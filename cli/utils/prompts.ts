import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const inquirer = require('inquirer');
import type { ProjectConfig } from '../../src/types/index.js';
import { detectFramework, getResourceTypeForFramework } from './detectFramework.js';

export interface InitAnswers {
  projectName: string;
  region: string;
  detectFramework: boolean;
  framework?: string;
  cicd: 'github' | 'azure' | 'both' | 'none';
  includeDatabase: boolean;
  databaseType?: 'cosmosdb' | 'sql';
  includeStorage: boolean;
  includeMonitoring: boolean;
}

const regions = [
  'eastus',
  'eastus2',
  'westus',
  'westus2',
  'westus3',
  'centralus',
  'northcentralus',
  'southcentralus',
  'westcentralus',
  'canadacentral',
  'canadaeast',
  'brazilsouth',
  'northeurope',
  'westeurope',
  'uksouth',
  'ukwest',
  'francecentral',
  'germanywestcentral',
  'swedencentral',
  'switzerlandnorth',
  'norwayeast',
  'eastasia',
  'southeastasia',
  'japaneast',
  'japanwest',
  'australiaeast',
  'australiasoutheast',
  'centralindia',
  'southindia',
  'westindia',
];

export async function promptForInit(): Promise<InitAnswers> {
  console.log('\n🚀 Welcome to BicepFlex!\n');
  console.log('Let\'s set up your Azure infrastructure...\n');
  
  // Detect framework first
  const detected = detectFramework();
  if (detected) {
    console.log(`✨ Detected: ${detected.framework} (${detected.language}, ${detected.buildTool})\n`);
  }
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: detected ? `my-${detected.framework}-app` : 'my-azure-app',
      validate: (input: string) => {
        if (!input || input.length === 0) return 'Project name is required';
        if (!/^[a-z0-9-]+$/.test(input)) return 'Project name must be lowercase alphanumeric with hyphens';
        return true;
      }
    },
    {
      type: 'list',
      name: 'region',
      message: 'Azure region:',
      default: 'eastus',
      choices: regions,
      pageSize: 15
    },
    {
      type: 'confirm',
      name: 'detectFramework',
      message: detected ? `Use detected framework (${detected.framework})?` : 'Would you like to specify a framework?',
      default: !!detected
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Select framework:',
      when: (answers) => !detected || !answers.detectFramework,
      choices: [
        { name: 'React (Vite)', value: 'react-vite' },
        { name: 'Next.js', value: 'nextjs' },
        { name: 'Vue.js', value: 'vue' },
        { name: 'Angular', value: 'angular' },
        { name: 'Express (Node.js)', value: 'express' },
        { name: 'Static HTML/JS', value: 'static' }
      ]
    },
    {
      type: 'list',
      name: 'cicd',
      message: 'CI/CD platform:',
      choices: [
        { name: 'GitHub Actions', value: 'github' },
        { name: 'Azure Pipelines', value: 'azure' },
        { name: 'Both', value: 'both' },
        { name: 'None (manual deployment)', value: 'none' }
      ],
      default: 'github'
    },
    {
      type: 'confirm',
      name: 'includeDatabase',
      message: 'Include database?',
      default: false
    },
    {
      type: 'list',
      name: 'databaseType',
      message: 'Database type:',
      when: (answers) => answers.includeDatabase,
      choices: [
        { name: 'Cosmos DB (NoSQL)', value: 'cosmosdb' },
        { name: 'Azure SQL Database', value: 'sql' }
      ],
      default: 'cosmosdb'
    },
    {
      type: 'confirm',
      name: 'includeStorage',
      message: 'Include storage account?',
      default: false
    },
    {
      type: 'confirm',
      name: 'includeMonitoring',
      message: 'Include Application Insights monitoring?',
      default: true
    }
  ]);
  
  return {
    ...answers,
    framework: answers.detectFramework && detected ? detected.framework : answers.framework
  };
}

export function buildProjectConfig(answers: InitAnswers): ProjectConfig {
  const resources: ProjectConfig['resources'] = [];
  
  // Add web app based on framework
  const framework = answers.framework || 'static';
  const resourceType = getResourceTypeForFramework(framework);
  
  resources.push({
    id: 'web-1',
    name: 'web',
    type: resourceType,
    displayName: 'Web Application',
    sku: { 
      name: resourceType === 'staticWebApp' ? 'Free' : 'B1', 
      tier: resourceType === 'staticWebApp' ? 'Free' : 'Basic' 
    },
    region: answers.region,
    properties: {
      appLocation: '/',
      outputLocation: framework === 'nextjs' ? '.next' : 'dist',
      apiLocation: '',
      language: 'javascript',
      runtime: 'NODE|18'
    },
    dependencies: []
  });
  
  // Add database if requested
  if (answers.includeDatabase && answers.databaseType) {
    if (answers.databaseType === 'cosmosdb') {
      resources.push({
        id: 'cosmos-1',
        name: 'cosmos',
        type: 'cosmosDb',
        displayName: 'Cosmos DB',
        sku: { name: 'Serverless', tier: 'Standard' },
        region: answers.region,
        properties: {
          databaseName: 'db'
        },
        dependencies: []
      });
    } else if (answers.databaseType === 'sql') {
      resources.push({
        id: 'sql-1',
        name: 'sql',
        type: 'sqlDatabase',
        displayName: 'SQL Database',
        sku: { name: 'Basic', tier: 'Basic' },
        region: answers.region,
        properties: {
          databaseName: 'db',
          adminLogin: 'sqladmin'
        },
        dependencies: []
      });
    }
  }
  
  // Add storage if requested
  if (answers.includeStorage) {
    resources.push({
      id: 'storage-1',
      name: 'storage',
      type: 'storageAccount',
      displayName: 'Storage Account',
      sku: { name: 'Standard_LRS', tier: 'Standard' },
      region: answers.region,
      properties: {},
      dependencies: []
    });
  }
  
  // Add monitoring if requested
  if (answers.includeMonitoring) {
    resources.push({
      id: 'insights-1',
      name: 'insights',
      type: 'appInsights',
      displayName: 'Application Insights',
      sku: { name: 'Standard', tier: 'Standard' },
      region: answers.region,
      properties: {},
      dependencies: []
    });
    
    // Update web app dependency
    resources[0].dependencies.push('insights');
  }
  
  return {
    name: answers.projectName,
    region: answers.region,
    resources,
    estimatedMonthlyCost: 0 // Will be calculated later
  };
}
