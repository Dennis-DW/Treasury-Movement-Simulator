'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react';

interface Account {
  _id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
}

interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  transactionType: string;
  createdAt: string;
  fromAccount: { name: string; currency: string };
  toAccount: { name: string; currency: string };
}

// Soft, eye-comfortable colors
const SOFT_COLORS = [
  '#8B9DC3', // Soft blue
  '#B8A9C9', // Soft purple
  '#A7C7E7', // Light blue
  '#C1E1C1', // Soft green
  '#F4C2C2', // Soft pink
  '#E6D7C3', // Soft beige
  '#D4E4F7', // Very light blue
  '#F0E6FF', // Very light purple
  '#E8F5E8', // Very light green
  '#FFE6E6', // Very light pink
  '#F5F5DC', // Cream
  '#E6F3FF'  // Ice blue
];

const CHART_COLORS = [
  '#8B9DC3', // Soft blue
  '#B8A9C9', // Soft purple
  '#A7C7E7', // Light blue
  '#C1E1C1', // Soft green
  '#F4C2C2', // Soft pink
  '#E6D7C3'  // Soft beige
];

// Format money with K/M/B/T suffixes
const formatMoney = (value: number) => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
};

// Get short name for accounts
const getShortName = (name: string) => {
  const shortNames: { [key: string]: string } = {
    'USD Operating Account': 'USD Op',
    'USD Reserve Fund': 'USD Reserve',
    'USD Investment Portfolio': 'USD Invest',
    'KES Operating Account': 'KES Op',
    'KES Investment Fund': 'KES Invest',
    'KES Petty Cash': 'KES Petty',
    'KES Emergency Fund': 'KES Emergency',
    'NGN Operating Account': 'NGN Op',
    'NGN Reserve Fund': 'NGN Reserve',
    'NGN Investment Account': 'NGN Invest',
    'USD FX Reserve': 'USD FX',
    'KES Treasury Bills': 'KES Treasury'
  };
  return shortNames[name] || name.split(' ').slice(0, 2).join(' ');
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<{ accounts: Account[]; transactions: Transaction[] }>({ accounts: [], transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          fetch('https://treasury-movement-simulator.onrender.com/api/accounts'),
          fetch('https://treasury-movement-simulator.onrender.com/api/transactions?limit=1000')
        ]);

        const accounts = await accountsRes.json();
        const transactionsData = await transactionsRes.json();
        const transactions = transactionsData.transactions || [];

        setData({ accounts, transactions });
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  // Prepare chart data
  const accountBalanceData = data.accounts.map(account => ({
    name: getShortName(account.name),
    balance: account.balance,
    currency: account.currency,
    fullName: account.name
  }));

  const currencyDistribution = data.accounts.reduce((acc, account) => {
    const currency = account.currency;
    if (!acc[currency]) acc[currency] = { currency, total: 0 };
    acc[currency].total += account.balance;
    return acc;
  }, {} as Record<string, { currency: string; total: number }>);

  const currencyData = Object.values(currencyDistribution).map(item => ({
    name: item.currency,
    value: item.total
  }));

  // Transaction trends by date
  const transactionTrends = data.transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, count: 0, total: 0 };
    }
    acc[date].count += 1;
    acc[date].total += transaction.amount;
    return acc;
  }, {} as Record<string, { date: string; count: number; total: number }>);

  const trendsData = Object.values(transactionTrends)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10); // Last 10 days

  // Transaction types distribution
  const transactionTypes = data.transactions.reduce((acc, transaction) => {
    const type = transaction.transactionType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const transactionTypeData = Object.entries(transactionTypes).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count
  }));

  const totalBalance = data.accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalTransactions = data.transactions.length;

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${formatMoney(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards with Soft Backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-blue-300/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Balance</h3>
              <div className="p-2 bg-white/60 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">${formatMoney(totalBalance)}</div>
            <p className="text-sm text-gray-600">Across all accounts</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-green-300/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Transactions</h3>
              <div className="p-2 bg-white/60 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalTransactions}</div>
            <p className="text-sm text-gray-600">All time transactions</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-purple-300/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Active Accounts</h3>
              <div className="p-2 bg-white/60 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{data.accounts.length}</div>
            <p className="text-sm text-gray-600">Total accounts</p>
          </div>
        </div>
      </div>

      {/* Charts with Gradient Styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
            <CardTitle className="text-white">Account Balances</CardTitle>
            <CardDescription className="text-blue-100">Current balance by account</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accountBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  fontSize={12}
                  stroke="#6b7280"
                />
                <YAxis 
                  tickFormatter={formatMoney}
                  fontSize={12}
                  stroke="#6b7280"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="url(#softBlueGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#8B9DC3', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, stroke: '#8B9DC3', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="softBlueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B9DC3" />
                    <stop offset="100%" stopColor="#A7C7E7" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
            <CardTitle className="text-white">Currency Distribution</CardTitle>
            <CardDescription className="text-purple-100">Balance distribution by currency</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={currencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${formatMoney(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {currencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${formatMoney(Number(value))}`, 'Total']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-green-400 to-green-600 text-white">
            <CardTitle className="text-white">Transaction Trends</CardTitle>
            <CardDescription className="text-green-100">Daily transaction volume</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" fontSize={12} stroke="#6b7280" />
                <YAxis tickFormatter={formatMoney} fontSize={12} stroke="#6b7280" />
                <Tooltip formatter={(value) => [`$${formatMoney(Number(value))}`, 'Total']} />
                <defs>
                  <linearGradient id="softAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C1E1C1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E8F5E8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="url(#softAreaGradient)"
                  fill="url(#softAreaGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-pink-400 to-pink-600 text-white">
            <CardTitle className="text-white">Transaction Types</CardTitle>
            <CardDescription className="text-pink-100">Distribution of transaction types</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transactionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transactionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 