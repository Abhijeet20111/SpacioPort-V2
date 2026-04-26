const express = require('express');
const Campaign = require('../models/Campaign');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/campaigns — user's campaigns (or all for admin)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const campaigns = await Campaign.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/campaigns — create campaign
router.post('/', protect, async (req, res) => {
  try {
    const campaign = await Campaign.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/campaigns/:id — update campaign
router.put('/:id', protect, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.user = req.user._id;

    const campaign = await Campaign.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/campaigns/:id — delete campaign
router.delete('/:id', protect, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.user = req.user._id;

    const campaign = await Campaign.findOneAndDelete(filter);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, message: 'Campaign deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
