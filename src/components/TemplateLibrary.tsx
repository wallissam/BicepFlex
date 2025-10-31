import { useState } from 'react';
import { projectTemplates, type ProjectTemplate } from '../data/projectTemplates';
import { useProjectStore } from '../store/projectStore';
import { resourceTemplates } from '../data/resourceTemplates';
import type { ResourceConfig, AzureResourceType } from '../types';
import { X, Rocket, DollarSign, Package, CheckCircle } from 'lucide-react';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateLibrary({ isOpen, onClose }: TemplateLibraryProps) {
  const { setProjectName, setRegion, addResource, resetProject } = useProjectStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'web', name: 'Web Apps' },
    { id: 'api', name: 'APIs' },
    { id: 'data', name: 'Data' },
    { id: 'fullstack', name: 'Full-Stack' },
    { id: 'container', name: 'Containers' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? projectTemplates
    : projectTemplates.filter(t => t.category === selectedCategory);

  const applyTemplate = (template: ProjectTemplate) => {
    // Reset current project
    resetProject();
    
    // Apply template basics
    if (template.template.name) {
      setProjectName(template.template.name);
    }
    if (template.template.region) {
      setRegion(template.template.region);
    }
    
    // Add resources based on template
    template.resources.forEach((resourceType, index) => {
      const resourceTemplate = resourceTemplates[resourceType as AzureResourceType];
      if (resourceTemplate) {
        const resource: ResourceConfig = {
          id: `${resourceType}-${Date.now()}-${index}`,
          name: `${resourceType}${index + 1}`,
          type: resourceType as AzureResourceType,
          displayName: resourceTemplate.displayName,
          sku: resourceTemplate.defaultSKUs[0],
          region: template.template.region || 'eastus',
          properties: {},
          dependencies: [],
        };
        addResource(resource);
      }
    });
    
    setApplied(true);
    setTimeout(() => {
      onClose();
      setApplied(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Rocket className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Project Templates</h2>
                <p className="text-sm text-blue-100 mt-1">
                  Quick-start your project with pre-configured templates
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{template.icon}</div>
                <div className="flex items-center space-x-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  <DollarSign className="w-3 h-3" />
                  <span>${template.estimatedCost}/mo</span>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                {template.name}
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {template.description}
              </p>
              
              <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <Package className="w-3 h-3" />
                <span>{template.resources.length} resources</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {template.resources.slice(0, 4).map((resource, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded"
                  >
                    {resource}
                  </span>
                ))}
                {template.resources.length > 4 && (
                  <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                    +{template.resources.length - 4}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => applyTemplate(template)}
                disabled={applied}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {applied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Use Template</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> Templates are fully customizable after applying. You can add, remove, or modify resources to fit your needs.
        </div>
      </div>
    </div>
  );
}
