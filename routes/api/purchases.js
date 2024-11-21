// **************************PURCHASE ROUTES WITH SWAGGER DOC.********************

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Purchase = require("../../models/Purchase");
const Book = require("../../models/Book");
const User = require("../../models/User");

/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: Get all purchase list of the user
 *     description: Fetches the list of purchases for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched the purchases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Purchase'
 *       404:
 *         description: No purchases found for the user
 *       500:
 *         description: Server error
 */
router.get("/", auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user.id })
      .populate("user", ["id", "name"])
      .populate("book", ["id", "title"]);

    if (!purchases.length) {
      return res.status(404).json({ message: "No purchases found for this user" });
    }

    res.status(200).json(purchases);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ***************************************************************

/**
 * @swagger
 * /api/purchases/{purchaseId}:
 *   get:
 *     summary: Get a specific purchase by ID for the user
 *     description: Fetches details of a specific purchase for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: purchaseId
 *         required: true
 *         description: The ID of the purchase to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the purchase
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Server error
 */
router.get("/:purchaseId", auth, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.purchaseId,
      user: req.user.id,
    })
      .populate("user", ["id", "name"])
      .populate("book", ["id", "title"]);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(purchase);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: Make a purchase
 *     description: Allows the authenticated user to purchase a book.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: The ID of the book to purchase
 *     responses:
 *       201:
 *         description: Purchase successfully created
 *       400:
 *         description: Invalid input or book out of stock
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  auth,
  [check("bookId", "Invalid book ID").isMongoId()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = await Book.findById(req.body.bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.stock < 1) {
        return res.status(400).json({ message: "Book out of stock" });
      }

      const newPurchase = new Purchase({
        user: req.user.id,
        book: req.body.bookId,
      });

      book.stock -= 1;
      await book.save();
      await newPurchase.save();

      res.status(201).json(newPurchase);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// *******************************************************************

/**
 * @swagger
 * /api/purchases/{purchaseId}:
 *   delete:
 *     summary: Cancel a purchase
 *     description: Allows the authenticated user to cancel a purchase by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: purchaseId
 *         required: true
 *         description: The ID of the purchase to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchase successfully canceled
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Server error
 */
router.delete("/:purchaseId", auth, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.purchaseId,
      user: req.user.id,
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const book = await Book.findById(purchase.book);
    if (book) {
      book.stock += 1;
      await book.save();
    }

    await purchase.deleteOne();
    res.status(200).json({ message: "Purchase successfully canceled" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
