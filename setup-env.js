#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  console.log('🚀 Treasury Movement Simulator - Environment Setup\n');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  console.log('📝 Please provide the following configuration:\n');
  
  // Database Configuration
  const mongodbUri = await question('MongoDB URI (default: mongodb://localhost:27017/treasury-simulator): ') || 'mongodb://localhost:27017/treasury-simulator';
  
  // API Configuration
  const apiUrl = await question('Backend API URL (default: http://localhost:3001): ') || 'http://localhost:3001';
  const port = await question('Backend Port (default: 3001): ') || '3001';
  
  // Exchange Rates
  const usdKesRate = await question('USD to KES rate (default: 150.0): ') || '150.0';
  const usdNgnRate = await question('USD to NGN rate (default: 800.0): ') || '800.0';
  const kesNgnRate = await question('KES to NGN rate (default: 5.33): ') || '5.33';
  
  // Application Settings
  const appName = await question('Application Name (default: Treasury Movement Simulator): ') || 'Treasury Movement Simulator';
  const nodeEnv = await question('Node Environment (default: development): ') || 'development';
  
  // Generate environment file content
  const envContent = `# Database Configuration
MONGODB_URI=${mongodbUri}

# API Configuration
NEXT_PUBLIC_API_URL=${apiUrl}
PORT=${port}

# Exchange Rates (optional - defaults to fixed rates)
USD_KES_RATE=${usdKesRate}
USD_NGN_RATE=${usdNgnRate}
KES_NGN_RATE=${kesNgnRate}

# Application Settings
NODE_ENV=${nodeEnv}
NEXT_PUBLIC_APP_NAME=${appName}

# Security (for production)
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here

# External APIs (for production)
EXCHANGE_RATE_API_KEY=your-api-key-here
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest

# Logging
LOG_LEVEL=info
`;

  // Write to .env.local
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 Location: ${envPath}`);
    console.log('\n🔧 Next steps:');
    console.log('1. Start MongoDB: sudo systemctl start mongod');
    console.log('2. Verify connection: npm run check-mongo');
    console.log('3. Seed data: npm run seed');
    console.log('4. Start application: npm run dev');
    console.log('\n📖 For more information, see the README.md file.');
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
  }
  
  rl.close();
}

// Run setup if called directly
if (require.main === module) {
  setupEnvironment().catch(console.error);
}

module.exports = { setupEnvironment }; 