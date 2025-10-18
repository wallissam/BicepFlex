import { colors } from '../utils/colors.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ora = require('ora');
import { readFileSync } from 'fs';
import type { ProjectConfig } from '../../src/types/index.js';
import { BicepGenerator } from '../../src/services/bicepGenerator.js';
import { CICDGenerator } from '../../src/services/cicdGenerator.js';
import { FileWriter } from '../utils/fileWriter.js';
import { frameworkTemplates } from '../../src/data/frameworkTemplates.js';

interface GenerateOptions {
  template?: string;
  config?: string;
  output?: string;
  force?: boolean;
  cicd?: 'github' | 'azure' | 'both' | 'none';
  name?: string;
}

export async function generateCommand(options: GenerateOptions) {
  console.log(colors.boldCyan('\n⚡ BicepFlex - Quick Generate\n'));
  
  try {
    let config: ProjectConfig;
    
    // Load config from file or use template
    if (options.config) {
      const spinner = ora(`Loading config from ${options.config}...`).start();
      const configContent = readFileSync(options.config, 'utf-8');
      config = JSON.parse(configContent);
      spinner.succeed('Config loaded');
    } else if (options.template) {
      const spinner = ora(`Loading template: ${options.template}...`).start();
      const template = frameworkTemplates.find(t => t.id === options.template || t.framework.toLowerCase() === (options.template || '').toLowerCase());
      
      if (!template) {
        spinner.fail('Template not found');
        console.log(colors.yellow('\nAvailable templates:'));
        frameworkTemplates.forEach(t => {
          console.log(`  - ${colors.cyan(t.id)}: ${t.name} (${t.framework})`);
        });
        console.log();
        process.exit(1);
      }
      
      config = { 
        ...template.config, 
        estimatedMonthlyCost: 0 
      };
      
      // Override name if provided
      if (options.name) {
        config.name = options.name;
      }
      
      spinner.succeed(`Template loaded: ${template.name}`);
    } else {
      console.error(colors.red('❌ Either --template or --config is required\n'));
      console.log('Examples:');
      console.log(colors.cyan('  bicepflex generate --template=react-vite --name=my-app'));
      console.log(colors.cyan('  bicepflex generate --config=bicepflex.json\n'));
      process.exit(1);
    }
    
    // Create generators
    const bicepGen = new BicepGenerator();
    const cicdGen = new CICDGenerator();
    
    const spinner = ora('Generating infrastructure files...').start();
    
    // Generate infrastructure files
    const files = bicepGen.generateInfrastructureFiles(config);
    
    // Generate CI/CD files if specified
    const cicd = options.cicd || 'github';
    if (cicd === 'github' || cicd === 'both') {
      files.set('.github/workflows/azure-deploy.yml', cicdGen.generateGitHubActions(config));
    }
    
    if (cicd === 'azure' || cicd === 'both') {
      files.set('azure-pipelines.yml', cicdGen.generateAzurePipelines(config));
    }
    
    if (cicd !== 'none') {
      files.set('deploy.sh', cicdGen.generateDeploymentScript(config));
      files.set('README.infra.md', cicdGen.generateReadme(config));
    }
    
    spinner.succeed('Infrastructure files generated!');
    
    // Write files
    const outputPath = options.output || process.cwd();
    const writer = new FileWriter(outputPath, false);
    
    // Check for existing files
    let hasConflicts = false;
    if (!options.force) {
      for (const [path] of files) {
        if (writer.fileExists(path)) {
          console.warn(colors.yellow(`⚠️  File already exists: ${path}`));
          hasConflicts = true;
        }
      }
    }
    
    if (hasConflicts) {
      console.log(colors.red('\n❌ Some files already exist. Use --force to overwrite.\n'));
      process.exit(1);
    }
    
    writer.writeFiles(files);
    
    // Print success message
    console.log(colors.greenBold('\n✨ Success! Infrastructure files generated.\n'));
    console.log(colors.bold('📦 Generated Files:\n'));
    files.forEach((_, path) => {
      console.log(`  ${colors.green('✓')} ${path}`);
    });
    console.log();
    
  } catch (error) {
    console.error(colors.red('\n❌ Error during generation:'), error);
    process.exit(1);
  }
}

export function listTemplates() {
  console.log(colors.boldCyan('\n📋 Available Templates\n'));
  
  frameworkTemplates.forEach(template => {
    console.log(colors.bold(`${template.icon} ${template.name}`));
    console.log(colors.dim(`   ID: ${template.id}`));
    console.log(colors.dim(`   Framework: ${template.framework}`));
    console.log(colors.dim(`   Tags: ${template.tags.join(', ')}`));
    console.log(colors.dim(`   Est. Cost: ${template.estimatedCost}`));
    console.log();
  });
  
  console.log(colors.dim('Use: bicepflex generate --template=<id> --name=<project-name>\n'));
}
