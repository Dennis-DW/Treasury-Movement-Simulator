import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';

interface Account {
  _id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
}

interface AccountsTableProps {
  accounts: Account[];
}

const getCurrencyColor = (currency: string) => {
  switch (currency) {
    case 'USD': return 'bg-green-100 text-green-800 border-green-200';
    case 'KES': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'NGN': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getAccountTypeColor = (type: string) => {
  switch (type) {
    case 'Operating': return 'bg-emerald-100 text-emerald-800';
    case 'Reserve': return 'bg-violet-100 text-violet-800';
    case 'Investment': return 'bg-amber-100 text-amber-800';
    case 'Petty Cash': return 'bg-cyan-100 text-cyan-800';
    case 'FX Reserve': return 'bg-rose-100 text-rose-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function AccountsTable({ accounts }: AccountsTableProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <Card key={account._id} className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900 leading-tight">
                {account.name}
              </h3>
              <Badge className={getCurrencyColor(account.currency)}>
                {account.currency}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(account.balance, account.currency)}
              </div>
              <Badge variant="secondary" className={getAccountTypeColor(account.accountType)}>
                {account.accountType}
              </Badge>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Account ID: {account._id.slice(-8)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}