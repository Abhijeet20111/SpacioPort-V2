const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1, space: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
