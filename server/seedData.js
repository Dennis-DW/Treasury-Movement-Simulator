// Load environment variables
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/treasury-simulator';

// Exchange rates for currency conversion
const EXCHANGE_RATES = {
  'USD_KES': 150.0,
  'USD_NGN': 800.0,
  'KES_USD': 1/150.0,
  'KES_NGN': 800.0/150.0,
  'NGN_USD': 1/800.0,
  'NGN_KES': 150.0/800.0
};

// Sample accounts data
const sampleAccounts = [
  { name: 'USD Operating Account', currency: 'USD', balance: 50000, accountType: 'Operating' },
  { name: 'USD Reserve Fund', currency: 'USD', balance: 100000, accountType: 'Reserve' },
  { name: 'USD Investment Portfolio', currency: 'USD', balance: 75000, accountType: 'Investment' },
  { name: 'KES Operating Account', currency: 'KES', balance: 5000000, accountType: 'Operating' },
  { name: 'KES Investment Fund', currency: 'KES', balance: 10000000, accountType: 'Investment' },
  { name: 'KES Petty Cash', currency: 'KES', balance: 50000, accountType: 'Petty Cash' },
  { name: 'KES Emergency Fund', currency: 'KES', balance: 2000000, accountType: 'Reserve' },
  { name: 'NGN Operating Account', currency: 'NGN', balance: 20000000, accountType: 'Operating' },
  { name: 'NGN Reserve Fund', currency: 'NGN', balance: 50000000, accountType: 'Reserve' },
  { name: 'NGN Investment Account', currency: 'NGN', balance: 15000000, accountType: 'Investment' },
  { name: 'USD FX Reserve', currency: 'USD', balance: 25000, accountType: 'FX Reserve' },
  { name: 'KES Treasury Bills', currency: 'KES', balance: 5000000, accountType: 'Investment' }
];

// Sample transaction notes
const transactionNotes = [
  'Monthly operating expenses transfer',
  'Investment portfolio rebalancing',
  'Emergency fund contribution',
  'Petty cash replenishment',
  'Reserve fund allocation',
  'FX position adjustment',
  'Treasury bill investment',
  'Operating account funding',
  'Cross-currency investment',
  'Reserve fund transfer',
  'Petty cash disbursement',
  'Investment return distribution',
  'Operating expense payment',
  'Emergency fund withdrawal',
  'FX reserve utilization'
];

// Generate random transaction data
function generateSampleTransactions(accounts) {
  const transactions = [];
  const now = new Date();
  
  // Generate transactions for the last 30 days
  for (let i = 0; i < 50; i++) {
    const fromAccount = accounts[Math.floor(Math.random() * accounts.length)];
    let toAccount = accounts[Math.floor(Math.random() * accounts.length)];
    
    // Ensure different accounts
    while (toAccount._id.toString() === fromAccount._id.toString()) {
      toAccount = accounts[Math.floor(Math.random() * accounts.length)];
    }
    
    // Generate random amount based on account type and currency
    let maxAmount;
    switch (fromAccount.currency) {
      case 'USD':
        maxAmount = fromAccount.accountType === 'Petty Cash' ? 1000 : 10000;
        break;
      case 'KES':
        maxAmount = fromAccount.accountType === 'Petty Cash' ? 100000 : 1000000;
        break;
      case 'NGN':
        maxAmount = fromAccount.accountType === 'Petty Cash' ? 500000 : 5000000;
        break;
      default:
        maxAmount = 10000;
    }
    
    const amount = Math.floor(Math.random() * maxAmount) + 1;
    const note = transactionNotes[Math.floor(Math.random() * transactionNotes.length)];
    
    // Random date within last 30 days
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const transactionDate = new Date(now.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000));
    
    // Calculate exchange rate and converted amount
    let convertedAmount = amount;
    let exchangeRate = 1;
    
    if (fromAccount.currency !== toAccount.currency) {
      const rateKey = `${fromAccount.currency}_${toAccount.currency}`;
      exchangeRate = EXCHANGE_RATES[rateKey] || 1;
      convertedAmount = amount * exchangeRate;
    }
    
    // Generate reference number manually
    const reference = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    transactions.push({
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      amount,
      currency: fromAccount.currency,
      convertedAmount: fromAccount.currency !== toAccount.currency ? convertedAmount : null,
      convertedCurrency: fromAccount.currency !== toAccount.currency ? toAccount.currency : null,
      exchangeRate,
      note,
      reference,
      transactionType: fromAccount.currency !== toAccount.currency ? 'conversion' : 'transfer',
      status: 'completed',
      createdAt: transactionDate,
      updatedAt: transactionDate
    });
  }
  
  return transactions;
}

// Main seeding function
async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Existing data cleared.');
    
    // Create accounts
    console.log('Creating sample accounts...');
    const accounts = await Account.insertMany(sampleAccounts);
    console.log(`Created ${accounts.length} accounts.`);
    
    // Generate and create transactions
    console.log('Generating sample transactions...');
    const sampleTransactions = generateSampleTransactions(accounts);
    
    // Create transactions one by one to ensure proper validation
    const transactions = [];
    for (const transactionData of sampleTransactions) {
      // Fetch the latest balances
      const fromAccount = await Account.findById(transactionData.fromAccount);
      const toAccount = await Account.findById(transactionData.toAccount);
      const amount = transactionData.amount;
      const credit = transactionData.convertedAmount || amount;

      // Only process if fromAccount has enough balance
      if (fromAccount.balance >= amount) {
        fromAccount.balance -= amount;
        toAccount.balance += credit;
        await fromAccount.save();
        await toAccount.save();
        const transaction = new Transaction(transactionData);
        await transaction.save();
        transactions.push(transaction);
      }
      // else skip this transaction
    }
    console.log(`Created ${transactions.length} transactions.`);
    
    // Display summary
    console.log('\n=== SEEDING COMPLETE ===');
    console.log(`Accounts created: ${accounts.length}`);
    console.log(`Transactions created: ${transactions.length}`);
    
    // Show account summary
    console.log('\nAccount Summary:');
    const accountSummary = await Account.find({}).sort({ currency: 1, accountType: 1 });
    accountSummary.forEach(account => {
      console.log(`${account.name}: ${account.currency} ${account.balance.toLocaleString()}`);
    });
    
    console.log('\nData seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

// Run the seeding function
if (require.main === module) {
  seedData();
}

module.exports = { seedData }; 