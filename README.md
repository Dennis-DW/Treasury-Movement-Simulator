# Treasury Movement Simulator

A comprehensive treasury management web application built with Next.js, Express.js, and MongoDB. This application allows you to manage multiple currency accounts, track transactions, and monitor treasury operations with beautiful analytics and real-time insights.

## 🌐 Live Application

**🌍 Frontend:** [Treasury Movement Simulator](https://treasury-movement-simulator-one.vercel.app)

**🔧 Backend API:** [https://treasury-movement-simulator.onrender.com](https://treasury-movement-simulator.onrender.com)

**📊 Demo Features:**
- Multi-currency account management (USD, KES, NGN)
- Real-time transaction processing
- Interactive analytics dashboard
- Fund transfer with automatic currency conversion
- Transaction scheduling capabilities
- Live data from MongoDB Atlas

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
- **Treasury Bills**: Government securities

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
- **MongoDB Atlas**: Cloud NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing

### **Development Tools**
- **Nodemon**: Auto-restart server during development
- **Concurrently**: Run multiple commands simultaneously
- **ESLint**: Code linting and formatting

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
# See "Environment Variables" section below for details
```

### 4. **Start the Application**

**Development Mode (Frontend + Backend)**
```bash
npm run dev
```

**Frontend Only**
```bash
npm run dev:frontend
```

**Backend Only**
```bash
npm run dev:backend
```

### 5. **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🔧 Environment Variables

### **Required Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Database Configuration (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/treasury-simulator?retryWrites=true&w=majority

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3001

# Exchange Rates
USD_KES_RATE=150.0
USD_NGN_RATE=800.0
KES_NGN_RATE=5.33

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Treasury Movement Simulator
```

### **Environment Variables Explained**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | - | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL for frontend | `http://localhost:3001` | Yes |
| `PORT` | Backend server port | `3001` | No |
| `USD_KES_RATE` | USD to KES exchange rate | `150.0` | No |
| `USD_NGN_RATE` | USD to NGN exchange rate | `800.0` | No |
| `KES_NGN_RATE` | KES to NGN exchange rate | `5.33` | No |
| `NODE_ENV` | Application environment | `development` | No |

## 📊 Database Setup

### **Seed Sample Data**
```bash
npm run seed
```

This will create:
- 12 sample accounts across USD, KES, and NGN
- 49 sample transactions with realistic data
- Multiple account types and balances

### **Check Database Connection**
```bash
npm run check-mongo
```

## 📱 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development |
| `npm run dev:frontend` | Start only the frontend |
| `npm run dev:backend` | Start only the backend |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production frontend |
| `npm run seed` | Seed the database with sample data |
| `npm run check-mongo` | Test MongoDB connection |
| `npm run setup` | Interactive environment setup |

## 🔍 API Endpoints

### **Health Check**
- `GET /api/health` - Check API status

### **Accounts**
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### **Transactions**
- `GET /api/transactions` - Get transactions (with pagination)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## 🎯 Project Structure

```
treasury-simulator/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components (Radix UI)
│   ├── AnalyticsDashboard.tsx
│   ├── TransferForm.tsx
│   └── ...
├── server/               # Backend server
│   ├── models/           # MongoDB models
│   ├── routes/           # Express routes
│   ├── server.js         # Main server file
│   └── seedData.js       # Database seeding
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


**Built with ❤️ for modern treasury management** 