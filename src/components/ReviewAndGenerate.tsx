import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { bicepGenerator } from '../services/bicepGenerator';
import RegionComparison from './RegionComparison';
import { Download, Copy, Check, FileCode, DollarSign, Globe } from 'lucide-react';

export default function ReviewAndGenerate() {
  const { project, completeStep } = useProjectStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('infra/main.bicep');
  const [showRegionComparison, setShowRegionComparison] = useState(false);

  const generatedFiles = bicepGenerator.generateInfrastructureFiles(project);
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

      {/* Region Comparison Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowRegionComparison(!showRegionComparison)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <Globe className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-primary-600">
            {showRegionComparison ? 'Hide' : 'Show'} Regional Cost Comparison
          </span>
        </button>
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
          <h3 className="font-semibold text-lg flex items-center space-x-2">
            <FileCode className="w-5 h-5" />
            <span>Generated Files</span>
          </h3>
          <button onClick={handleDownloadAll} className="btn-primary flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download All</span>
          </button>
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

      {/* Next Steps */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200">
        <h3 className="font-semibold text-lg mb-4">🚀 Next Steps</h3>
        <ol className="list-decimal list-inside space-y-3 text-slate-700">
          <li>
            Download all files and extract them to your project directory
          </li>
          <li>
            Install the Azure Developer CLI:{' '}
            <code className="px-2 py-1 bg-white rounded text-sm">
              npm install -g @azure/azd
            </code>
          </li>
          <li>
            Initialize your project:{' '}
            <code className="px-2 py-1 bg-white rounded text-sm">
              azd init
            </code>
          </li>
          <li>
            Deploy to Azure:{' '}
            <code className="px-2 py-1 bg-white rounded text-sm">
              azd up
            </code>
          </li>
        </ol>
        <div className="mt-4 p-4 bg-white rounded-lg">
          <p className="text-sm text-slate-600">
            📚 Learn more about azd at{' '}
            <a
              href="https://learn.microsoft.com/azure/developer/azure-developer-cli/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              aka.ms/azd
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
