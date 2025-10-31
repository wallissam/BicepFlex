import { useState } from 'react';
import { Check, Zap, Link2, Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { SmartConnectionsService, type ConnectionSuggestion } from '../services/smartConnections';
import type { ProjectConfig } from '../types';

interface SmartConnectionsProps {
  config: ProjectConfig;
  onApplyConnection: (suggestion: ConnectionSuggestion) => void;
  onApplyAllAutomatic: () => void;
}

export default function SmartConnections({ config, onApplyConnection, onApplyAllAutomatic }: SmartConnectionsProps) {
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());
  const service = new SmartConnectionsService();
  const suggestions = service.analyzeConnections(config);
  
  const automaticSuggestions = suggestions.filter(s => s.type === 'automatic');
  const recommendedSuggestions = suggestions.filter(s => s.type === 'recommended');

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSuggestions(newExpanded);
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">All Set!</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your resources are optimally configured. No additional connections recommended.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Smart Resource Connections
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Automatically wire resources together following Azure best practices
          </p>
        </div>
        
        {automaticSuggestions.length > 0 && (
          <button
            onClick={onApplyAllAutomatic}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Apply All Automatic ({automaticSuggestions.length})
          </button>
        )}
      </div>

      {/* Automatic Connections */}
      {automaticSuggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Automatic Connections ({automaticSuggestions.length})
            <span className="text-xs text-gray-500 dark:text-gray-400">- Highly recommended, zero risk</span>
          </div>
          
          <div className="space-y-2">
            {automaticSuggestions.map((suggestion, idx) => {
              const key = `auto-${idx}`;
              const isExpanded = expandedSuggestions.has(key);
              
              return (
                <div
                  key={key}
                  className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                          <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300">
                            {suggestion.source} → {suggestion.target}
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium">
                            Auto
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {suggestion.description}
                        </p>
                        
                        {/* Benefits (always visible for automatic) */}
                        <div className="mt-3 space-y-1">
                          {suggestion.benefits.slice(0, 3).map((benefit, bidx) => (
                            <div key={bidx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Check className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpanded(key)}
                          className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                          title={isExpanded ? 'Hide details' : 'Show details'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </button>
                        <button
                          onClick={() => onApplyConnection(suggestion)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
                        <div className="space-y-3">
                          {/* All Benefits */}
                          {suggestion.benefits.length > 3 && (
                            <div>
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Additional Benefits:
                              </div>
                              <div className="space-y-1">
                                {suggestion.benefits.slice(3).map((benefit, bidx) => (
                                  <div key={bidx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Check className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Bicep Code */}
                          <div>
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Bicep Code:
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                              <code>{suggestion.bicepCode}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Connections */}
      {recommendedSuggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Recommended Connections ({recommendedSuggestions.length})
            <span className="text-xs text-gray-500 dark:text-gray-400">- Optional but beneficial</span>
          </div>
          
          <div className="space-y-2">
            {recommendedSuggestions.map((suggestion, idx) => {
              const key = `rec-${idx}`;
              const isExpanded = expandedSuggestions.has(key);
              
              return (
                <div
                  key={key}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span className="font-mono text-xs text-blue-700 dark:text-blue-300">
                            {suggestion.source} → {suggestion.target}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {suggestion.description}
                        </p>
                        
                        {/* Top 2 Benefits */}
                        <div className="mt-2 space-y-1">
                          {suggestion.benefits.slice(0, 2).map((benefit, bidx) => (
                            <div key={bidx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Check className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpanded(key)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title={isExpanded ? 'Hide details' : 'Show details'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </button>
                        <button
                          onClick={() => onApplyConnection(suggestion)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                        <div className="space-y-3">
                          {/* All Benefits */}
                          {suggestion.benefits.length > 2 && (
                            <div>
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Additional Benefits:
                              </div>
                              <div className="space-y-1">
                                {suggestion.benefits.slice(2).map((benefit, bidx) => (
                                  <div key={bidx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Check className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Bicep Code */}
                          <div>
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Bicep Code:
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                              <code>{suggestion.bicepCode}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              <strong className="text-gray-700 dark:text-gray-300">Automatic connections</strong> are best practices that should always be applied (e.g., Application Insights monitoring).
            </p>
            <p>
              <strong className="text-gray-700 dark:text-gray-300">Recommended connections</strong> add value but may depend on your specific use case (e.g., database connections).
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              All connections use secure methods like Managed Identity and Key Vault when available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
