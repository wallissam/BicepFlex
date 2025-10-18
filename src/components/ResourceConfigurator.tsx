import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { resourceTemplates, serviceNameMapping } from '../data/resourceTemplates';
import { useQuery } from '@tanstack/react-query';
import { azurePricingService } from '../services/azurePricing';
import type { AzureSKU } from '../types';
import { DollarSign, Settings, ChevronDown, ChevronUp } from 'lucide-react';

export default function ResourceConfigurator() {
  const { project, completeStep } = useProjectStore();
  const [expandedResource, setExpandedResource] = useState<string | null>(
    project.resources[0]?.id || null
  );

  useEffect(() => {
    // Mark as complete once all resources have been reviewed
    if (project.resources.length > 0) {
      completeStep('configure');
    }
  }, [project.resources, completeStep]);

  if (project.resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">
          No resources to configure. Please add resources in the previous step.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {project.resources.map((resource) => (
        <ResourceConfigCard
          key={resource.id}
          resource={resource}
          expanded={expandedResource === resource.id}
          onToggle={() =>
            setExpandedResource(
              expandedResource === resource.id ? null : resource.id
            )
          }
        />
      ))}
    </div>
  );
}

function ResourceConfigCard({
  resource,
  expanded,
  onToggle,
}: {
  resource: any;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { project, updateResource } = useProjectStore();
  const template = resourceTemplates[resource.type];

  // Fetch pricing for this resource
  const { data: pricingData } = useQuery({
    queryKey: ['pricing', resource.type, project.region],
    queryFn: async () => {
      const serviceName = serviceNameMapping[resource.type];
      if (!serviceName) return null;
      return azurePricingService.getServicePricing(serviceName, project.region);
    },
    enabled: !!serviceNameMapping[resource.type],
  });

  const handleSKUChange = (sku: AzureSKU) => {
    const pricing = pricingData?.get(sku.name);
    updateResource(resource.id, { sku, pricing });
  };

  const handlePropertyChange = (key: string, value: any) => {
    updateResource(resource.id, {
      properties: { ...resource.properties, [key]: value },
    });
  };

  return (
    <div className="border-2 border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{template.icon}</span>
          <div className="text-left">
            <h3 className="font-semibold text-slate-900">{resource.displayName}</h3>
            <p className="text-sm text-slate-500">
              {resource.sku.tier} - {resource.sku.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {resource.pricing && (
            <div className="text-right">
              <div className="flex items-center space-x-1 text-green-600 font-semibold">
                <DollarSign className="w-4 h-4" />
                <span>{resource.pricing.estimatedMonthlyCost.toFixed(2)}/mo</span>
              </div>
            </div>
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-slate-200 p-6 bg-slate-50 space-y-6">
          {/* Resource Name */}
          <div>
            <label className="label">Resource Name</label>
            <input
              type="text"
              value={resource.name}
              onChange={(e) => updateResource(resource.id, { name: e.target.value })}
              className="input"
            />
          </div>

          {/* SKU Selection */}
          <div>
            <label className="label">Pricing Tier</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {template.defaultSKUs.map((sku) => {
                const pricing = pricingData?.get(sku.name);
                const isSelected =
                  resource.sku.name === sku.name && resource.sku.tier === sku.tier;

                return (
                  <button
                    key={`${sku.name}-${sku.tier}`}
                    onClick={() => handleSKUChange(sku)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{sku.name}</div>
                    <div className="text-sm text-slate-600">{sku.tier}</div>
                    {pricing && (
                      <div className="mt-2 text-sm font-semibold text-green-600">
                        ${pricing.estimatedMonthlyCost.toFixed(2)}/mo
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resource-specific properties */}
          {template.requiredProperties.length > 0 && (
            <div>
              <h4 className="label flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configuration</span>
              </h4>
              <div className="space-y-4">
                {template.requiredProperties.map((prop) => (
                  <div key={prop}>
                    <label className="label text-sm">{formatPropertyName(prop)}</label>
                    <input
                      type="text"
                      value={resource.properties[prop] || ''}
                      onChange={(e) => handlePropertyChange(prop, e.target.value)}
                      placeholder={getPropertyPlaceholder(prop, resource.type)}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Details */}
          {resource.pricing && (
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Pricing Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Unit Price:</span>
                  <span className="font-semibold">
                    ${resource.pricing.unitPrice.toFixed(4)} {resource.pricing.currencyCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Unit of Measure:</span>
                  <span className="font-semibold">{resource.pricing.unitOfMeasure}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600">Estimated Monthly:</span>
                  <span className="font-semibold text-green-600">
                    ${resource.pricing.estimatedMonthlyCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatPropertyName(prop: string): string {
  return prop
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function getPropertyPlaceholder(prop: string, type: string): string {
  const placeholders: Record<string, Record<string, string>> = {
    webApp: {
      runtime: 'NODE|18-lts',
    },
    functionApp: {
      runtime: 'NODE|18',
      workerRuntime: 'node',
    },
    staticWebApp: {
      appLocation: '/',
      outputLocation: 'dist',
      apiLocation: 'api',
    },
    containerApp: {
      image: 'nginx:latest',
      targetPort: '80',
    },
    cosmosDb: {
      databaseName: 'mydb',
    },
    sqlDatabase: {
      databaseName: 'mydb',
      adminLogin: 'sqladmin',
      adminPassword: 'P@ssw0rd123!',
    },
  };

  return placeholders[type]?.[prop] || '';
}
