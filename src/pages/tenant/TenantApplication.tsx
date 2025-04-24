import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { useToast } from "@/components/ui/use-toast";
import TenantStep1 from "@/components/tenant/TenantStep1";
import TenantStep2 from "@/components/tenant/TenantStep2";
import TenantStep3 from "@/components/tenant/TenantStep3";
import TenantStep4 from "@/components/tenant/TenantStep4";
import TenantStep5 from "@/components/tenant/TenantStep5";
import TenantStep6 from "@/components/tenant/TenantStep6";

// Step titles for reference
const stepTitles = [
  "Personal Info", 
  "Address History", 
  "Employment", 
  "Lease Details", 
  "Documents", 
  "Review & Submit"
];

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
    
    // Step 2: Address
    residenceType: "new" as 'current' | 'new',
    currentAddress: "",
    currentCity: "",
    moveInDate: "",
    
    // Step 3: Employment
    employerName: "",
    jobTitle: "",
    monthlyIncome: "",
    
    // Step 4: Lease details
    propertyAddress: "",
    propertyCity: "",
    monthlyRent: "",
    leaseStartDate: "",
    leaseDuration: "12",
    landlordName: "",
    landlordEmail: "",
    landlordPhone: "",
    
    // Step 5: Uploads
    idDocument: null as File | null,
    proofOfIncome: null as File | null,
    leaseAgreement: null as File | null,
    
    // Step 6: Consent
    agreeToTerms: false,
    agreeToCredit: false,
    agreeToBackground: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
  
  // Check if user is logged in (has completed signup)
  useEffect(() => {
    const email = localStorage.getItem("tenant-email");
    const firstName = localStorage.getItem("tenant-firstName");
    const lastName = localStorage.getItem("tenant-lastName");
    
    if (!email) {
      toast({
        title: "Please sign up first",
        description: "You need to create an account before applying.",
        variant: "destructive",
      });
      navigate("/apply");
    } else {
      // Pre-fill data if available
      setApplicationData(prev => ({
        ...prev,
        firstName: firstName || "",
        lastName: lastName || ""
      }));
    }
  }, [navigate, toast]);

  const updateApplicationData = (newData: Partial<typeof applicationData>) => {
    setApplicationData(prev => ({ ...prev, ...newData }));
  };

  const validateCurrentStep = () => {
    setHasAttemptedNext(true);
    
    switch(currentStep) {
      case 1:
        if (!applicationData.firstName || !applicationData.lastName || !applicationData.dateOfBirth || !applicationData.idNumber) {
          toast({
            title: "Missing information",
            description: "Please fill out all required fields before continuing.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!applicationData.currentAddress || !applicationData.currentCity || !applicationData.moveInDate) {
          toast({
            title: "Missing information",
            description: "Please fill out all current address fields before continuing.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (!applicationData.employerName || !applicationData.jobTitle || !applicationData.monthlyIncome) {
          toast({
            title: "Missing information",
            description: "Please fill out all required employment fields before continuing.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 4:
        if (
          !applicationData.monthlyRent || 
          !applicationData.leaseStartDate || 
          !applicationData.landlordName || 
          !applicationData.landlordEmail ||
          !applicationData.landlordPhone ||
          (applicationData.residenceType === 'new' && (!applicationData.propertyAddress || !applicationData.propertyCity))
        ) {
          toast({
            title: "Missing information",
            description: "Please fill out all required lease details before continuing.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 5:
        // Documents are optional in this demo
        break;
      case 6:
        if (!applicationData.agreeToTerms || !applicationData.agreeToCredit || !applicationData.agreeToBackground) {
          toast({
            title: "Consent required",
            description: "Please agree to all terms to submit your application.",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < 6) {
      setCurrentStep(currentStep + 1);
      setHasAttemptedNext(false);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setHasAttemptedNext(false);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;
    
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

  // Prepare breadcrumb items
  const breadcrumbItems = [
    { label: "Apply", href: "/apply" },
    { label: "Application", active: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <BreadcrumbNav items={breadcrumbItems} />
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-4">Tenant Application</h1>
              <p className="text-white/70 mb-6">Complete your application to begin your rent now, pay later journey.</p>
              
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
