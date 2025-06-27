'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatters';

interface Account {
  _id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
}

interface TransferFormProps {
  accounts: Account[];
  onSuccess: () => void;
}

const EXCHANGE_RATES = {
  'USD_KES': 150.0,
  'USD_NGN': 800.0,
  'KES_USD': 1/150.0,
  'KES_NGN': 800.0/150.0,
  'NGN_USD': 1/800.0,
  'NGN_KES': 150.0/800.0
};

export function TransferForm({ accounts, onSuccess }: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fromAccountData = accounts.find(acc => acc._id === fromAccount);
  const toAccountData = accounts.find(acc => acc._id === toAccount);

  const calculateConversion = () => {
    if (!fromAccountData || !toAccountData || !amount) return null;
    
    const transferAmount = parseFloat(amount);
    if (fromAccountData.currency === toAccountData.currency) {
      return { convertedAmount: transferAmount, rate: 1 };
    }

    const rateKey = `${fromAccountData.currency}_${toAccountData.currency}`;
    const rate = EXCHANGE_RATES[rateKey] || 1;
    return { convertedAmount: transferAmount * rate, rate };
  };

  const conversion = calculateConversion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromAccount || !toAccount || !amount || !note) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (fromAccount === toAccount) {
      toast.error('Cannot transfer to the same account');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
      toast.error('Transfer amount must be greater than 0');
      return;
    }

    if (fromAccountData && transferAmount > fromAccountData.balance) {
      toast.error('Insufficient funds in source account');
      return;
    }

    // Validate scheduled date is not in the past
    if (scheduledDate) {
      const selectedDate = new Date(scheduledDate);
      const now = new Date();
      
      if (selectedDate <= now) {
        toast.error('Scheduled date cannot be in the past. Please select a future date and time.');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('/api/proxy/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: toAccount,
          amount: transferAmount,
          note,
          scheduledDate: scheduledDate || null
        }),
      });

      if (response.ok) {
        const transaction = await response.json();
        toast.success(
          scheduledDate 
            ? `Transfer scheduled for ${new Date(scheduledDate).toLocaleDateString()}`
            : `Transfer completed successfully! Reference: ${transaction.reference}`
        );
        
        // Reset form
        setFromAccount('');
        setToAccount('');
        setAmount('');
        setNote('');
        setScheduledDate('');
        
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Transfer failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From Account */}
          <div className="space-y-2">
            <Label htmlFor="from-account">From Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account._id} value={account._id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{account.name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge variant="outline" className="text-xs">
                          {account.currency}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {formatCurrency(account.balance, account.currency)}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromAccountData && (
              <div className="text-sm text-slate-600">
                Available: {formatCurrency(fromAccountData.balance, fromAccountData.currency)}
              </div>
            )}
          </div>

          {/* To Account */}
          <div className="space-y-2">
            <Label htmlFor="to-account">To Account</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  .filter(account => account._id !== fromAccount)
                  .map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{account.name}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          {account.currency}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transfer Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Transfer Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="text-lg"
          />
          {fromAccountData && (
            <div className="text-sm text-slate-600">
              Currency: {fromAccountData.currency}
            </div>
          )}
        </div>

        {/* Conversion Preview */}
        {conversion && fromAccountData && toAccountData && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium text-blue-900">Transfer Preview</div>
                  <div className="text-blue-700">
                    {formatCurrency(parseFloat(amount || '0'), fromAccountData.currency)}
                  </div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-blue-600" />
                
                <div className="text-sm text-right">
                  <div className="font-medium text-blue-900">Recipient Gets</div>
                  <div className="text-blue-700">
                    {formatCurrency(conversion.convertedAmount, toAccountData.currency)}
                  </div>
                </div>
              </div>
              
              {conversion.rate !== 1 && (
                <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-600">
                  Exchange Rate: 1 {fromAccountData.currency} = {conversion.rate} {toAccountData.currency}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Note */}
        <div className="space-y-2">
          <Label htmlFor="note">Transfer Note</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter a description for this transfer..."
            rows={3}
          />
        </div>

        {/* Scheduled Date */}
        <div className="space-y-2">
          <Label htmlFor="scheduled-date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Transfer (Optional)
          </Label>
          <Input
            id="scheduled-date"
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className={scheduledDate && new Date(scheduledDate) <= new Date() ? 'border-red-300 focus:border-red-500' : ''}
          />
          {scheduledDate && (
            <div className={`flex items-center gap-2 text-sm ${
              new Date(scheduledDate) <= new Date() 
                ? 'text-red-600' 
                : 'text-amber-600'
            }`}>
              <AlertCircle className="h-4 w-4" />
              {new Date(scheduledDate) <= new Date() 
                ? 'Invalid date: Cannot schedule in the past'
                : `This transfer will be scheduled for ${new Date(scheduledDate).toLocaleString()}`
              }
            </div>
          )}
          <div className="text-xs text-gray-500">
            Leave empty for immediate transfer, or select a future date and time to schedule
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={
            loading || 
            !fromAccount || 
            !toAccount || 
            !amount || 
            !note ||
            (scheduledDate && new Date(scheduledDate) <= new Date())
          }
          className="w-full"
          size="lg"
        >
          {loading ? 'Processing...' : (scheduledDate ? 'Schedule Transfer' : 'Transfer Funds')}
        </Button>
      </form>
    </div>
  );
}