/**
 * Azure Documentation Links Service
 * Provides context-aware links to Azure documentation
 */

export interface DocLink {
  title: string;
  url: string;
  description: string;
  category: 'getting-started' | 'best-practices' | 'pricing' | 'reference' | 'troubleshooting';
}

class AzureDocsService {
  private baseUrl = 'https://learn.microsoft.com';

  /**
   * Get documentation links for a specific Azure resource type
   */
  getResourceDocs(resourceType: string): DocLink[] {
    const docsMap: Record<string, DocLink[]> = {
      webApp: [
        {
          title: 'App Service Overview',
          url: `${this.baseUrl}/en-us/azure/app-service/overview`,
          description: 'Learn about Azure App Service features and capabilities',
          category: 'getting-started',
        },
        {
          title: 'App Service Best Practices',
          url: `${this.baseUrl}/en-us/azure/app-service/app-service-best-practices`,
          description: 'Production readiness and optimization tips',
          category: 'best-practices',
        },
        {
          title: 'App Service Pricing',
          url: 'https://azure.microsoft.com/pricing/details/app-service/',
          description: 'Detailed pricing information and calculator',
          category: 'pricing',
        },
      ],
      staticWebApp: [
        {
          title: 'Static Web Apps Overview',
          url: `${this.baseUrl}/en-us/azure/static-web-apps/overview`,
          description: 'Modern web app hosting with automatic deployment',
          category: 'getting-started',
        },
        {
          title: 'Static Web Apps Configuration',
          url: `${this.baseUrl}/en-us/azure/static-web-apps/configuration`,
          description: 'Configure routing, authentication, and more',
          category: 'reference',
        },
      ],
      functionApp: [
        {
          title: 'Azure Functions Overview',
          url: `${this.baseUrl}/en-us/azure/azure-functions/functions-overview`,
          description: 'Serverless compute service for event-driven applications',
          category: 'getting-started',
        },
        {
          title: 'Functions Best Practices',
          url: `${this.baseUrl}/en-us/azure/azure-functions/functions-best-practices`,
          description: 'Optimize performance and reliability',
          category: 'best-practices',
        },
        {
          title: 'Functions Pricing',
          url: 'https://azure.microsoft.com/pricing/details/functions/',
          description: 'Consumption and Premium plan pricing',
          category: 'pricing',
        },
      ],
      cosmosdb: [
        {
          title: 'Cosmos DB Overview',
          url: `${this.baseUrl}/en-us/azure/cosmos-db/introduction`,
          description: 'Globally distributed, multi-model database service',
          category: 'getting-started',
        },
        {
          title: 'Cosmos DB Serverless',
          url: `${this.baseUrl}/en-us/azure/cosmos-db/serverless`,
          description: 'Pay-per-request pricing model',
          category: 'reference',
        },
        {
          title: 'Request Units (RU) Optimization',
          url: `${this.baseUrl}/en-us/azure/cosmos-db/request-units`,
          description: 'Understand and optimize throughput costs',
          category: 'best-practices',
        },
      ],
      sqlDatabase: [
        {
          title: 'Azure SQL Database Overview',
          url: `${this.baseUrl}/en-us/azure/azure-sql/database/sql-database-paas-overview`,
          description: 'Fully managed relational database service',
          category: 'getting-started',
        },
        {
          title: 'SQL Database Best Practices',
          url: `${this.baseUrl}/en-us/azure/azure-sql/database/security-best-practice`,
          description: 'Security and performance optimization',
          category: 'best-practices',
        },
        {
          title: 'Elastic Pools',
          url: `${this.baseUrl}/en-us/azure/azure-sql/database/elastic-pool-overview`,
          description: 'Cost-effective resource management',
          category: 'reference',
        },
      ],
      storageAccount: [
        {
          title: 'Storage Account Overview',
          url: `${this.baseUrl}/en-us/azure/storage/common/storage-account-overview`,
          description: 'Highly available and secure cloud storage',
          category: 'getting-started',
        },
        {
          title: 'Storage Lifecycle Management',
          url: `${this.baseUrl}/en-us/azure/storage/blobs/lifecycle-management-overview`,
          description: 'Automatically optimize storage costs',
          category: 'best-practices',
        },
      ],
      keyVault: [
        {
          title: 'Key Vault Overview',
          url: `${this.baseUrl}/en-us/azure/key-vault/general/overview`,
          description: 'Secure secrets, keys, and certificates management',
          category: 'getting-started',
        },
        {
          title: 'Key Vault Best Practices',
          url: `${this.baseUrl}/en-us/azure/key-vault/general/best-practices`,
          description: 'Security and access control recommendations',
          category: 'best-practices',
        },
      ],
      containerApp: [
        {
          title: 'Container Apps Overview',
          url: `${this.baseUrl}/en-us/azure/container-apps/overview`,
          description: 'Serverless containers for microservices',
          category: 'getting-started',
        },
        {
          title: 'Container Apps Scaling',
          url: `${this.baseUrl}/en-us/azure/container-apps/scale-app`,
          description: 'Configure autoscaling rules',
          category: 'reference',
        },
      ],
      appInsights: [
        {
          title: 'Application Insights Overview',
          url: `${this.baseUrl}/en-us/azure/azure-monitor/app/app-insights-overview`,
          description: 'Application performance monitoring',
          category: 'getting-started',
        },
      ],
    };

    return docsMap[resourceType] || this.getGenericDocs();
  }

  /**
   * Get Bicep-specific documentation links
   */
  getBicepDocs(): DocLink[] {
    return [
      {
        title: 'Bicep Overview',
        url: `${this.baseUrl}/en-us/azure/azure-resource-manager/bicep/overview`,
        description: 'Introduction to Bicep language',
        category: 'getting-started',
      },
      {
        title: 'Bicep Best Practices',
        url: `${this.baseUrl}/en-us/azure/azure-resource-manager/bicep/best-practices`,
        description: 'Write production-ready Bicep files',
        category: 'best-practices',
      },
      {
        title: 'Bicep File Structure',
        url: `${this.baseUrl}/en-us/azure/azure-resource-manager/bicep/file`,
        description: 'Parameters, variables, resources, and outputs',
        category: 'reference',
      },
      {
        title: 'Bicep Modules',
        url: `${this.baseUrl}/en-us/azure/azure-resource-manager/bicep/modules`,
        description: 'Create reusable infrastructure components',
        category: 'reference',
      },
    ];
  }

  /**
   * Get deployment-related documentation
   */
  getDeploymentDocs(): DocLink[] {
    return [
      {
        title: 'Deploy Bicep Files',
        url: `${this.baseUrl}/en-us/azure/azure-resource-manager/bicep/deploy-cli`,
        description: 'Deploy using Azure CLI or PowerShell',
        category: 'getting-started',
      },
      {
        title: 'CI/CD with GitHub Actions',
        url: `${this.baseUrl}/en-us/azure/azure-resource-manager/bicep/deploy-github-actions`,
        description: 'Automate deployments with GitHub Actions',
        category: 'reference',
      },
      {
        title: 'Deployment What-If',
        url: `${this.baseUrl}/en-us/azure/azure-resource-manager/bicep/deploy-what-if`,
        description: 'Preview changes before deployment',
        category: 'best-practices',
      },
    ];
  }

  /**
   * Get cost optimization documentation
   */
  getCostOptimizationDocs(): DocLink[] {
    return [
      {
        title: 'Azure Cost Management',
        url: `${this.baseUrl}/en-us/azure/cost-management-billing/costs/`,
        description: 'Monitor and optimize Azure spending',
        category: 'best-practices',
      },
      {
        title: 'Azure Pricing Calculator',
        url: 'https://azure.microsoft.com/pricing/calculator/',
        description: 'Estimate your Azure costs',
        category: 'pricing',
      },
      {
        title: 'Cost Optimization Best Practices',
        url: `${this.baseUrl}/en-us/azure/well-architected/cost/`,
        description: 'Well-Architected Framework cost guidance',
        category: 'best-practices',
      },
    ];
  }

  private getGenericDocs(): DocLink[] {
    return [
      {
        title: 'Azure Documentation',
        url: `${this.baseUrl}/en-us/azure/`,
        description: 'Browse all Azure documentation',
        category: 'reference',
      },
    ];
  }
}

export const azureDocsService = new AzureDocsService();
