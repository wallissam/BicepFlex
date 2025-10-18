import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { colors } from './colors.js';

export class FileWriter {
  private outputPath: string;
  private dryRun: boolean;
  
  constructor(outputPath: string = process.cwd(), dryRun: boolean = false) {
    this.outputPath = outputPath;
    this.dryRun = dryRun;
  }
  
  writeFile(relativePath: string, content: string): void {
    const fullPath = join(this.outputPath, relativePath);
    
    if (this.dryRun) {
      console.log(colors.blue(`[DRY RUN] Would write: ${relativePath}`));
      return;
    }
    
    try {
      // Create directory if it doesn't exist
      const dir = dirname(fullPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      
      // Write file
      writeFileSync(fullPath, content, 'utf-8');
      console.log(colors.green(`✓ Created: ${relativePath}`));
    } catch (error) {
      console.error(colors.red(`✗ Failed to write ${relativePath}:`), error);
      throw error;
    }
  }
  
  writeFiles(files: Map<string, string>): void {
    console.log(colors.bold(`\n📝 Writing ${files.size} files...\n`));
    
    for (const [path, content] of files.entries()) {
      this.writeFile(path, content);
    }
    
    console.log(colors.greenBold(`\n✅ Successfully wrote ${files.size} files!\n`));
  }
  
  fileExists(relativePath: string): boolean {
    const fullPath = join(this.outputPath, relativePath);
    return existsSync(fullPath);
  }
}

export function confirmOverwrite(filePath: string): boolean {
  console.warn(colors.yellow(`⚠️  File already exists: ${filePath}`));
  console.log(colors.dim('Use --force to overwrite existing files'));
  return false;
}
