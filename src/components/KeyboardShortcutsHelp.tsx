import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', '→'], description: 'Next step' },
    { keys: ['Ctrl', '←'], description: 'Previous step' },
    { keys: ['Ctrl', 'S'], description: 'Save progress (auto-saved)' },
    { keys: ['Ctrl', 'Shift', 'R'], description: 'Reset project' },
    { keys: ['?'], description: 'Show this help' },
    { keys: ['Esc'], description: 'Close dialogs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Keyboard className="w-6 h-6" />
              <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span className="text-slate-700">{shortcut.description}</span>
              <div className="flex items-center space-x-1">
                {shortcut.keys.map((key, idx) => (
                  <span key={idx} className="flex items-center">
                    <kbd className="px-3 py-1 bg-white border-2 border-slate-300 rounded shadow-sm font-mono text-sm font-semibold text-slate-800">
                      {key}
                    </kbd>
                    {idx < shortcut.keys.length - 1 && (
                      <span className="mx-1 text-slate-400">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Your progress is automatically saved to your browser's local
              storage. You can safely close and return to your project anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
