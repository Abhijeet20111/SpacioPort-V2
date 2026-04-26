  const mongoose = require('mongoose');

  const campaignSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      title: { type: String, trim: true },
      description: { type: String, default: '' },
      budget: { type: Number, required: true, min: 0 },
      targetCities: [{ type: String }],
      category: {
        type: String,
        enum: ['banner', 'featured', 'newsletter', 'event', 'social'],
        default: 'banner',
      },
      startDate: { type: Date },
      endDate: { type: Date },
      status: {
        type: String,
        enum: ['draft', 'pending', 'running', 'paused', 'completed'],
        default: 'draft',
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model('Campaign', campaignSchema);
