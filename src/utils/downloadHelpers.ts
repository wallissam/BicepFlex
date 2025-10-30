/**
 * Simple utility to create and download a ZIP file containing project files
 * Uses a lightweight approach without external dependencies
 */

export interface FileEntry {
  path: string;
  content: string;
}

/**
 * Downloads multiple files as individual downloads (fallback for browsers without ZIP support)
 */
export function downloadFilesIndividually(files: Map<string, string>, projectName: string): void {
  files.forEach((content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\//g, '-'); // Flatten directory structure
    a.click();
    URL.revokeObjectURL(url);
  });
}

/**
 * Creates a simple tar-like archive and downloads it
 * This is a simplified approach that creates a text-based archive
 */
export function downloadAsArchive(files: Map<string, string>, projectName: string): void {
  // Create a simple archive format
  let archiveContent = `# BicepFlex Project Archive: ${projectName}\n`;
  archiveContent += `# Generated: ${new Date().toISOString()}\n`;
  archiveContent += `# Extract files below to recreate project structure\n\n`;
  archiveContent += `--- FILE MANIFEST ---\n`;
  
  files.forEach((_, filename) => {
    archiveContent += `${filename}\n`;
  });
  
  archiveContent += `\n--- FILES ---\n\n`;
  
  files.forEach((content, filename) => {
    archiveContent += `===== BEGIN FILE: ${filename} =====\n`;
    archiveContent += content;
    archiveContent += `\n===== END FILE: ${filename} =====\n\n`;
  });
  
  // Create download
  const blob = new Blob([archiveContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName}-bicep-templates.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Creates a deployment script that recreates the file structure
 */
export function downloadWithSetupScript(files: Map<string, string>, projectName: string): void {
  // Create a shell script that will recreate all files
  let setupScript = `#!/bin/bash
# BicepFlex Project Setup Script
# Generated: ${new Date().toISOString()}
# Project: ${projectName}

echo "Setting up BicepFlex project: ${projectName}"
echo ""

`;

  files.forEach((content, filename) => {
    const dir = filename.includes('/') ? filename.substring(0, filename.lastIndexOf('/')) : '';
    if (dir) {
      setupScript += `mkdir -p "${dir}"\n`;
    }
    
    // Escape the content for safe embedding in heredoc
    const escapedContent = content.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    
    setupScript += `cat > "${filename}" << 'BICEPFLEX_EOF'\n`;
    setupScript += content;
    setupScript += `\nBICEPFLEX_EOF\n\n`;
  });
  
  setupScript += `echo "✅ Project setup complete!"
echo "📁 Files created:"
`;
  
  files.forEach((_, filename) => {
    setupScript += `echo "  - ${filename}"\n`;
  });
  
  setupScript += `
echo ""
echo "🚀 Next steps:"
echo "  1. Run: az login"
echo "  2. Run: azd up"
echo ""
`;

  // Download the script
  const blob = new Blob([setupScript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `setup-${projectName}.sh`;
  a.click();
  URL.revokeObjectURL(url);
}
