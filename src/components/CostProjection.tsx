import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { TrendingUp, Calendar, DollarSign, AlertCircle } from 'lucide-react';

interface CostTrend {
  month: string;
  cost: number;
  resources: number;
}

export default function CostProjection() {
  const { project } = useProjectStore();
  const [timeframe, setTimeframe] = useState<'6months' | '1year' | '2years'>('1year');

  if (project.resources.length === 0) {
    return null;
  }

  const monthlyCost = project.resources.reduce(
    (sum, r) => sum + (r.pricing?.estimatedMonthlyCost || 0),
    0
  );

  // Generate cost projections
  const generateProjections = (): CostTrend[] => {
    const months = timeframe === '6months' ? 6 : timeframe === '1year' ? 12 : 24;
    const projections: CostTrend[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const currentDate = new Date();
    
    for (let i = 0; i < months; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() + i);
      
      // Simulate slight growth (3-5% monthly) for realistic projection
      const growthFactor = 1 + (i * 0.03);
      const projectedCost = monthlyCost * growthFactor;
      
      projections.push({
        month: `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`,
        cost: projectedCost,
        resources: project.resources.length + Math.floor(i / 3), // Add resources every 3 months
      });
    }
    
    return projections;
  };

  const projections = generateProjections();
  const totalProjectedCost = projections.reduce((sum, p) => sum + p.cost, 0);
  const finalMonthCost = projections[projections.length - 1].cost;
  const costIncrease = finalMonthCost - monthlyCost;
  const percentageIncrease = (costIncrease / monthlyCost) * 100;

  return (
    <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Cost Projection
          </h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('6months')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeframe === '6months'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeframe('1year')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeframe === '1year'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            1 Year
          </button>
          <button
            onClick={() => setTimeframe('2years')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeframe === '2years'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            2 Years
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 mb-1">
            <Calendar className="h-4 w-4" />
            <span>Total ({timeframe === '6months' ? '6mo' : timeframe === '1year' ? '1yr' : '2yr'})</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            ${totalProjectedCost.toFixed(0)}
          </div>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 mb-1">
            <DollarSign className="h-4 w-4" />
            <span>Current Monthly</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            ${monthlyCost.toFixed(2)}
          </div>
        </div>
        
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Growth</span>
          </div>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            +{percentageIncrease.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Simple Cost Chart (Text-based) */}
      <div className="space-y-2 mb-4">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Monthly Cost Trend
        </div>
        {projections.map((projection, index) => {
          const percentage = (projection.cost / finalMonthCost) * 100;
          const isCurrentMonth = index === 0;
          
          return (
            <div key={projection.month} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isCurrentMonth ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {projection.month}
                  {isCurrentMonth && ' (Now)'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  ${projection.cost.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isCurrentMonth 
                      ? 'bg-blue-600 dark:bg-blue-500'
                      : index < 4
                      ? 'bg-green-500 dark:bg-green-400'
                      : index < 8
                      ? 'bg-amber-500 dark:bg-amber-400'
                      : 'bg-red-500 dark:bg-red-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>Projection assumes 3% monthly growth</strong> based on typical application scaling patterns.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Review costs quarterly to identify optimization opportunities</li>
              <li>Set up Azure Cost Management alerts at key thresholds</li>
              <li>Consider Reserved Instances for predictable workloads (up to 72% savings)</li>
              <li>Enable auto-scaling to optimize resource usage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
