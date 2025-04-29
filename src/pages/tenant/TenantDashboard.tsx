import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Clock, Award, Info } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationData {
  id: string;
  status: string;
  property_id: string;
  tenant_first_name: string;
  tenant_last_name: string;
  property?: {
    address: string;
    city: string;
    rent_amount: number;
  };
  additional_info?: {
    lease_start_date?: string;
    lease_duration?: string;
  };
  created_at: string;
  processed_at?: string;
}

interface LocalApplicationData {
  id?: string;
  firstName: string;
  lastName: string;
  propertyId?: string;
  propertyAddress: string;
  propertyCity: string;
  monthlyRent: string;
  status: string;
  createdAt: string;
  tenantId?: string;
}

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const { role, setRole, isLoadingRole } = useUserRole();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isTenant, setIsTenant] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecentlySubmitted, setIsRecentlySubmitted] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasLocalApplication, setHasLocalApplication] = useState(false);
  const [hasMultipleApplications, setHasMultipleApplications] = useState(false);
  
  // Handle rewards tier calculation
  const calculateRewardsTier = () => {
    // Demo implementation - would be based on payment history
    return {
      currentTier: "Bronze",
      nextTier: "Silver",
      progressPercentage: 65,
    };
  };

  const { currentTier, nextTier, progressPercentage } = calculateRewardsTier();

  // Check for recently submitted application
  useEffect(() => {
    const appSubmitted = localStorage.getItem("application-submitted");
    if (appSubmitted === "true") {
      setIsRecentlySubmitted(true);
      // Clear the flag after checking
      localStorage.removeItem("application-submitted");
    }

    // Check if there's application data in localStorage
    const localAppData = localStorage.getItem("tenant-application");
    if (localAppData) {
      try {
        const parsedData = JSON.parse(localAppData);
        if (parsedData && parsedData.propertyAddress) {
          setHasLocalApplication(true);
        }
      } catch (error) {
        console.error("Error parsing local application data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Wait for authentication and role to load
      if (authLoading || isLoadingRole) {
        return;
      }

      console.log("Auth state:", { user, role, authLoading, isLoadingRole });

      // Check if user is logged in
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to access your dashboard",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // If role is not set as tenant yet, check if we should set it
      if (role !== "tenant") {
        try {
          // Check if user has a tenant record
          const { data: tenant, error: tenantCheckError } = await supabase
            .from('tenants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          // If tenant record exists but role isn't set, set it
          if (tenant) {
            console.log("Found tenant record but role not set, setting now");
            await setRole("tenant");
          } else {
            console.log("No tenant record found, redirecting to role selection");
            navigate("/auth");
            return;
          }
        } catch (error) {
          console.error("Error checking tenant records:", error);
        }
      }
      
      setIsTenant(true);

      // Fetch tenant information and application data
      try {
        console.log("Fetching tenant data for user:", user.id);
        
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (tenantError) {
          console.error("Error fetching tenant:", tenantError);
          setError(`Error fetching tenant: ${tenantError.message}`);
          setLoading(false);
          return;
        }

        if (!tenant) {
          // If no tenant record is found but we have local application data,
          // the user may have just submitted an application
          if (isRecentlySubmitted && hasLocalApplication) {
            console.log("Application recently submitted, showing pending application view");
            setLoading(false);
            
            // Use the local application data as a fallback
            const localApp = JSON.parse(localStorage.getItem("tenant-application") || "{}");
            if (localApp && localApp.propertyAddress) {
              const tempAppData: ApplicationData = {
                id: localApp.id || "pending",
                status: "pending",
                property_id: localApp.propertyId || "",
                tenant_first_name: localApp.firstName || "",
                tenant_last_name: localApp.lastName || "",
                property: {
                  address: localApp.propertyAddress || "",
                  city: localApp.propertyCity || "",
                  rent_amount: parseFloat(localApp.monthlyRent) || 0
                },
                created_at: localApp.createdAt || new Date().toISOString()
              };
              setApplicationData(tempAppData);
              return;
            }
          }
          
          console.log("No tenant record found, redirecting to application");
          navigate("/apply");
          return;
        }

        console.log("Tenant record found:", tenant);
        setTenantId(tenant.id);

        // Fetch application data - Get the most recent application instead of using maybeSingle
        const { data: applications, error: applicationError, count } = await supabase
          .from('tenant_applications')
          .select(`
            *,
            property:property_id (
              address,
              city,
              rent_amount
            )
          `)
          .eq('tenant_id', tenant.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (applicationError) {
          console.error("Error fetching application:", applicationError);
          setError(`Error fetching application: ${applicationError.message}`);
          setLoading(false);
          
          // If this is a recent submission and we have retries left, try again
          if (isRecentlySubmitted && retryCount < 3) {
            console.log(`Retrying application fetch, attempt ${retryCount + 1}/3`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 1500);
            return;
          }
          
          // If we're out of retries but have local data, use it as fallback
          if (hasLocalApplication) {
            const localApp = JSON.parse(localStorage.getItem("tenant-application") || "{}");
            if (localApp && localApp.propertyAddress) {
              const tempAppData: ApplicationData = {
                id: localApp.id || "pending",
                status: "pending",
                property_id: localApp.propertyId || "",
                tenant_first_name: localApp.firstName || "",
                tenant_last_name: localApp.lastName || "",
                property: {
                  address: localApp.propertyAddress || "",
                  city: localApp.propertyCity || "",
                  rent_amount: parseFloat(localApp.monthlyRent) || 0
                },
                created_at: localApp.createdAt || new Date().toISOString()
              };
              setApplicationData(tempAppData);
            }
          }
          
          return;
        }

        // Check how many applications this tenant has
        const { count: totalApplications } = await supabase
          .from('tenant_applications')
          .select('id', { count: 'exact' })
          .eq('tenant_id', tenant.id);
        
        if (totalApplications !== undefined && totalApplications > 1) {
          console.log(`Found ${totalApplications} applications for this tenant`);
          setHasMultipleApplications(true);
          toast({
            title: "Multiple applications found",
            description: "Showing your most recent application.",
            duration: 5000,
          });
        }

        if (!applications || applications.length === 0) {
          // Check if we have a local application that hasn't been found yet
          if (isRecentlySubmitted && hasLocalApplication && retryCount < 3) {
            console.log("Recently submitted application not found in database, retrying...");
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 1500);
            return;
          }
          
          // Use local application data as fallback if available
          if (hasLocalApplication) {
            console.log("Using local application data as fallback");
            const localApp = JSON.parse(localStorage.getItem("tenant-application") || "{}");
            if (localApp && localApp.propertyAddress) {
              const tempAppData: ApplicationData = {
                id: localApp.id || "pending",
                status: "pending",
                property_id: localApp.propertyId || "",
                tenant_first_name: localApp.firstName || "",
                tenant_last_name: localApp.lastName || "",
                property: {
                  address: localApp.propertyAddress || "",
                  city: localApp.propertyCity || "",
                  rent_amount: parseFloat(localApp.monthlyRent) || 0
                },
                created_at: localApp.createdAt || new Date().toISOString()
              };
              setApplicationData(tempAppData);
            } else {
              console.log("No application found, redirecting to apply");
              navigate("/tenant/application");
            }
          } else {
            console.log("No application found, redirecting to apply");
            navigate("/tenant/application");
          }
          return;
        }

        console.log("Application data retrieved:", applications[0]);
        setApplicationData(applications[0] as ApplicationData);
      } catch (error: any) {
        console.error("Error fetching tenant data:", error);
        setError(`Error loading tenant data: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Error loading your information",
          description: error.message || "Please try again later"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up subscription for real-time updates to application status
    const setupSubscription = () => {
      if (!tenantId) return null;

      console.log("Setting up real-time subscription for tenant:", tenantId);
      const channel = supabase
        .channel('tenant-application-updates')
        .on('postgres_changes', {
          event: 'UPDATE', 
          schema: 'public',
          table: 'tenant_applications',
          filter: `tenant_id=eq.${tenantId}`
        }, (payload) => {
          console.log('Application updated:', payload);
          
          // Since we now might have multiple applications, make sure we're
          // updating the correct one by checking the ID
          if (payload.new && applicationData && payload.new.id === applicationData.id) {
            setApplicationData(prevData => {
              if (!prevData) return payload.new as ApplicationData;
              return { ...prevData, ...payload.new };
            });
            
            if (payload.new.status !== payload.old.status) {
              toast({
                title: "Application Status Updated",
                description: `Your application status has changed to ${payload.new.status}.`,
              });
              
              // Update localStorage status
              const localApp = localStorage.getItem("tenant-application");
              if (localApp) {
                try {
                  const parsedApp = JSON.parse(localApp);
                  parsedApp.status = payload.new.status;
                  localStorage.setItem("tenant-application", JSON.stringify(parsedApp));
                  localStorage.setItem("application-status", payload.new.status);
                } catch (error) {
                  console.error("Error updating local storage:", error);
                }
              }
            }
          }
        })
        .subscribe();

      // Return unsubscribe function
      return () => {
        supabase.removeChannel(channel);
      };
    };

    const unsubscribe = tenantId ? setupSubscription() : null;
    
    // Clean up subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate, toast, user, tenantId, authLoading, isLoadingRole, role, setRole, retryCount, isRecentlySubmitted, hasLocalApplication, applicationData]);

  // Get status badge styling
  const getStatusBadge = () => {
    if (!applicationData) return { 
      color: "bg-gray-500/20", 
      text: "text-gray-300",
      label: "Unknown" 
    };
    
    switch (applicationData.status) {
      case 'pending':
        return { 
          color: "bg-amber-500/20", 
          text: "text-amber-300",
          label: "Application Pending" 
        };
      case 'under-review':
        return { 
          color: "bg-blue-500/20", 
          text: "text-blue-300",
          label: "Under Review" 
        };
      case 'approved':
        return { 
          color: "bg-emerald-500/20", 
          text: "text-emerald-300",
          label: "Approved" 
        };
      case 'rejected':
        return { 
          color: "bg-red-500/20", 
          text: "text-red-300",
          label: "Not Approved" 
        };
      case 'pending_offer':
        return {
          color: "bg-purple-500/20",
          text: "text-purple-300",
          label: "Offer Pending"
        };
      default:
        return { 
          color: "bg-gray-500/20", 
          text: "text-gray-300",
          label: applicationData.status || "Unknown" 
        };
    }
  };

  const statusBadge = getStatusBadge();

  const handleStartApplication = () => {
    // Direct users straight to the application page when they're already authenticated
    navigate("/tenant/application");
  };

  if (authLoading || isLoadingRole || (loading && isTenant && !isRecentlySubmitted)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/70">Loading your dashboard...</p>
            {error && <p className="text-red-400 mt-2">Debug info: {error}</p>}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // User is logged in but doesn't have a tenant application yet
  if (isTenant && !applicationData && !loading && !hasLocalApplication) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Tenant Dashboard</h1>
            <p className="text-white/70 mb-8">You haven't submitted an application yet.</p>
            <Button 
              onClick={handleStartApplication} 
              className="bg-primary text-black hover:bg-primary/90"
            >
              Start Your Application
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Tenant Dashboard</h1>
            <p className="text-white/70">Welcome back, {applicationData?.tenant_first_name || "Tenant"}</p>
            {hasMultipleApplications && (
              <div className="mt-2 text-sm text-amber-400 bg-amber-400/10 p-2 rounded-md inline-block">
                <Info size={14} className="inline mr-1" /> You have multiple applications in our system. Showing your most recent one.
              </div>
            )}
          </div>

          {/* Debug info during development */}
          {error && <div className="bg-red-500/20 p-4 mb-6 rounded-lg text-white">{error}</div>}
          
          {isRecentlySubmitted && (
            <div className="bg-green-500/20 p-4 mb-6 rounded-lg text-white flex items-start">
              <Info size={20} className="mr-2 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold">Application successfully submitted!</p>
                <p>Your application is now being processed. You'll see updates here as it progresses.</p>
              </div>
            </div>
          )}

          {/* Application Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Application Status</h2>
              <div className="flex items-center mb-6">
                <div className={`px-3 py-1 rounded-full ${statusBadge.color} ${statusBadge.text} text-sm font-medium`}>
                  {statusBadge.label}
                </div>
                {applicationData?.status === "under-review" && (
                  <div className="ml-4 flex items-center text-white/70">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">Est. completion: 24-48 hours</span>
                  </div>
                )}
              </div>

              {/* Status-specific content */}
              {applicationData?.status === "pending" && (
                <div className="mb-4 bg-white/5 rounded-lg p-4 text-white/70">
                  <div className="flex items-start">
                    <Info size={20} className="mr-2 flex-shrink-0 mt-1" />
                    <p>Your application has been received and will be reviewed shortly. We'll notify you of any updates.</p>
                  </div>
                </div>
              )}

              {applicationData?.status === "under-review" && (
                <div className="mb-4 bg-white/5 rounded-lg p-4 text-white/70">
                  <div className="flex items-start">
                    <Info size={20} className="mr-2 flex-shrink-0 mt-1" />
                    <p>Our team is currently reviewing your application. We may contact you if additional information is needed.</p>
                  </div>
                </div>
              )}

              {applicationData?.status === "approved" && (
                <div className="mb-4 bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                  <h3 className="text-emerald-300 font-medium mb-2">Congratulations! Your application is approved.</h3>
                  <p className="text-white/70">Doorways admin team will now generate an offer for you shortly.</p>
                </div>
              )}

              {applicationData?.status === "pending_offer" && (
                <div className="mb-4 bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-purple-300 font-medium mb-2">Doorways is preparing your offer!</h3>
                  <p className="text-white/70">Our admin team is now preparing your personalized rent offer. You'll be notified when it's ready.</p>
                </div>
              )}

              {applicationData?.status === "rejected" && (
                <div className="mb-4 bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <h3 className="text-red-300 font-medium mb-2">Your application was not approved at this time</h3>
                  <p className="text-white/70">We'd like to help you improve your chances of approval.</p>
                  <Button className="mt-4 bg-primary text-black hover:bg-primary/90">
                    Get Assistance
                  </Button>
                </div>
              )}

              {(applicationData?.status === "under-review" || applicationData?.status === "pending") && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-2">Application Timeline</h3>
                  <ol className="relative border-l border-white/20">
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 text-black text-xs">✓</span>
                      <h4 className="text-white font-medium">Application Submitted</h4>
                      <p className="text-sm text-white/50">{applicationData ? new Date(applicationData.created_at).toLocaleDateString() : "N/A"}</p>
                    </li>
                    <li className="mb-6 ml-6">
                      <span className={`absolute flex items-center justify-center w-6 h-6 ${applicationData?.status === "under-review" ? "bg-primary" : "bg-white/20"} rounded-full -left-3 text-black text-xs`}>
                        {applicationData?.status === "under-review" ? "✓" : "2"}
                      </span>
                      <h4 className={applicationData?.status === "under-review" ? "text-white font-medium" : "text-white/50 font-medium"}>
                        Under Review
                      </h4>
                      {applicationData?.status === "under-review" && (
                        <p className="text-sm text-white/50">Started {new Date().toLocaleDateString()}</p>
                      )}
                    </li>
                    <li className="ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-white/20 rounded-full -left-3 text-black text-xs">3</span>
                      <h4 className="text-white/50 font-medium">Final Decision</h4>
                    </li>
                  </ol>
                </div>
              )}
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Property Details</h2>
              {applicationData && applicationData.property && (
                <div className="space-y-3 text-white/70">
                  <p className="text-white font-medium">{applicationData.property?.address || "Property Address"}</p>
                  <p>{applicationData.property?.city || "City"}</p>
                  <div className="pt-2">
                    <p className="text-sm text-white/50">Monthly Rent</p>
                    <p className="text-xl font-semibold text-white">${applicationData.property?.rent_amount}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-white/50">Application Date</p>
                    <p>{new Date(applicationData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rewards Section */}
          {(applicationData?.status === "approved" || applicationData?.status === "pending_offer") && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <Award size={24} className="text-primary mr-2" />
                <h2 className="text-xl font-semibold text-primary">Rewards Progress</h2>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Current tier: <span className="font-semibold text-white">{currentTier}</span></span>
                    <span className="text-white/70">Next tier: <span className="font-semibold text-white">{nextTier}</span></span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-white/50 mt-2">Make 3 more on-time payments to reach {nextTier}</p>
                </div>
                <div className="md:w-1/3 bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Tier Benefits</h3>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li>• Reduced security deposit</li>
                    <li>• Priority rental applications</li>
                    <li>• Exclusive rental listings</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* If application is not yet approved, show tips */}
          {applicationData?.status !== "approved" && applicationData?.status !== "pending_offer" && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Tips to Speed Up Approval</h2>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-black mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Ensure all uploaded documents are clear and legible
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-black mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Double-check your contact information is accurate
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-black mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Verify your income information is complete
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-black mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Provide additional references if possible
                </li>
              </ul>
              <Button className="mt-6" variant="outline">Contact Support</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantDashboard;
