import { AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import type { ResourceConfig } from '../types';

interface CostAlertProps {
  totalCost: number;
  resources: ResourceConfig[];
}

export default function CostAlert({ totalCost, resources }: CostAlertProps) {
  // Cost thresholds
  const WARNING_THRESHOLD = 100; // $100/month
  const DANGER_THRESHOLD = 500;  // $500/month
  
  const alertLevel = 
    totalCost >= DANGER_THRESHOLD ? 'danger' : 
    totalCost >= WARNING_THRESHOLD ? 'warning' : 
    'info';
  
  // Find most expensive resources
  const expensiveResources = [...resources]
    .filter(r => (r.pricing?.estimatedMonthlyCost || 0) > 0)
    .sort((a, b) => (b.pricing?.estimatedMonthlyCost || 0) - (a.pricing?.estimatedMonthlyCost || 0))
    .slice(0, 3);
  
  // Cost optimization suggestions
  const suggestions: string[] = [];
  
  resources.forEach(resource => {
    if (resource.type === 'webApp' && resource.sku.tier === 'Premium') {
      suggestions.push('Consider using Standard tier for App Service instead of Premium if you don\'t need advanced features');
    }
    if (resource.type === 'sqlDatabase' && resource.sku.tier === 'Premium') {
      suggestions.push('SQL Database Premium tier is expensive - consider Standard for non-production workloads');
    }
    if (resource.type === 'cosmosDb' && !resource.properties.serverless) {
      suggestions.push('Enable serverless mode for Cosmos DB if you have variable or low traffic');
    }
  });
  
  if (alertLevel === 'info' && totalCost === 0) {
    return null; // Don't show alert if no costs yet
  }
  
  const bgColor = 
    alertLevel === 'danger' ? 'bg-red-50 border-red-200' :
    alertLevel === 'warning' ? 'bg-amber-50 border-amber-200' :
    'bg-blue-50 border-blue-200';
    
  const iconColor = 
    alertLevel === 'danger' ? 'text-red-600' :
    alertLevel === 'warning' ? 'text-amber-600' :
    'text-blue-600';
    
  const textColor = 
    alertLevel === 'danger' ? 'text-red-900' :
    alertLevel === 'warning' ? 'text-amber-900' :
    'text-blue-900';

  return (
    <div className={`${bgColor} border rounded-lg p-4 space-y-3`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`font-semibold ${textColor} mb-1`}>
            {alertLevel === 'danger' && 'High Cost Alert'}
            {alertLevel === 'warning' && 'Cost Warning'}
            {alertLevel === 'info' && 'Cost Estimate'}
          </h4>
          <p className={`text-sm ${textColor.replace('900', '800')}`}>
            Your estimated monthly cost is <strong>${totalCost.toFixed(2)}</strong>.
            {alertLevel === 'danger' && ' This is quite expensive for a typical application.'}
            {alertLevel === 'warning' && ' Monitor your usage to avoid unexpected charges.'}
            {alertLevel === 'info' && ' This is a reasonable cost for the selected resources.'}
          </p>
          
          {expensiveResources.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className={`w-4 h-4 ${iconColor}`} />
                <span className={`text-sm font-medium ${textColor}`}>Top Cost Drivers:</span>
              </div>
              <ul className={`text-sm ${textColor.replace('900', '700')} space-y-1 ml-6`}>
                {expensiveResources.map(resource => (
                  <li key={resource.id}>
                    <strong>{resource.displayName}</strong>: ${(resource.pricing?.estimatedMonthlyCost || 0).toFixed(2)}/month
                    <span className="text-xs ml-1">({resource.sku.tier} - {resource.sku.name})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className={`w-4 h-4 ${iconColor}`} />
                <span className={`text-sm font-medium ${textColor}`}>Cost Optimization Tips:</span>
              </div>
              <ul className={`text-sm ${textColor.replace('900', '700')} space-y-1 ml-6 list-disc`}>
                {suggestions.slice(0, 3).map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
