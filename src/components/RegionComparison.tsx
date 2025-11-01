import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useProjectStore } from '../store/projectStore';
import { azurePricingService } from '../services/azurePricing';
import { serviceNameMapping } from '../data/resourceTemplates';
import { commonRegions } from '../data/resourceTemplates';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function RegionComparison() {
  const { project } = useProjectStore();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    project.region,
    'westus2',
    'westeurope',
  ]);

  // Fetch pricing for all selected regions
  const pricingQueries = useQueries({
    queries: selectedRegions.map((region) => ({
      queryKey: ['region-comparison', region, project.resources],
      queryFn: async () => {
        const costs = await Promise.all(
          project.resources.map(async (resource) => {
            const serviceName = serviceNameMapping[resource.type];
            if (!serviceName) return 0;

            const pricing = await azurePricingService.getServicePricing(serviceName, region);
            const skuPricing = pricing.get(resource.sku.name);
            return skuPricing?.estimatedMonthlyCost || 0;
          })
        );

        return {
          region,
          totalCost: costs.reduce((sum, cost) => sum + cost, 0),
        };
      },
      enabled: project.resources.length > 0,
    })),
  });

  const isLoading = pricingQueries.some((q) => q.isLoading);
  const allData = pricingQueries.map((q) => q.data).filter(Boolean);

  if (project.resources.length === 0) {
    return (
      <div className="card">
        <p className="text-center text-slate-500">
          Add resources to see regional cost comparison
        </p>
      </div>
    );
  }

  const minCost = Math.min(...allData.map((d) => d!.totalCost));
  const maxCost = Math.max(...allData.map((d) => d!.totalCost));

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Regional Cost Comparison
        </h3>
        <p className="text-sm text-slate-600">
          Compare estimated monthly costs across different Azure regions
        </p>
      </div>

      {/* Region Selector */}
      <div className="mb-6">
        <label className="label">Select Regions to Compare (max 5)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {commonRegions.slice(0, 12).map((region) => (
            <button
              key={region.name}
              onClick={() => {
                if (selectedRegions.includes(region.name)) {
                  setSelectedRegions(selectedRegions.filter((r) => r !== region.name));
                } else if (selectedRegions.length < 5) {
                  setSelectedRegions([...selectedRegions, region.name]);
                }
              }}
              disabled={
                !selectedRegions.includes(region.name) && selectedRegions.length >= 5
              }
              className={`p-3 text-sm rounded-lg border-2 transition-all ${
                selectedRegions.includes(region.name)
                  ? 'border-primary-500 bg-primary-50 font-semibold'
                  : 'border-slate-200 hover:border-slate-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {region.displayName}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner text="Fetching regional pricing..." />
        </div>
      ) : (
        <div className="space-y-3">
          {allData.map((data) => {
            const regionInfo = commonRegions.find((r) => r.name === data!.region);
            const isMin = data!.totalCost === minCost;
            const isMax = data!.totalCost === maxCost;
            const savingsVsMax = maxCost - data!.totalCost;
            const savingsPercent =
              maxCost > 0 ? ((savingsVsMax / maxCost) * 100).toFixed(0) : 0;

            return (
              <div
                key={data!.region}
                className={`p-4 rounded-lg border-2 ${
                  isMin
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {regionInfo?.displayName}
                      </div>
                      <div className="text-sm text-slate-500">{data!.region}</div>
                    </div>
                    {isMin && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                        BEST VALUE
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-slate-900">
                        {data!.totalCost.toFixed(2)}
                      </span>
                      <span className="text-slate-500">/mo</span>
                    </div>

                    {!isMin && savingsVsMax > 0 && (
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        {isMax ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">
                              +${savingsVsMax.toFixed(2)} vs best
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">
                              Save ${savingsVsMax.toFixed(2)} ({savingsPercent}%)
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {isMin && allData.length > 1 && (
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <Minus className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-semibold">
                          Lowest cost
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Costs may vary based on actual usage, data transfer, and
          availability of services in each region. Some services may not be available in all
          regions.
        </p>
      </div>
    </div>
  );
}
