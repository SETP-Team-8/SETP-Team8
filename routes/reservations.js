const pool = require('../config/database'); //path to required database.js from the database folder

var express = require('express');
var router = express.Router();

// POST Endpoint for Creating Reservations
router.post('/', async function(req, res) {
    const { ReservationDate, ReservationTime, NumberOfGuests, NumberOfChildren, SpecialRequests, DinerID, RestaurantID, TableID } = req.body;
    const query = `
    INSERT INTO Reservations (ReservationDate, ReservationTime, NumberOfGuests, NumberOfChildren, SpecialRequests, DinerID, RestaurantID, TableID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [ReservationDate, ReservationTime, NumberOfGuests, NumberOfChildren, SpecialRequests, DinerID, RestaurantID, TableID];
    try {
        const [result] = await pool.query(query, values);
        res.status(201).send({ message: 'Reservation created', reservationId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: ' + err.message);
    }
});

// GET Endpoint to Retrieve Reservations
router.get('/', async function(req, res) {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM Reservations');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;