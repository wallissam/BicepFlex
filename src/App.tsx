import { useState, useEffect } from 'react';
import { useProjectStore } from './store/projectStore';
import { useTheme } from './hooks/useTheme';
import ProjectBasics from './components/ProjectBasics';
import ResourceSelector from './components/ResourceSelector';
import ResourceConfigurator from './components/ResourceConfigurator';
import ReviewAndGenerate from './components/ReviewAndGenerate';
import StepIndicator from './components/StepIndicator';
import QuickStartModal from './components/QuickStartModal';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import ExportImport from './components/ExportImport';
import BicepHelpModal from './components/BicepHelpModal';
import Tooltip from './components/Tooltip';
import ValidationPanel from './components/ValidationPanel';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ChevronLeft, ChevronRight, Zap, Keyboard, RotateCcw, Save, FileJson, BookOpen, Moon, Sun } from 'lucide-react';

function App() {
  const { currentStep, steps, setCurrentStep, resetProject, project } = useProjectStore();
  const { theme, toggleTheme } = useTheme();
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [showBicepHelp, setShowBicepHelp] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Show quick start on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('bicepflex-visited');
    if (!hasVisited && !project.name) {
      setShowQuickStart(true);
      localStorage.setItem('bicepflex-visited', 'true');
    }
  }, [project.name]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your project? This cannot be undone.')) {
      resetProject();
    }
  };

  const handleSave = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'ArrowRight', ctrlKey: true, description: 'Next step', action: handleNext },
    { key: 'ArrowLeft', ctrlKey: true, description: 'Previous step', action: handleBack },
    { key: 's', ctrlKey: true, description: 'Save', action: handleSave },
    { key: 'r', ctrlKey: true, shiftKey: true, description: 'Reset', action: handleReset },
    { key: '?', shiftKey: true, description: 'Help', action: () => setShowShortcuts(true) },
  ]);

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'basics':
        return <ProjectBasics />;
      case 'resources':
        return <ResourceSelector />;
      case 'configure':
        return <ResourceConfigurator />;
      case 'review':
        return <ReviewAndGenerate />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Modals */}
      <QuickStartModal isOpen={showQuickStart} onClose={() => setShowQuickStart(false)} />
      <KeyboardShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <ExportImport isOpen={showExportImport} onClose={() => setShowExportImport(false)} />
      <BicepHelpModal isOpen={showBicepHelp} onClose={() => setShowBicepHelp(false)} />

      {/* Auto-Save Indicator */}
      <AutoSaveIndicator />

      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span className="font-semibold">Progress auto-saved!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">💪</div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BicepFlex</h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Trivialise your Azure infrastructure as code generation
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              <Tooltip content={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </Tooltip>
              
              <Tooltip content="Learn About Bicep">
                <button
                  onClick={() => setShowBicepHelp(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Bicep Help"
                >
                  <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Tooltip>
              
              <Tooltip content="Quick Start Templates">
                <button
                  onClick={() => setShowQuickStart(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Quick Start"
                >
                  <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Tooltip>
              
              <Tooltip content="Export/Import Project">
                <button
                  onClick={() => setShowExportImport(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Export/Import"
                >
                  <FileJson className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Tooltip>
              
              <Tooltip content="Keyboard Shortcuts (?)">
                <button
                  onClick={() => setShowShortcuts(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Keyboard Shortcuts"
                >
                  <Keyboard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Tooltip>
              
              <Tooltip content="Reset Project (Ctrl+Shift+R)">
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                  aria-label="Reset Project"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Validation Panel - shown after step 1 */}
        {currentStep >= 1 && project.resources.length > 0 && (
          <div className="mb-6">
            <ValidationPanel />
          </div>
        )}
        
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator />
        </div>

        {/* Step Content */}
        <div className="card min-h-[500px]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {steps[currentStep].title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {steps[currentStep].description}
            </p>
          </div>

          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Tooltip content="Ctrl + ← to go back">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </Tooltip>

          {currentStep < steps.length - 1 && (
            <Tooltip content="Ctrl + → to continue">
              <button
                onClick={handleNext}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </Tooltip>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">About BicepFlex</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate production-ready Azure Bicep templates with best practices built-in.
                All templates are fully customizable and follow Azure recommendations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Learn More</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Bicep Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://learn.microsoft.com/azure/developer/azure-developer-cli/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Azure Developer CLI
                  </a>
                </li>
                <li>
                  <a
                    href="https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Bicep Best Practices
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://learn.microsoft.com/azure/templates/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Azure Template Reference
                  </a>
                </li>
                <li>
                  <a
                    href="https://prices.azure.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Azure Pricing API
                  </a>
                </li>
                <li>
                  <a
                    href="https://learn.microsoft.com/azure/architecture/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Azure Architecture Center
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-slate-600 dark:text-slate-400 text-sm">
            <p>
              Built with ❤️ for the Azure community • Powered by{' '}
              <a
                href="https://azure.github.io/azure-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
              >
                Azure Developer CLI
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
