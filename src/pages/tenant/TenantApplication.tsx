import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { useToast } from "@/components/ui/use-toast";
import ApplicationProgress from "@/components/tenant/ApplicationProgress";
import ApplicationNavigation from "@/components/tenant/ApplicationNavigation";
import { validateStep } from "@/lib/constants/application";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
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

  // Check if user is logged in
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

  const handleNext = () => {
    if (validateStep(currentStep, applicationData) && currentStep < 6) {
      setCurrentStep(currentStep + 1);
      setHasAttemptedNext(false);
      window.scrollTo(0, 0);
    } else {
      setHasAttemptedNext(true);
      toast({
        title: "Missing information",
        description: "Please fill out all required fields before continuing.",
        variant: "destructive",
      });
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
    if (!validateStep(currentStep, applicationData)) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      localStorage.setItem("tenant-application", JSON.stringify({
        ...applicationData,
        idDocument: applicationData.idDocument ? applicationData.idDocument.name : null,
        proofOfIncome: applicationData.proofOfIncome ? applicationData.proofOfIncome.name : null,
        leaseAgreement: applicationData.leaseAgreement ? applicationData.leaseAgreement.name : null,
      }));
      
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
              
              <ApplicationProgress currentStep={currentStep} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              {renderStepContent()}
            </div>

            <ApplicationNavigation 
              currentStep={currentStep}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantApplication;
