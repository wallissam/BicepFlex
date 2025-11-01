import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Search, Filter, X, DollarSign } from 'lucide-react';

export default function ResourceSearchFilter() {
  const { project } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'cost'>('name');
  
  if (project.resources.length === 0) return null;
  
  // Get unique resource types
  const resourceTypes = Array.from(new Set(project.resources.map(r => r.type)));
  
  // Filter resources
  let filteredResources = project.resources.filter(resource => {
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || resource.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Sort resources
  filteredResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'cost':
        return (b.pricing?.estimatedMonthlyCost || 0) - (a.pricing?.estimatedMonthlyCost || 0);
      default:
        return 0;
    }
  });
  
  const totalCost = filteredResources.reduce((sum, r) => sum + (r.pricing?.estimatedMonthlyCost || 0), 0);
  
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Resources ({filteredResources.length}/{project.resources.length})</span>
        </h3>
        
        {filteredResources.length > 0 && (
          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">${totalCost.toFixed(2)}/mo</span>
          </div>
        )}
      </div>
      
      {/* Search and Filters */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {resourceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'type' | 'cost')}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
            <option value="cost">Sort by Cost</option>
          </select>
          
          {(searchTerm || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Results */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No resources found matching your criteria</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white truncate">
                    {resource.name}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                      {resource.type}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {resource.sku.tier} - {resource.sku.name}
                    </span>
                  </div>
                </div>
                
                {resource.pricing?.estimatedMonthlyCost && (
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      ${resource.pricing.estimatedMonthlyCost.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      per month
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
