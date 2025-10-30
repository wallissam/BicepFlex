import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { bestPracticesValidator } from '../services/bestPracticesValidator';
import type { ValidationIssue } from '../services/bestPracticesValidator';
import { AlertCircle, CheckCircle, Info, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ValidationPanel() {
  const { project } = useProjectStore();
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  useEffect(() => {
    if (project.resources.length > 0) {
      const validationIssues = bestPracticesValidator.validate(project);
      setIssues(validationIssues);
    } else {
      setIssues([]);
    }
  }, [project]);

  const filteredIssues = filter === 'all' 
    ? issues 
    : issues.filter(issue => issue.severity === filter);

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  if (issues.length === 0 && project.resources.length > 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100">All Checks Passed!</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your configuration follows Azure best practices. Ready to generate!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Validation & Best Practices</h3>
            <div className="flex items-center space-x-3 mt-1">
              {errorCount > 0 && (
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {errorCount} error{errorCount !== 1 ? 's' : ''}
                </span>
              )}
              {warningCount > 0 && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {warningCount} warning{warningCount !== 1 ? 's' : ''}
                </span>
              )}
              {infoCount > 0 && (
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {infoCount} suggestion{infoCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          {/* Filter Tabs */}
          <div className="flex space-x-1 p-2 bg-slate-50 dark:bg-slate-900/50">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All ({issues.length})
            </button>
            {errorCount > 0 && (
              <button
                onClick={() => setFilter('error')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'error'
                    ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 font-medium shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                Errors ({errorCount})
              </button>
            )}
            {warningCount > 0 && (
              <button
                onClick={() => setFilter('warning')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'warning'
                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 font-medium shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                Warnings ({warningCount})
              </button>
            )}
            {infoCount > 0 && (
              <button
                onClick={() => setFilter('info')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'info'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Info ({infoCount})
              </button>
            )}
          </div>

          {/* Issues List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredIssues.map((issue, idx: number) => {
              const Icon = 
                issue.severity === 'error' ? AlertCircle :
                issue.severity === 'warning' ? AlertTriangle :
                Info;
              
              const colorClass = 
                issue.severity === 'error' ? 'text-red-600 dark:text-red-400' :
                issue.severity === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                'text-blue-600 dark:text-blue-400';
              
              const bgClass = 
                issue.severity === 'error' ? 'bg-red-50 dark:bg-red-900/10' :
                issue.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10' :
                'bg-blue-50 dark:bg-blue-900/10';

              return (
                <div 
                  key={idx} 
                  className={`p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:${bgClass} transition-colors`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 ${colorClass} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      {issue.resource && (
                        <div className={`text-xs font-medium ${colorClass} mb-1`}>
                          {issue.resource}
                        </div>
                      )}
                      <p className="text-sm text-slate-900 dark:text-slate-100 font-medium mb-1">
                        {issue.message}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        💡 {issue.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
