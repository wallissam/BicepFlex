import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { commonRegions } from '../data/resourceTemplates';
import { MapPin, ExternalLink, Info, BookOpen } from 'lucide-react';

export default function ProjectBasics() {
  const { project, setProjectName, setRegion, completeStep } = useProjectStore();
  const [localName, setLocalName] = useState(project.name);
  const [localRegion, setLocalRegion] = useState(project.region);

  useEffect(() => {
    if (localName && localRegion) {
      completeStep('basics');
    }
  }, [localName, localRegion, completeStep]);

  const handleNameChange = (name: string) => {
    // Convert to lowercase and replace spaces with hyphens
    const sanitized = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setLocalName(sanitized);
    setProjectName(sanitized);
  };

  const handleRegionChange = (region: string) => {
    setLocalRegion(region);
    setRegion(region);
  };

  const regionsByGeography = commonRegions.reduce((acc, region) => {
    if (!acc[region.geography]) {
      acc[region.geography] = [];
    }
    acc[region.geography].push(region);
    return acc;
  }, {} as Record<string, typeof commonRegions>);

  return (
    <div className="space-y-8">
      {/* Help Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">About Bicep Configuration</h4>
            <p className="text-sm text-blue-800 mb-2">
              BicepFlex generates Azure Bicep templates - a declarative language for deploying Azure resources.
              All generated configurations are customizable and follow Azure best practices.
            </p>
            <a
              href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-blue-700 hover:text-blue-900 font-medium"
            >
              <span>Learn about Bicep</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Project Name */}
      <div>
        <label htmlFor="projectName" className="label flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Project Name</span>
            {localName && localName.length < 3 && (
              <span className="text-xs text-amber-600">
                (minimum 3 characters)
              </span>
            )}
            {localName && localName.length >= 3 && (
              <span className="text-xs text-green-600">✓ Valid</span>
            )}
          </div>
        </label>
        <input
          type="text"
          id="projectName"
          value={localName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="my-awesome-app"
          className={`input ${
            localName && localName.length < 3
              ? 'border-amber-400 focus:ring-amber-500'
              : localName
              ? 'border-green-400 focus:ring-green-500'
              : ''
          }`}
          autoFocus
          minLength={3}
          maxLength={50}
        />
        <div className="mt-2 flex items-start space-x-2">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-slate-600">
              This will be used as a prefix for your Azure resources. Use lowercase letters,
              numbers, and hyphens only. In Bicep, this becomes the <code className="px-1 py-0.5 bg-slate-100 rounded text-xs">environmentName</code> parameter.
            </p>
            {localName && (
              <p className="text-xs text-slate-500 mt-1">
                Character count: {localName.length}/50
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Region Selection */}
      <div>
        <label htmlFor="region" className="label flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Azure Region</span>
        </label>
        <select
          id="region"
          value={localRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="input"
        >
          {Object.entries(regionsByGeography).map(([geography, regions]) => (
            <optgroup key={geography} label={geography}>
              {regions.map((region) => (
                <option key={region.name} value={region.name}>
                  {region.displayName}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="mt-2 flex items-start space-x-2">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-slate-600">
              Choose the region closest to your users for best performance. This sets the <code className="px-1 py-0.5 bg-slate-100 rounded text-xs">location</code> parameter in Bicep.
            </p>
            <a
              href="https://azure.microsoft.com/explore/global-infrastructure/products-by-region/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 font-medium mt-1"
            >
              <span>View service availability by region</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      {localName && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-3">Preview</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-600">Resource Group:</span>{' '}
              <span className="font-mono font-semibold text-slate-900">
                rg-{localName}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Example Resource:</span>{' '}
              <span className="font-mono font-semibold text-slate-900">
                {localName}-webapp
              </span>
            </div>
            <div>
              <span className="text-slate-600">Region:</span>{' '}
              <span className="font-semibold text-slate-900">
                {commonRegions.find((r) => r.name === localRegion)?.displayName}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="font-semibold text-amber-900 mb-3 flex items-center space-x-2">
          <span>💡</span>
          <span>Pro Tips & Best Practices</span>
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Use descriptive names that reflect your project's purpose and environment (e.g., <code className="px-1 bg-amber-100 rounded">contoso-prod</code>)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Consider data residency and compliance requirements when choosing regions</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>East US and West Europe typically have the most services available</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>All generated Bicep templates are fully customizable - you can modify SKUs, properties, and parameters</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Bicep supports parameterization, making it easy to deploy to multiple environments</span>
          </li>
        </ul>
        <div className="mt-3 pt-3 border-t border-amber-200">
          <a
            href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-amber-700 hover:text-amber-900 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            <span>Bicep Best Practices Guide</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
