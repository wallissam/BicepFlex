import { X, BookOpen, Code, Layers, Settings, ExternalLink, FileCode, Zap } from 'lucide-react';

interface BicepHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BicepHelpModal({ isOpen, onClose }: BicepHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">About Azure Bicep</h2>
                  <p className="text-blue-100 text-sm">Infrastructure as Code Made Easy</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* What is Bicep */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Code className="w-6 h-6 text-blue-600" />
                <span>What is Bicep?</span>
              </h3>
              <p className="text-slate-700 mb-3">
                Bicep is a domain-specific language (DSL) for deploying Azure resources declaratively. It's a transparent 
                abstraction over Azure Resource Manager (ARM) templates that provides a cleaner, more concise syntax.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Key Benefits:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li className="flex items-start space-x-2">
                    <span>✓</span>
                    <span><strong>Simpler syntax</strong> - Cleaner than JSON ARM templates</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>✓</span>
                    <span><strong>Native Azure support</strong> - Day-zero support for new services</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>✓</span>
                    <span><strong>Modular</strong> - Break down infrastructure into reusable modules</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>✓</span>
                    <span><strong>Type safety</strong> - Strong typing and IntelliSense support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>✓</span>
                    <span><strong>No state management</strong> - Unlike Terraform, no state files needed</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* How BicepFlex Works */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Zap className="w-6 h-6 text-purple-600" />
                <span>How BicepFlex Works</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Define Your Infrastructure</h4>
                    <p className="text-sm text-slate-600">
                      Select Azure resources and configure their properties through our intuitive UI
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Generate Bicep Templates</h4>
                    <p className="text-sm text-slate-600">
                      We create production-ready Bicep files with best practices, parameters, and proper dependencies
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Customize & Deploy</h4>
                    <p className="text-sm text-slate-600">
                      Download, customize as needed, and deploy using Azure CLI or Azure Developer CLI
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Bicep Concepts */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Layers className="w-6 h-6 text-green-600" />
                <span>Key Bicep Concepts</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-green-600" />
                    <span>Parameters</span>
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    Define values that can be customized at deployment time
                  </p>
                  <code className="text-xs bg-slate-100 p-2 rounded block">
                    param location string = 'eastus'
                  </code>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-green-600" />
                    <span>Resources</span>
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    Azure resources you want to deploy
                  </p>
                  <code className="text-xs bg-slate-100 p-2 rounded block">
                    resource storage 'Microsoft.Storage/...'
                  </code>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-green-600" />
                    <span>Modules</span>
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    Reusable Bicep files for common patterns
                  </p>
                  <code className="text-xs bg-slate-100 p-2 rounded block">
                    module webApp './webapp.bicep'
                  </code>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                    <Code className="w-4 h-4 text-green-600" />
                    <span>Outputs</span>
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    Values returned after deployment
                  </p>
                  <code className="text-xs bg-slate-100 p-2 rounded block">
                    output appUrl string = webapp.properties.defaultHostName
                  </code>
                </div>
              </div>
            </section>

            {/* Customization Examples */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Common Customizations</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <h4 className="font-semibold text-blue-900 mb-1">Change SKUs/Pricing Tiers</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Modify the <code className="px-1 bg-blue-100 rounded">sku</code> block in any resource
                  </p>
                  <code className="text-xs bg-white p-2 rounded block text-slate-800">
                    sku: &#123;<br />
                    &nbsp;&nbsp;name: 'S1'  // Change to B1, P1V2, etc.<br />
                    &nbsp;&nbsp;tier: 'Standard'<br />
                    &#125;
                  </code>
                </div>
                <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                  <h4 className="font-semibold text-purple-900 mb-1">Add Environment-Specific Values</h4>
                  <p className="text-sm text-purple-800 mb-2">
                    Create separate parameter files for dev, staging, and production
                  </p>
                  <code className="text-xs bg-white p-2 rounded block text-slate-800">
                    dev.parameters.json<br />
                    staging.parameters.json<br />
                    prod.parameters.json
                  </code>
                </div>
                <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                  <h4 className="font-semibold text-green-900 mb-1">Add Conditional Resources</h4>
                  <p className="text-sm text-green-800 mb-2">
                    Deploy resources only in certain environments
                  </p>
                  <code className="text-xs bg-white p-2 rounded block text-slate-800">
                    resource redis '...' = if (enableRedis) &#123;<br />
                    &nbsp;&nbsp;// resource definition<br />
                    &#125;
                  </code>
                </div>
              </div>
            </section>

            {/* Resources */}
            <section className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Learn More</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-900">Bicep Documentation</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                </a>
                <a
                  href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-900">Best Practices</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                </a>
                <a
                  href="https://learn.microsoft.com/azure/developer/azure-developer-cli/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-900">Azure Developer CLI</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                </a>
                <a
                  href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-slate-900">Deploy Bicep Files</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
                </a>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 rounded-b-xl">
            <button
              onClick={onClose}
              className="w-full btn-primary"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
