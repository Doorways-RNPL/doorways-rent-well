
import { stepTitles } from "@/lib/constants/application";

interface ApplicationProgressProps {
  currentStep: number;
}

const ApplicationProgress = ({ currentStep }: ApplicationProgressProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>
        <span className="ml-4 text-white/70 min-w-[80px]">Step {currentStep}/6</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs sm:text-sm">
        {stepTitles.map((title, index) => (
          <div 
            key={index}
            className={`px-3 py-2 text-center rounded-md ${
              currentStep === index + 1 
                ? "bg-primary text-black" 
                : currentStep > index + 1 
                ? "bg-primary/30 text-white" 
                : "bg-white/5 text-white/50"
            }`}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationProgress;
