'use client';

interface FinancialHealthBarProps {
  advance: number;
  total: number;
  currency?: string;
  currencySymbol?: string;
}

export function FinancialHealthBar({
  advance,
  total,
  currency = 'INR',
  currencySymbol = '₹'
}: FinancialHealthBarProps) {
  if (total === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-950/20 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">No payment info</p>
      </div>
    );
  }

  const percentage = Math.min((advance / total) * 100, 100);
  const balance = total - advance;

  // Determine color based on percentage
  const getBarColor = () => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-orange-500';
  };

  const getBarBgColor = () => {
    if (percentage >= 100) return 'bg-green-100 dark:bg-green-900/30';
    if (percentage >= 50) return 'bg-amber-100 dark:bg-amber-900/30';
    return 'bg-orange-100 dark:bg-orange-900/30';
  };

  return (
    <div className={`${getBarBgColor()} rounded-lg p-3 border border-current border-opacity-20`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Payment Progress
        </span>
        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className={`absolute left-0 top-0 h-full ${getBarColor()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Amount Breakdown */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Paid: </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {currencySymbol}{advance.toLocaleString()}
          </span>
        </div>
        <div className="text-right">
          <span className="text-gray-600 dark:text-gray-400">Balance: </span>
          <span className={`font-semibold ${balance > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
            {currencySymbol}{balance.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
