
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Clock, Award, Info } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
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

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  
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

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate("/auth");
      return;
    }

    // Fetch tenant information and application data
    const fetchTenantData = async () => {
      try {
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (tenantError && tenantError.code !== 'PGRST116') {
          console.error("Error fetching tenant:", tenantError);
          throw tenantError;
        }

        if (!tenant) {
          // No tenant record found, redirect to application
          navigate("/apply");
          return;
        }

        setTenantId(tenant.id);

        // Fetch application data
        const { data: application, error: applicationError } = await supabase
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
          .maybeSingle();

        if (applicationError && applicationError.code !== 'PGRST116') {
          console.error("Error fetching application:", applicationError);
          throw applicationError;
        }

        if (!application) {
          // No application found, redirect to apply
          navigate("/apply");
          return;
        }

        setApplicationData(application as ApplicationData);
      } catch (error: any) {
        console.error("Error fetching tenant data:", error);
        toast({
          variant: "destructive",
          title: "Error loading your information",
          description: error.message || "Please try again later"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();

    // Set up subscription for real-time updates to application status
    const setupSubscription = async () => {
      const channel = supabase
        .channel('tenant-application-updates')
        .on('postgres_changes', {
          event: 'UPDATE', 
          schema: 'public',
          table: 'tenant_applications',
          filter: `tenant_id=eq.${tenantId}`
        }, (payload) => {
          console.log('Application updated:', payload);
          
          // Update application data with the new status
          if (payload.new) {
            setApplicationData(prevData => {
              if (!prevData) return payload.new as ApplicationData;
              return { ...prevData, ...payload.new };
            });
            
            if (payload.new.status !== payload.old.status) {
              toast({
                title: "Application Status Updated",
                description: `Your application status has changed to ${payload.new.status}.`,
              });
            }
          }
        })
        .subscribe();

      // Clean up subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    };

    if (tenantId) {
      setupSubscription();
    }
  }, [navigate, toast, user, tenantId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/70">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If no application data, redirect to apply
  if (!applicationData) {
    navigate("/apply");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Tenant Dashboard</h1>
            <p className="text-white/70">Welcome back, {applicationData?.tenant_first_name || "Tenant"}</p>
          </div>

          {/* Application Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Application Status</h2>
              <div className="flex items-center mb-6">
                <div className={`px-3 py-1 rounded-full ${statusBadge.color} ${statusBadge.text} text-sm font-medium`}>
                  {statusBadge.label}
                </div>
                {applicationData.status === "under-review" && (
                  <div className="ml-4 flex items-center text-white/70">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">Est. completion: 24-48 hours</span>
                  </div>
                )}
              </div>

              {applicationData.status === "pending" && (
                <div className="mb-4 bg-white/5 rounded-lg p-4 text-white/70">
                  <div className="flex items-start">
                    <Info size={20} className="mr-2 flex-shrink-0 mt-1" />
                    <p>Your application has been received and will be reviewed shortly. We'll notify you of any updates.</p>
                  </div>
                </div>
              )}

              {applicationData.status === "under-review" && (
                <div className="mb-4 bg-white/5 rounded-lg p-4 text-white/70">
                  <div className="flex items-start">
                    <Info size={20} className="mr-2 flex-shrink-0 mt-1" />
                    <p>Our team is currently reviewing your application. We may contact you if additional information is needed.</p>
                  </div>
                </div>
              )}

              {applicationData.status === "approved" && (
                <div className="mb-4 bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                  <h3 className="text-emerald-300 font-medium mb-2">Congratulations! Your application is approved.</h3>
                  <p className="text-white/70">Doorways admin team will now generate an offer for you shortly.</p>
                </div>
              )}

              {applicationData.status === "pending_offer" && (
                <div className="mb-4 bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-purple-300 font-medium mb-2">Doorways is preparing your offer!</h3>
                  <p className="text-white/70">Our admin team is now preparing your personalized rent offer. You'll be notified when it's ready.</p>
                </div>
              )}

              {applicationData.status === "rejected" && (
                <div className="mb-4 bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <h3 className="text-red-300 font-medium mb-2">Your application was not approved at this time</h3>
                  <p className="text-white/70">We'd like to help you improve your chances of approval.</p>
                  <Button className="mt-4 bg-primary text-black hover:bg-primary/90">
                    Get Assistance
                  </Button>
                </div>
              )}

              {(applicationData.status === "under-review" || applicationData.status === "pending") && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-2">Application Timeline</h3>
                  <ol className="relative border-l border-white/20">
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 text-black text-xs">✓</span>
                      <h4 className="text-white font-medium">Application Submitted</h4>
                      <p className="text-sm text-white/50">{new Date(applicationData.created_at).toLocaleDateString()}</p>
                    </li>
                    <li className="mb-6 ml-6">
                      <span className={`absolute flex items-center justify-center w-6 h-6 ${applicationData.status === "under-review" ? "bg-primary" : "bg-white/20"} rounded-full -left-3 text-black text-xs`}>
                        {applicationData.status === "under-review" ? "✓" : "2"}
                      </span>
                      <h4 className={applicationData.status === "under-review" ? "text-white font-medium" : "text-white/50 font-medium"}>
                        Under Review
                      </h4>
                      {applicationData.status === "under-review" && (
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
              {applicationData && (
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
          {applicationData.status === "approved" || applicationData.status === "pending_offer" && (
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
          {applicationData.status !== "approved" && applicationData.status !== "pending_offer" && (
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
