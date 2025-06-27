'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
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
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-slate-400 mb-2">No transactions found</div>
              <div className="text-sm text-slate-500">
                Try adjusting your search filters
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-slate-900">
                          {transaction.fromAccount.name}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {transaction.toAccount.name}
                        </span>
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold text-slate-900">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                        {transaction.convertedAmount && transaction.convertedCurrency && (
                          <>
                            <ArrowRight className="h-4 w-4 text-slate-400" />
                            <div className="text-lg font-semibold text-blue-600">
                              {formatCurrency(transaction.convertedAmount, transaction.convertedCurrency)}
                            </div>
                            <div className="text-sm text-slate-500">
                              @ {transaction.exchangeRate.toFixed(4)}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="text-sm text-slate-600">
                        {transaction.note}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-sm font-mono text-slate-500">
                      {transaction.reference}
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(transaction.createdAt).toLocaleString()}
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