
import { Button } from "@/components/ui/button";

interface ApplicationNavigationProps {
  currentStep: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const ApplicationNavigation = ({ 
  currentStep, 
  isSubmitting, 
  onBack, 
  onNext, 
  onSubmit 
}: ApplicationNavigationProps) => {
  return (
    <div className="flex justify-between">
      <Button 
        onClick={onBack} 
        variant="outline" 
        disabled={currentStep === 1}
        className="border-white/20 text-white hover:bg-white/10"
      >
        Back
      </Button>
      
      {currentStep < 6 ? (
        <Button onClick={onNext} className="bg-primary text-black hover:bg-primary/90">
          Next Step
        </Button>
      ) : (
        <Button 
          onClick={onSubmit} 
          className="bg-primary text-black hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      )}
    </div>
  );
};

export default ApplicationNavigation;
