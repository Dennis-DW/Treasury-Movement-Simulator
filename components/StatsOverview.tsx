import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

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

interface StatsOverviewProps {
  accounts: Account[];
  transactions: Transaction[];
}

export function StatsOverview({ accounts, transactions }: StatsOverviewProps) {
  // Calculate total balances by currency
  const balancesByCurrency = accounts.reduce((acc, account) => {
    if (!acc[account.currency]) {
      acc[account.currency] = 0;
    }
    acc[account.currency] += account.balance;
    return acc;
  }, {} as Record<string, number>);

  // Calculate recent transactions (last 24 hours)
  const recentTxns = transactions.filter(txn => {
    const txnDate = new Date(txn.createdAt);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return txnDate > oneDayAgo;
  }).length;

  // Calculate total transaction volume by currency
  const volumeByCurrency = transactions.reduce((acc, txn) => {
    if (!acc[txn.currency]) {
      acc[txn.currency] = 0;
    }
    acc[txn.currency] += txn.amount;
    return acc;
  }, {} as Record<string, number>);

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'USD': return '🇺🇸';
      case 'KES': return '🇰🇪';
      case 'NGN': return '🇳🇬';
      default: return '💰';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Currency Balances */}
      {Object.entries(balancesByCurrency).map(([currency, balance]) => (
        <Card key={currency} className="bg-gradient-to-br from-white to-slate-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{getCurrencyIcon(currency)}</div>
              <Badge variant="outline" className="text-xs">
                {currency}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-slate-600">Total Balance</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(balance, currency)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Recent Activity */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-6 w-6 text-blue-600" />
            <Badge className="bg-blue-200 text-blue-800">24h</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-blue-700">Recent Transactions</div>
            <div className="text-2xl font-bold text-blue-900">
              {recentTxns}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}