import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import type { ProjectConfig } from '../types';

interface QuickCopyCommandsProps {
  project: ProjectConfig;
}

interface CommandOption {
  label: string;
  command: string;
  description: string;
}

export default function QuickCopyCommands({ project }: QuickCopyCommandsProps) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const commands: CommandOption[] = [
    {
      label: 'Azure Login',
      command: 'az login',
      description: 'Login to Azure CLI',
    },
    {
      label: 'Set Subscription',
      command: 'az account set --subscription <YOUR_SUBSCRIPTION_ID>',
      description: 'Set active Azure subscription',
    },
    {
      label: 'Install Bicep',
      command: 'az bicep install',
      description: 'Install Bicep CLI',
    },
    {
      label: 'Validate Template',
      command: 'az bicep build --file infra/main.bicep',
      description: 'Validate Bicep template syntax',
    },
    {
      label: 'Deploy (What-If)',
      command: `az deployment sub what-if --location ${project.region} --template-file infra/main.bicep --parameters infra/main.parameters.json`,
      description: 'Preview deployment changes',
    },
    {
      label: 'Deploy Resources',
      command: `az deployment sub create --location ${project.region} --template-file infra/main.bicep --parameters infra/main.parameters.json`,
      description: 'Deploy infrastructure to Azure',
    },
    {
      label: 'Azure Developer CLI',
      command: 'azd up',
      description: 'Deploy using Azure Developer CLI',
    },
    {
      label: 'List Resources',
      command: 'az resource list --query "[?resourceGroup==\'<YOUR_RG_NAME>\']" --output table',
      description: 'List deployed resources',
    },
  ];

  const handleCopy = async (command: string) => {
    await navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Quick Copy Commands</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Common Azure CLI commands for your deployment
        </p>
      </div>

      {/* Commands List */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
        {commands.map((cmd, idx) => (
          <div key={idx} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-900 dark:text-white mb-1">
                  {cmd.label}
                </div>
                <code className="block text-xs bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 p-2 rounded font-mono overflow-x-auto">
                  {cmd.command}
                </code>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {cmd.description}
                </p>
              </div>
              <button
                onClick={() => handleCopy(cmd.command)}
                className="flex-shrink-0 p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                aria-label={`Copy ${cmd.label} command`}
              >
                {copiedCommand === cmd.command ? (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Tip */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
        💡 <strong>Tip:</strong> Replace placeholders like <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded text-xs">&lt;YOUR_SUBSCRIPTION_ID&gt;</code> with your actual values
      </div>
    </div>
  );
}
