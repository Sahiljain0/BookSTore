// ***************BOOK API  ROUTES ALONG WITH SWAGGER DOCUMENTATION**************
 
const express = require("express");
const router = express.Router();
const Book = require("../../models/Book");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route  GET api/books
// @desc   Get all book list
// @access Public
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary:  list of all available Books
 *     description: Get a list of all books available in stock
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of books
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({ stock: { $gt: 0 } });
    res.status(200).json(books);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


// **********************************************************************

// @route  GET api/books/:bookId
// @desc   Get a book by ID
// @access Public
/**
 * @swagger
 * /api/books/{bookId}:
 *   get:
 *    summary:  Get a specific book by ID
 *     description: Get a specific book by ID
 *     parameters:
 *       - name: bookId
 *         in: path
 *         description: The ID of the book to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the book details
 *       400:
 *         description: Book not found with the provided ID
 *       500:
 *         description: Server error
 */
router.get("/:bookId", async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: "Could not find a book by this id" }] });
    }
    res.status(200).json(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


// ********************************************************************


// @router  POST api/books
// @desc    Create a new book
// @access  Private
/**
 * @swagger
 * /api/books:
 *   post:
 *  summary:  Add a new book (Admin)
 *     description: Add a new book to the collection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the book
 *               description:
 *                 type: string
 *                 description: Description of the book (optional)
 *               price:
 *                 type: number
 *                 description: Price of the book
 *               stock:
 *                 type: integer
 *                 description: Stock quantity of the book
 *     responses:
 *       200:
 *         description: Successfully added the new book
 *       400:
 *         description: Book already exists or validation errors
 *       500:
 *         description: Server error
 */


router.post(
  "/",
  auth,
  [
    check("title", "Title must be between 2 to 100 characters ").isLength({
      min: 2,
      max: 100,
    }),
    check("description").isLength({ max: 500 }).optional(),
    check("price", "Price not included or invalid price given").isFloat({
      min: 0.0,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { title, description, price, stock } = req.body;

    try {
      let book = await Book.findOne({ title });

      if (book) {
        return res
          .status(400)
          .json({ errors: [{ message: "Book already exists" }] });
      }

      const isAdmin = await User.findById(req.user.id).select("-password");

      if (isAdmin.role === 0) {
        return res
          .status(400)
          .json({ errors: [{ message: "Only admin can add books" }] });
      }

      newBook = new Book({
        title: title,
        description: description ? description : null,
        price: price,
        stock: stock,
      });
      await newBook.save();

      res.status(200).json({
        newBook,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


// ******************************************************************

// @route  PATCH api/books/:bookId
// @desc   Update a book by ID
// @access Private
/**
 * @swagger
 * /api/books/{bookId}:
 *   patch:
 *     summary: Update details of an existing book (Admin)
 *     description: Update details of an existing book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId 
 *         in: path
 *         description: The ID of the book to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the book
 *               description:
 *                 type: string
 *                 description: Description of the book (optional)
 *               price:
 *                 type: number
 *                 description: Price of the book
 *               stock:
 *                 type: integer
 *                 description: Stock quantity of the book
 *     responses:
 *       200:
 *         description: Successfully updated the book
 *       400:
 *         description: Book not found with the provided ID
 *       500:
 *         description: Server error
 */
router.patch("/:bookId", auth, async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId).select("-stock");
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: "Could not find a book by this id" }] });
    }

    const isAdmin = await User.findById(req.user.id).select("-password");

    if (isAdmin.role === 0) {
      return res
        .status(400)
        .json({ errors: [{ message: "Only admin can update books" }] });
    }
    const updateOptions = req.body;
    await book.updateOne({ $set: updateOptions });

    res.status(200).json({ message: "Successfully updated the book" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


// ****************************************************************
// @route  DELETE api/books/:bookId
// @desc   Delete a book by ID
// @access Private (Admin only)
/**
 * @swagger
 * /api/books/{bookId}:
 *   delete:
 *     summary: Delete a book (Admin)
 *     description: Delete a book by its ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         description: ID of the book to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the book
 *       400:
 *         description: Book not found with the provided ID
 *       403:
 *         description: Only admin can delete books
 *       500:
 *         description: Internal server error
 */


router.delete("/:bookId", auth, async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId).select("-stock");
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: "Could not find a book by this id" }] });
    }

    const isAdmin = await User.findById(req.user.id).select("-password");

    if (isAdmin.role === 0) {
      return res
        .status(400)
        .json({ errors: [{ message: "Only admin can delete books" }] });
    }

    await book.delete();

    res.status(200).json({ message: "Successfully deleted the book" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


// *************************************************************************


module.exports = router;


