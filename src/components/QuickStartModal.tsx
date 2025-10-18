import { X, Zap } from 'lucide-react';
import { quickStartTemplates } from '../data/templates';
import { useProjectStore } from '../store/projectStore';
import { cn } from '../utils/cn';

interface QuickStartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickStartModal({ isOpen, onClose }: QuickStartModalProps) {
  const { loadTemplate, setCurrentStep } = useProjectStore();

  if (!isOpen) return null;

  const handleSelectTemplate = (template: typeof quickStartTemplates[0]) => {
    loadTemplate({ ...template.config, estimatedMonthlyCost: 0 });
    setCurrentStep(1); // Skip to resource selection
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Quick Start Templates</h2>
                <p className="text-blue-100 text-sm">
                  Start with a pre-configured template and customize to your needs
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickStartTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={cn(
                  'p-6 border-2 rounded-xl text-left transition-all',
                  'hover:border-primary-500 hover:shadow-lg hover:scale-105',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{template.icon}</div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                    {template.category}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{template.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Resources:</span>
                    <span className="font-semibold text-slate-700">
                      {template.config.resources.length} services
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Est. Cost:</span>
                    <span className="font-semibold text-green-600">
                      {template.estimatedCost}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-wrap gap-1">
                    {template.config.resources.slice(0, 3).map((resource, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded"
                      >
                        {resource.displayName.split(' ')[0]}
                      </span>
                    ))}
                    {template.config.resources.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                        +{template.config.resources.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Start Option */}
          <div className="mt-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-dashed border-slate-300 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  Start from Scratch
                </h3>
                <p className="text-sm text-slate-600">
                  Build your own custom infrastructure configuration
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Custom Build
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
