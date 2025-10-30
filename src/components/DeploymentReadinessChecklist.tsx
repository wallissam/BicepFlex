import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { CheckCircle, Circle, AlertCircle, ExternalLink, Terminal, Key, FileCode } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'incomplete' | 'warning';
  action?: string;
  actionLink?: string;
}

export default function DeploymentReadinessChecklist() {
  const { project } = useProjectStore();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const items: ChecklistItem[] = [
      {
        id: 'azure-cli',
        title: 'Azure CLI Installed',
        description: 'Install Azure CLI to deploy your infrastructure',
        status: 'incomplete',
        action: 'Install Azure CLI',
        actionLink: 'https://learn.microsoft.com/cli/azure/install-azure-cli',
      },
      {
        id: 'azure-login',
        title: 'Azure Account & Subscription',
        description: 'Ensure you have an active Azure subscription',
        status: 'incomplete',
        action: 'Sign up for Azure',
        actionLink: 'https://azure.microsoft.com/free/',
      },
      {
        id: 'bicep-cli',
        title: 'Bicep CLI Installed',
        description: 'Install Bicep CLI for template validation',
        status: 'incomplete',
        action: 'Install Bicep',
        actionLink: 'https://learn.microsoft.com/azure/azure-resource-manager/bicep/install',
      },
      {
        id: 'resource-group',
        title: 'Resource Group Ready',
        description: `Plan your resource group name for ${project.region}`,
        status: project.name ? 'complete' : 'incomplete',
      },
      {
        id: 'permissions',
        title: 'Deployment Permissions',
        description: 'Verify you have Contributor or Owner role on the subscription',
        status: 'warning',
        action: 'Check Permissions',
        actionLink: 'https://learn.microsoft.com/azure/role-based-access-control/check-access',
      },
      {
        id: 'naming',
        title: 'Resource Naming Plan',
        description: 'All resource names must be globally unique',
        status: project.resources.length > 0 ? 'complete' : 'incomplete',
      },
    ];

    // Check if CI/CD is configured
    if (project.cicd) {
      items.push({
        id: 'github-secrets',
        title: 'GitHub Secrets Configured',
        description: 'Set up AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID',
        status: 'incomplete',
        action: 'GitHub Secrets Guide',
        actionLink: 'https://docs.github.com/actions/security-guides/encrypted-secrets',
      });
    }

    setChecklist(items);
  }, [project]);

  const completeCount = checklist.filter(item => item.status === 'complete').length;
  const totalCount = checklist.length;
  const progressPercent = (completeCount / totalCount) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Deployment Readiness</span>
          </h3>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {completeCount}/{totalCount} Complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-blue-200 dark:bg-blue-900/40 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {checklist.map(item => {
          const Icon = 
            item.status === 'complete' ? CheckCircle :
            item.status === 'warning' ? AlertCircle :
            Circle;
          
          const iconColor = 
            item.status === 'complete' ? 'text-green-600 dark:text-green-400' :
            item.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
            'text-slate-400 dark:text-slate-600';

          return (
            <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {item.description}
                  </p>
                  {item.action && item.actionLink && (
                    <a
                      href={item.actionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2"
                    >
                      <span>{item.action}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Help */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-start space-x-2 text-sm">
          <FileCode className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-slate-600 dark:text-slate-400">
            <strong>Ready to deploy?</strong> Run <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">az login</code> then <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">azd up</code> in your project directory.
          </p>
        </div>
      </div>
    </div>
  );
}
