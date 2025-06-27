const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    required: true,
    enum: ['KES', 'USD', 'NGN']
  },
  convertedAmount: {
    type: Number,
    default: null
  },
  convertedCurrency: {
    type: String,
    enum: ['KES', 'USD', 'NGN'],
    default: null
  },
  exchangeRate: {
    type: Number,
    default: 1
  },
  note: {
    type: String,
    required: true,
    trim: true
  },
  transactionType: {
    type: String,
    enum: ['transfer', 'conversion', 'scheduled'],
    default: 'transfer'
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'scheduled'],
    default: 'completed'
  },
  reference: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Generate reference number before saving
transactionSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Add indexes for better query performance
transactionSchema.index({ fromAccount: 1 });
transactionSchema.index({ toAccount: 1 });
transactionSchema.index({ currency: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ reference: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);