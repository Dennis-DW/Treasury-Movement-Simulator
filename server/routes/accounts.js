const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find({ isActive: true }).sort({ name: 1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get account by ID
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new account
router.post('/', async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Account name already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Update account
router.put('/:id', async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Initialize default accounts
router.post('/initialize', async (req, res) => {
  try {
    const existingAccounts = await Account.countDocuments();
    if (existingAccounts > 0) {
      return res.status(400).json({ error: 'Accounts already initialized' });
    }

    const defaultAccounts = [
      { name: 'USD Operating Account', currency: 'USD', balance: 50000, accountType: 'Operating' },
      { name: 'USD Reserve Fund', currency: 'USD', balance: 100000, accountType: 'Reserve' },
      { name: 'KES Operating Account', currency: 'KES', balance: 5000000, accountType: 'Operating' },
      { name: 'KES Investment Fund', currency: 'KES', balance: 10000000, accountType: 'Investment' },
      { name: 'KES Petty Cash', currency: 'KES', balance: 50000, accountType: 'Petty Cash' },
      { name: 'NGN Operating Account', currency: 'NGN', balance: 20000000, accountType: 'Operating' },
      { name: 'NGN Reserve Fund', currency: 'NGN', balance: 50000000, accountType: 'Reserve' },
      { name: 'USD FX Reserve', currency: 'USD', balance: 25000, accountType: 'FX Reserve' },
      { name: 'KES Emergency Fund', currency: 'KES', balance: 2000000, accountType: 'Reserve' },
      { name: 'NGN Investment Account', currency: 'NGN', balance: 15000000, accountType: 'Investment' }
    ];

    const accounts = await Account.insertMany(defaultAccounts);
    res.status(201).json({ message: 'Default accounts created', accounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;