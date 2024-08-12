const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  console.log("Login attempt for:", req.body.email);
  const { email, password } = req.body;
  try {
    // Join the Staff table with the Restaurant table
    const query = `
      SELECT Staff.FirstName, Staff.Role, Staff.Password, Restaurant.Name as RestaurantName
      FROM Staff
      JOIN Restaurant ON Staff.RestaurantID = Restaurant.RestaurantID
      WHERE Staff.Email = ?
    `;
    const [results] = await pool.query(query, [email]);

    if (results.length > 0) {
      const isValidPassword = await bcrypt.compare(password, results[0].Password);
      if (isValidPassword) {
        const token = jwt.sign({ id: results[0].StaffID }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        console.log("Login successful for:", email);
        res.json({
          message: 'Login successful',
          token: token,
          staffName: results[0].FirstName, // Send only first name
          role: results[0].Role,
          restaurantName: results[0].RestaurantName // Dynamically fetched restaurant name
        });
      } else {
        console.log("Invalid password for:", email);
        res.status(401).send('Invalid credentials');
      }
    } else {
      console.log("No user found for:", email);
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error("Error during login for:", email, error);
    res.status(500).send('Server error');
  }
});

module.exports = router;


// Add staff or manager
router.post('/', async (req, res) => {
  console.log(req.body);
  const { FirstName, LastName, Username, Email, PhoneNumber, Role, RestaurantID, Password } = req.body;

  // Hash the password before storing it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(Password, salt);

  try {
    const query = `INSERT INTO Staff (FirstName, LastName, Username, Email, PhoneNumber, Role, RestaurantID, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [FirstName, LastName, Username, Email, PhoneNumber, Role, RestaurantID, hashedPassword];
    const [result] = await pool.query(query, values);
    res.status(201).send({ message: 'Staff member added', staffId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
});

// Update staff or manager
router.put('/:id', async (req, res) => {
  const staffId = req.params.id;
  const { FirstName, LastName, Username, Email, PhoneNumber, Role } = req.body;
  try {
    const query = `UPDATE Staff SET FirstName = ?, LastName = ?, Username = ?, Email = ?, PhoneNumber = ?, Role = ? WHERE StaffID = ?`;
    const values = [FirstName, LastName, Username, Email, PhoneNumber, Role, staffId];
    await pool.query(query, values);
    res.send({ message: 'Staff member updated' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
});

// Delete staff or manager
router.delete('/:id', async (req, res) => {
  const staffId = req.params.id;
  try {
    const query = 'DELETE FROM Staff WHERE StaffID = ?';
    const [result] = await pool.query(query, [staffId]);
    res.send({ message: 'Staff member deleted', affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
});

// List all staff
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Staff');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get a single staff member
router.get('/:id', async (req, res) => {
  const staffId = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM Staff WHERE StaffID = ?', [staffId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Staff member not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;