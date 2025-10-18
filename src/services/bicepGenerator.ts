import type { ProjectConfig, ResourceConfig, BicepTemplate, AzdConfig } from '../types/index.js';
import YAML from 'yaml';

export class BicepGenerator {
  generateBicepTemplate(config: ProjectConfig, includeTags = false, tags: Array<{key: string, value: string}> = []): BicepTemplate {
    const parameters: Record<string, any> = {
      location: {
        type: 'string',
        defaultValue: config.region,
        metadata: {
          description: 'Primary location for all resources',
        },
      },
      environmentName: {
        type: 'string',
        minLength: 1,
        maxLength: 64,
        metadata: {
          description: 'Name of the environment (e.g., dev, staging, prod)',
        },
      },
    };

    const outputs: Record<string, any> = {};
    const resources: string[] = [];

    // Add resource group reference
    resources.push(`// Resource Group is managed by azd`);
    resources.push('');

    // Generate each resource
    for (const resource of config.resources) {
      const bicep = this.generateResourceBicep(resource, config);
      resources.push(bicep);
      resources.push('');

      // Add outputs for important resources
      if (['webApp', 'staticWebApp', 'functionApp', 'containerApp'].includes(resource.type)) {
        outputs[`${resource.name}Url`] = {
          type: 'string',
          value: `\${${resource.name}.properties.defaultHostName}`,
        };
      }
    }

    // Build the complete Bicep content
    const parameterSection = Object.entries(parameters)
      .map(([name, param]) => this.generateParameterBicep(name, param))
      .join('\n');

    const tagsSection = includeTags ? this.generateTagsParameter(tags) : '';

    const outputSection = Object.entries(outputs)
      .map(([name, output]) => `output ${name} ${output.type} = ${output.value}`)
      .join('\n');

    const content = `${parameterSection}\n${tagsSection}\n${resources.join('\n')}\n\n${outputSection}`;

    return {
      content,
      parameters,
      outputs,
    };
  }

  private generateParameterBicep(name: string, param: any): string {
    let bicep = `@description('${param.metadata?.description || ''}')\n`;
    
    if (param.minLength !== undefined) {
      bicep += `@minLength(${param.minLength})\n`;
    }
    
    if (param.maxLength !== undefined) {
      bicep += `@maxLength(${param.maxLength})\n`;
    }

    bicep += `param ${name} ${param.type}`;
    
    if (param.defaultValue !== undefined) {
      bicep += ` = '${param.defaultValue}'`;
    }

    return bicep;
  }

  private generateResourceBicep(resource: ResourceConfig, _config: ProjectConfig): string {
    switch (resource.type) {
      case 'webApp':
        return this.generateWebAppBicep(resource);
      case 'staticWebApp':
        return this.generateStaticWebAppBicep(resource);
      case 'functionApp':
        return this.generateFunctionAppBicep(resource);
      case 'containerApp':
        return this.generateContainerAppBicep(resource);
      case 'cosmosDb':
        return this.generateCosmosDbBicep(resource);
      case 'sqlDatabase':
        return this.generateSqlDatabaseBicep(resource);
      case 'storageAccount':
        return this.generateStorageAccountBicep(resource);
      case 'keyVault':
        return this.generateKeyVaultBicep(resource);
      case 'appInsights':
        return this.generateAppInsightsBicep(resource);
      default:
        return `// TODO: Implement ${resource.type}`;
    }
  }

  private generateWebAppBicep(resource: ResourceConfig): string {
    return `// App Service Plan for ${resource.displayName}
resource ${resource.name}Plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '\${environmentName}-${resource.name}-plan'
  location: location
  sku: {
    name: '${resource.sku.name}'
    tier: '${resource.sku.tier}'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Web App for ${resource.displayName}
resource ${resource.name} 'Microsoft.Web/sites@2022-03-01' = {
  name: '\${environmentName}-${resource.name}'
  location: location
  properties: {
    serverFarmId: ${resource.name}Plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: '${resource.properties.runtime || 'NODE|20-lts'}'
      alwaysOn: ${resource.sku.tier !== 'Free' && resource.sku.tier !== 'Shared'}
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
    }
  }
}`;
  }

  private generateStaticWebAppBicep(resource: ResourceConfig): string {
    return `// Static Web App for ${resource.displayName}
resource ${resource.name} 'Microsoft.Web/staticSites@2022-03-01' = {
  name: '\${environmentName}-${resource.name}'
  location: location
  sku: {
    name: '${resource.sku.name}'
    tier: '${resource.sku.tier}'
  }
  properties: {
    repositoryUrl: '${resource.properties.repositoryUrl || ''}'
    branch: '${resource.properties.branch || 'main'}'
    buildProperties: {
      appLocation: '${resource.properties.appLocation || '/'}'
      apiLocation: '${resource.properties.apiLocation || ''}'
      outputLocation: '${resource.properties.outputLocation || 'dist'}'
    }
  }
}`;
  }

  private generateFunctionAppBicep(resource: ResourceConfig): string {
    const storageDepName = resource.dependencies.find((d: string) => d.includes('storage')) || 'storage';
    
    return `// App Service Plan for ${resource.displayName}
resource ${resource.name}Plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '\${environmentName}-${resource.name}-plan'
  location: location
  sku: {
    name: '${resource.sku.name}'
    tier: '${resource.sku.tier}'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Function App for ${resource.displayName}
resource ${resource.name} 'Microsoft.Web/sites@2022-03-01' = {
  name: '\${environmentName}-${resource.name}'
  location: location
  kind: 'functionapp,linux'
  properties: {
    serverFarmId: ${resource.name}Plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: '${resource.properties.runtime || 'NODE|20'}'
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: '${resource.properties.workerRuntime || 'node'}'
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=\${${storageDepName}.name};EndpointSuffix=\${environment().suffixes.storage};AccountKey=\${${storageDepName}.listKeys().keys[0].value}'
        }
      ]
    }
  }
}`;
  }

  private generateContainerAppBicep(resource: ResourceConfig): string {
    return `// Container App Environment for ${resource.displayName}
resource ${resource.name}Env 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '\${environmentName}-${resource.name}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
    }
  }
}

// Container App for ${resource.displayName}
resource ${resource.name} 'Microsoft.App/containerApps@2023-05-01' = {
  name: '\${environmentName}-${resource.name}'
  location: location
  properties: {
    managedEnvironmentId: ${resource.name}Env.id
    configuration: {
      ingress: {
        external: true
        targetPort: ${resource.properties.targetPort || 80}
      }
    }
    template: {
      containers: [
        {
          name: '${resource.name}'
          image: '${resource.properties.image || 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'}'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: ${resource.properties.minReplicas || 0}
        maxReplicas: ${resource.properties.maxReplicas || 10}
      }
    }
  }
}`;
  }

  private generateCosmosDbBicep(resource: ResourceConfig): string {
    return `// Cosmos DB Account for ${resource.displayName}
resource ${resource.name} 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: '\${environmentName}-${resource.name}'
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
  }
}

// Cosmos DB Database
resource ${resource.name}Db 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: ${resource.name}
  name: '${resource.properties.databaseName || 'db'}'
  properties: {
    resource: {
      id: '${resource.properties.databaseName || 'db'}'
    }
  }
}`;
  }

  private generateSqlDatabaseBicep(resource: ResourceConfig): string {
    return `// SQL Server for ${resource.displayName}
resource ${resource.name}Server 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: '\${environmentName}-${resource.name}-server'
  location: location
  properties: {
    administratorLogin: '${resource.properties.adminLogin || 'sqladmin'}'
    administratorLoginPassword: '${resource.properties.adminPassword || 'P@ssw0rd123!'}'
    version: '12.0'
  }
}

// SQL Database for ${resource.displayName}
resource ${resource.name} 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: ${resource.name}Server
  name: '${resource.properties.databaseName || 'db'}'
  location: location
  sku: {
    name: '${resource.sku.name}'
    tier: '${resource.sku.tier}'
  }
}

// Firewall rule to allow Azure services
resource ${resource.name}Firewall 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = {
  parent: ${resource.name}Server
  name: 'AllowAllWindowsAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}`;
  }

  private generateStorageAccountBicep(resource: ResourceConfig): string {
    return `// Storage Account for ${resource.displayName}
resource ${resource.name} 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '\${replace(environmentName, '-', '')}${resource.name}'
  location: location
  sku: {
    name: '${resource.sku.name}'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}`;
  }

  private generateKeyVaultBicep(resource: ResourceConfig): string {
    return `// Key Vault for ${resource.displayName}
resource ${resource.name} 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: '\${environmentName}-${resource.name}'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: '${resource.sku.name.toLowerCase()}'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
  }
}`;
  }

  private generateAppInsightsBicep(resource: ResourceConfig): string {
    return `// Log Analytics Workspace for ${resource.displayName}
resource ${resource.name}Workspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '\${environmentName}-${resource.name}-workspace'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Application Insights for ${resource.displayName}
resource ${resource.name} 'Microsoft.Insights/components@2020-02-02' = {
  name: '\${environmentName}-${resource.name}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: ${resource.name}Workspace.id
  }
}`;
  }

  generateAzdConfig(config: ProjectConfig): string {
    const azdConfig: AzdConfig = {
      name: config.name,
      services: {},
    };

    // Map resources to azd services
    for (const resource of config.resources) {
      if (['webApp', 'staticWebApp', 'functionApp', 'containerApp'].includes(resource.type)) {
        azdConfig.services[resource.name] = {
          project: `./${resource.name}`,
          language: resource.properties.language || 'ts',
          host: this.getAzdHost(resource.type),
        };
      }
    }

    return YAML.stringify(azdConfig);
  }

  private getAzdHost(resourceType: string): string {
    const hostMap: Record<string, string> = {
      webApp: 'appservice',
      staticWebApp: 'staticwebapp',
      functionApp: 'function',
      containerApp: 'containerapp',
    };
    return hostMap[resourceType] || 'appservice';
  }

  generateInfrastructureFiles(config: ProjectConfig, includeTags = false, tags: Array<{key: string, value: string}> = []): Map<string, string> {
    const files = new Map<string, string>();

    // Generate main.bicep
    const template = this.generateBicepTemplate(config, includeTags, tags);
    files.set('infra/main.bicep', template.content);

    // Generate main.parameters.json
    const parameters = {
      $schema: 'https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#',
      contentVersion: '1.0.0.0',
      parameters: {
        environmentName: {
          value: '${AZURE_ENV_NAME}',
        },
        location: {
          value: '${AZURE_LOCATION}',
        },
      },
    };
    files.set('infra/main.parameters.json', JSON.stringify(parameters, null, 2));

    // Generate azure.yaml
    files.set('azure.yaml', this.generateAzdConfig(config));

    // Generate .azure/config
    const azureConfig = `defaults:
  location: ${config.region}
  subscription: $\{AZURE_SUBSCRIPTION_ID\}
`;
    files.set('.azure/config', azureConfig);

    return files;
  }

  private generateTagsParameter(tags: Array<{key: string, value: string}>): string {
    if (tags.length === 0) return '';
    
    return `
@description('Resource tags')
param tags object = {
${tags.map(tag => `  '${tag.key}': '${tag.value}'`).join('\n')}
}
`;
  }
}

export const bicepGenerator = new BicepGenerator();
