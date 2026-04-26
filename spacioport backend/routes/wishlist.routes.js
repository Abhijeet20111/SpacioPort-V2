const express = require('express');
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/wishlist — get user's wishlist
router.get('/', protect, async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate('space');
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/wishlist — add to wishlist
router.post('/', protect, async (req, res) => {
  try {
    const item = await Wishlist.create({ user: req.user._id, space: req.body.spaceId });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already in wishlist.' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/wishlist/:spaceId — remove from wishlist
router.delete('/:spaceId', protect, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id, space: req.params.spaceId });
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
