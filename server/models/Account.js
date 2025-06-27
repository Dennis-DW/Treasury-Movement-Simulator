const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['KES', 'USD', 'NGN']
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  accountType: {
    type: String,
    required: true,
    enum: ['Operating', 'Reserve', 'Investment', 'Petty Cash', 'FX Reserve']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
accountSchema.index({ currency: 1 });
accountSchema.index({ accountType: 1 });

module.exports = mongoose.model('Account', accountSchema);