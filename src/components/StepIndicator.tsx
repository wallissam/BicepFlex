import { useProjectStore } from '../store/projectStore';
import { Check } from 'lucide-react';
import { cn } from '../utils/cn';

export default function StepIndicator() {
  const { steps, currentStep, setCurrentStep } = useProjectStore();

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <button
              onClick={() => setCurrentStep(index)}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-200',
                index === currentStep
                  ? 'bg-primary-600 text-white shadow-lg scale-110'
                  : step.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              )}
            >
              {step.completed ? (
                <Check className="w-6 h-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </button>
            <div className="mt-2 text-center">
              <p
                className={cn(
                  'text-sm font-medium',
                  index === currentStep
                    ? 'text-primary-600'
                    : 'text-slate-600'
                )}
              >
                {step.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-1 mx-4 rounded transition-colors duration-200',
                step.completed ? 'bg-green-500' : 'bg-slate-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
