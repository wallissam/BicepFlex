import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { resourceTemplates } from '../data/resourceTemplates';
import type { AzureResourceType, ResourceConfig } from '../types';
import { Plus, Trash2, Search, ExternalLink, BookOpen, Info } from 'lucide-react';
import { cn } from '../utils/cn';

export default function ResourceSelector() {
  const { project, addResource, removeResource, completeStep } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (project.resources.length > 0) {
      completeStep('resources');
    }
  }, [project.resources.length, completeStep]);

  const categories = [
    'all',
    'compute',
    'database',
    'storage',
    'messaging',
    'security',
    'monitoring',
    'container',
  ];

  const filteredResources = Object.values(resourceTemplates).filter((template) => {
    const matchesSearch =
      template.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddResource = (type: AzureResourceType) => {
    const template = resourceTemplates[type];
    const resourceName = `${type}${project.resources.filter((r) => r.type === type).length + 1}`;

    const newResource: ResourceConfig = {
      id: `${type}-${Date.now()}`,
      name: resourceName,
      type,
      displayName: template.displayName,
      sku: template.defaultSKUs[0],
      region: project.region,
      properties: {},
      dependencies: [],
    };

    addResource(newResource);
  };

  const isResourceAdded = (type: AzureResourceType) => {
    return project.resources.some((r) => r.type === type);
  };

  return (
    <div className="space-y-6">
      {/* Help Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900 mb-1">Choosing Azure Resources</h4>
            <p className="text-sm text-purple-800">
              Each resource has detailed documentation and pricing information. Click on documentation links to learn about configuration options,
              SKUs, and Bicep-specific properties. You can add multiple instances of the same resource type.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors',
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((template) => {
          const added = isResourceAdded(template.type);
          const count = project.resources.filter(
            (r) => r.type === template.type
          ).length;

          return (
            <div
              key={template.type}
              className={cn(
                'border-2 rounded-lg p-4 transition-all hover:shadow-md',
                added
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-white hover:border-primary-300'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{template.icon}</div>
                <button
                  onClick={() => handleAddResource(template.type)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    added
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                  title={added ? 'Add another' : 'Add resource'}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <h3 className="font-semibold text-slate-900 mb-1">
                {template.displayName}
              </h3>
              <p className="text-sm text-slate-600 mb-3">{template.description}</p>

              {/* Documentation Links */}
              {template.docsUrl && (
                <div className="mb-3 flex flex-wrap gap-2">
                  <a
                    href={template.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Docs</span>
                  </a>
                  {template.bicepDocsUrl && (
                    <a
                      href={template.bicepDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Bicep</span>
                    </a>
                  )}
                  {template.pricingUrl && (
                    <a
                      href={template.pricingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>💲</span>
                      <span>Pricing</span>
                    </a>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded">
                  {template.category}
                </span>
                {added && (
                  <span className="text-primary-600 font-semibold">
                    {count} added
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Resources Summary */}
      {project.resources.length > 0 && (
        <div className="mt-8 p-6 bg-white border-2 border-primary-200 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center justify-between">
            <span>Selected Resources ({project.resources.length})</span>
          </h3>
          <div className="space-y-2">
            {project.resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {resourceTemplates[resource.type].icon}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{resource.displayName}</p>
                    <p className="text-sm text-slate-500">{resource.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeResource(resource.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove resource"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No resources found matching your search.</p>
        </div>
      )}
    </div>
  );
}
