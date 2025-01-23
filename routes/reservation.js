const express = require('express');
const Reservation = require('../models/Reservation');
const FoodListing = require('../models/FoodListing');
const router = express.Router();

// Reserve a listing
router.post('/', async (req, res) => {
  const { listingId, userId } = req.body;
  try {
    const listing = await FoodListing.findById(listingId);
    if (!listing || listing.status !== 'available') {
      return res.status(400).json({ error: 'Listing not available' });
    }

    // Create a new reservation with status 'reserved'
    const reservation = new Reservation({ listingId, userId, status: 'reserved', pickupStatus: 'pending' });
    await reservation.save();

    // Update listing status to 'reserved'
    listing.status = 'reserved';
    listing.reservedBy = userId;
    await listing.save();

    res.json({ message: 'Reservation successful', reservationId: reservation._id });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation', details: error.message });
  }
});

// Get user reservations
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const reservations = await Reservation.find({ userId }).populate('listingId');
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
  }
});

// Cancel reservation
router.delete('/:reservationId', async (req, res) => {
  const { reservationId } = req.params;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update listing status
    const listing = await FoodListing.findById(reservation.listingId);
    listing.status = 'available';
    listing.reservedBy = null;
    await listing.save();

    // Use deleteOne() or findByIdAndDelete() instead of remove()
    await Reservation.deleteOne({ _id: reservationId });

    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Failed to cancel reservation', details: error.message });
  }
});

// Mark reservation as picked up
router.put('/:reservationId/pickup', async (req, res) => {
  const { reservationId } = req.params;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update reservation status to 'picked_up'
    reservation.pickupStatus = 'picked_up';
    await reservation.save();

    // Update the corresponding food listing status to 'completed'
    const listing = await FoodListing.findById(reservation.listingId);
    if (listing) {
      listing.status = 'completed';
      await listing.save();
    }

    res.json({ message: 'Reservation marked as picked up' });
  } catch (error) {
    console.error('Error updating pickup status:', error);
    res.status(500).json({ error: 'Failed to update pickup status', details: error.message });
  }
});

// Get all reservations (Admin only)
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId')
      .populate('listingId');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reservations by listing IDs
router.get('/by-listings', async (req, res) => {
  const { listingIds } = req.query;

  try {
    // Convert listingIds string to an array
    const listingIdsArray = listingIds.split(',');

    // Find reservations for these listing IDs and populate listingId and userId
    const reservations = await Reservation.find({ listingId: { $in: listingIdsArray } })
      .populate('listingId')
      .populate('userId');

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations by listings:', error);
    res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
  }
});

router.delete('/reservations/:id', async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;