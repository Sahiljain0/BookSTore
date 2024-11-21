
// **************************USER ROUTES WITH SWAGGER DOCUMENTATION**************


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');

const User = require('../../models/User');

// // @route    POST api/users/register
// // @desc     Register user
// // @access   Public
// /**
//  * @swagger
//  * /api/users/register:
//  *   post:
//  *     summary: Registers a new user
//  *     tags: [User]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 description: The user's name
//  *                 example: John Doe
//  *               email:
//  *                 type: string
//  *                 description: The user's email address
//  *                 example: johndoe@example.com
//  *               password:
//  *                 type: string
//  *                 description: The user's password
//  *                 example: password123
//  *     responses:
//  *       201:
//  *         description: User successfully registered
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 token:
//  *                   type: string
//  *                   description: JWT token for authentication
//  *       400:
//  *         description: Bad request - user already exists
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 errors:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       message:
//  *                         type: string
//  *       500:
//  *         description: Server error
//  */
// router.post(
//   '/register',
//   [
//     check('name', 'Name is required')
//       .not()
//       .isEmpty(),
//     check('email', 'Please include a valid email').isEmail(),
//     check(
//       'password',
//       'Please enter a password with 8 or more characters'
//     ).isLength({ min: 8 })
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(401).json({ errors: errors.array() });
//     }
//     const { name, email, password } = req.body;

//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res
//           .status(400)
//           .json({ errors: [{ message: 'User already exists' }] });
//       }

//       const salt = await bcrypt.genSalt(10);

//       let hashedPassword = await bcrypt.hash(password, salt);
//       let role = 0; // for normal users, role is 0

//       // check if it is an Admin signup
//       if (req.header('admin-signup-key')) {
//         // check adminSignupKey
//         if (req.header('admin-signup-key') === config.get('admin-signup-key')) {
//           role = 1; // for admin, role is 1
//         }
//       }

//       user = new User({
//         name: name,
//         email: email,
//         password: hashedPassword,
//         role: role
//       });

//       await user.save();
//       const payload = {
//         user: {
//           id: user.id,
//           role: user.role
//         }
//       };

//       jwt.sign(
//         payload,
//         config.get('jwtSecret'),
//         { expiresIn: 3600 },
//         (err, token) => {
//           if (err) throw err;
//           res.status(201).json({ token });
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: password123
 *               role:
 *                 type: integer
 *                 description: The user's role (0 for user, 1 for admin)
 *                 example: 0
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request - user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.post(
  '/register',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters'
    ).isLength({ min: 8 }),
    check('role', 'Role must be an integer (0 for user, 1 for admin)')
      .isInt()
      .optional(), // Optional, defaults to 0 if not provided
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    const { name, email, password, role = 0 } = req.body; // Default role to 0 for normal users

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'User already exists' }] });
      }

      const salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);

      if (role !== 0 && role !== 1) {
        return res.status(400).json({
          errors: [{ message: 'Invalid role. Role must be 0 for user or 1 for admin.' }],
        });
      }

      user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      });

      await user.save();
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


// ********************************************************************

// @route    POST api/users/login
// @desc     Authenticate user and get token
// @access   Public
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user and receive a JWT token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid credentials' }] });
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid credentials' }] });
      }
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
