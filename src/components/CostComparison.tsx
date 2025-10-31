import { useState } from 'react';
import type { AzureSKU, ResourceConfig } from '../types';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

interface CostComparisonProps {
  resource: ResourceConfig;
  availableSKUs: AzureSKU[];
  onSKUChange: (sku: AzureSKU) => void;
}

export default function CostComparison({ resource, availableSKUs, onSKUChange }: CostComparisonProps) {
  const [showComparison, setShowComparison] = useState(false);
  
  const currentMonthlyCost = resource.pricing?.estimatedMonthlyCost || 0;
  const currentYearlyCost = currentMonthlyCost * 12;
  
  // Group SKUs by tier for better comparison
  const skusByTier = availableSKUs.reduce((acc, sku) => {
    if (!acc[sku.tier]) {
      acc[sku.tier] = [];
    }
    acc[sku.tier].push(sku);
    return acc;
  }, {} as Record<string, AzureSKU[]>);
  
  const tierOrder = ['Free', 'Basic', 'Standard', 'Premium'];
  const sortedTiers = Object.keys(skusByTier).sort((a, b) => {
    const aIndex = tierOrder.indexOf(a);
    const bIndex = tierOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
  
  return (
    <div className="space-y-2">
      <button
        onClick={() => setShowComparison(!showComparison)}
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
      >
        <DollarSign className="w-4 h-4" />
        <span>{showComparison ? 'Hide' : 'Show'} Cost Comparison</span>
      </button>
      
      {showComparison && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4">
          {/* Current SKU Summary */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Current: {resource.sku.tier} - {resource.sku.name}
              </span>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  ${currentMonthlyCost.toFixed(2)}/mo
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  ${currentYearlyCost.toFixed(2)}/yr
                </div>
              </div>
            </div>
          </div>
          
          {/* SKU Comparison by Tier */}
          <div className="space-y-3">
            {sortedTiers.map(tier => (
              <div key={tier}>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  {tier} Tier
                </h4>
                <div className="space-y-2">
                  {skusByTier[tier].map((sku) => {
                    // Estimate cost based on tier (simplified)
                    const estimatedMonthlyCost = 
                      tier === 'Free' ? 0 :
                      tier === 'Basic' ? 30 :
                      tier === 'Standard' ? 75 :
                      tier === 'Premium' ? 200 :
                      50;
                    
                    const estimatedYearlyCost = estimatedMonthlyCost * 12;
                    const costDiff = estimatedMonthlyCost - currentMonthlyCost;
                    const isCurrentSKU = sku.name === resource.sku.name && sku.tier === resource.sku.tier;
                    const isCheaper = costDiff < 0;
                    const isMoreExpensive = costDiff > 0;
                    
                    return (
                      <button
                        key={sku.name}
                        onClick={() => !isCurrentSKU && onSKUChange(sku)}
                        disabled={isCurrentSKU}
                        className={`w-full p-3 border rounded-lg text-left transition-all ${
                          isCurrentSKU
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 cursor-default'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {sku.name}
                              </span>
                              {isCurrentSKU && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            {sku.size && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Size: {sku.size}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="font-bold text-slate-900 dark:text-white">
                              ${estimatedMonthlyCost.toFixed(2)}/mo
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              ${estimatedYearlyCost.toFixed(2)}/yr
                            </div>
                            
                            {!isCurrentSKU && costDiff !== 0 && (
                              <div className={`flex items-center justify-end space-x-1 mt-1 text-xs font-medium ${
                                isCheaper ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {isCheaper ? (
                                  <>
                                    <TrendingDown className="w-3 h-3" />
                                    <span>Save ${Math.abs(costDiff).toFixed(2)}/mo</span>
                                  </>
                                ) : (
                                  <>
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+${costDiff.toFixed(2)}/mo</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Note */}
          <div className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Note:</strong> Cost estimates are approximate and may vary based on region, usage patterns, and Azure pricing changes. Always verify with Azure Pricing Calculator.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
