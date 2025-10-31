import type { ProjectConfig } from '../types';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'web' | 'api' | 'data' | 'fullstack' | 'container';
  estimatedCost: number;
  resources: string[]; // Resource types included
  template: Partial<ProjectConfig>;
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'static-website',
    name: 'Static Website',
    description: 'Simple static website with storage and CDN',
    icon: '🌐',
    category: 'web',
    estimatedCost: 5,
    resources: ['staticWebApp', 'storageAccount'],
    template: {
      name: 'my-static-site',
      region: 'eastus',
      resources: [],
    },
  },
  {
    id: 'web-app-sql',
    name: 'Web App + SQL Database',
    description: 'Traditional web application with SQL database',
    icon: '🚀',
    category: 'web',
    estimatedCost: 75,
    resources: ['webApp', 'sqlDatabase', 'appInsights'],
    template: {
      name: 'my-web-app',
      region: 'eastus',
      resources: [],
    },
  },
  {
    id: 'serverless-api',
    name: 'Serverless API',
    description: 'Function app with Cosmos DB and API Management',
    icon: '⚡',
    category: 'api',
    estimatedCost: 50,
    resources: ['functionApp', 'cosmosDb', 'appInsights'],
    template: {
      name: 'my-serverless-api',
      region: 'eastus',
      resources: [],
    },
  },
  {
    id: 'microservices',
    name: 'Microservices Platform',
    description: 'Container apps with Service Bus messaging',
    icon: '🔗',
    category: 'container',
    estimatedCost: 200,
    resources: ['containerApp', 'serviceBus', 'cosmosDb', 'appInsights'],
    template: {
      name: 'my-microservices',
      region: 'eastus',
      resources: [],
    },
  },
  {
    id: 'data-platform',
    name: 'Data Platform',
    description: 'SQL Database with Storage and Event Hub for data ingestion',
    icon: '📊',
    category: 'data',
    estimatedCost: 150,
    resources: ['sqlDatabase', 'storageAccount', 'eventHub', 'appInsights'],
    template: {
      name: 'my-data-platform',
      region: 'eastus',
      resources: [],
    },
  },
  {
    id: 'fullstack-app',
    name: 'Full-Stack Application',
    description: 'Static frontend with Function App backend and SQL database',
    icon: '💎',
    category: 'fullstack',
    estimatedCost: 100,
    resources: ['staticWebApp', 'functionApp', 'sqlDatabase', 'storageAccount', 'appInsights'],
    template: {
      name: 'my-fullstack-app',
      region: 'eastus',
      resources: [],
    },
  },
  {
    id: 'cache-layer',
    name: 'High-Performance Web App',
    description: 'Web app with Redis cache and SQL database',
    icon: '⚡',
    category: 'web',
    estimatedCost: 120,
    resources: ['webApp', 'redis', 'sqlDatabase', 'appInsights'],
    template: {
      name: 'my-cached-app',
      region: 'eastus',
      resources: [],
    },
  },
  {
    id: 'event-driven',
    name: 'Event-Driven Architecture',
    description: 'Function apps with Event Hub and Service Bus',
    icon: '📨',
    category: 'api',
    estimatedCost: 85,
    resources: ['functionApp', 'eventHub', 'serviceBus', 'storageAccount', 'appInsights'],
    template: {
      name: 'my-event-system',
      region: 'eastus',
      resources: [],
    },
  },
];
