// Simple color utility wrapper for chalk
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chalk = require('chalk');

export const colors = {
  bold: (text: string) => chalk.bold(text),
  cyan: (text: string) => chalk.cyan(text),
  green: (text: string) => chalk.green(text),
  yellow: (text: string) => chalk.yellow(text),
  red: (text: string) => chalk.red(text),
  dim: (text: string) => chalk.dim(text),
  blue: (text: string) => chalk.blue(text),
  
  // Compound styles
  boldCyan: (text: string) => chalk.bold.cyan(text),
  boldGreen: (text: string) => chalk.bold.green(text),
  greenBold: (text: string) => chalk.green.bold(text),
};
