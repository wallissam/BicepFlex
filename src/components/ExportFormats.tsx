import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Download, FileText, FileJson, List } from 'lucide-react';

export default function ExportFormats() {
  const { project } = useProjectStore();
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);
  
  const exportAsMarkdown = () => {
    let markdown = `# ${project.name}\n\n`;
    markdown += `**Region:** ${project.region}\n`;
    markdown += `**Resources:** ${project.resources.length}\n\n`;
    
    const totalCost = project.resources.reduce((sum, r) => sum + (r.pricing?.estimatedMonthlyCost || 0), 0);
    markdown += `**Estimated Monthly Cost:** $${totalCost.toFixed(2)}\n\n`;
    
    markdown += `## Resources\n\n`;
    project.resources.forEach(resource => {
      markdown += `### ${resource.displayName}\n`;
      markdown += `- **Name:** ${resource.name}\n`;
      markdown += `- **Type:** ${resource.type}\n`;
      markdown += `- **SKU:** ${resource.sku.tier} - ${resource.sku.name}\n`;
      markdown += `- **Region:** ${resource.region}\n`;
      if (resource.pricing) {
        markdown += `- **Cost:** $${resource.pricing.estimatedMonthlyCost.toFixed(2)}/month\n`;
      }
      markdown += `\n`;
    });
    
    markdown += `## Deployment Steps\n\n`;
    markdown += `1. Ensure you have Azure CLI installed\n`;
    markdown += `2. Run \`az login\` to authenticate\n`;
    markdown += `3. Run \`az bicep install\` to install Bicep\n`;
    markdown += `4. Deploy with \`az deployment sub create --location ${project.region} --template-file infra/main.bicep --parameters infra/main.parameters.json\`\n`;
    
    downloadFile(markdown, `${project.name}-summary.md`, 'text/markdown');
    setExportedFormat('markdown');
    setTimeout(() => setExportedFormat(null), 2000);
  };
  
  const exportAsJSON = () => {
    const exportData = {
      version: '1.0',
      name: project.name,
      region: project.region,
      generatedAt: new Date().toISOString(),
      resources: project.resources.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        displayName: r.displayName,
        sku: {
          name: r.sku.name,
          tier: r.sku.tier,
        },
        region: r.region,
        estimatedMonthlyCost: r.pricing?.estimatedMonthlyCost || 0,
        dependencies: r.dependencies || [],
      })),
      metadata: {
        totalResources: project.resources.length,
        totalMonthlyCost: project.resources.reduce((sum, r) => sum + (r.pricing?.estimatedMonthlyCost || 0), 0),
      },
    };
    
    const json = JSON.stringify(exportData, null, 2);
    downloadFile(json, `${project.name}-config.json`, 'application/json');
    setExportedFormat('json');
    setTimeout(() => setExportedFormat(null), 2000);
  };
  
  const exportDeploymentSteps = () => {
    let steps = `# Deployment Steps for ${project.name}\n\n`;
    steps += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    steps += `## Prerequisites\n`;
    steps += `[ ] Azure CLI installed (https://docs.microsoft.com/cli/azure/install-azure-cli)\n`;
    steps += `[ ] Bicep CLI installed\n`;
    steps += `[ ] Active Azure subscription\n`;
    steps += `[ ] Appropriate permissions (Contributor or Owner role)\n\n`;
    
    steps += `## Pre-Deployment\n`;
    steps += `1. Login to Azure:\n`;
    steps += `   \`\`\`bash\n`;
    steps += `   az login\n`;
    steps += `   \`\`\`\n\n`;
    
    steps += `2. Set your subscription:\n`;
    steps += `   \`\`\`bash\n`;
    steps += `   az account set --subscription <YOUR_SUBSCRIPTION_ID>\n`;
    steps += `   \`\`\`\n\n`;
    
    steps += `3. Install Bicep:\n`;
    steps += `   \`\`\`bash\n`;
    steps += `   az bicep install\n`;
    steps += `   \`\`\`\n\n`;
    
    steps += `## Validation\n`;
    steps += `4. Validate the Bicep template:\n`;
    steps += `   \`\`\`bash\n`;
    steps += `   az bicep build --file infra/main.bicep\n`;
    steps += `   \`\`\`\n\n`;
    
    steps += `5. Preview changes (What-If):\n`;
    steps += `   \`\`\`bash\n`;
    steps += `   az deployment sub what-if --location ${project.region} --template-file infra/main.bicep --parameters infra/main.parameters.json\n`;
    steps += `   \`\`\`\n\n`;
    
    steps += `## Deployment\n`;
    steps += `6. Deploy resources:\n`;
    steps += `   \`\`\`bash\n`;
    steps += `   az deployment sub create --location ${project.region} --template-file infra/main.bicep --parameters infra/main.parameters.json\n`;
    steps += `   \`\`\`\n\n`;
    
    steps += `   Or use Azure Developer CLI:\n`;
    steps += `   \`\`\`bash\n`;
    steps += `   azd up\n`;
    steps += `   \`\`\`\n\n`;
    
    steps += `## Post-Deployment\n`;
    steps += `7. Verify deployment:\n`;
    steps += `   \`\`\`bash\n`;
    steps += `   az resource list --query "[?resourceGroup=='<YOUR_RG_NAME>']" --output table\n`;
    steps += `   \`\`\`\n\n`;
    
    steps += `## Resources to be Created\n`;
    project.resources.forEach((resource, idx) => {
      steps += `${idx + 1}. **${resource.displayName}**\n`;
      steps += `   - Type: ${resource.type}\n`;
      steps += `   - SKU: ${resource.sku.tier} - ${resource.sku.name}\n`;
      if (resource.pricing) {
        steps += `   - Cost: $${resource.pricing.estimatedMonthlyCost.toFixed(2)}/month\n`;
      }
      steps += `\n`;
    });
    
    const totalCost = project.resources.reduce((sum, r) => sum + (r.pricing?.estimatedMonthlyCost || 0), 0);
    steps += `\n**Total Estimated Monthly Cost:** $${totalCost.toFixed(2)}\n`;
    
    downloadFile(steps, `${project.name}-deployment-steps.md`, 'text/markdown');
    setExportedFormat('steps');
    setTimeout(() => setExportedFormat(null), 2000);
  };
  
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
        <Download className="w-5 h-5" />
        <span>Export Project</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={exportAsMarkdown}
          className="p-4 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            {exportedFormat === 'markdown' && (
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                Downloaded!
              </span>
            )}
          </div>
          <div className="font-semibold text-slate-900 dark:text-white mb-1">Markdown Summary</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Project overview and resource list
          </div>
        </button>
        
        <button
          onClick={exportAsJSON}
          className="p-4 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <FileJson className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            {exportedFormat === 'json' && (
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                Downloaded!
              </span>
            )}
          </div>
          <div className="font-semibold text-slate-900 dark:text-white mb-1">JSON Configuration</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Machine-readable project data
          </div>
        </button>
        
        <button
          onClick={exportDeploymentSteps}
          className="p-4 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <List className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            {exportedFormat === 'steps' && (
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                Downloaded!
              </span>
            )}
          </div>
          <div className="font-semibold text-slate-900 dark:text-white mb-1">Deployment Steps</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Step-by-step deployment guide
          </div>
        </button>
      </div>
    </div>
  );
}
