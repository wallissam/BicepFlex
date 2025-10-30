import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { bicepGenerator } from '../services/bicepGenerator';
import { cicdGenerator } from '../services/cicdGenerator';
import RegionComparison from './RegionComparison';
import TagManager from './TagManager';
import CostAlert from './CostAlert';
import DeploymentReadinessChecklist from './DeploymentReadinessChecklist';
import { Download, Copy, Check, FileCode, DollarSign, Globe, GitBranch, Tag, ExternalLink, BookOpen, Info, Sparkles } from 'lucide-react';
import type { ResourceTag } from '../types/tags';

export default function ReviewAndGenerate() {
  const { project, completeStep } = useProjectStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('infra/main.bicep');
  const [showRegionComparison, setShowRegionComparison] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [includeCICD, setIncludeCICD] = useState(true);
  const [cicdPlatform, setCICDPlatform] = useState<'github' | 'azure'>('github');
  const [tags, setTags] = useState<ResourceTag[]>([]);
  const includeTags = tags.length > 0;

  const generatedFiles = bicepGenerator.generateInfrastructureFiles(project, includeTags, tags);
  
  // Add CI/CD files if enabled
  if (includeCICD) {
    if (cicdPlatform === 'github') {
      generatedFiles.set('.github/workflows/deploy.yml', cicdGenerator.generateGitHubActions(project));
    } else {
      generatedFiles.set('azure-pipelines.yml', cicdGenerator.generateAzurePipelines(project));
    }
    generatedFiles.set('deploy.sh', cicdGenerator.generateDeploymentScript(project));
    generatedFiles.set('README.md', cicdGenerator.generateReadme(project));
  }
  
  const totalCost = project.resources.reduce(
    (sum, r) => sum + (r.pricing?.estimatedMonthlyCost || 0),
    0
  );

  const handleCopy = async (content: string, filename: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(filename);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadAll = () => {
    generatedFiles.forEach((content, filename) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
    completeStep('review');
  };

  const fileList = Array.from(generatedFiles.keys());

  return (
    <div className="space-y-6">
      {/* Cost Alert */}
      <CostAlert totalCost={totalCost} resources={project.resources} />
      
      {/* Help Banner */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-1">Your Infrastructure as Code is Ready!</h4>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-2">
              We've generated production-ready Bicep templates with best practices built-in. All resources are parameterized,
              making it easy to customize for different environments. The templates include proper dependencies, security settings, and Azure CLI deployment scripts.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 font-medium"
              >
                <BookOpen className="w-4 h-4" />
                <span>Bicep Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://learn.microsoft.com/azure/developer/azure-developer-cli/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 font-medium"
              >
                <BookOpen className="w-4 h-4" />
                <span>Azure Developer CLI (azd)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold">{project.resources.length}</div>
          <div className="text-blue-100">Resources</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          <div className="text-green-100">Est. Monthly Cost</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg">
          <div className="text-3xl mb-2">📁</div>
          <div className="text-2xl font-bold">{generatedFiles.size}</div>
          <div className="text-purple-100">Files Generated</div>
        </div>
      </div>

      {/* Deployment Readiness Checklist */}
      <DeploymentReadinessChecklist />

      {/* Modals */}
      <TagManager 
        isOpen={showTagManager} 
        onClose={() => setShowTagManager(false)}
        tags={tags}
        onTagsChange={setTags}
      />

      {/* Options Bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => setShowRegionComparison(!showRegionComparison)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <Globe className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-primary-600">
            {showRegionComparison ? 'Hide' : 'Show'} Regional Comparison
          </span>
        </button>

        <button
          onClick={() => setShowTagManager(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <Tag className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-600">
            Manage Tags {tags.length > 0 && `(${tags.length})`}
          </span>
        </button>

        <div className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-lg">
          <GitBranch className="w-5 h-5 text-slate-600" />
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCICD}
              onChange={(e) => setIncludeCICD(e.target.checked)}
              className="rounded"
            />
            <span className="font-semibold text-slate-700">Include CI/CD</span>
          </label>
          {includeCICD && (
            <select
              value={cicdPlatform}
              onChange={(e) => setCICDPlatform(e.target.value as 'github' | 'azure')}
              className="ml-2 px-2 py-1 border border-slate-300 rounded text-sm"
            >
              <option value="github">GitHub Actions</option>
              <option value="azure">Azure Pipelines</option>
            </select>
          )}
        </div>
      </div>

      {/* Regional Comparison */}
      {showRegionComparison && <RegionComparison />}

      {/* Resources List */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Your Resources</h3>
        <div className="space-y-2">
          {project.resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{resource.displayName.split(' ')[0]}</span>
                <div>
                  <p className="font-medium">{resource.displayName}</p>
                  <p className="text-sm text-slate-500">
                    {resource.sku.tier} - {resource.sku.name}
                  </p>
                </div>
              </div>
              {resource.pricing && (
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>${resource.pricing.estimatedMonthlyCost.toFixed(2)}/mo</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Generated Files */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center space-x-2">
              <FileCode className="w-5 h-5" />
              <span>Generated Files</span>
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              All Bicep files use parameters for flexibility. Customize values via <code className="px-1 py-0.5 bg-slate-100 rounded text-xs">main.parameters.json</code> or at deployment time.
            </p>
          </div>
          <button onClick={handleDownloadAll} className="btn-primary flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download All</span>
          </button>
        </div>

        {/* File Descriptions */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Understanding the Generated Files</span>
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded mt-0.5">infra/main.bicep</span>
              <span>Core infrastructure definition with all Azure resources</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded mt-0.5">main.parameters.json</span>
              <span>Parameter values for deployment (environment-specific)</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded mt-0.5">azure.yaml</span>
              <span>Azure Developer CLI configuration for service mapping</span>
            </div>
            {includeCICD && (
              <>
                <div className="flex items-start space-x-2">
                  <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded mt-0.5">
                    {cicdPlatform === 'github' ? '.github/workflows/deploy.yml' : 'azure-pipelines.yml'}
                  </span>
                  <span>CI/CD pipeline for automated deployments</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded mt-0.5">deploy.sh</span>
                  <span>Deployment script using Azure CLI and Bicep</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* File List */}
          <div className="space-y-1">
            {fileList.map((filename) => (
              <button
                key={filename}
                onClick={() => setSelectedFile(filename)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFile === filename
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {filename}
              </button>
            ))}
          </div>

          {/* File Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                <span className="text-slate-300 text-sm font-mono">{selectedFile}</span>
                <button
                  onClick={() => handleCopy(generatedFiles.get(selectedFile)!, selectedFile)}
                  className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
                >
                  {copied === selectedFile ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-green-400 font-mono">
                  {generatedFiles.get(selectedFile)}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Bicep Customization Tips */}
      <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Customizing Your Bicep Templates</span>
        </h3>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="p-3 bg-white rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-1">Modify SKUs & Pricing Tiers</h4>
            <p className="text-slate-600">Change the <code className="px-1 py-0.5 bg-slate-100 rounded">sku</code> properties in <code className="px-1 py-0.5 bg-slate-100 rounded">main.bicep</code> to adjust resource tiers (e.g., B1 → S1, Free → Standard)</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-1">Add More Parameters</h4>
            <p className="text-slate-600">Use <code className="px-1 py-0.5 bg-slate-100 rounded">param</code> declarations to make any value customizable (regions, names, feature flags)</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-1">Environment-Specific Configs</h4>
            <p className="text-slate-600">Create multiple parameter files: <code className="px-1 py-0.5 bg-slate-100 rounded">dev.parameters.json</code>, <code className="px-1 py-0.5 bg-slate-100 rounded">prod.parameters.json</code></p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-1">Add Conditional Resources</h4>
            <p className="text-slate-600">Use Bicep's <code className="px-1 py-0.5 bg-slate-100 rounded">if</code> conditions to deploy resources based on parameters or environments</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/parameters"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-indigo-700 hover:text-indigo-900 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            <span>Parameters Guide</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-indigo-700 hover:text-indigo-900 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            <span>Best Practices</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/conditional-resource-deployment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-indigo-700 hover:text-indigo-900 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            <span>Conditional Deployment</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200">
        <h3 className="font-semibold text-lg mb-4">🚀 Deployment Steps</h3>
        <ol className="list-decimal list-inside space-y-3 text-slate-700">
          <li className="pl-2">
            <span className="font-semibold">Download all files</span> and extract them to your project directory
          </li>
          <li className="pl-2">
            <span className="font-semibold">Install the Azure Developer CLI:</span>
            <div className="mt-1 ml-6">
              <code className="px-3 py-2 bg-white rounded text-sm block">
                npm install -g @azure/azd
              </code>
              <p className="text-xs text-slate-500 mt-1">Or use other installation methods at <a href="https://aka.ms/azd" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">aka.ms/azd</a></p>
            </div>
          </li>
          <li className="pl-2">
            <span className="font-semibold">Login to Azure:</span>
            <div className="mt-1 ml-6">
              <code className="px-3 py-2 bg-white rounded text-sm block">azd auth login</code>
            </div>
          </li>
          <li className="pl-2">
            <span className="font-semibold">Initialize your project:</span>
            <div className="mt-1 ml-6">
              <code className="px-3 py-2 bg-white rounded text-sm block">azd init</code>
              <p className="text-xs text-slate-500 mt-1">This sets up your environment and creates configuration files</p>
            </div>
          </li>
          <li className="pl-2">
            <span className="font-semibold">Deploy to Azure:</span>
            <div className="mt-1 ml-6">
              <code className="px-3 py-2 bg-white rounded text-sm block">azd up</code>
              <p className="text-xs text-slate-500 mt-1">This provisions infrastructure and deploys your application</p>
            </div>
          </li>
        </ol>
        <div className="mt-4 p-4 bg-white rounded-lg border border-primary-200">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Alternative: Direct Bicep Deployment</span>
          </h4>
          <p className="text-sm text-slate-600 mb-2">
            You can also deploy using Azure CLI directly:
          </p>
          <code className="px-3 py-2 bg-slate-50 rounded text-xs block">
            az deployment group create --resource-group YOUR_RG --template-file infra/main.bicep --parameters @infra/main.parameters.json
          </code>
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg">
          <div className="flex items-start space-x-2">
            <BookOpen className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600 mb-2">
                <span className="font-semibold">Learn more:</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://learn.microsoft.com/azure/developer/azure-developer-cli/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span>Azure Developer CLI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span>Deploy Bicep Files</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span>Bicep File Structure</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
