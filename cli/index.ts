#!/usr/bin/env node

import { Command } from 'commander';
import { colors } from './utils/colors.js';
import { initCommand } from './commands/init.js';
import { initWebCommand } from './commands/init-web.js';
import { generateCommand, listTemplates } from './commands/generate.js';

const program = new Command();

program
  .name('bicepflex')
  .description('Azure infrastructure generator using Bicep - The flexible way to deploy to Azure')
  .version('0.1.0');

// Init command (interactive CLI)
program
  .command('init')
  .description('Initialize Azure infrastructure interactively (CLI mode)')
  .option('-f, --force', 'Overwrite existing files')
  .option('-y, --yes', 'Skip confirmations and use defaults')
  .option('-o, --output <path>', 'Output directory', process.cwd())
  .action(initCommand);

// Init-web command (launch web UI)
program
  .command('init-web')
  .alias('ui')
  .description('Launch the web UI for visual infrastructure configuration')
  .option('-p, --port <number>', 'Port for web server', '5173')
  .action((options) => {
    initWebCommand({ port: parseInt(options.port) });
  });

// Generate command (non-interactive, from template or config)
program
  .command('generate')
  .description('Generate infrastructure from a template or config file')
  .option('-t, --template <name>', 'Template name or ID (e.g., react-vite, nextjs)')
  .option('-c, --config <path>', 'Path to config JSON file')
  .option('-n, --name <name>', 'Project name')
  .option('-o, --output <path>', 'Output directory', process.cwd())
  .option('-f, --force', 'Overwrite existing files')
  .option('--cicd <platform>', 'CI/CD platform: github, azure, both, or none', 'github')
  .action(generateCommand);

// Templates command
program
  .command('templates')
  .alias('list')
  .description('List available framework templates')
  .action(listTemplates);

// Help text
program.on('--help', () => {
  console.log('');
  console.log(colors.bold('Examples:'));
  console.log('');
  console.log(colors.cyan('  # Interactive setup (recommended for first-time users)'));
  console.log('  $ bicepflex init');
  console.log('');
  console.log(colors.cyan('  # Launch web UI'));
  console.log('  $ bicepflex init-web');
  console.log('  $ bicepflex ui');
  console.log('');
  console.log(colors.cyan('  # Quick generate from template'));
  console.log('  $ bicepflex generate --template=react-vite --name=my-app');
  console.log('  $ bicepflex generate --template=nextjs --name=my-nextjs-app --cicd=both');
  console.log('');
  console.log(colors.cyan('  # Generate from config file'));
  console.log('  $ bicepflex generate --config=bicepflex.json');
  console.log('');
  console.log(colors.cyan('  # List available templates'));
  console.log('  $ bicepflex templates');
  console.log('');
  console.log(colors.bold('Learn more:'));
  console.log('  Documentation: https://github.com/yourusername/bicepflex');
  console.log('  Issues: https://github.com/yourusername/bicepflex/issues');
  console.log('');
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
