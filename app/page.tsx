'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountsTable } from '@/components/AccountsTable';
import { TransferForm } from '@/components/TransferForm';
import { TransactionHistory } from '@/components/TransactionHistory';
import { StatsOverview } from '@/components/StatsOverview';
import { Banknote, TrendingUp, ArrowRightLeft, History } from 'lucide-react';
import { toast } from 'sonner';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

interface Account {
  _id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
}

interface Transaction {
  _id: string;
  fromAccount: {
    _id: string;
    name: string;
    currency: string;
  };
  toAccount: {
    _id: string;
    name: string;
    currency: string;
  };
  amount: number;
  currency: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  exchangeRate: number;
  note: string;
  reference: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('https://treasury-movement-simulator.onrender.com/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      } else {
        console.error('Failed to fetch accounts:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://treasury-movement-simulator.onrender.com/api/transactions?limit=100');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      } else {
        console.error('Failed to fetch transactions:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchAccounts(), fetchTransactions()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleTransferSuccess = () => {
    fetchAccounts();
    fetchTransactions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading Treasury Simulator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
              <Banknote className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Treasury Movement Simulator</h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600">Manage multi-currency accounts and simulate financial transactions</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 sm:mb-8">
          <StatsOverview accounts={accounts} transactions={transactions} />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="accounts" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
            <TabsTrigger value="accounts" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <Banknote className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Accounts</span>
              <span className="sm:hidden">Accts</span>
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <ArrowRightLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Transfer</span>
              <span className="sm:hidden">Xfer</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">  
              <History className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">Hist</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Account Overview</CardTitle>
                <p className="text-xs sm:text-sm text-slate-600">
                  Monitor your multi-currency treasury accounts
                </p>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <AccountsTable accounts={accounts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Fund Transfer</CardTitle>
                <p className="text-xs sm:text-sm text-slate-600">
                  Transfer funds between accounts with automatic FX conversion
                </p>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <TransferForm 
                  accounts={accounts} 
                  onSuccess={handleTransferSuccess}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Transaction History</CardTitle>
                <p className="text-xs sm:text-sm text-slate-600">
                  View and filter all transaction records
                </p>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <TransactionHistory 
                  transactions={transactions}
                  accounts={accounts}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Analytics Dashboard</CardTitle>
                <p className="text-xs sm:text-sm text-slate-600">
                  Insights and trends from your treasury operations
                </p>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}