
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import ApplicationProgress from "@/components/tenant/ApplicationProgress";
import ApplicationNavigation from "@/components/tenant/ApplicationNavigation";
import { validateStep } from "@/lib/constants/application";
import TenantStep1 from "@/components/tenant/TenantStep1";
import TenantStep2 from "@/components/tenant/TenantStep2";
import TenantStep3 from "@/components/tenant/TenantStep3";
import TenantStep4 from "@/components/tenant/TenantStep4";
import TenantStep5 from "@/components/tenant/TenantStep5";
import TenantStep6 from "@/components/tenant/TenantStep6";
import { supabase } from "@/integrations/supabase/client";

interface PropertyOption {
  id: string;
  address: string;
  city: string;
  rent_amount: number;
}

const TenantApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { role, setRole } = useUserRole();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
  const [availableProperties, setAvailableProperties] = useState<PropertyOption[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  
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
    propertyId: "", // Store property ID instead of address
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

  // Fetch available properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, address, city, rent_amount')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAvailableProperties(data || []);
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error loading properties",
          description: "Unable to load available properties. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProperties(false);
      }
    };
    
    fetchProperties();
  }, [toast]);

  // Check if user is logged in
  useEffect(() => {
    const email = localStorage.getItem("tenant-email");
    const firstName = localStorage.getItem("tenant-firstName");
    const lastName = localStorage.getItem("tenant-lastName");
    
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "You need to create an account before applying.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    // Set role if we're coming from the signup flow
    if (role !== "tenant") {
      setRole("tenant");
    }

    if (email) {
      setApplicationData(prev => ({
        ...prev,
        firstName: firstName || "",
        lastName: lastName || ""
      }));
    }
  }, [navigate, toast, user, role, setRole]);

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

  const handleSubmit = async () => {
    if (!validateStep(currentStep, applicationData)) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit an application.",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.propertyId) {
      toast({
        title: "Property selection required",
        description: "Please select a property to apply for.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create tenant record if it doesn't exist
      const { data: existingTenant, error: tenantCheckError } = await supabase
        .from('tenants')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      let tenantId;
        
      if (tenantCheckError && tenantCheckError.code === 'PGRST116') {
        // No tenant record found, create one
        const { data: newTenant, error: createError } = await supabase
          .from('tenants')
          .insert({
            first_name: applicationData.firstName,
            last_name: applicationData.lastName,
            email: user.email || localStorage.getItem("tenant-email") || '',
            user_id: user.id
          })
          .select('id')
          .single();
          
        if (createError) throw createError;
        tenantId = newTenant?.id;
      } else if (tenantCheckError) {
        throw tenantCheckError;
      } else {
        tenantId = existingTenant?.id;
      }
      
      // Format employment info
      const employmentInfo = {
        employer: applicationData.employerName,
        job_title: applicationData.jobTitle,
      };
      
      // Format additional info
      const additionalInfo = {
        current_address: applicationData.currentAddress,
        current_city: applicationData.currentCity,
        move_in_date: applicationData.moveInDate,
        id_number: applicationData.idNumber,
        date_of_birth: applicationData.dateOfBirth,
        lease_duration: applicationData.leaseDuration,
      };
      
      // Submit application to database
      const { error: applicationError } = await supabase
        .from('tenant_applications')
        .insert({
          tenant_email: user.email || localStorage.getItem("tenant-email") || '',
          tenant_first_name: applicationData.firstName,
          tenant_last_name: applicationData.lastName,
          property_id: applicationData.propertyId,
          tenant_id: tenantId,
          monthly_income: parseFloat(applicationData.monthlyIncome),
          employment_info: employmentInfo,
          additional_info: additionalInfo,
          status: 'pending',
          message: "I would like to apply for this property."
        });
        
      if (applicationError) throw applicationError;

      // Handle file uploads
      if (applicationData.idDocument) {
        const fileExt = applicationData.idDocument.name.split('.').pop();
        const fileName = `${tenantId}/id_document_${Date.now()}.${fileExt}`;
        
        await supabase.storage
          .from('tenant_documents')
          .upload(fileName, applicationData.idDocument);
      }

      if (applicationData.proofOfIncome) {
        const fileExt = applicationData.proofOfIncome.name.split('.').pop();
        const fileName = `${tenantId}/income_proof_${Date.now()}.${fileExt}`;
        
        await supabase.storage
          .from('tenant_documents')
          .upload(fileName, applicationData.proofOfIncome);
      }

      if (applicationData.leaseAgreement) {
        const fileExt = applicationData.leaseAgreement.name.split('.').pop();
        const fileName = `${tenantId}/lease_agreement_${Date.now()}.${fileExt}`;
        
        await supabase.storage
          .from('tenant_documents')
          .upload(fileName, applicationData.leaseAgreement);
      }
      
      toast({
        title: "Application submitted successfully!",
        description: "Your application is now under review.",
      });
      
      navigate("/tenant/dashboard");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        variant: "destructive",
        title: "Error submitting application",
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
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
        return (
          <TenantStep4 
            data={applicationData} 
            updateData={updateApplicationData} 
            properties={availableProperties} 
            isLoading={isLoadingProperties} 
          />
        );
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

  if (!user) {
    return null; // Don't render anything while redirecting
  }

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
