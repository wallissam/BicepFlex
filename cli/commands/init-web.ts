import { colors } from '../utils/colors.js';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export async function initWebCommand(options: { port?: number }) {
  const port = options.port || 5173;
  
  console.log(colors.boldCyan('\n🌐 Starting BicepFlex Web UI...\n'));
  console.log(colors.dim(`Opening web interface on port ${port}...\n`));
  
  try {
    // Get the directory where this script is located
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const projectRoot = join(__dirname, '../..');
    
    // Start vite dev server
    const vite = spawn('npm', ['run', 'dev', '--', '--port', port.toString()], {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true
    });
    
    console.log(colors.green(`✓ Web UI starting...`));
    console.log(colors.cyan(`\n→ Open your browser to: http://localhost:${port}\n`));
    console.log(colors.dim('Press Ctrl+C to stop the server\n'));
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log(colors.yellow('\n\n👋 Shutting down web UI...\n'));
      vite.kill();
      process.exit(0);
    });
    
    vite.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(colors.red(`\n❌ Web UI exited with code ${code}\n`));
        process.exit(code);
      }
    });
    
  } catch (error) {
    console.error(colors.red('\n❌ Failed to start web UI:'), error);
    console.log(colors.yellow('\nTip: Make sure you\'re in the bicepflex project directory or have it installed globally.\n'));
    process.exit(1);
  }
}
