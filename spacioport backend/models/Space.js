const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['virtual', 'physical'] },
    duration: {
      type: String,
      enum: ['long-term', 'on-demand'],
      // required only for physical spaces 
    },
    city: {
      type: String,
      enum: ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Gurgaon', 'Noida', 'Ahmedabad'],
    },
    address: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    priceUnit: { type: String, default: '/month' },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    capacity: { type: Number, default: 1, min: 1 },
    image: { type: String, default: '' },
    images: [{ type: String }],
    amenities: [{ type: String }],
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Conditional validation: physical → city + address required & duration required
spaceSchema.pre('validate', function (next) {
  if (this.type === 'physical') {
    if (!this.city) this.invalidate('city', 'City is required for physical spaces.');
    if (!this.address && !this.location) this.invalidate('address', 'Address is required for physical spaces.');
    if (!this.duration) this.invalidate('duration', 'Duration is required for physical spaces.');
  }
  // For virtual, clear physical-only fields silently if absent
  if (this.type === 'virtual') {
    if (!this.duration) this.duration = undefined;
  }
  next();
});

module.exports = mongoose.model('Space', spaceSchema);
