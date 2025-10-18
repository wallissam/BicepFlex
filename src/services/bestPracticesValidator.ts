import type { ProjectConfig, ResourceConfig } from '../types';

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  resource?: string;
  message: string;
  recommendation: string;
}

export class BestPracticesValidator {
  validate(config: ProjectConfig): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Project-level validations
    this.validateProjectName(config, issues);
    this.validateResourceCount(config, issues);
    
    // Resource-level validations
    config.resources.forEach((resource) => {
      this.validateResourceNaming(resource, issues);
      this.validateSKUSelection(resource, issues);
      this.validateDependencies(resource, config, issues);
      this.validateSecurity(resource, issues);
    });

    // Architecture validations
    this.validateMonitoring(config, issues);
    this.validateBackup(config, issues);
    this.validateHighAvailability(config, issues);

    return issues;
  }

  private validateProjectName(config: ProjectConfig, issues: ValidationIssue[]): void {
    if (!config.name || config.name.length < 3) {
      issues.push({
        severity: 'error',
        message: 'Project name is too short',
        recommendation: 'Use a descriptive name with at least 3 characters',
      });
    }

    if (config.name && config.name.length > 50) {
      issues.push({
        severity: 'warning',
        message: 'Project name is very long',
        recommendation: 'Consider a shorter name for easier resource management',
      });
    }
  }

  private validateResourceCount(config: ProjectConfig, issues: ValidationIssue[]): void {
    if (config.resources.length === 0) {
      issues.push({
        severity: 'error',
        message: 'No resources configured',
        recommendation: 'Add at least one resource to deploy infrastructure',
      });
    }

    if (config.resources.length > 20) {
      issues.push({
        severity: 'info',
        message: 'Large number of resources',
        recommendation: 'Consider breaking into multiple deployments for easier management',
      });
    }
  }

  private validateResourceNaming(resource: ResourceConfig, issues: ValidationIssue[]): void {
    if (resource.name.length < 2) {
      issues.push({
        severity: 'warning',
        resource: resource.name,
        message: 'Resource name is too short',
        recommendation: 'Use descriptive names that indicate the resource purpose',
      });
    }

    // Check for common naming patterns
    const hasEnvironmentPrefix = /^(dev|staging|prod|test)-/.test(resource.name);
    if (!hasEnvironmentPrefix) {
      issues.push({
        severity: 'info',
        resource: resource.name,
        message: 'Missing environment prefix',
        recommendation: 'Consider prefixing with environment (e.g., prod-api, dev-db)',
      });
    }
  }

  private validateSKUSelection(resource: ResourceConfig, issues: ValidationIssue[]): void {
    // Check for Free tier in production-like names
    if (resource.sku.tier === 'Free' && resource.name.includes('prod')) {
      issues.push({
        severity: 'warning',
        resource: resource.name,
        message: 'Free tier SKU for production resource',
        recommendation: 'Consider using a paid tier for production workloads',
      });
    }

    // Recommend cost-effective options
    if (resource.type === 'webApp' && resource.sku.tier === 'Premium') {
      issues.push({
        severity: 'info',
        resource: resource.name,
        message: 'Premium tier selected',
        recommendation: 'Ensure Premium features are needed; Standard may be sufficient',
      });
    }
  }

  private validateDependencies(
    resource: ResourceConfig,
    config: ProjectConfig,
    issues: ValidationIssue[]
  ): void {
    // Check if referenced dependencies exist
    resource.dependencies.forEach((depName) => {
      const exists = config.resources.some((r) => r.name === depName);
      if (!exists) {
        issues.push({
          severity: 'error',
          resource: resource.name,
          message: `Missing dependency: ${depName}`,
          recommendation: 'Add the required dependency or remove the reference',
        });
      }
    });
  }

  private validateSecurity(resource: ResourceConfig, issues: ValidationIssue[]): void {
    // SQL Database security
    if (resource.type === 'sqlDatabase') {
      if (resource.properties.adminPassword === 'P@ssw0rd123!') {
        issues.push({
          severity: 'error',
          resource: resource.name,
          message: 'Using default/weak password',
          recommendation: 'Use Azure Key Vault for secrets or strong generated passwords',
        });
      }
    }

    // Storage Account security
    if (resource.type === 'storageAccount') {
      issues.push({
        severity: 'info',
        resource: resource.name,
        message: 'Storage account security',
        recommendation: 'Enable HTTPS only, set minimum TLS to 1.2, and consider private endpoints',
      });
    }

    // Key Vault best practices
    if (resource.type === 'keyVault') {
      issues.push({
        severity: 'info',
        resource: resource.name,
        message: 'Key Vault configured',
        recommendation: 'Ensure RBAC is enabled and soft-delete is active (default in template)',
      });
    }
  }

  private validateMonitoring(config: ProjectConfig, issues: ValidationIssue[]): void {
    const hasMonitoring = config.resources.some((r) => r.type === 'appInsights');
    
    const hasComputeResources = config.resources.some((r) =>
      ['webApp', 'functionApp', 'containerApp'].includes(r.type)
    );

    if (hasComputeResources && !hasMonitoring) {
      issues.push({
        severity: 'warning',
        message: 'No monitoring configured',
        recommendation: 'Add Application Insights for observability and troubleshooting',
      });
    }
  }

  private validateBackup(config: ProjectConfig, issues: ValidationIssue[]): void {
    const hasDatabase = config.resources.some((r) =>
      ['sqlDatabase', 'cosmosDb'].includes(r.type)
    );

    if (hasDatabase) {
      issues.push({
        severity: 'info',
        message: 'Database backup strategy',
        recommendation: 'Configure automated backups and retention policies for databases',
      });
    }
  }

  private validateHighAvailability(config: ProjectConfig, issues: ValidationIssue[]): void {
    const storageResources = config.resources.filter((r) => r.type === 'storageAccount');
    
    storageResources.forEach((resource) => {
      if (resource.sku.name?.includes('LRS')) {
        issues.push({
          severity: 'info',
          resource: resource.name,
          message: 'Using locally-redundant storage (LRS)',
          recommendation: 'Consider GRS or GZRS for production data requiring high availability',
        });
      }
    });
  }
}

export const bestPracticesValidator = new BestPracticesValidator();
