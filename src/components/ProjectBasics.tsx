import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { commonRegions } from '../data/resourceTemplates';
import { MapPin } from 'lucide-react';

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
      {/* Project Name */}
      <div>
        <label htmlFor="projectName" className="label">
          Project Name
          {localName && localName.length < 3 && (
            <span className="ml-2 text-xs text-amber-600">
              (minimum 3 characters)
            </span>
          )}
          {localName && localName.length >= 3 && (
            <span className="ml-2 text-xs text-green-600">✓ Valid</span>
          )}
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
          <p className="text-sm text-slate-500 flex-1">
            This will be used as a prefix for your Azure resources. Use lowercase letters,
            numbers, and hyphens only.
          </p>
          {localName && (
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {localName.length}/50
            </span>
          )}
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
        <p className="mt-2 text-sm text-slate-500">
          Choose the region closest to your users for best performance. You can deploy to
          multiple regions later.
        </p>
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
        <h3 className="font-semibold text-amber-900 mb-2 flex items-center space-x-2">
          <span>💡</span>
          <span>Pro Tips</span>
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
          <li>Use descriptive names that reflect your project's purpose</li>
          <li>Consider data residency and compliance requirements when choosing regions</li>
          <li>East US and West Europe typically have the most services available</li>
          <li>You can always change these settings in the generated code</li>
        </ul>
      </div>
    </div>
  );
}
