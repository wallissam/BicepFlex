import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { bestPracticesValidator } from '../services/bestPracticesValidator';
import type { ValidationIssue } from '../services/bestPracticesValidator';
import { AlertCircle, CheckCircle, Info, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ValidationPanel() {
  const { project } = useProjectStore();
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (project.resources.length > 0) {
      const validationIssues = bestPracticesValidator.validate(project);
      setIssues(validationIssues);
    } else {
      setIssues([]);
    }
  }, [project]);

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  if (issues.length === 0 && project.resources.length > 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-green-900 dark:text-green-100">All Checks Passed!</h4>
            <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
              Ready to generate
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
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
      {/* Compact Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <AlertCircle className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Validation</h3>
            <div className="flex items-center space-x-2 mt-0.5 text-xs">
              {errorCount > 0 && (
                <span className="text-red-600 dark:text-red-400 font-medium">{errorCount}↓</span>
              )}
              {warningCount > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">{warningCount}⚠</span>
              )}
              {infoCount > 0 && (
                <span className="text-blue-600 dark:text-blue-400 font-medium">{infoCount}ℹ</span>
              )}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </div>

      {/* Compact Content */}
      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          {/* Compact Issue List */}
          <div className="max-h-64 overflow-y-auto">
            {issues.slice(0, 5).map((issue, index) => {
              const Icon = issue.severity === 'error' ? AlertCircle : 
                          issue.severity === 'warning' ? AlertTriangle : Info;
              const colorClass = issue.severity === 'error' ? 'text-red-600 dark:text-red-400' :
                                issue.severity === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                                'text-blue-600 dark:text-blue-400';
              
              return (
                <div key={index} className="p-2 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <div className="flex items-start space-x-2">
                    <Icon className={`w-3 h-3 ${colorClass} mt-0.5 flex-shrink-0`} />
                    <p className="text-xs text-slate-700 dark:text-slate-300 flex-1">{issue.message}</p>
                  </div>
                </div>
              );
            })}
            {issues.length > 5 && (
              <div className="p-2 text-center text-xs text-slate-500 dark:text-slate-400">
                +{issues.length - 5} more issues
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
