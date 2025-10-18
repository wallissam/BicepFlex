import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Download, Upload, FileJson, Check, X } from 'lucide-react';

interface ExportImportProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportImport({ isOpen, onClose }: ExportImportProps) {
  const { project, loadTemplate } = useProjectStore();
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bicepflex-${project.name || 'project'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate the imported data
        if (!data.project || !data.version) {
          throw new Error('Invalid project file format');
        }

        if (!data.project.name || !Array.isArray(data.project.resources)) {
          throw new Error('Invalid project structure');
        }

        // Load the project
        loadTemplate(data.project);
        setImportSuccess(true);
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        setImportError(
          error instanceof Error ? error.message : 'Failed to import project'
        );
      }
    };

    reader.onerror = () => {
      setImportError('Failed to read file');
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileJson className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Export / Import Project</h2>
                <p className="text-indigo-100 text-sm">
                  Save or load your infrastructure configuration
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
                  <Download className="w-5 h-5 text-indigo-600" />
                  <span>Export Project</span>
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Save your current configuration as a JSON file
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Project Name:</span>
                <span className="font-semibold text-slate-900">
                  {project.name || 'Unnamed Project'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Resources:</span>
                <span className="font-semibold text-slate-900">
                  {project.resources.length} configured
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Region:</span>
                <span className="font-semibold text-slate-900">{project.region}</span>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={!project.name}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export Configuration</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-purple-300 transition-colors">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2 mb-1">
                <Upload className="w-5 h-5 text-purple-600" />
                <span>Import Project</span>
              </h3>
              <p className="text-sm text-slate-600">
                Load a previously exported configuration
              </p>
            </div>

            {/* Success Message */}
            {importSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 font-semibold">
                  Project imported successfully!
                </span>
              </div>
            )}

            {/* Error Message */}
            {importError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{importError}</p>
              </div>
            )}

            <label className="btn-secondary w-full flex items-center justify-center space-x-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              <span>Choose File to Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Exported files can be shared with team members, version
              controlled, or used as templates for new projects. All configuration including
              resources, SKUs, and properties are preserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
