import { describe, it, expect } from 'vitest';
import { BicepGenerator } from '../bicepGenerator';
import type { ProjectConfig } from '../../types';

describe('BicepGenerator', () => {
  const generator = new BicepGenerator();

  describe('generateBicepTemplate', () => {
    it('should generate a basic Bicep template with parameters', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [],
        cicd: 'github',
      };

      const result = generator.generateBicepTemplate(config);

      expect(result.content).toContain('param location');
      expect(result.content).toContain('param environmentName');
      expect(result.content).toContain("= 'eastus'");
      expect(result.parameters).toHaveProperty('location');
      expect(result.parameters).toHaveProperty('environmentName');
    });

    it('should generate Web App resource correctly', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [
          {
            id: 'webapp-1',
            name: 'mywebapp',
            displayName: 'My Web App',
            type: 'webApp',
            sku: {
              name: 'B1',
              tier: 'Basic',
            },
            properties: {},
          },
        ],
        cicd: 'github',
      };

      const result = generator.generateBicepTemplate(config);

      expect(result.content).toContain('resource mywebapp');
      expect(result.content).toContain('Microsoft.Web/sites');
      expect(result.outputs).toHaveProperty('mywebappUrl');
    });

    it('should include tags when requested', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [],
        cicd: 'github',
      };

      const tags = [
        { key: 'Environment', value: 'Production' },
        { key: 'Project', value: 'BicepFlex' },
      ];

      const result = generator.generateBicepTemplate(config, true, tags);

      expect(result.content).toContain('param tags');
      expect(result.content).toContain('Environment');
      expect(result.content).toContain('Production');
    });
  });

  describe('generateInfrastructureFiles', () => {
    it('should generate all necessary infrastructure files', () => {
      const config: ProjectConfig = {
        name: 'test-project',
        region: 'eastus',
        resources: [
          {
            id: 'webapp-1',
            name: 'mywebapp',
            displayName: 'My Web App',
            type: 'webApp',
            sku: {
              name: 'B1',
              tier: 'Basic',
            },
            properties: {},
          },
        ],
        cicd: 'github',
      };

      const files = generator.generateInfrastructureFiles(config);

      expect(files.has('infra/main.bicep')).toBe(true);
      expect(files.has('infra/main.parameters.json')).toBe(true);
      expect(files.has('azure.yaml')).toBe(true);
      expect(files.has('.azure/config')).toBe(true);

      const bicepContent = files.get('infra/main.bicep');
      expect(bicepContent).toContain('param location');
    });
  });
});
