const express = require('express');
const Inquiry = require('../models/Inquiry');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries — submit inquiry (public)
router.post('/', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, data: inquiry, message: 'Inquiry submitted successfully!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/inquiries — list all (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/inquiries/:id/status — update status (admin)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
