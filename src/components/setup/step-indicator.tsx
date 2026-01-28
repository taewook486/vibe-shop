import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => (
          <li
            key={step.number}
            className={cn(
              'relative',
              stepIdx !== steps.length - 1 ? 'flex-1' : ''
            )}
          >
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    currentStep > step.number
                      ? 'border-vibe-blue bg-vibe-blue text-white'
                      : currentStep === step.number
                      ? 'border-vibe-blue bg-white text-vibe-blue'
                      : 'border-gray-300 bg-white text-gray-500'
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>

                {/* Step Text */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      currentStep >= step.number
                        ? 'text-vibe-blue'
                        : 'text-gray-500'
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {stepIdx !== steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-full mx-4 transition-colors',
                    currentStep > step.number ? 'bg-vibe-blue' : 'bg-gray-300'
                  )}
                  style={{ marginTop: '-60px' }}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
