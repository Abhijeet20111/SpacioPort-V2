const express = require('express');
const Space = require('../models/Space');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/spaces
 * Public. Supports filtering by type, duration, city, maxPrice, minCapacity.
 * Always excludes soft-deleted (isActive=false) spaces.
 */
router.get('/', async (req, res) => {
  try {
    const { type, duration, city, maxPrice, minCapacity, page = 1, limit = 50 } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (duration) filter.duration = duration;
    if (city) filter.city = city;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (minCapacity) filter.capacity = { $gte: Number(minCapacity) };

    const skip = (Number(page) - 1) * Number(limit);
    const [spaces, total] = await Promise.all([
      Space.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Space.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: spaces,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/spaces/:id — public
router.get('/:id', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space || !space.isActive) {
      return res.status(404).json({ success: false, message: 'Space not found.' });
    }
    res.json({ success: true, data: space });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/spaces — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const space = await Space.create(req.body);
    res.status(201).json({ success: true, data: space });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/spaces/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!space) return res.status(404).json({ success: false, message: 'Space not found.' });
    res.json({ success: true, data: space });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/spaces/:id — admin only
 * SOFT DELETE: sets isActive = false
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!space) return res.status(404).json({ success: false, message: 'Space not found.' });
    res.json({ success: true, message: 'Space deactivated (soft deleted).', data: space });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
