import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  showOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  startOnboarding: () => void;
  skipOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const totalSteps = 5;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const completed = localStorage.getItem('creatorflow_onboarding_completed');
    if (!completed) {
      // Show onboarding on first visit after a short delay
      const timer = setTimeout(() => setShowOnboarding(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startOnboarding = () => {
    setCurrentStep(1);
    setShowOnboarding(true);
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('creatorflow_onboarding_completed', 'true');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('creatorflow_onboarding_completed', 'true');
  };

  return (
    <OnboardingContext.Provider
      value={{
        showOnboarding,
        currentStep,
        totalSteps,
        startOnboarding,
        skipOnboarding,
        nextStep,
        prevStep,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
