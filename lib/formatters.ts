export function formatCurrency(amount: number, currency: string): string {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    KES: new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }),
    NGN: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }),
  };

  const formatter = formatters[currency as keyof typeof formatters];
  return formatter ? formatter.format(amount) : `${currency} ${amount.toLocaleString()}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}