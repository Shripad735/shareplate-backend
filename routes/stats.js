const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodListing = require('../models/FoodListing');
const Reservation = require('../models/Reservation');

// Get platform statistics
router.get('/', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await FoodListing.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    res.json({ totalUsers, totalListings, totalReservations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;