'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Search, Filter } from 'lucide-react';

// Improved currency formatter that handles small values better
function formatCurrency(amount: number, currency: string): string {
  // Handle very small amounts (less than 0.01)
  if (Math.abs(amount) < 0.01 && amount !== 0) {
    return `${amount.toFixed(6)} ${currency}`;
  }
  
  // Handle small amounts (less than 1)
  if (Math.abs(amount) < 1) {
    return `${amount.toFixed(4)} ${currency}`;
  }
  
  // Standard formatting for larger amounts
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format exchange rate to prevent overflow
function formatExchangeRate(rate: number): string {
  if (rate < 0.0001) {
    return rate.toExponential(2);
  }
  if (rate < 0.01) {
    return rate.toFixed(6);
  }
  if (rate < 1) {
    return rate.toFixed(4);
  }
  return rate.toFixed(2);
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

interface Account {
  _id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  accounts: Account[];
}

export function TransactionHistory({ transactions, accounts }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.fromAccount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.toAccount.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCurrency = currencyFilter === 'all' || transaction.currency === currencyFilter;
    
    const matchesAccount = accountFilter === 'all' || 
      transaction.fromAccount._id === accountFilter ||
      transaction.toAccount._id === accountFilter;

    return matchesSearch && matchesCurrency && matchesAccount;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="KES">KES</SelectItem>
            <SelectItem value="NGN">NGN</SelectItem>
          </SelectContent>
        </Select>

        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account._id} value={account._id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Filter className="h-4 w-4" />
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>

      {/* Transaction List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="text-slate-400 mb-2">No transactions found</div>
              <div className="text-sm text-slate-500">
                Try adjusting your search filters
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Header with accounts and status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                        <span className="font-medium text-slate-900 truncate">
                          {transaction.fromAccount.name}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400 hidden sm:block" />
                        <span className="font-medium text-slate-900 truncate">
                          {transaction.toAccount.name}
                        </span>
                      </div>
                      <Badge className={`${getStatusColor(transaction.status)} text-xs`}>
                        {transaction.status}
                      </Badge>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-xs sm:text-sm font-mono text-slate-500 break-all">
                        {transaction.reference}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Amount and conversion details */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="text-base sm:text-lg font-semibold text-slate-900 break-words">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                      
                      {transaction.convertedAmount && transaction.convertedCurrency && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <ArrowRight className="h-4 w-4 text-slate-400 hidden sm:block" />
                          <div className="text-base sm:text-lg font-semibold text-blue-600 break-words">
                            {formatCurrency(transaction.convertedAmount, transaction.convertedCurrency)}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-500 font-mono">
                            @ {formatExchangeRate(transaction.exchangeRate)}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-slate-600 break-words">
                      {transaction.note}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}