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
      const response = await fetch('/api/proxy/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      } else {
        console.error('Failed to fetch accounts:', response.status, response.statusText);
        toast.error('Failed to load accounts');
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      toast.error('Failed to load accounts');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/proxy/transactions?limit=100');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Banknote className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Treasury Movement Simulator</h1>
          </div>
          <p className="text-slate-600">Manage multi-currency accounts and simulate financial transactions</p>
        </div>

        {/* Stats Overview */}
        <StatsOverview accounts={accounts} transactions={transactions} />

        {/* Main Content */}
        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Transfer
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">  
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <p className="text-sm text-slate-600">
                  Monitor your multi-currency treasury accounts
                </p>
              </CardHeader>
              <CardContent>
                <AccountsTable accounts={accounts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer">
            <Card>
              <CardHeader>
                <CardTitle>Fund Transfer</CardTitle>
                <p className="text-sm text-slate-600">
                  Transfer funds between accounts with automatic FX conversion
                </p>
              </CardHeader>
              <CardContent>
                <TransferForm 
                  accounts={accounts} 
                  onSuccess={handleTransferSuccess}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <p className="text-sm text-slate-600">
                  View and filter all transaction records
                </p>
              </CardHeader>
              <CardContent>
                <TransactionHistory 
                  transactions={transactions}
                  accounts={accounts}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <p className="text-sm text-slate-600">
                  Insights and trends from your treasury operations
                </p>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}