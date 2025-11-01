// Comprehensive configuration options for all Azure resource properties
// This file provides dropdown options for every configurable property to reduce friction

export interface ConfigOption {
  value: string | number | boolean;
  label: string;
  description?: string;
  recommended?: boolean;
  category?: string;
}

export interface PropertyConfig {
  propertyName: string;
  displayName: string;
  description: string;
  options: ConfigOption[];
  defaultValue: string | number | boolean;
  docsUrl?: string;
  type: 'select' | 'multiselect' | 'boolean' | 'number' | 'text';
  showOptionsInline?: boolean; // Show available options right next to the control
}

// Common boolean options
const booleanOptions: ConfigOption[] = [
  { value: true, label: 'Enabled', description: 'Turn this feature on' },
  { value: false, label: 'Disabled', description: 'Turn this feature off' },
];

// Cosmos DB Consistency Levels
export const cosmosDbConsistencyLevels: PropertyConfig = {
  propertyName: 'consistencyLevel',
  displayName: 'Consistency Level',
  description: 'Balance between availability, consistency, latency, and throughput',
  type: 'select',
  defaultValue: 'Session',
  docsUrl: 'https://learn.microsoft.com/azure/cosmos-db/consistency-levels',
  showOptionsInline: true,
  options: [
    {
      value: 'Strong',
      label: 'Strong',
      description: 'Linearizability guarantee - highest consistency, highest latency',
      category: 'High Consistency',
    },
    {
      value: 'BoundedStaleness',
      label: 'Bounded Staleness',
      description: 'Reads lag behind writes by at most K versions or T interval',
      category: 'High Consistency',
    },
    {
      value: 'Session',
      label: 'Session (Default)',
      description: 'Consistent within a client session - best balance for most apps',
      recommended: true,
      category: 'Balanced',
    },
    {
      value: 'ConsistentPrefix',
      label: 'Consistent Prefix',
      description: 'Reads never see out-of-order writes',
      category: 'Low Latency',
    },
    {
      value: 'Eventual',
      label: 'Eventual',
      description: 'Lowest latency, highest availability - weak consistency',
      category: 'Low Latency',
    },
  ],
};

// SQL Database Collation (top 10 most common)
export const sqlDatabaseCollation: PropertyConfig = {
  propertyName: 'collation',
  displayName: 'Database Collation',
  description: 'Defines sorting and comparison rules for string data',
  type: 'select',
  defaultValue: 'SQL_Latin1_General_CP1_CI_AS',
  docsUrl: 'https://learn.microsoft.com/sql/relational-databases/collations/collation-and-unicode-support',
  showOptionsInline: false,
  options: [
    {
      value: 'SQL_Latin1_General_CP1_CI_AS',
      label: 'SQL_Latin1_General_CP1_CI_AS (Default)',
      description: 'Case-insensitive, accent-sensitive, general-purpose',
      recommended: true,
    },
    {
      value: 'SQL_Latin1_General_CP1_CS_AS',
      label: 'SQL_Latin1_General_CP1_CS_AS',
      description: 'Case-sensitive, accent-sensitive',
    },
    {
      value: 'Latin1_General_100_CI_AS_SC_UTF8',
      label: 'Latin1_General_100_CI_AS_SC_UTF8',
      description: 'UTF-8 encoding, case-insensitive, modern applications',
      recommended: true,
    },
    {
      value: 'Latin1_General_CI_AS',
      label: 'Latin1_General_CI_AS',
      description: 'Case-insensitive, Windows collation',
    },
    {
      value: 'Chinese_PRC_CI_AS',
      label: 'Chinese_PRC_CI_AS',
      description: 'Simplified Chinese',
    },
    {
      value: 'Japanese_CI_AS',
      label: 'Japanese_CI_AS',
      description: 'Japanese',
    },
    {
      value: 'Korean_Wansung_CI_AS',
      label: 'Korean_Wansung_CI_AS',
      description: 'Korean',
    },
  ],
};

// SQL Database Max Size (common options)
export const sqlDatabaseMaxSize: PropertyConfig = {
  propertyName: 'maxSizeBytes',
  displayName: 'Maximum Database Size',
  description: 'Maximum storage capacity for the database',
  type: 'select',
  defaultValue: 2147483648, // 2 GB
  docsUrl: 'https://learn.microsoft.com/azure/azure-sql/database/resource-limits-vcore-single-databases',
  showOptionsInline: true,
  options: [
    { value: 1073741824, label: '1 GB', description: 'Small databases, development' },
    { value: 2147483648, label: '2 GB (Default)', description: 'Light workloads', recommended: true },
    { value: 5368709120, label: '5 GB', description: 'Small production databases' },
    { value: 10737418240, label: '10 GB', description: 'Medium databases' },
    { value: 21474836480, label: '20 GB', description: 'Medium-large databases' },
    { value: 53687091200, label: '50 GB', description: 'Large databases' },
    { value: 107374182400, label: '100 GB', description: 'Very large databases' },
    { value: 268435456000, label: '250 GB', description: 'Enterprise databases' },
    { value: 536870912000, label: '500 GB', description: 'Enterprise databases' },
    { value: 1073741824000, label: '1 TB', description: 'Very large enterprise' },
  ],
};

// Container App CPU allocation
export const containerAppCPU: PropertyConfig = {
  propertyName: 'cpu',
  displayName: 'CPU Cores',
  description: 'Number of CPU cores allocated to each container instance',
  type: 'select',
  defaultValue: 0.5,
  docsUrl: 'https://learn.microsoft.com/azure/container-apps/containers#configuration',
  showOptionsInline: true,
  options: [
    { value: 0.25, label: '0.25 cores', description: 'Minimal workloads' },
    { value: 0.5, label: '0.5 cores (Default)', description: 'Light workloads', recommended: true },
    { value: 0.75, label: '0.75 cores', description: 'Medium workloads' },
    { value: 1, label: '1 core', description: 'Standard workloads' },
    { value: 1.25, label: '1.25 cores', description: 'Heavy workloads' },
    { value: 1.5, label: '1.5 cores', description: 'Heavy workloads' },
    { value: 2, label: '2 cores', description: 'Very heavy workloads' },
  ],
};

// Container App Memory allocation
export const containerAppMemory: PropertyConfig = {
  propertyName: 'memory',
  displayName: 'Memory',
  description: 'Memory allocated to each container instance',
  type: 'select',
  defaultValue: '1.0Gi',
  docsUrl: 'https://learn.microsoft.com/azure/container-apps/containers#configuration',
  showOptionsInline: true,
  options: [
    { value: '0.5Gi', label: '0.5 GiB', description: 'Minimal workloads' },
    { value: '1.0Gi', label: '1.0 GiB (Default)', description: 'Light workloads', recommended: true },
    { value: '1.5Gi', label: '1.5 GiB', description: 'Medium workloads' },
    { value: '2.0Gi', label: '2.0 GiB', description: 'Standard workloads' },
    { value: '2.5Gi', label: '2.5 GiB', description: 'Heavy workloads' },
    { value: '3.0Gi', label: '3.0 GiB', description: 'Heavy workloads' },
    { value: '4.0Gi', label: '4.0 GiB', description: 'Very heavy workloads' },
  ],
};

// Container App replica limits
export const containerAppMinReplicas: PropertyConfig = {
  propertyName: 'minReplicas',
  displayName: 'Minimum Replicas',
  description: 'Minimum number of container instances (0 = scale to zero)',
  type: 'select',
  defaultValue: 0,
  showOptionsInline: true,
  options: [
    { value: 0, label: '0 (Scale to Zero)', description: 'Minimize costs, allow cold starts', recommended: true },
    { value: 1, label: '1 replica', description: 'Always running, no cold starts' },
    { value: 2, label: '2 replicas', description: 'High availability' },
    { value: 3, label: '3 replicas', description: 'High availability across zones' },
  ],
};

export const containerAppMaxReplicas: PropertyConfig = {
  propertyName: 'maxReplicas',
  displayName: 'Maximum Replicas',
  description: 'Maximum number of container instances for scaling',
  type: 'select',
  defaultValue: 10,
  docsUrl: 'https://learn.microsoft.com/azure/container-apps/scale-app',
  showOptionsInline: true,
  options: [
    { value: 1, label: '1 replica', description: 'No scaling' },
    { value: 3, label: '3 replicas', description: 'Light scaling' },
    { value: 5, label: '5 replicas', description: 'Moderate scaling' },
    { value: 10, label: '10 replicas (Default)', description: 'Standard scaling', recommended: true },
    { value: 20, label: '20 replicas', description: 'Heavy scaling' },
    { value: 30, label: '30 replicas', description: 'Maximum scaling' },
  ],
};

// App Insights retention
export const appInsightsRetention: PropertyConfig = {
  propertyName: 'retentionInDays',
  displayName: 'Data Retention',
  description: 'Number of days to retain telemetry data',
  type: 'select',
  defaultValue: 90,
  docsUrl: 'https://learn.microsoft.com/azure/azure-monitor/logs/data-retention-archive',
  showOptionsInline: true,
  options: [
    { value: 30, label: '30 days', description: 'Minimum retention, lower cost' },
    { value: 60, label: '60 days', description: 'Short-term retention' },
    { value: 90, label: '90 days (Default)', description: 'Standard retention', recommended: true },
    { value: 120, label: '120 days', description: 'Extended retention' },
    { value: 180, label: '180 days', description: '6 months retention' },
    { value: 365, label: '365 days', description: '1 year retention' },
    { value: 730, label: '730 days', description: '2 years retention' },
  ],
};

// App Insights daily cap
export const appInsightsDailyCap: PropertyConfig = {
  propertyName: 'dailyDataCapInGB',
  displayName: 'Daily Data Cap',
  description: 'Maximum GB of data per day (cost control)',
  type: 'select',
  defaultValue: 1,
  docsUrl: 'https://learn.microsoft.com/azure/azure-monitor/logs/daily-cap',
  showOptionsInline: true,
  options: [
    { value: 0.1, label: '0.1 GB', description: 'Very low volume, testing' },
    { value: 0.5, label: '0.5 GB', description: 'Low volume applications' },
    { value: 1, label: '1 GB (Default)', description: 'Small applications', recommended: true },
    { value: 5, label: '5 GB', description: 'Medium applications' },
    { value: 10, label: '10 GB', description: 'Large applications' },
    { value: 50, label: '50 GB', description: 'Very large applications' },
    { value: 100, label: '100 GB', description: 'Enterprise applications' },
    { value: -1, label: 'No Limit', description: 'Unlimited (use with caution!)' },
  ],
};

// Boolean properties with context
export const webAppAlwaysOn: PropertyConfig = {
  propertyName: 'alwaysOn',
  displayName: 'Always On',
  description: 'Keep app loaded even when idle (prevents cold starts)',
  type: 'boolean',
  defaultValue: false,
  docsUrl: 'https://learn.microsoft.com/azure/app-service/configure-common#configure-general-settings',
  options: booleanOptions,
};

export const webAppHttpsOnly: PropertyConfig = {
  propertyName: 'httpsOnly',
  displayName: 'HTTPS Only',
  description: 'Redirect all HTTP traffic to HTTPS (recommended for production)',
  type: 'boolean',
  defaultValue: true,
  options: [
    { value: true, label: 'Enabled (Recommended)', description: 'Secure all traffic', recommended: true },
    { value: false, label: 'Disabled', description: 'Allow HTTP (not recommended)' },
  ],
};

export const keyVaultSoftDelete: PropertyConfig = {
  propertyName: 'enableSoftDelete',
  displayName: 'Soft Delete',
  description: 'Retain deleted secrets for recovery (required for production)',
  type: 'boolean',
  defaultValue: true,
  docsUrl: 'https://learn.microsoft.com/azure/key-vault/general/soft-delete-overview',
  options: [
    { value: true, label: 'Enabled (Recommended)', description: 'Protect against accidental deletion', recommended: true },
    { value: false, label: 'Disabled', description: 'Not recommended for production' },
  ],
};

export const keyVaultRbac: PropertyConfig = {
  propertyName: 'enableRbacAuthorization',
  displayName: 'RBAC Authorization',
  description: 'Use Azure RBAC instead of access policies (modern approach)',
  type: 'boolean',
  defaultValue: true,
  docsUrl: 'https://learn.microsoft.com/azure/key-vault/general/rbac-guide',
  options: [
    { value: true, label: 'Enabled (Recommended)', description: 'Modern, centralized access control', recommended: true },
    { value: false, label: 'Disabled', description: 'Use legacy access policies' },
  ],
};

export const redisNonSslPort: PropertyConfig = {
  propertyName: 'enableNonSslPort',
  displayName: 'Enable Non-SSL Port',
  description: 'Allow unencrypted connections (not recommended)',
  type: 'boolean',
  defaultValue: false,
  docsUrl: 'https://learn.microsoft.com/azure/azure-cache-for-redis/cache-configure#access-ports',
  options: [
    { value: false, label: 'Disabled (Recommended)', description: 'SSL/TLS only - secure', recommended: true },
    { value: true, label: 'Enabled', description: 'Allow unencrypted (not recommended)' },
  ],
};

export const containerRegistryAdminUser: PropertyConfig = {
  propertyName: 'adminUserEnabled',
  displayName: 'Admin User',
  description: 'Enable admin user for authentication (use managed identity instead)',
  type: 'boolean',
  defaultValue: false,
  docsUrl: 'https://learn.microsoft.com/azure/container-registry/container-registry-authentication',
  options: [
    { value: false, label: 'Disabled (Recommended)', description: 'Use managed identity or service principal', recommended: true },
    { value: true, label: 'Enabled', description: 'Use admin username/password (less secure)' },
  ],
};

// Container App target port (common ports)
export const containerAppTargetPort: PropertyConfig = {
  propertyName: 'targetPort',
  displayName: 'Target Port',
  description: 'Port your container listens on',
  type: 'select',
  defaultValue: 8080,
  showOptionsInline: true,
  options: [
    { value: 80, label: '80 (HTTP)', description: 'Standard HTTP' },
    { value: 443, label: '443 (HTTPS)', description: 'Standard HTTPS' },
    { value: 3000, label: '3000 (Node.js)', description: 'Common for Node.js apps', recommended: true },
    { value: 5000, label: '5000 (Flask)', description: 'Common for Flask apps' },
    { value: 8000, label: '8000 (Django)', description: 'Common for Django apps' },
    { value: 8080, label: '8080 (Default)', description: 'Common alternative HTTP port', recommended: true },
    { value: 8443, label: '8443', description: 'Alternative HTTPS port' },
  ],
};

// Helper function to get property configuration
export function getPropertyConfig(resourceType: string, propertyName: string): PropertyConfig | null {
  const configMap: Record<string, Record<string, PropertyConfig>> = {
    cosmosDb: {
      consistencyLevel: cosmosDbConsistencyLevels,
    },
    sqlDatabase: {
      collation: sqlDatabaseCollation,
      maxSizeBytes: sqlDatabaseMaxSize,
    },
    containerApp: {
      cpu: containerAppCPU,
      memory: containerAppMemory,
      minReplicas: containerAppMinReplicas,
      maxReplicas: containerAppMaxReplicas,
      targetPort: containerAppTargetPort,
    },
    appInsights: {
      retentionInDays: appInsightsRetention,
      dailyDataCapInGB: appInsightsDailyCap,
    },
    webApp: {
      alwaysOn: webAppAlwaysOn,
      httpsOnly: webAppHttpsOnly,
    },
    keyVault: {
      enableSoftDelete: keyVaultSoftDelete,
      enableRbacAuthorization: keyVaultRbac,
    },
    redis: {
      enableNonSslPort: redisNonSslPort,
    },
    containerRegistry: {
      adminUserEnabled: containerRegistryAdminUser,
    },
  };

  return configMap[resourceType]?.[propertyName] || null;
}

// Helper to check if a property should be rendered as dropdown
export function shouldUseDropdown(resourceType: string, propertyName: string): boolean {
  return getPropertyConfig(resourceType, propertyName) !== null;
}
