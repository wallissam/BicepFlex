import { colors } from '../utils/colors.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ora = require('ora');
import { BicepGenerator } from '../../src/services/bicepGenerator.js';
import { CICDGenerator } from '../../src/services/cicdGenerator.js';
import { promptForInit, buildProjectConfig } from '../utils/prompts.js';
import { FileWriter } from '../utils/fileWriter.js';

export async function initCommand(options: { force?: boolean; yes?: boolean; output?: string }) {
  console.log(colors.boldCyan('\n🎯 BicepFlex CLI - Interactive Setup\n'));
  
  try {
    // Get user input
    const answers = await promptForInit();
    
    // Build project config
    const config = buildProjectConfig(answers);
    
    // Create generators
    const bicepGen = new BicepGenerator();
    const cicdGen = new CICDGenerator();
    
    const spinner = ora('Generating infrastructure files...').start();
    
    // Generate infrastructure files
    const files = bicepGen.generateInfrastructureFiles(config);
    
    // Generate CI/CD files based on selection
    if (answers.cicd === 'github' || answers.cicd === 'both') {
      files.set('.github/workflows/azure-deploy.yml', cicdGen.generateGitHubActions(config));
    }
    
    if (answers.cicd === 'azure' || answers.cicd === 'both') {
      files.set('azure-pipelines.yml', cicdGen.generateAzurePipelines(config));
    }
    
    // Generate deployment script
    files.set('deploy.sh', cicdGen.generateDeploymentScript(config));
    
    // Generate README
    files.set('README.infra.md', cicdGen.generateReadme(config));
    
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
    
    // Print success message with next steps
    console.log(colors.greenBold('\n✨ Success! Your infrastructure is ready.\n'));
    console.log(colors.bold('📋 Next Steps:\n'));
    console.log('1. Review the generated files in the infra/ directory');
    console.log('2. Configure Azure CLI: ' + colors.cyan('az login'));
    
    if (answers.cicd !== 'none') {
      console.log('3. Set up GitHub secrets (see README.infra.md for details)');
      console.log('4. Push to GitHub and let CI/CD deploy automatically');
    } else {
      console.log('3. Deploy manually: ' + colors.cyan('bash deploy.sh'));
    }
    
    console.log('\n' + colors.dim('For more information, see README.infra.md\n'));
    
  } catch (error) {
    console.error(colors.red('\n❌ Error during initialization:'), error);
    process.exit(1);
  }
}
