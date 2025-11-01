import { X, Keyboard, Lightbulb } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', '→'], description: 'Navigate to next step', category: 'Navigation' },
    { keys: ['Ctrl', '←'], description: 'Navigate to previous step', category: 'Navigation' },
    { keys: ['Ctrl', 'S'], description: 'Manual save (auto-saves continuously)', category: 'Actions' },
    { keys: ['Ctrl', 'Shift', 'R'], description: 'Reset entire project', category: 'Actions' },
    { keys: ['Ctrl', 'K'], description: 'Quick search/command palette', category: 'Navigation' },
    { keys: ['?'], description: 'Show keyboard shortcuts help', category: 'Help' },
    { keys: ['Esc'], description: 'Close open dialogs and modals', category: 'Navigation' },
    { keys: ['Tab'], description: 'Navigate between form fields', category: 'Navigation' },
    { keys: ['Enter'], description: 'Submit or confirm current action', category: 'Actions' },
  ];

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black text-white p-6 rounded-t-2xl sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Keyboard className="w-6 h-6" />
              <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-300 mt-2">Master these shortcuts to boost your productivity</p>
        </div>

        {/* Shortcuts List by Category */}
        <div className="p-6 space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts.filter(s => s.category === category).map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-slate-700 dark:text-slate-300">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, idx) => (
                        <span key={idx} className="flex items-center">
                          <kbd className="px-3 py-1.5 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded shadow-sm font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
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
            </div>
          ))}
        </div>

        {/* Footer Tips */}
        <div className="px-6 pb-6 space-y-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Auto-Save:</strong> Your progress is automatically saved to your browser's local
                storage. You can safely close and return to your project anytime.
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800 dark:text-green-200">
                <strong>Pro Tip:</strong> Use <kbd className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/40 rounded text-xs font-mono">Ctrl + →</kbd> and <kbd className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/40 rounded text-xs font-mono">Ctrl + ←</kbd> to quickly navigate between steps without using the mouse.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
