import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface DetectedFramework {
  framework: string;
  buildTool: string;
  language: string;
  outputDir: string;
  confidence: 'high' | 'medium' | 'low';
}

export function detectFramework(projectPath: string = process.cwd()): DetectedFramework | null {
  try {
    // Try to read package.json
    const packageJsonPath = join(projectPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Next.js detection
      if (deps.next) {
        return {
          framework: 'nextjs',
          buildTool: 'next',
          language: deps.typescript ? 'typescript' : 'javascript',
          outputDir: '.next',
          confidence: 'high'
        };
      }
      
      // Vite + React
      if (deps.vite && deps.react) {
        return {
          framework: 'react-vite',
          buildTool: 'vite',
          language: deps.typescript ? 'typescript' : 'javascript',
          outputDir: 'dist',
          confidence: 'high'
        };
      }
      
      // Vue
      if (deps['@vue/cli-service'] || deps.vue) {
        return {
          framework: 'vue',
          buildTool: deps.vite ? 'vite' : 'vue-cli',
          language: deps.typescript ? 'typescript' : 'javascript',
          outputDir: 'dist',
          confidence: 'high'
        };
      }
      
      // Angular
      if (deps['@angular/core']) {
        return {
          framework: 'angular',
          buildTool: 'angular-cli',
          language: 'typescript',
          outputDir: 'dist',
          confidence: 'high'
        };
      }
      
      // Express (Node.js backend)
      if (deps.express) {
        return {
          framework: 'express',
          buildTool: 'node',
          language: deps.typescript ? 'typescript' : 'javascript',
          outputDir: 'dist',
          confidence: 'medium'
        };
      }
    }
    
    // Check for config files if package.json wasn't conclusive
    if (existsSync(join(projectPath, 'next.config.js')) || existsSync(join(projectPath, 'next.config.mjs'))) {
      return {
        framework: 'nextjs',
        buildTool: 'next',
        language: 'javascript',
        outputDir: '.next',
        confidence: 'medium'
      };
    }
    
    if (existsSync(join(projectPath, 'vite.config.ts')) || existsSync(join(projectPath, 'vite.config.js'))) {
      return {
        framework: 'react-vite',
        buildTool: 'vite',
        language: existsSync(join(projectPath, 'tsconfig.json')) ? 'typescript' : 'javascript',
        outputDir: 'dist',
        confidence: 'medium'
      };
    }
    
    if (existsSync(join(projectPath, 'angular.json'))) {
      return {
        framework: 'angular',
        buildTool: 'angular-cli',
        language: 'typescript',
        outputDir: 'dist',
        confidence: 'medium'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting framework:', error);
    return null;
  }
}

export function getResourceTypeForFramework(framework: string): 'staticWebApp' | 'webApp' | 'functionApp' {
  switch (framework) {
    case 'nextjs':
    case 'react-vite':
    case 'vue':
    case 'angular':
      return 'staticWebApp';
    case 'express':
      return 'webApp';
    default:
      return 'staticWebApp';
  }
}
