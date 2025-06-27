const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Exchange rates (in a real app, these would come from an API)
const EXCHANGE_RATES = {
  'USD_KES': 150.0,
  'USD_NGN': 800.0,
  'KES_USD': 1/150.0,
  'KES_NGN': 800.0/150.0,
  'NGN_USD': 1/800.0,
  'NGN_KES': 150.0/800.0
};

// Get all transactions with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      fromAccount, 
      toAccount, 
      currency, 
      startDate, 
      endDate, 
      limit = 50,
      page = 1 
    } = req.query;

    const filter = {};
    
    if (fromAccount) filter.fromAccount = fromAccount;
    if (toAccount) filter.toAccount = toAccount;
    if (currency) filter.currency = currency;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find(filter)
      .populate('fromAccount', 'name currency')
      .populate('toAccount', 'name currency')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount, note, scheduledDate } = req.body;

    // Validate accounts exist
    const fromAccount = await Account.findById(fromAccountId);
    const toAccount = await Account.findById(toAccountId);

    if (!fromAccount || !toAccount) {
      throw new Error('Invalid account(s)');
    }

    if (fromAccountId === toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }

    // Check if this is a future-dated transaction
    const isScheduled = scheduledDate && new Date(scheduledDate) > new Date();
    
    // Validate scheduled date is not in the past
    if (scheduledDate && new Date(scheduledDate) <= new Date()) {
      throw new Error('Scheduled date cannot be in the past. Please select a future date and time.');
    }

    if (!isScheduled) {
      // Check sufficient funds for immediate transfer
      if (fromAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }
    }

    // Calculate exchange rate and converted amount
    let convertedAmount = amount;
    let exchangeRate = 1;
    
    if (fromAccount.currency !== toAccount.currency) {
      const rateKey = `${fromAccount.currency}_${toAccount.currency}`;
      exchangeRate = EXCHANGE_RATES[rateKey] || 1;
      convertedAmount = amount * exchangeRate;
    }

    // Create transaction
    const transaction = new Transaction({
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      amount,
      currency: fromAccount.currency,
      convertedAmount: fromAccount.currency !== toAccount.currency ? convertedAmount : null,
      convertedCurrency: fromAccount.currency !== toAccount.currency ? toAccount.currency : null,
      exchangeRate,
      note,
      reference: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
      scheduledDate: isScheduled ? new Date(scheduledDate) : null,
      status: isScheduled ? 'scheduled' : 'completed',
      transactionType: isScheduled ? 'scheduled' : (fromAccount.currency !== toAccount.currency ? 'conversion' : 'transfer')
    });

    await transaction.save();

    // Update account balances only for immediate transfers
    if (!isScheduled) {
      fromAccount.balance -= amount;
      toAccount.balance += convertedAmount;

      await fromAccount.save();
      await toAccount.save();
    }

    // Populate account details for response
    await transaction.populate([
      { path: 'fromAccount', select: 'name currency' },
      { path: 'toAccount', select: 'name currency' }
    ]);

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get transaction statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: '$currency',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    const totalTransactions = await Transaction.countDocuments();
    const recentTransactions = await Transaction.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.json({
      byCurrency: stats,
      totalTransactions,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;