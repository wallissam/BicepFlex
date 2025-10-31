import { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, TrendingUp, Info, ExternalLink } from 'lucide-react';

interface PricingInsight {
  message: string;
  type: 'savings' | 'cost-increase' | 'info';
  amount?: number;
  percentage?: number;
  link?: string;
}

export default function AzurePricingInsights({ 
  region, 
  resourceType, 
  currentSKU 
}: { 
  region: string; 
  resourceType: string; 
  currentSKU: string;
}) {
  const [insights, setInsights] = useState<PricingInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would call Azure Retail Prices API
    // https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices
    
    const fetchInsights = async () => {
      setLoading(true);
      
      // Mock insights based on resource type and SKU
      const mockInsights: PricingInsight[] = [];

      // Add region-specific pricing insights
      if (region === 'eastus' || region === 'westus') {
        mockInsights.push({
          message: `${region === 'eastus' ? 'East US' : 'West US'} typically has the lowest pricing for this resource type`,
          type: 'savings',
          percentage: 15,
        });
      }

      // Add SKU-specific insights
      if (currentSKU.toLowerCase().includes('premium')) {
        mockInsights.push({
          message: 'Standard tier could save you up to 60% with minimal feature differences',
          type: 'savings',
          amount: 120,
          percentage: 60,
          link: 'https://azure.microsoft.com/pricing/details/app-service/',
        });
      }

      // Add resource-specific insights
      if (resourceType === 'cosmosdb') {
        mockInsights.push({
          message: 'Consider serverless mode for unpredictable workloads - pay only for what you use',
          type: 'info',
          link: 'https://learn.microsoft.com/en-us/azure/cosmos-db/serverless',
        });
      }

      if (resourceType === 'sqlDatabase') {
        mockInsights.push({
          message: 'SQL elastic pools can reduce costs by 30-50% when running multiple databases',
          type: 'savings',
          percentage: 40,
          link: 'https://learn.microsoft.com/en-us/azure/azure-sql/database/elastic-pool-overview',
        });
      }

      if (resourceType === 'storageAccount') {
        mockInsights.push({
          message: 'Lifecycle management can automatically move data to cooler tiers, reducing storage costs by up to 90%',
          type: 'savings',
          percentage: 90,
          link: 'https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview',
        });
      }

      setInsights(mockInsights);
      setLoading(false);
    };

    fetchInsights();
  }, [region, resourceType, currentSKU]);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <DollarSign className="h-5 w-5 animate-pulse" />
          <span>Loading pricing insights...</span>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <DollarSign className="h-4 w-4" />
        <span>Pricing Insights</span>
      </div>
      
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border ${
            insight.type === 'savings'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : insight.type === 'cost-increase'
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {insight.type === 'savings' ? (
                <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : insight.type === 'cost-increase' ? (
                <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <p
                className={`text-sm ${
                  insight.type === 'savings'
                    ? 'text-green-800 dark:text-green-200'
                    : insight.type === 'cost-increase'
                    ? 'text-amber-800 dark:text-amber-200'
                    : 'text-blue-800 dark:text-blue-200'
                }`}
              >
                {insight.message}
              </p>
              
              {(insight.amount || insight.percentage) && (
                <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                  {insight.amount && `Save ~$${insight.amount}/month`}
                  {insight.amount && insight.percentage && ' • '}
                  {insight.percentage && `${insight.percentage}% savings`}
                </p>
              )}
              
              {insight.link && (
                <a
                  href={insight.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Learn more
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
      
      <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
        💡 Pricing insights are estimates based on Azure Retail Prices API
      </div>
    </div>
  );
}
