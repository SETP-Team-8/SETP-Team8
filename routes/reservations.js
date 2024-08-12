const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET retrieve reservations by RestaurantID
router.get('/', async function(req, res) {
    const restaurantId = req.query.restaurantId;
    const query = `
        SELECT 
            Reservations.ReservationID,
            Diner.FirstName,
            Reservations.ReservationDate,
            Reservations.ReservationTime,
            Reservations.TableID,
            Reservations.NumberOfGuests,
            Diner.PhoneNumber as PhoneNumber,
            Diner.Email,
            Reservations.Status
        FROM 
            Reservations 
        JOIN 
            Diner ON Reservations.DinerID = Diner.DinerID
        WHERE 
            Reservations.RestaurantID = ?
    `;
    try {
        const [rows] = await pool.query(query, [restaurantId]);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching reservations:', err);
        res.status(500).send('Server error: ' + err.message);
    }
});


// POST Creating Reservations
router.post('/', async function(req, res) {
    const { ReservationDate, ReservationTime, NumberOfGuests, NumberOfChildren, SpecialRequests, DinerID, RestaurantID, TableID } = req.body;
    const query = `
    INSERT INTO Reservations (ReservationDate, ReservationTime, NumberOfGuests, NumberOfChildren, SpecialRequests, DinerID, RestaurantID, TableID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [ReservationDate, ReservationTime, NumberOfGuests, NumberOfChildren || null, SpecialRequests || null, DinerID, RestaurantID, TableID || null];
    try {
        const [result] = await pool.query(query, values);
        res.status(201).send({ message: 'Reservation created', reservationId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: ' + err.message);
    }
});

// GET Retrieve Reservations
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