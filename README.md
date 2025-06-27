# Treasury Movement Simulator

A comprehensive treasury management web application built with Next.js, Express.js, and MongoDB. This application allows you to manage multiple currency accounts, track transactions, and monitor treasury operations with beautiful analytics and real-time insights.

## 🌐 Live Application

**🌍 Live Website:** [Treasury Movement Simulator](https://treasury-simulator.vercel.app)

**📊 Demo Features:**
- Multi-currency account management (USD, KES, NGN)
- Real-time transaction processing
- Interactive analytics dashboard
- Fund transfer with automatic currency conversion
- Transaction scheduling capabilities

## ✨ Features

### 💰 **Multi-Currency Support**
- Manage accounts in USD, KES, and NGN
- Automatic currency conversion with real-time exchange rates
- Cross-currency fund transfers

### 🏦 **Account Types**
- **Operating Accounts**: Daily business operations
- **Reserve Funds**: Emergency and backup funds
- **Investment Portfolios**: Long-term investments
- **Petty Cash**: Small expense management
- **FX Reserve**: Foreign exchange reserves

### 📈 **Analytics Dashboard**
- **Interactive Charts**: Line charts, pie charts, and area charts
- **Real-time Statistics**: Account balances, transaction counts, trends
- **Beautiful Gradients**: Modern UI with gradient styling
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🔄 **Transaction Management**
- **Instant Transfers**: Immediate fund transfers between accounts
- **Scheduled Transfers**: Plan future transactions
- **Transaction History**: Complete audit trail
- **Status Tracking**: Pending, completed, failed, scheduled

### 🎨 **Modern UI/UX**
- **Clean Design**: White-based theme with beautiful gradients
- **Responsive Layout**: Optimized for all screen sizes
- **Real-time Updates**: Live data without page refresh
- **Toast Notifications**: User-friendly feedback

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Recharts**: Beautiful data visualization
- **React Hook Form**: Form handling and validation

### **Backend**
- **Express.js**: Node.js web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing

### **Development Tools**
- **Nodemon**: Auto-restart server during development
- **Concurrently**: Run multiple commands simultaneously
- **ESLint**: Code linting and formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** for version control

## 🔧 Environment Variables

### 1. **Create Environment File**

**Option A: Interactive Setup (Recommended)**
```bash
npm run setup
```

**Option B: Manual Setup**
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your configuration
# See "Environment Variables" section below for details
```

### 2. **Configure Environment Variables**

Edit `.env.local` with your specific values:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/treasury-simulator

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3001

# Exchange Rates (optional - defaults to fixed rates)
USD_KES_RATE=150.0
USD_NGN_RATE=800.0
KES_NGN_RATE=5.33

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Treasury Movement Simulator

# Security (for production)
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here

# External APIs (for production)
EXCHANGE_RATE_API_KEY=your-api-key-here
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest

# Logging
LOG_LEVEL=info
```

### 3. **Environment Variables Explained**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/treasury-simulator` | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL for frontend | `http://localhost:3001` | Yes |
| `PORT` | Backend server port | `3001` | No |
| `USD_KES_RATE` | USD to KES exchange rate | `150.0` | No |
| `USD_NGN_RATE` | USD to NGN exchange rate | `800.0` | No |
| `KES_NGN_RATE` | KES to NGN exchange rate | `5.33` | No |
| `NODE_ENV` | Application environment | `development` | No |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Treasury Movement Simulator` | No |

### 4. **Production Environment Variables**

For production deployment, add these additional variables:

```env
# Security (generate strong secrets)
JWT_SECRET=your-super-secure-jwt-secret-here
SESSION_SECRET=your-super-secure-session-secret-here

# External APIs
EXCHANGE_RATE_API_KEY=your-exchange-rate-api-key
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest

# Logging
LOG_LEVEL=error
```

### 5. **MongoDB Atlas Setup**

If using MongoDB Atlas (cloud):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/treasury-simulator?retryWrites=true&w=majority
```

**Steps to get MongoDB Atlas connection string:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `username`, `password`, and `cluster` with your actual values

## 🚀 Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/Dennis-DW/Treasury-Movement-Simulator.git
cd treasury-simulator
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Set up Environment Variables**

**Option A: Interactive Setup (Recommended)**
```bash
npm run setup
```

**Option B: Manual Setup**
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your configuration
# See "Environment Variables" section above for details
```

### 4. **Set up MongoDB**
- **Option A: Local MongoDB**
  ```bash
  # Start MongoDB service
  sudo systemctl start mongod  # Linux
  brew services start mongodb-community  # macOS
  ```
  
- **Option B: MongoDB Atlas (Cloud)**
  - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
  - Get your connection string
  - Update `MONGODB_URI` in your `.env.local` file

### 5. **Verify MongoDB Connection**
```bash
npm run check-mongo
```

### 6. **Seed Sample Data**
```bash
npm run seed
```

This will create:
- 12 sample accounts across different currencies
- 50 realistic transactions
- Proper account balances

### 7. **Start the Application**
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📊 Sample Data

The seeding script creates realistic treasury data:

### **Accounts Created:**
- USD Operating Account ($50,000)
- USD Reserve Fund ($100,000)
- USD Investment Portfolio ($75,000)
- KES Operating Account (KES 5,000,000)
- KES Investment Fund (KES 10,000,000)
- KES Petty Cash (KES 50,000)
- KES Emergency Fund (KES 2,000,000)
- NGN Operating Account (NGN 20,000,000)
- NGN Reserve Fund (NGN 50,000,000)
- NGN Investment Account (NGN 15,000,000)
- USD FX Reserve ($25,000)
- KES Treasury Bills (KES 5,000,000)

### **Transaction Types:**
- **Transfers**: Same currency transfers
- **Conversions**: Cross-currency transfers with automatic conversion
- **Scheduled**: Future-dated transactions

## 🔧 Available Scripts

```bash
# Setup
npm run setup             # Interactive environment setup

# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Database
npm run seed             # Populate database with sample data
npm run check-mongo      # Verify MongoDB connection

# Production
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

## 🌐 API Endpoints

### **Accounts**
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `POST /api/accounts/initialize` - Initialize default accounts

### **Transactions**
- `GET /api/transactions` - Get all transactions (with filtering)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/stats` - Get transaction statistics

### **Query Parameters**
- `limit`: Number of records to return
- `page`: Page number for pagination
- `currency`: Filter by currency
- `startDate`/`endDate`: Date range filtering

## 💱 Exchange Rates

The application uses the following fixed exchange rates:
- **USD to KES**: 1 USD = 150 KES
- **USD to NGN**: 1 USD = 800 NGN
- **KES to NGN**: 1 KES = 5.33 NGN

*Note: In a production environment, these would be fetched from a real-time exchange rate API.*

## 🎯 Key Features Explained

### **Analytics Dashboard**
- **Account Balances**: Line chart showing current balances
- **Currency Distribution**: Pie chart of balance by currency
- **Transaction Trends**: Area chart of daily transaction volume
- **Transaction Types**: Distribution of transfer types

### **Fund Transfer System**
- **Real-time Validation**: Check sufficient funds before transfer
- **Currency Conversion**: Automatic conversion with exchange rates
- **Scheduling**: Schedule transfers for future dates
- **Transaction History**: Complete audit trail

### **Security Features**
- **Input Validation**: Both client and server-side validation
- **Date Validation**: Prevents scheduling transactions in the past
- **Balance Checks**: Ensures sufficient funds before transfers
- **Error Handling**: Comprehensive error messages

## 🚀 Deployment

### **Frontend (Vercel)**
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### **Backend (Railway/Render)**
1. Connect your repository
2. Set `MONGODB_URI` environment variable
3. Deploy the backend API

### **Database (MongoDB Atlas)**
1. Create a free cluster
2. Get connection string
3. Set up network access

## 🆘 Troubleshooting

### **Common Issues**

**Environment Variables Not Loading:**
```bash
# Check if .env.local exists
ls -la .env.local

# Verify environment variables are set
echo $MONGODB_URI
echo $NEXT_PUBLIC_API_URL
```

**MongoDB Connection Failed:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection string in .env.local
cat .env.local | grep MONGODB_URI
```

**Port Already in Use:**
```bash
# Kill process using port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Or change ports in .env.local
PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

**Data Not Loading:**
```bash
# Re-seed the database
npm run seed

# Check API connectivity
curl http://localhost:3001/api/health
```

**Frontend Can't Connect to Backend:**
```bash
# Verify backend is running
curl http://localhost:3001/api/health

# Check NEXT_PUBLIC_API_URL in .env.local
cat .env.local | grep NEXT_PUBLIC_API_URL

# Restart both frontend and backend
npm run dev
```

### **Environment Variable Debugging**

**Check if variables are loaded:**
```bash
# Backend variables
node -e "console.log('MONGODB_URI:', process.env.MONGODB_URI)"
node -e "console.log('PORT:', process.env.PORT)"

# Frontend variables (must start with NEXT_PUBLIC_)
node -e "console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)"
```

**Common Environment Variable Mistakes:**
- Forgetting to prefix frontend variables with `NEXT_PUBLIC_`
- Using spaces around `=` in `.env.local`
- Not restarting the development server after changing `.env.local`
- Using quotes around values in `.env.local`

### **Production Deployment Issues**

**Vercel Environment Variables:**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all required variables
4. Redeploy the application

**Backend Environment Variables:**
1. Set environment variables in your hosting platform (Railway, Render, etc.)
2. Ensure `MONGODB_URI` is correctly formatted
3. Check that `PORT` is set (most platforms set this automatically)

### **Database Issues**

**MongoDB Atlas Connection:**
```bash
# Test connection string
mongosh "your-connection-string"

# Common issues:
# - Network access not configured
# - Wrong username/password
# - Database name missing
# - IP whitelist not set
```

**Local MongoDB Issues:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo journalctl -u mongod -f

# Reset MongoDB data (WARNING: deletes all data)
sudo systemctl stop mongod
sudo rm -rf /var/lib/mongodb/*
sudo systemctl start mongod
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⭐ Star this repository if you find it helpful!**

**🔗 Live Demo:** [https://treasury-simulator.vercel.app](https://treasury-simulator.vercel.app) 