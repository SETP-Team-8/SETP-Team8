const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Database config 
const bcrypt = require('bcryptjs'); // hashing
const jwt = require('jsonwebtoken'); // authentication
const { body, validationResult } = require('express-validator'); // validation
const { authenticateToken } = require('../routes/authentication');

// POST: Register a new diner
router.post('/signup', [
  body('Title').notEmpty().withMessage('Title is required'),
  body('FirstName').notEmpty().withMessage('First name is required'),
  body('LastName').notEmpty().withMessage('Last name is required'),
  body('Email').isEmail().withMessage('Must be a valid email address'),
  body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('ConfirmPassword').custom((value, { req }) => {
      if (value !== req.body.Password) {
          throw new Error('Password confirmation does not match password');
      }
      return true;
  }),
  body('PhoneNumber').notEmpty().withMessage('Phone number is required'),
  body('DateOfBirth').notEmpty().withMessage('Date of birth is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { Title, FirstName, LastName, Username, Email, Password, PhoneNumber, DateOfBirth } = req.body;
  try {
      const hashedPassword = bcrypt.hashSync(Password, 10); // Hash password
      const query = `INSERT INTO Diner (Title, FirstName, LastName, Username, Email, Password, PhoneNumber, DateOfBirth) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`; //SQL query
      const values = [Title, FirstName, LastName, Username, Email, hashedPassword, PhoneNumber, DateOfBirth]; // Use hashedPassword
      const [result] = await pool.query(query, values); //Execute query 
      res.status(201).send({ message: 'Diner registered successfully', dinerId: result.insertId });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error: ' + err.message);
  }
});

// POST: Diner login
router.post('/login', async (req, res) => {
  const { identifier, Password } = req.body; // 'identifier' can be either email or username

  try {
      // Check both username and email fields for the identifier
      const query = `SELECT * FROM Diner WHERE Username = ? OR Email = ? LIMIT 1`;
      const [rows] = await pool.query(query, [identifier, identifier]);

      // Log fetched data for debugging
      console.log("Fetched user:", rows[0]);

      if (rows.length > 0) {
          const user = rows[0];

          // Check and log the password details
          console.log("Stored password:", user.Password);
          console.log("Provided password:", Password);

          // Check if the password is defined and compare it
          if (user.Password && bcrypt.compareSync(Password, user.Password)) {
              const token = jwt.sign({ dinerId: user.DinerID, name: user.FirstName }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
              res.json({ message: 'Login successful', token });
          } else {
              res.status(401).send('Password incorrect');
          }
      } else {
          res.status(404).send('Diner not found');
      }
  } catch (err) {
      console.error('Error during login:', err);
      res.status(500).send('Server error: ' + err.message);
  }
});

// PUT: Update diner details
router.put('/:dinerId', async (req, res) => {
  const { Title, FirstName, LastName, Email, Username, Password, PhoneNumber, DateOfBirth } = req.body;
  const dinerId = req.params.dinerId;
  try {
      const hashedPassword = bcrypt.hashSync(Password, 10); // Hash the password
      const query = `UPDATE Diner SET Title = ?, FirstName = ?, LastName = ?, Email = ?, Username = ?, Password = ?, PhoneNumber = ?, DateOfBirth = ? WHERE DinerID = ?`;
      const values = [Title, FirstName, LastName, Email, Username, hashedPassword, PhoneNumber, DateOfBirth, dinerId]; // Use hashedPassword instead of Password
      await pool.query(query, values);
      res.send({ message: 'Diner updated successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error: ' + err.message);
  }
});

// DELETE: Delete diner account
router.delete('/:dinerId', async (req, res) => {
    const dinerId = req.params.dinerId;
    try {
        const query = 'DELETE FROM Diner WHERE DinerID = ?';
        const [result] = await pool.query(query, [dinerId]);
        res.send({ message: 'Diner deleted successfully', affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: ' + err.message);
    }
});

// GET: Retrieve all diners
router.get('/', async (req, res) => {
  try {
      const query = 'SELECT * FROM Diner';
      const [rows] = await pool.query(query);
      res.json(rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error: ' + err.message);
  }
});

// GET: Retrieve diner details
router.get('/:dinerId', authenticateToken, async (req, res) => {
  const dinerId = req.params.dinerId;
  try {
      const query = 'SELECT * FROM Diner WHERE DinerID = ?';
      const [rows] = await pool.query(query, [dinerId]);
      if (rows.length > 0) {
          res.json(rows[0]);
      } else {
          res.status(404).send('Diner not found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

module.exports = router;