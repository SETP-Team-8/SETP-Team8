const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        // Create a unique filename with the original extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Add a new restaurant
router.post('/', upload.single('image'), async (req, res) => {
  // Extract info from body
  const { Name, Address, CuisineType, PhoneNumber } = req.body;
  let imagePath = req.file ? req.file.path : 'defaultImagePath';  // Provide a default or handle absence

  try {
      // SQL query to insert into database
      const query = `INSERT INTO Restaurant (Name, Address, CuisineType, PhoneNumber, ImagePath) VALUES (?, ?, ?, ?, ?)`;
      const values = [Name, Address, CuisineType, PhoneNumber, imagePath];
      const [result] = await pool.query(query, values);
      res.status(201).send({ message: 'Restaurant added', restaurantId: result.insertId });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error: ' + err.message);
  }
});

// Modify restaurant information
// Modify restaurant information
router.put('/:id', upload.single('image'), async (req, res) => {
  const { Name, Address, CuisineType, PhoneNumber, OpeningHours, Menu } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined; // Use file path if a new file is uploaded

  const updates = [];
  const values = [];

  // Check each field and prepare query dynamically
  if (Name) {
    updates.push('Name = ?');
    values.push(Name);
  }
  if (Address) {
    updates.push('Address = ?');
    values.push(Address);
  }
  if (CuisineType) {
    updates.push('CuisineType = ?');
    values.push(CuisineType);
  }
  if (PhoneNumber) {
    updates.push('PhoneNumber = ?');
    values.push(PhoneNumber);
  }
  if (OpeningHours) {
    updates.push('OpeningHours = ?');
    values.push(OpeningHours);
  }
  if (Menu) {
    updates.push('Menu = ?');
    values.push(Menu);
  }
  if (imagePath) {
    updates.push('ImagePath = ?');
    values.push(imagePath);
  }

  if (updates.length > 0) {
    values.push(req.params.id); // Add restaurant ID to the parameters list
    const query = `UPDATE Restaurant SET ${updates.join(', ')} WHERE RestaurantID = ?`;

    try {
      await pool.query(query, values);
      res.send({ message: 'Restaurant updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error: ' + err.message);
    }
  } else {
    res.status(400).send('No updates provided');
  }
});

// Delete a restaurant
router.delete('/:id', async (req, res) => {
    try {
        const query = 'DELETE FROM Restaurant WHERE RestaurantID = ?';
        const [result] = await pool.query(query, [req.params.id]);
        res.send({ message: 'Restaurant deleted successfully', affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: ' + err.message);
    }
});

//Get all restaurant
router.get('/', async (req, res) => {
  try {
      const [rows, fields] = await pool.query('SELECT * FROM Restaurant');
      res.json(rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

//Get the restaurant by ID
router.get('/:id', async (req, res) => {
  const restaurantId = req.params.id;
  try {
      const [rows, fields] = await pool.query('SELECT * FROM Restaurant WHERE RestaurantID = ?', [restaurantId]);
      if (rows.length > 0) {
          res.json(rows[0]);
      } else {
          res.status(404).send('Restaurant not found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

module.exports = router;