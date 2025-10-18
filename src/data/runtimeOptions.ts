// Runtime configuration options for Azure services
// Documentation: https://learn.microsoft.com/azure/app-service/configure-language-support

export interface RuntimeOption {
  value: string;
  label: string;
  description?: string;
  version: string;
  supportStatus: 'GA' | 'Preview' | 'LTS' | 'Deprecated';
}

export interface RuntimeConfig {
  propertyName: string;
  displayName: string;
  options: RuntimeOption[];
  docsUrl: string;
  defaultValue: string;
}

// Web App runtimes (linuxFxVersion format)
export const webAppRuntimes: RuntimeConfig = {
  propertyName: 'runtime',
  displayName: 'Runtime Stack',
  docsUrl: 'https://learn.microsoft.com/azure/app-service/configure-language-support',
  defaultValue: 'NODE|20-lts',
  options: [
    // Node.js
    { value: 'NODE|20-lts', label: 'Node.js 20 LTS', version: '20', supportStatus: 'LTS' },
    { value: 'NODE|18-lts', label: 'Node.js 18 LTS', version: '18', supportStatus: 'LTS' },
    { value: 'NODE|16-lts', label: 'Node.js 16 LTS', version: '16', supportStatus: 'LTS' },
    
    // Python
    { value: 'PYTHON|3.12', label: 'Python 3.12', version: '3.12', supportStatus: 'GA' },
    { value: 'PYTHON|3.11', label: 'Python 3.11', version: '3.11', supportStatus: 'GA' },
    { value: 'PYTHON|3.10', label: 'Python 3.10', version: '3.10', supportStatus: 'GA' },
    { value: 'PYTHON|3.9', label: 'Python 3.9', version: '3.9', supportStatus: 'GA' },
    
    // .NET
    { value: 'DOTNETCORE|8.0', label: '.NET 8', version: '8.0', supportStatus: 'LTS' },
    { value: 'DOTNETCORE|7.0', label: '.NET 7', version: '7.0', supportStatus: 'GA' },
    { value: 'DOTNETCORE|6.0', label: '.NET 6', version: '6.0', supportStatus: 'LTS' },
    
    // Java
    { value: 'JAVA|17-java17', label: 'Java 17', version: '17', supportStatus: 'LTS' },
    { value: 'JAVA|11-java11', label: 'Java 11', version: '11', supportStatus: 'LTS' },
    { value: 'JAVA|8-jre8', label: 'Java 8', version: '8', supportStatus: 'LTS' },
    
    // PHP
    { value: 'PHP|8.2', label: 'PHP 8.2', version: '8.2', supportStatus: 'GA' },
    { value: 'PHP|8.1', label: 'PHP 8.1', version: '8.1', supportStatus: 'GA' },
    { value: 'PHP|8.0', label: 'PHP 8.0', version: '8.0', supportStatus: 'GA' },
    
    // Ruby
    { value: 'RUBY|3.2', label: 'Ruby 3.2', version: '3.2', supportStatus: 'GA' },
    { value: 'RUBY|3.1', label: 'Ruby 3.1', version: '3.1', supportStatus: 'GA' },
  ],
};

// Function App runtimes
export const functionAppRuntimes: RuntimeConfig = {
  propertyName: 'runtime',
  displayName: 'Runtime Stack',
  docsUrl: 'https://learn.microsoft.com/azure/azure-functions/supported-languages',
  defaultValue: 'NODE|20',
  options: [
    // Node.js
    { value: 'NODE|20', label: 'Node.js 20', version: '20', supportStatus: 'GA' },
    { value: 'NODE|18', label: 'Node.js 18', version: '18', supportStatus: 'LTS' },
    { value: 'NODE|16', label: 'Node.js 16', version: '16', supportStatus: 'LTS' },
    
    // Python
    { value: 'PYTHON|3.11', label: 'Python 3.11', version: '3.11', supportStatus: 'GA' },
    { value: 'PYTHON|3.10', label: 'Python 3.10', version: '3.10', supportStatus: 'GA' },
    { value: 'PYTHON|3.9', label: 'Python 3.9', version: '3.9', supportStatus: 'GA' },
    
    // .NET
    { value: 'DOTNET|8.0', label: '.NET 8 (isolated)', version: '8.0', supportStatus: 'LTS' },
    { value: 'DOTNET|7.0', label: '.NET 7 (isolated)', version: '7.0', supportStatus: 'GA' },
    { value: 'DOTNET|6.0', label: '.NET 6 (isolated)', version: '6.0', supportStatus: 'LTS' },
    
    // Java
    { value: 'JAVA|17', label: 'Java 17', version: '17', supportStatus: 'LTS' },
    { value: 'JAVA|11', label: 'Java 11', version: '11', supportStatus: 'LTS' },
    { value: 'JAVA|8', label: 'Java 8', version: '8', supportStatus: 'LTS' },
    
    // PowerShell
    { value: 'POWERSHELL|7.2', label: 'PowerShell 7.2', version: '7.2', supportStatus: 'LTS' },
    { value: 'POWERSHELL|7.4', label: 'PowerShell 7.4', version: '7.4', supportStatus: 'GA' },
  ],
};

// Function App worker runtime (FUNCTIONS_WORKER_RUNTIME app setting)
export const functionAppWorkerRuntimes: RuntimeConfig = {
  propertyName: 'workerRuntime',
  displayName: 'Worker Runtime',
  docsUrl: 'https://learn.microsoft.com/azure/azure-functions/functions-app-settings#functions_worker_runtime',
  defaultValue: 'node',
  options: [
    { value: 'node', label: 'Node.js', version: '', supportStatus: 'GA' },
    { value: 'python', label: 'Python', version: '', supportStatus: 'GA' },
    { value: 'dotnet', label: '.NET', version: '', supportStatus: 'GA' },
    { value: 'dotnet-isolated', label: '.NET Isolated', version: '', supportStatus: 'GA' },
    { value: 'java', label: 'Java', version: '', supportStatus: 'GA' },
    { value: 'powershell', label: 'PowerShell', version: '', supportStatus: 'GA' },
    { value: 'custom', label: 'Custom Handler', version: '', supportStatus: 'GA' },
  ],
};

// Helper function to get runtime config by resource type and property
export function getRuntimeConfig(resourceType: string, propertyName: string): RuntimeConfig | null {
  if (resourceType === 'webApp' && propertyName === 'runtime') {
    return webAppRuntimes;
  }
  if (resourceType === 'functionApp') {
    if (propertyName === 'runtime') {
      return functionAppRuntimes;
    }
    if (propertyName === 'workerRuntime') {
      return functionAppWorkerRuntimes;
    }
  }
  return null;
}

// Helper to sync runtime and workerRuntime for Function Apps
export function syncFunctionAppRuntimes(runtime: string): string {
  if (runtime.startsWith('NODE|')) return 'node';
  if (runtime.startsWith('PYTHON|')) return 'python';
  if (runtime.startsWith('DOTNET|')) return 'dotnet-isolated';
  if (runtime.startsWith('JAVA|')) return 'java';
  if (runtime.startsWith('POWERSHELL|')) return 'powershell';
  return 'node';
}
