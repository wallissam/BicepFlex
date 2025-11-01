import { useProjectStore } from '../store/projectStore';
import type { ResourceConfig } from '../types';
import { GitBranch, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export default function ResourceDependencyView() {
  const { project } = useProjectStore();
  
  if (project.resources.length === 0) return null;
  
  // Build dependency map
  const dependencyMap = new Map<string, Set<string>>();
  const reverseMap = new Map<string, Set<string>>(); // What depends on this resource
  
  project.resources.forEach(resource => {
    if (!dependencyMap.has(resource.id)) {
      dependencyMap.set(resource.id, new Set());
    }
    if (!reverseMap.has(resource.id)) {
      reverseMap.set(resource.id, new Set());
    }
    
    resource.dependencies?.forEach(depId => {
      dependencyMap.get(resource.id)?.add(depId);
      if (!reverseMap.has(depId)) {
        reverseMap.set(depId, new Set());
      }
      reverseMap.get(depId)?.add(resource.id);
    });
  });
  
  // Detect circular dependencies (simple check)
  const hasCircular = Array.from(dependencyMap.entries()).some(([id, deps]) => 
    Array.from(deps).some(depId => dependencyMap.get(depId)?.has(id))
  );
  
  // Group resources by dependency level
  const independent = project.resources.filter(r => !r.dependencies || r.dependencies.length === 0);
  const dependent = project.resources.filter(r => r.dependencies && r.dependencies.length > 0);
  
  const getResourceById = (id: string): ResourceConfig | undefined =>
    project.resources.find(r => r.id === id);
  
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Resource Dependencies</h3>
          </div>
          
          {hasCircular ? (
            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Circular dependency detected!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>No circular dependencies</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Independent Resources */}
        {independent.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Independent Resources ({independent.length})</span>
            </h4>
            <div className="space-y-2">
              {independent.map(resource => {
                const dependents = reverseMap.get(resource.id);
                return (
                  <div key={resource.id} className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{resource.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{resource.type}</div>
                      </div>
                      {dependents && dependents.size > 0 && (
                        <div className="text-xs text-green-700 dark:text-green-400">
                          {dependents.size} {dependents.size === 1 ? 'resource depends' : 'resources depend'} on this
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dependent Resources */}
        {dependent.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Dependent Resources ({dependent.length})</span>
            </h4>
            <div className="space-y-2">
              {dependent.map(resource => {
                const deps = resource.dependencies || [];
                return (
                  <div key={resource.id} className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-2">{resource.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{resource.type}</div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Depends on:</div>
                      {deps.map(depId => {
                        const depResource = getResourceById(depId);
                        return depResource ? (
                          <div key={depId} className="flex items-center space-x-2 ml-4 text-xs text-slate-600 dark:text-slate-400">
                            <ArrowRight className="w-3 h-3" />
                            <span>{depResource.name} ({depResource.type})</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Help */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">
          <strong>Note:</strong> Independent resources can be deployed first. Dependent resources will wait for their dependencies to be created.
        </div>
      </div>
    </div>
  );
}
