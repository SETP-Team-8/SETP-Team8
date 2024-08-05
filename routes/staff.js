const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Add staff or manager
router.post('/', async (req, res) => {
  const { FirstName, LastName, Username, Email, PhoneNumber, Role, RestaurantID } = req.body;
  try {
    const query = `INSERT INTO Staff (FirstName, LastName, Username, Email, PhoneNumber, Role, RestaurantID) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [FirstName, LastName, Username, Email, PhoneNumber, Role, RestaurantID];
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