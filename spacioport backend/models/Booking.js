const mongoose = require('mongoose');

/**
 * Booking = Lead form submission for a Space.
 * Captures inquiry-style booking requests (name / email / phone / message).
 */
const bookingSchema = new mongoose.Schema(
  {
    space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional — guests can book too
    name: { type: String, required: [true, 'Name is required.'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email.'],
    },
    phone: { type: String, required: [true, 'Phone is required.'], trim: true },
    message: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
