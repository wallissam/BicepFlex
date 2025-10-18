import { useProjectStore } from './store/projectStore';
import ProjectBasics from './components/ProjectBasics';
import ResourceSelector from './components/ResourceSelector';
import ResourceConfigurator from './components/ResourceConfigurator';
import ReviewAndGenerate from './components/ReviewAndGenerate';
import StepIndicator from './components/StepIndicator';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const { currentStep, steps, setCurrentStep } = useProjectStore();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">💪</div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">BicepFlex</h1>
              <p className="text-slate-600 text-sm">
                Trivialise your Azure infrastructure as code generation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator />
        </div>

        {/* Step Content */}
        <div className="card min-h-[500px]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {steps[currentStep].title}
            </h2>
            <p className="text-slate-600 mt-1">
              {steps[currentStep].description}
            </p>
          </div>

          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-600 text-sm">
            <p>
              Built with ❤️ using{' '}
              <a
                href="https://azure.github.io/azure-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Azure Developer CLI
              </a>
            </p>
            <p className="mt-2">
              Pricing data from{' '}
              <a
                href="https://prices.azure.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Azure Retail Prices API
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
