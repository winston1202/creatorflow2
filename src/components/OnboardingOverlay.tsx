import { useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, Sparkles, Video, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OnboardingOverlay = () => {
  const { showOnboarding, currentStep, totalSteps, nextStep, prevStep, skipOnboarding } = useOnboarding();
  const { user } = useAuth();

  const userName = user?.username || 'UserFallbackName';

  useEffect(() => {
    if (showOnboarding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOnboarding]);

  const steps = [
    {
      title: `Welcome, ${userName}! 👋`,
      description: 'Let\'s take a quick tour of CreatorFlow. This will only take a minute.',
      icon: Sparkles,
      position: 'center',
    },
    {
      title: 'Your Dashboard',
      description: 'This is your home base. View all your projects, track your progress, and start new creations.',
      icon: Video,
      position: 'center',
      highlight: '.dashboard-projects',
    },
    {
      title: 'AI-Powered Editor',
      description: 'Create professional videos with our intuitive editor. AI tools help you generate scripts, add effects, and more.',
      icon: Sparkles,
      position: 'center',
    },
    {
      title: 'Community Hub',
      description: 'Get inspired by templates and tutorials from other creators. Import them directly to your editor.',
      icon: Users,
      position: 'center',
    },
    {
      title: 'You\'re All Set!',
      description: 'You can always customize your experience in Settings. Ready to create something amazing?',
      icon: Settings,
      position: 'center',
    },
  ];

  const currentStepData = steps[currentStep - 1];

  if (!showOnboarding) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/95 backdrop-blur-sm"
          onClick={skipOnboarding}
        />

        {/* Tooltip Card */}
        <motion.div
          key={currentStep}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative z-10 max-w-lg mx-4"
        >
          <Card className="p-6 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={skipOnboarding}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close tutorial"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <currentStepData.icon className="h-7 w-7 text-primary" />
            </div>

            {/* Content */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i + 1 === currentStep
                      ? 'bg-primary w-8'
                      : i + 1 < currentStep
                      ? 'bg-primary/50 w-6'
                      : 'bg-muted w-6'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={skipOnboarding}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip Tutorial
              </Button>

              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep} size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <Button onClick={nextStep} size="sm" className="gap-1">
                  {currentStep === totalSteps ? 'Get Started' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Step Counter */}
            <div className="text-center mt-4 text-xs text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
