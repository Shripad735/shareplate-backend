const express = require('express');
const router = express.Router();
const FoodListing = require('../models/FoodListing');
const authMiddleware = require('../middleware/authMiddleware'); 
const User = require('../models/User'); 
const cron = require('node-cron');

// Create a new food listing (restaurant only)
router.post('/', authMiddleware, async (req, res) => {
  console.log('Request Body:', req.body); // Debug: Log the request body
  console.log('Authenticated User:', req.user); // Debug: Log the authenticated user

  if (req.user.userType !== 'restaurant') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { foodType, quantity, expiryTime, location, photo } = req.body;

    // Debug: Log the parsed data
    console.log('Parsed Data:', { foodType, quantity, expiryTime, location, photo });

    const newListing = new FoodListing({
      restaurantId: req.user._id,
      foodType,
      quantity,
      expiryTime,
      location,
      photo,
      status: 'available',
    });

    await newListing.save();
    console.log('New Listing Created:', newListing); // Debug: Log the created listing
    res.status(201).json(newListing);
  } catch (error) {
    console.error('Error creating listing:', error); // Debug: Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all food listings (Admin only)
router.get('/', async (req, res) => {
  try {
    const listings = await FoodListing.find().populate('restaurantId');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all food listings for a restaurant
router.get('/restaurant', authMiddleware, async (req, res) => {
  if (req.user.userType !== 'restaurant') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const currentTime = new Date(); 
    const listings = await FoodListing.find({ 
      restaurantId: req.user._id,
      expiryTime: { $gt: currentTime } 
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all available food listings (for NGOs/individuals)
router.get('/available', async (req, res) => {
  try {
    const listings = await FoodListing.find({ status: 'available' });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a food listing (restaurant only)
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.userType !== 'restaurant') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { id } = req.params;
    const updatedListing = await FoodListing.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a food listing (restaurant only)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.userType !== 'restaurant' && req.user.userType !== 'admin') {
    console.log('User:', req.user);
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { id } = req.params;
    await FoodListing.findByIdAndDelete(id);
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/food-listings/:id', async (req, res) => {
  try {
    await FoodListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

cron.schedule('0 * * * *', async () => {
  try {
    const currentTime = new Date();
    await FoodListing.deleteMany({ expiryTime: { $lt: currentTime } });
    console.log('Expired listings deleted successfully');
  } catch (error) {
    console.error('Error deleting expired listings:', error);
  }
});

module.exports = router;