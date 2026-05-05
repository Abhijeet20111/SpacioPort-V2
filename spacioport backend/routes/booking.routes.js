const express = require('express');
const Booking = require('../models/Booking');
const Space = require('../models/Space');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/bookings
 * Admin → all bookings. Logged-in user → their own bookings (matched by user ref OR email).
 */
router.get('/', protect, async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { $or: [{ user: req.user._id }, { email: req.user.email }] };

    const bookings = await Booking.find(filter)
      .populate('space', 'name city type duration image price priceUnit')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { spaceId, name, email, phone, message } = req.body;

    if (!spaceId || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'spaceId, name, email and phone are required.',
      });
    }

    const space = await Space.findById(spaceId);
    if (!space || !space.isActive) {
      return res.status(404).json({ success: false, message: 'Space not found.' });
    }

    
    let userId;
    try {
      const jwt = require('jsonwebtoken');
      const auth = req.headers.authorization;
      if (auth?.startsWith('Bearer ')) {
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'fallback_secret');
        userId = decoded.id;
      }
    } catch {
      /* anonymous booking — fine */
    }

    const booking = await Booking.create({
      space: spaceId,
      user: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: (message || '').trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Booking request submitted. Our team will contact you shortly.',
      data: booking,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/bookings/:id/status — admin only
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/bookings/:id — admin only (hard delete a lead)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, message: 'Booking deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
