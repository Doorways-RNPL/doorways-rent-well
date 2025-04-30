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
  const { role } = useUserRole();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
  const [availableProperties, setAvailableProperties] = useState<PropertyOption[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [existingApplication, setExistingApplication] = useState<boolean>(false);
  
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    idNumber: "",
    
    residenceType: "new" as 'current' | 'new',
    currentAddress: "",
    currentCity: "",
    moveInDate: "",
    
    employerName: "",
    jobTitle: "",
    monthlyIncome: "",
    
    propertyId: "",
    propertyAddress: "",
    propertyCity: "",
    monthlyRent: "",
    leaseStartDate: "",
    leaseDuration: "12",
    landlordName: "",
    landlordEmail: "",
    landlordPhone: "",
    
    idDocument: null as File | null,
    proofOfIncome: null as File | null,
    leaseAgreement: null as File | null,
    
    agreeToTerms: false,
    agreeToCredit: false,
    agreeToBackground: false,
  });

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
    
    // CRITICAL FIX: No longer setting user's role automatically
    // Instead, we check if user has the correct role to access this page
    if (role !== "tenant") {
      toast({
        title: "Role selection required",
        description: "You need to select 'Tenant' role to access the application form.",
        variant: "destructive",
      });
      navigate("/auth", { state: { showRoleSelection: true } });
      return;
    }

    if (email) {
      setApplicationData(prev => ({
        ...prev,
        firstName: firstName || "",
        lastName: lastName || ""
      }));
    }

    // Check if user already has an application
    const checkForExistingApplication = async () => {
      try {
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (tenantError && tenantError.code !== 'PGRST116') {
          console.error("Error checking for tenant:", tenantError);
          return;
        }
        
        if (tenant) {
          // User has a tenant record, check for applications
          const { data: applications, error: appError, count } = await supabase
            .from('tenant_applications')
            .select('*', { count: 'exact' })
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (appError && appError.code !== 'PGRST116') {
            console.error("Error checking for applications:", appError);
            return;
          }
          
          if (count && count > 0) {
            setExistingApplication(true);
            toast({
              title: "Application already submitted",
              description: "You already have an application in our system. Redirecting to dashboard.",
            });
            
            // Give the toast time to show before redirecting
            setTimeout(() => {
              navigate("/tenant/dashboard");
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };
    
    checkForExistingApplication();
  }, [navigate, toast, user, role]);

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
        .maybeSingle();
        
      let tenantId;
        
      if (!existingTenant && !tenantCheckError) {
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
          
        if (createError) {
          console.error("Error creating tenant record:", createError);
          throw createError;
        }
        tenantId = newTenant?.id;
      } else if (tenantCheckError && tenantCheckError.code !== 'PGRST116') { 
        // PGRST116 is "no rows returned", which is fine - we'll create a tenant
        console.error("Error checking for existing tenant:", tenantCheckError);
        throw tenantCheckError;
      } else if (existingTenant) {
        tenantId = existingTenant.id;
      } else {
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
          
        if (createError) {
          console.error("Error creating tenant record:", createError);
          throw createError;
        }
        tenantId = newTenant?.id;
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
      const { data: applicationResult, error: applicationError } = await supabase
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
        })
        .select('id')
        .single();
        
      if (applicationError) {
        console.error("Error submitting application:", applicationError);
        throw applicationError;
      }

      const applicationId = applicationResult?.id;

      // Handle file uploads if tenant record was created
      if (tenantId) {
        if (applicationData.idDocument) {
          const fileExt = applicationData.idDocument.name.split('.').pop();
          const fileName = `${user.id}/id_document_${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('tenant_documents')
            .upload(fileName, applicationData.idDocument);
            
          if (uploadError) {
            console.error("Error uploading ID document:", uploadError);
          }
        }

        if (applicationData.proofOfIncome) {
          const fileExt = applicationData.proofOfIncome.name.split('.').pop();
          const fileName = `${user.id}/income_proof_${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('tenant_documents')
            .upload(fileName, applicationData.proofOfIncome);
            
          if (uploadError) {
            console.error("Error uploading proof of income:", uploadError);
          }
        }

        if (applicationData.leaseAgreement) {
          const fileExt = applicationData.leaseAgreement.name.split('.').pop();
          const fileName = `${user.id}/lease_agreement_${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('tenant_documents')
            .upload(fileName, applicationData.leaseAgreement);
            
          if (uploadError) {
            console.error("Error uploading lease agreement:", uploadError);
          }
        }
      }
      
      toast({
        title: "Application submitted successfully!",
        description: "Your application is now under review.",
      });
      
      // Store the applicationData in localStorage for the dashboard 
      // Enhanced localStorage with more complete application information
      localStorage.setItem("tenant-application", JSON.stringify({
        id: applicationId, // Store the application ID
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        propertyId: applicationData.propertyId,
        propertyAddress: applicationData.propertyAddress,
        propertyCity: applicationData.propertyCity,
        monthlyRent: applicationData.monthlyRent,
        leaseStartDate: applicationData.leaseStartDate,
        landlordName: applicationData.landlordName,
        landlordEmail: applicationData.landlordEmail,
        status: 'pending',
        createdAt: new Date().toISOString(),
        tenantId: tenantId
      }));
      
      // Set initial application status
      localStorage.setItem("application-status", "pending");
      localStorage.setItem("application-submitted", "true");
      
      // Add a short delay before redirecting to ensure database writes complete
      setTimeout(() => {
        // Redirect to dashboard after submission
        navigate("/tenant/dashboard");
      }, 1000);
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

  if (!user || existingApplication) {
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
