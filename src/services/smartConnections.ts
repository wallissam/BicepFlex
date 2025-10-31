import type { ResourceConfig, ProjectConfig } from '../types/index.js';

export interface ConnectionSuggestion {
  source: string;
  target: string;
  type: 'automatic' | 'recommended';
  description: string;
  bicepCode: string;
  benefits: string[];
}

export interface SmartConnection {
  sourceResource: ResourceConfig;
  targetResource: ResourceConfig;
  connectionType: string;
  isAutomatic: boolean;
  configChanges: Record<string, unknown>;
}

export class SmartConnectionsService {
  /**
   * Analyzes project configuration and returns smart connection suggestions
   */
  analyzeConnections(config: ProjectConfig): ConnectionSuggestion[] {
    const suggestions: ConnectionSuggestion[] = [];
    const resources = config.resources;

    // Find Key Vault
    const keyVault = resources.find(r => r.type === 'keyVault');
    
    // Find Application Insights
    const appInsights = resources.find(r => r.type === 'appInsights');
    
    // Find Storage Accounts
    const storageAccounts = resources.filter(r => r.type === 'storageAccount');
    
    // Find databases
    const cosmosDb = resources.find(r => r.type === 'cosmosDb');
    const sqlDb = resources.find(r => r.type === 'sqlDatabase');

    // 1. Auto-connect App Insights to all compute resources
    if (appInsights) {
      const computeResources = resources.filter(r => 
        ['webApp', 'functionApp', 'containerApp'].includes(r.type)
      );

      computeResources.forEach(compute => {
        if (!compute.dependencies.includes(appInsights.name)) {
          suggestions.push({
            source: compute.name,
            target: appInsights.name,
            type: 'automatic',
            description: `Automatically connect ${compute.displayName} to Application Insights for telemetry and monitoring`,
            bicepCode: this.generateAppInsightsConnection(compute, appInsights),
            benefits: [
              'Real-time performance monitoring',
              'Exception tracking and diagnostics',
              'Request/dependency tracking',
              'Custom metrics and events',
              'Application map visualization'
            ]
          });
        }
      });
    }

    // 2. Auto-connect Key Vault to store sensitive credentials
    if (keyVault) {
      // SQL Database - store connection strings and passwords
      if (sqlDb && !sqlDb.dependencies.includes(keyVault.name)) {
        suggestions.push({
          source: sqlDb.name,
          target: keyVault.name,
          type: 'automatic',
          description: `Store SQL Database admin password and connection string in Key Vault`,
          bicepCode: this.generateKeyVaultSecretStorage(sqlDb, keyVault),
          benefits: [
            'Secure password management',
            'Centralized secret rotation',
            'Audit trail for secret access',
            'No hardcoded credentials',
            'Compliance with security best practices'
          ]
        });
      }

      // Cosmos DB - store connection strings
      if (cosmosDb && !cosmosDb.dependencies.includes(keyVault.name)) {
        suggestions.push({
          source: cosmosDb.name,
          target: keyVault.name,
          type: 'automatic',
          description: `Store Cosmos DB connection strings and keys in Key Vault`,
          bicepCode: this.generateCosmosKeyVaultConnection(cosmosDb, keyVault),
          benefits: [
            'Secure key management',
            'Easy key rotation',
            'Prevent key exposure in code',
            'Centralized secret access',
              'Enhanced security posture'
          ]
        });
      }

      // Storage Account - store connection strings
      storageAccounts.forEach(storage => {
        if (!storage.dependencies.includes(keyVault.name)) {
          suggestions.push({
            source: storage.name,
            target: keyVault.name,
            type: 'automatic',
            description: `Store ${storage.displayName} connection string in Key Vault`,
            bicepCode: this.generateStorageKeyVaultConnection(storage, keyVault),
            benefits: [
              'Secure storage account key management',
              'Simplified key rotation',
              'Audit secret access',
              'No hardcoded connection strings'
            ]
          });
        }
      });

      // Connect web apps/functions to Key Vault with managed identity
      const webResources = resources.filter(r => 
        ['webApp', 'functionApp'].includes(r.type)
      );

      webResources.forEach(web => {
        if (!web.dependencies.includes(keyVault.name)) {
          suggestions.push({
            source: web.name,
            target: keyVault.name,
            type: 'automatic',
            description: `Enable Managed Identity for ${web.displayName} to access Key Vault secrets`,
            bicepCode: this.generateManagedIdentityConnection(web, keyVault),
            benefits: [
              'Password-less authentication',
              'No credential management',
              'Automatic credential rotation',
              'Fine-grained access control',
              'Best practice for Azure security'
            ]
          });
        }
      });
    }

    // 3. Auto-wire database connection strings to web apps
    const databases = resources.filter(r => ['cosmosDb', 'sqlDatabase'].includes(r.type));
    const webApps = resources.filter(r => ['webApp', 'functionApp'].includes(r.type));

    databases.forEach(db => {
      webApps.forEach(web => {
        if (!web.dependencies.includes(db.name)) {
          const useKeyVault = keyVault !== undefined;
          suggestions.push({
            source: web.name,
            target: db.name,
            type: 'recommended',
            description: `Connect ${web.displayName} to ${db.displayName}${useKeyVault ? ' via Key Vault references' : ''}`,
            bicepCode: this.generateDatabaseConnection(web, db, keyVault),
            benefits: useKeyVault ? [
              'Secure database connection',
              'Connection string from Key Vault',
              'No secrets in app settings',
              'Ready-to-use environment variable'
            ] : [
              'Direct database connection',
              'Environment variable configured',
              'Ready for application use',
              'Consider adding Key Vault for production'
            ]
          });
        }
      });
    });

    // 4. Auto-connect Functions to Storage Account (required)
    const functions = resources.filter(r => r.type === 'functionApp');
    functions.forEach(func => {
      const existingStorage = storageAccounts.find(s => func.dependencies.includes(s.name));
      if (!existingStorage && storageAccounts.length > 0) {
        suggestions.push({
          source: func.name,
          target: storageAccounts[0].name,
          type: 'automatic',
          description: `Connect ${func.displayName} to Storage Account (required for Azure Functions)`,
          bicepCode: this.generateFunctionStorageConnection(func, storageAccounts[0]),
          benefits: [
            'Required for Functions runtime',
            'Stores function triggers and bindings',
            'Durable Functions state management',
            'Function logs and diagnostics'
          ]
        });
      }
    });

    // 5. Container Registry connections
    const containerRegistry = resources.find(r => r.type === 'containerRegistry');
    if (containerRegistry) {
      const containerApps = resources.filter(r => r.type === 'containerApp');
      containerApps.forEach(app => {
        if (!app.dependencies.includes(containerRegistry.name)) {
          suggestions.push({
            source: app.name,
            target: containerRegistry.name,
            type: 'recommended',
            description: `Connect ${app.displayName} to ${containerRegistry.displayName} for private container images`,
            bicepCode: this.generateContainerRegistryConnection(app, containerRegistry, keyVault),
            benefits: [
              'Pull private container images',
              'Secure image registry',
              'Faster image pulls (same region)',
              'Managed identity authentication'
            ]
          });
        }
      });
    }

    return suggestions;
  }

  /**
   * Automatically applies safe connections that should always be enabled
   */
  autoApplyConnections(config: ProjectConfig): ProjectConfig {
    const newConfig = { ...config };
    const resources = [...newConfig.resources];

    // Find important resources
    const keyVault = resources.find(r => r.type === 'keyVault');
    const appInsights = resources.find(r => r.type === 'appInsights');
    const storageAccounts = resources.filter(r => r.type === 'storageAccount');

    // 1. Auto-add App Insights to all compute resources (always beneficial, no downside)
    if (appInsights) {
      resources.forEach(resource => {
        if (['webApp', 'functionApp', 'containerApp'].includes(resource.type)) {
          if (!resource.dependencies.includes(appInsights.name)) {
            resource.dependencies.push(appInsights.name);
            
            // Add instrumentation key to app settings
            if (!resource.properties.appInsightsKey) {
              resource.properties.appInsightsKey = `@Microsoft.KeyVault(SecretUri=https://\${${keyVault?.name || 'keyvault'}}.vault.azure.net/secrets/appInsightsKey)`;
            }
          }
        }
      });
    }

    // 2. Auto-connect Functions to Storage (required, no choice)
    const functions = resources.filter(r => r.type === 'functionApp');
    functions.forEach(func => {
      const hasStorage = func.dependencies.some(dep => 
        resources.find(r => r.name === dep && r.type === 'storageAccount')
      );
      
      if (!hasStorage && storageAccounts.length > 0) {
        func.dependencies.push(storageAccounts[0].name);
      }
    });

    // 3. Enable Managed Identity on web resources if Key Vault exists (security best practice)
    if (keyVault) {
      resources.forEach(resource => {
        if (['webApp', 'functionApp', 'containerApp'].includes(resource.type)) {
          if (!resource.dependencies.includes(keyVault.name)) {
            resource.dependencies.push(keyVault.name);
          }
          
          // Enable managed identity
          if (resource.properties.managedIdentity !== true) {
            resource.properties.managedIdentity = true;
          }
        }
      });
    }

    newConfig.resources = resources;
    return newConfig;
  }

  // Bicep code generation methods

  private generateAppInsightsConnection(compute: ResourceConfig, appInsights: ResourceConfig): string {
    return `// Add Application Insights to ${compute.displayName}
// In the ${compute.name} resource properties, add to appSettings array:
{
  name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
  value: ${appInsights.name}.properties.ConnectionString
}
{
  name: 'ApplicationInsightsAgent_EXTENSION_VERSION'
  value: '~3'
}`;
  }

  private generateKeyVaultSecretStorage(sqlDb: ResourceConfig, keyVault: ResourceConfig): string {
    return `// Store SQL Database secrets in Key Vault
resource ${sqlDb.name}PasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: ${keyVault.name}
  name: '${sqlDb.name}-admin-password'
  properties: {
    value: ${sqlDb.name}Server.properties.administratorLoginPassword
  }
}

resource ${sqlDb.name}ConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: ${keyVault.name}
  name: '${sqlDb.name}-connection-string'
  properties: {
    value: 'Server=tcp:\${${sqlDb.name}Server.properties.fullyQualifiedDomainName},1433;Database=\${${sqlDb.name}.name};User ID=\${${sqlDb.name}Server.properties.administratorLogin};Password=\${${sqlDb.name}Server.properties.administratorLoginPassword};Encrypt=true;'
  }
}`;
  }

  private generateCosmosKeyVaultConnection(cosmosDb: ResourceConfig, keyVault: ResourceConfig): string {
    return `// Store Cosmos DB secrets in Key Vault
resource ${cosmosDb.name}ConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: ${keyVault.name}
  name: '${cosmosDb.name}-connection-string'
  properties: {
    value: ${cosmosDb.name}.listConnectionStrings().connectionStrings[0].connectionString
  }
}

resource ${cosmosDb.name}PrimaryKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: ${keyVault.name}
  name: '${cosmosDb.name}-primary-key'
  properties: {
    value: ${cosmosDb.name}.listKeys().primaryMasterKey
  }
}`;
  }

  private generateStorageKeyVaultConnection(storage: ResourceConfig, keyVault: ResourceConfig): string {
    return `// Store Storage Account connection string in Key Vault
resource ${storage.name}ConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: ${keyVault.name}
  name: '${storage.name}-connection-string'
  properties: {
    value: 'DefaultEndpointsProtocol=https;AccountName=\${${storage.name}.name};EndpointSuffix=\${environment().suffixes.storage};AccountKey=\${${storage.name}.listKeys().keys[0].value}'
  }
}`;
  }

  private generateManagedIdentityConnection(web: ResourceConfig, keyVault: ResourceConfig): string {
    return `// Enable Managed Identity for ${web.displayName}
// Update ${web.name} resource with:
identity: {
  type: 'SystemAssigned'
}

// Grant Key Vault access
resource ${web.name}KeyVaultAccess 'Microsoft.KeyVault/vaults/accessPolicies@2023-02-01' = {
  parent: ${keyVault.name}
  name: 'add'
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: ${web.name}.identity.principalId
        permissions: {
          secrets: ['get', 'list']
        }
      }
    ]
  }
}`;
  }

  private generateDatabaseConnection(web: ResourceConfig, db: ResourceConfig, keyVault?: ResourceConfig): string {
    if (keyVault) {
      return `// Connect ${web.displayName} to ${db.displayName} via Key Vault
// Add to ${web.name} appSettings:
{
  name: 'DATABASE_CONNECTION_STRING'
  value: '@Microsoft.KeyVault(SecretUri=https://\${${keyVault.name}.properties.vaultUri}secrets/${db.name}-connection-string)'
}`;
    } else {
      const connString = db.type === 'cosmosDb' 
        ? `${db.name}.listConnectionStrings().connectionStrings[0].connectionString`
        : `'Server=tcp:\${${db.name}Server.properties.fullyQualifiedDomainName},1433;Database=\${${db.name}.name};User ID=\${${db.name}Server.properties.administratorLogin};Password=\${${db.name}Server.properties.administratorLoginPassword};'`;
      
      return `// Connect ${web.displayName} to ${db.displayName}
// Add to ${web.name} appSettings:
{
  name: 'DATABASE_CONNECTION_STRING'
  value: ${connString}
}
// ⚠️  Consider using Key Vault for production to secure credentials`;
    }
  }

  private generateFunctionStorageConnection(func: ResourceConfig, storage: ResourceConfig): string {
    return `// Connect ${func.displayName} to ${storage.displayName} (required)
// Already configured in AzureWebJobsStorage app setting:
{
  name: 'AzureWebJobsStorage'
  value: 'DefaultEndpointsProtocol=https;AccountName=\${${storage.name}.name};EndpointSuffix=\${environment().suffixes.storage};AccountKey=\${${storage.name}.listKeys().keys[0].value}'
}`;
  }

  private generateContainerRegistryConnection(app: ResourceConfig, registry: ResourceConfig, keyVault?: ResourceConfig): string {
    if (keyVault) {
      return `// Connect ${app.displayName} to ${registry.displayName}
// Enable managed identity for registry pull
identity: {
  type: 'SystemAssigned'
}

// Grant ACR pull permission
resource ${app.name}RegistryPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(${registry.name}.id, ${app.name}.id, 'AcrPull')
  scope: ${registry.name}
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d') // AcrPull
    principalId: ${app.name}.identity.principalId
    principalType: 'ServicePrincipal'
  }
}`;
    } else {
      return `// Connect ${app.displayName} to ${registry.displayName}
// Configure container image from registry:
image: '\${${registry.name}.properties.loginServer}/your-image:tag'`;
    }
  }
}
