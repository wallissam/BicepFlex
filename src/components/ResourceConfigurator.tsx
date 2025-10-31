import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { resourceTemplates, serviceNameMapping } from '../data/resourceTemplates';
import { useQuery } from '@tanstack/react-query';
import { azurePricingService } from '../services/azurePricing';
import type { AzureSKU, ResourceConfig } from '../types';
import { DollarSign, Settings, ChevronDown, ChevronUp, ExternalLink, BookOpen, Lightbulb, Info, CheckCircle2 } from 'lucide-react';
import { getRuntimeConfig, syncFunctionAppRuntimes } from '../data/runtimeOptions';
import { getPropertyConfig } from '../data/configurationOptions';
import ResourceNamingHelper from './ResourceNamingHelper';
import CostComparison from './CostComparison';
import AzurePricingInsights from './AzurePricingInsights';
import ContextualDocs from './ContextualDocs';

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
    <div className="space-y-6">
      {/* Help Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Settings className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">Configuring Your Resources</h4>
            <p className="text-sm text-green-800">
              Fine-tune each resource's SKU and properties. All configurations will be parameterized in Bicep,
              allowing you to customize values for different environments (dev, staging, prod).
            </p>
          </div>
        </div>
      </div>
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
  resource: ResourceConfig;
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

  const handlePropertyChange = (key: string, value: string | number | boolean) => {
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
          {/* Documentation Links */}
          {(template.docsUrl || template.bicepDocsUrl || template.pricingUrl) && (
            <div className="flex flex-wrap gap-3 pb-4 border-b border-slate-200">
              {template.docsUrl && (
                <a
                  href={template.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Service Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {template.bicepDocsUrl && (
                <a
                  href={template.bicepDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Bicep Template Reference</span>
                </a>
              )}
              {template.pricingUrl && (
                <a
                  href={template.pricingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Pricing Details</span>
                </a>
              )}
            </div>
          )}

          {/* Resource Name */}
          <div>
            <label className="label">Resource Name</label>
            <input
              type="text"
              value={resource.name}
              onChange={(e) => updateResource(resource.id, { name: e.target.value })}
              className="input"
            />
            <ResourceNamingHelper 
              resourceType={resource.type}
              currentName={resource.name}
              onNameGenerated={(name) => updateResource(resource.id, { name })}
            />
          </div>

          {/* SKU Selection */}
          <div>
            <label className="label flex items-center justify-between">
              <span>Pricing Tier / SKU</span>
              <span className="text-xs text-slate-500 font-normal">Configurable in Bicep via sku parameter</span>
            </label>
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
            
            {/* Cost Comparison */}
            <CostComparison
              resource={resource}
              availableSKUs={template.defaultSKUs}
              onSKUChange={(sku) => updateResource(resource.id, { sku })}
            />
          </div>

          {/* Resource-specific properties */}
          {template.requiredProperties.length > 0 && (
            <div>
              <h4 className="label flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configuration</span>
              </h4>
              <div className="space-y-4">
                {template.requiredProperties.map((prop) => {
                  const runtimeConfig = getRuntimeConfig(resource.type, prop);
                  const propConfig = getPropertyConfig(resource.type, prop);
                  
                  // Render select dropdown for runtime properties
                  if (runtimeConfig) {
                    return (
                      <div key={prop}>
                        <label className="label text-sm flex items-center justify-between">
                          <span>{runtimeConfig.displayName}</span>
                          <a
                            href={runtimeConfig.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>View supported runtimes</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </label>
                        <select
                          value={String(resource.properties[prop] || runtimeConfig.defaultValue)}
                          onChange={(e) => {
                            handlePropertyChange(prop, e.target.value);
                            // Auto-sync workerRuntime for Function Apps
                            if (resource.type === 'functionApp' && prop === 'runtime') {
                              handlePropertyChange('workerRuntime', syncFunctionAppRuntimes(e.target.value));
                            }
                          }}
                          className="input"
                        >
                          {runtimeConfig.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label} {option.supportStatus === 'LTS' && '(LTS)'} {option.supportStatus === 'Preview' && '(Preview)'}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                          {runtimeConfig.options.find(o => o.value === (resource.properties[prop] || runtimeConfig.defaultValue))?.description || 
                           `Selected: ${resource.properties[prop] || runtimeConfig.defaultValue}`}
                        </p>
                      </div>
                    );
                  }
                  
                  // Render configured dropdown for properties with predefined options
                  if (propConfig) {
                    const currentValue = resource.properties[prop] ?? propConfig.defaultValue;
                    const selectedOption = propConfig.options.find(opt => opt.value === currentValue);
                    
                    if (propConfig.type === 'boolean') {
                      return (
                        <div key={prop}>
                          <label className="label text-sm flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span>{propConfig.displayName}</span>
                              <div title={propConfig.description}>
                                <Info className="w-3.5 h-3.5 text-slate-400" />
                              </div>
                            </div>
                            {propConfig.docsUrl && (
                              <a
                                href={propConfig.docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>Docs</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </label>
                          <p className="text-xs text-slate-600 mb-2">{propConfig.description}</p>
                          <select
                            value={String(currentValue)}
                            onChange={(e) => handlePropertyChange(prop, e.target.value === 'true')}
                            className="input"
                          >
                            {propConfig.options.map((option) => (
                              <option key={String(option.value)} value={String(option.value)}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {selectedOption?.description && (
                            <p className="text-xs text-slate-500 mt-1 flex items-start space-x-1">
                              {selectedOption.recommended && <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />}
                              <span>{selectedOption.description}</span>
                            </p>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <div key={prop}>
                        <label className="label text-sm flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{propConfig.displayName}</span>
                            <div title={propConfig.description}>
                              <Info className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>
                          {propConfig.docsUrl && (
                            <a
                              href={propConfig.docsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Docs</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </label>
                        <p className="text-xs text-slate-600 mb-2">{propConfig.description}</p>
                        <select
                          value={String(currentValue)}
                          onChange={(e) => {
                            // Parse value based on option type
                            const option = propConfig.options.find(opt => String(opt.value) === e.target.value);
                            if (option) {
                              handlePropertyChange(prop, option.value);
                            }
                          }}
                          className="input"
                        >
                          {propConfig.options.map((option) => (
                            <option key={String(option.value)} value={String(option.value)}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {selectedOption?.description && (
                          <p className="text-xs text-slate-500 mt-1 flex items-start space-x-1">
                            {selectedOption.recommended && <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />}
                            <span>{selectedOption.description}</span>
                          </p>
                        )}
                        {propConfig.showOptionsInline && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 className="text-xs font-semibold text-blue-900 mb-2">Available Options:</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {propConfig.options.map((option) => {
                                const isCurrent = option.value === currentValue;
                                return (
                                  <div 
                                    key={String(option.value)}
                                    className={`text-xs p-2 rounded ${
                                      isCurrent 
                                        ? 'bg-blue-100 border border-blue-300 font-semibold' 
                                        : 'bg-white border border-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-1">
                                      {isCurrent && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                                      {option.recommended && !isCurrent && <span className="text-green-600">★</span>}
                                      <span className="text-slate-900">{option.label}</span>
                                    </div>
                                    {option.description && (
                                      <p className="text-slate-600 mt-0.5">{option.description}</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  // Render text input for properties without configured options
                  return (
                    <div key={prop}>
                      <label className="label text-sm">{formatPropertyName(prop)}</label>
                      <input
                        type="text"
                        value={String(resource.properties[prop] || '')}
                        onChange={(e) => handlePropertyChange(prop, e.target.value)}
                        placeholder={getPropertyPlaceholder(prop, resource.type)}
                        className="input"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Best Practices */}
          {template.bestPractices && template.bestPractices.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-2 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span>Best Practices</span>
              </h4>
              <ul className="space-y-1.5">
                {template.bestPractices.map((practice, idx) => (
                  <li key={idx} className="text-sm text-amber-800 flex items-start space-x-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing Details */}
          {resource.pricing && (
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Pricing Details</span>
              </h4>
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
              <p className="text-xs text-slate-500 mt-2">
                <Info className="w-3 h-3 inline mr-1" />
                Estimates are based on Azure Retail Pricing API. Actual costs may vary.
              </p>
            </div>
          )}

          {/* Azure Pricing Insights */}
          <AzurePricingInsights
            region={project.region}
            resourceType={resource.type}
            currentSKU={resource.sku.tier}
          />

          {/* Contextual Documentation */}
          <ContextualDocs resourceType={resource.type} context="resource" />
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
