import { describe, it, expect } from 'vitest';
import { BestPracticesValidator } from '../bestPracticesValidator.js';
import type { ProjectConfig } from '../../types/index.js';

describe('BestPracticesValidator', () => {
  const validator = new BestPracticesValidator();

  describe('validate - project name', () => {
    it('should error on project name too short', () => {
      const config: ProjectConfig = {
        name: 'ab',
        region: 'eastus',
        resources: [],
        cicd: 'github',
        estimatedMonthlyCost: 0,
      };

      const issues = validator.validate(config);
      const nameIssue = issues.find((i) => i.message.includes('too short'));

      expect(nameIssue).toBeDefined();
      expect(nameIssue?.severity).toBe('error');
    });

    it('should warn on project name too long', () => {
      const config: ProjectConfig = {
        name: 'a'.repeat(51),
        region: 'eastus',
        resources: [],
        cicd: 'github',
        estimatedMonthlyCost: 0,
      };

      const issues = validator.validate(config);
      const nameIssue = issues.find((i) => i.message.includes('very long'));

      expect(nameIssue).toBeDefined();
      expect(nameIssue?.severity).toBe('warning');
    });
  });

  describe('validate - resources', () => {
    it('should error when no resources configured', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [],
        cicd: 'github',
        estimatedMonthlyCost: 0,
      };

      const issues = validator.validate(config);
      const resourceIssue = issues.find((i) => i.message.includes('No resources'));

      expect(resourceIssue).toBeDefined();
      expect(resourceIssue?.severity).toBe('error');
    });

    it('should info on large number of resources', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: Array(21).fill({
          id: 'test',
          name: 'test-resource',
          displayName: 'Test',
          type: 'webApp',
            region: 'eastus',
          sku: { name: 'B1', tier: 'Basic' },
          properties: {},
          dependencies: [],
        }),
        cicd: 'github',
        estimatedMonthlyCost: 0,
      };

      const issues = validator.validate(config);
      const countIssue = issues.find((i) => i.message.includes('Large number'));

      expect(countIssue).toBeDefined();
      expect(countIssue?.severity).toBe('info');
    });
  });

  describe('validate - security', () => {
    it('should warn on Free tier for production', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [
          {
            id: 'webapp-1',
            name: 'prod-webapp',
            displayName: 'Production Web App',
            type: 'webApp',
            region: 'eastus',
            sku: { name: 'F1', tier: 'Free' },
            properties: {},
            dependencies: [],
          },
        ],
        cicd: 'github',
        estimatedMonthlyCost: 0,
      };

      const issues = validator.validate(config);
      const skuIssue = issues.find((i) => i.message.includes('Free tier'));

      expect(skuIssue).toBeDefined();
      expect(skuIssue?.severity).toBe('warning');
    });

    it('should error on weak password', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [
          {
            id: 'sql-1',
            name: 'test-sql',
            displayName: 'Test SQL',
            type: 'sqlDatabase',
            region: 'eastus',
            sku: { name: 'Basic', tier: 'Basic' },
            properties: {
              adminPassword: 'P@ssw0rd123!',
            },
            dependencies: [],
          },
        ],
        cicd: 'github',
        estimatedMonthlyCost: 0,
      };

      const issues = validator.validate(config);
      const passwordIssue = issues.find((i) => i.message.includes('weak password'));

      expect(passwordIssue).toBeDefined();
      expect(passwordIssue?.severity).toBe('error');
    });
  });

  describe('validate - monitoring', () => {
    it('should warn when compute resources lack monitoring', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [
          {
            id: 'webapp-1',
            name: 'test-webapp',
            displayName: 'Test Web App',
            type: 'webApp',
            region: 'eastus',
            sku: { name: 'B1', tier: 'Basic' },
            properties: {},
            dependencies: [],
          },
        ],
        cicd: 'github',
        estimatedMonthlyCost: 0,
      };

      const issues = validator.validate(config);
      const monitoringIssue = issues.find((i) => i.message.includes('No monitoring'));

      expect(monitoringIssue).toBeDefined();
      expect(monitoringIssue?.severity).toBe('warning');
    });

    it('should not warn when monitoring is configured', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [
          {
            id: 'webapp-1',
            name: 'test-webapp',
            displayName: 'Test Web App',
            type: 'webApp',
            region: 'eastus',
            sku: { name: 'B1', tier: 'Basic' },
            properties: {},
            dependencies: [],
          },
          {
            id: 'insights-1',
            name: 'test-insights',
            displayName: 'Test Insights',
            type: 'appInsights',
            region: 'eastus',
            sku: { name: 'Standard', tier: 'Standard' },
            properties: {},
            dependencies: [],
          },
        ],
        cicd: 'github',
        estimatedMonthlyCost: 0,
      };

      const issues = validator.validate(config);
      const monitoringIssue = issues.find((i) => i.message.includes('No monitoring'));

      expect(monitoringIssue).toBeUndefined();
    });
  });
});
