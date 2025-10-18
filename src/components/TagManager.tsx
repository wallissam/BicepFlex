import { useState } from 'react';
import { X, Plus, Trash2, Tag, Sparkles } from 'lucide-react';
import { commonTagPresets, type ResourceTag } from '../types/tags';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tags: ResourceTag[];
  onTagsChange: (tags: ResourceTag[]) => void;
}

export default function TagManager({ isOpen, onClose, tags, onTagsChange }: TagManagerProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (newKey && newValue) {
      onTagsChange([...tags, { key: newKey, value: newValue }]);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleApplyPreset = (presetTags: ResourceTag[]) => {
    // Merge preset tags with existing, avoiding duplicates by key
    const existingKeys = new Set(tags.map(t => t.key));
    const newTags = presetTags.filter(t => !existingKeys.has(t.key));
    onTagsChange([...tags, ...newTags]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Tag className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Resource Tags</h2>
                <p className="text-purple-100 text-sm">
                  Add metadata for governance, cost tracking, and organization
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Tag Presets */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Quick Presets</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonTagPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset.tags)}
                  className="p-4 border-2 border-slate-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
                >
                  <div className="font-semibold text-slate-900 mb-1">{preset.name}</div>
                  <div className="text-sm text-slate-600 mb-2">{preset.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {preset.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                      >
                        {tag.key}
                      </span>
                    ))}
                    {preset.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                        +{preset.tags.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-slate-900 mb-3">
                Current Tags ({tags.length})
              </h3>
              <div className="space-y-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <span className="font-mono text-sm font-semibold text-slate-700">
                          {tag.key}
                        </span>
                      </div>
                      <div className="text-slate-400">=</div>
                      <div className="flex-1">
                        <span className="font-mono text-sm text-slate-600">{tag.value}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Tag */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Add Custom Tag</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Tag Key</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Environment"
                  className="input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
              </div>
              <div>
                <label className="label">Tag Value</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Production"
                  className="input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
              </div>
            </div>
            <button
              onClick={handleAddTag}
              disabled={!newKey || !newValue}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Tag</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Best Practice:</strong> Tags help with cost tracking, resource organization,
              and governance policies. Common uses include Environment, CostCenter, Owner, and
              Project tags. Azure allows up to 50 tags per resource.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <button onClick={onClose} className="btn-primary w-full">
            Done ({tags.length} tags configured)
          </button>
        </div>
      </div>
    </div>
  );
}
