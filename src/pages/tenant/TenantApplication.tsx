
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import TenantStep1 from "@/components/tenant/TenantStep1";
import TenantStep2 from "@/components/tenant/TenantStep2";
import TenantStep3 from "@/components/tenant/TenantStep3";
import TenantStep4 from "@/components/tenant/TenantStep4";
import TenantStep5 from "@/components/tenant/TenantStep5";
import TenantStep6 from "@/components/tenant/TenantStep6";

const TenantApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    // Step 1: Personal info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    idNumber: "",
    idType: "drivers-license",
    
    // Step 2: Address history
    currentAddress: "",
    currentCity: "",
    currentState: "",
    currentZip: "",
    moveInDate: "",
    previousAddress: "",
    previousCity: "",
    previousState: "",
    previousZip: "",
    
    // Step 3: Employment
    employerName: "",
    jobTitle: "",
    employmentStartDate: "",
    monthlyIncome: "",
    employerPhone: "",
    employerAddress: "",
    
    // Step 4: Lease details
    propertyAddress: "",
    propertyCity: "",
    propertyState: "",
    propertyZip: "",
    monthlyRent: "",
    leaseStartDate: "",
    leaseDuration: "12",
    landlordName: "",
    landlordEmail: "",
    landlordPhone: "",
    
    // Step 5: Uploads (will store file names or URLs)
    idDocument: null as File | null,
    proofOfIncome: null as File | null,
    leaseAgreement: null as File | null,
    
    // Step 6: Consent
    agreeToTerms: false,
    agreeToCredit: false,
    agreeToBackground: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user is logged in (has completed signup)
  useEffect(() => {
    const email = localStorage.getItem("tenant-email");
    if (!email) {
      toast({
        title: "Please sign up first",
        description: "You need to create an account before applying.",
        variant: "destructive",
      });
      navigate("/apply");
    }
  }, [navigate, toast]);

  const updateApplicationData = (newData: Partial<typeof applicationData>) => {
    setApplicationData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // For demo purposes, we'll simulate submitting the application
    setTimeout(() => {
      // Store application data in localStorage to access in dashboard
      localStorage.setItem("tenant-application", JSON.stringify({
        ...applicationData,
        idDocument: applicationData.idDocument ? applicationData.idDocument.name : null,
        proofOfIncome: applicationData.proofOfIncome ? applicationData.proofOfIncome.name : null,
        leaseAgreement: applicationData.leaseAgreement ? applicationData.leaseAgreement.name : null,
      }));
      
      // Store application status
      localStorage.setItem("application-status", "pending");
      
      toast({
        title: "Application submitted successfully!",
        description: "Your application is now under review.",
      });
      
      navigate("/tenant/dashboard");
      setIsSubmitting(false);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <TenantStep1 data={applicationData} updateData={updateApplicationData} />;
      case 2:
        return <TenantStep2 data={applicationData} updateData={updateApplicationData} />;
      case 3:
        return <TenantStep3 data={applicationData} updateData={updateApplicationData} />;
      case 4:
        return <TenantStep4 data={applicationData} updateData={updateApplicationData} />;
      case 5:
        return <TenantStep5 data={applicationData} updateData={updateApplicationData} />;
      case 6:
        return <TenantStep6 data={applicationData} updateData={updateApplicationData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Tenant Application</h1>
              <div className="flex items-center mb-6">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${(currentStep / 6) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-white/70 min-w-[60px]">Step {currentStep}/6</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              {renderStepContent()}
            </div>

            <div className="flex justify-between">
              <Button 
                onClick={handleBack} 
                variant="outline" 
                disabled={currentStep === 1}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
              
              {currentStep < 6 ? (
                <Button onClick={handleNext} className="bg-primary text-black hover:bg-primary/90">
                  Next Step
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="bg-primary text-black hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantApplication;
