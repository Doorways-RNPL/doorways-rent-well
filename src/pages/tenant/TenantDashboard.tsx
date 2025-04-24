
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Clock, Award, Info } from "lucide-react";

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applicationStatus, setApplicationStatus] = useState<string>("pending");
  const [applicationData, setApplicationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate automatic progress of application for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (applicationStatus === "pending") {
        setApplicationStatus("under-review");
        localStorage.setItem("application-status", "under-review");
        
        toast({
          title: "Application Update",
          description: "Your application is now under review by our team.",
        });
        
        // After another delay, change to approved
        setTimeout(() => {
          setApplicationStatus("approved");
          localStorage.setItem("application-status", "approved");
          
          toast({
            title: "Congratulations!",
            description: "Your RNPL application has been approved!",
            variant: "default",
          });
        }, 30000); // 30 seconds for demo
      }
    }, 10000); // 10 seconds for demo
    
    return () => clearTimeout(timer);
  }, [applicationStatus, toast]);

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("tenant-email");
    const storedStatus = localStorage.getItem("application-status");
    const storedData = localStorage.getItem("tenant-application");
    
    if (!email) {
      navigate("/apply");
      return;
    }
    
    if (storedStatus) {
      setApplicationStatus(storedStatus);
    }
    
    if (storedData) {
      setApplicationData(JSON.parse(storedData));
    }
    
    setLoading(false);
  }, [navigate]);

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

  // Get status badge styling
  const getStatusBadge = () => {
    switch (applicationStatus) {
      case "pending":
        return { 
          color: "bg-amber-500/20", 
          text: "text-amber-300",
          label: "Application Pending" 
        };
      case "under-review":
        return { 
          color: "bg-blue-500/20", 
          text: "text-blue-300",
          label: "Under Review" 
        };
      case "approved":
        return { 
          color: "bg-emerald-500/20", 
          text: "text-emerald-300",
          label: "Approved" 
        };
      case "rejected":
        return { 
          color: "bg-red-500/20", 
          text: "text-red-300",
          label: "Not Approved" 
        };
      default:
        return { 
          color: "bg-gray-500/20", 
          text: "text-gray-300",
          label: "Unknown" 
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Tenant Dashboard</h1>
            <p className="text-white/70">Welcome back, {applicationData?.firstName || "Tenant"}</p>
          </div>

          {/* Application Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Application Status</h2>
              <div className="flex items-center mb-6">
                <div className={`px-3 py-1 rounded-full ${statusBadge.color} ${statusBadge.text} text-sm font-medium`}>
                  {statusBadge.label}
                </div>
                {applicationStatus === "under-review" && (
                  <div className="ml-4 flex items-center text-white/70">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">Est. completion: 24-48 hours</span>
                  </div>
                )}
              </div>

              {applicationStatus === "pending" && (
                <div className="mb-4 bg-white/5 rounded-lg p-4 text-white/70">
                  <div className="flex items-start">
                    <Info size={20} className="mr-2 flex-shrink-0 mt-1" />
                    <p>Your application has been received and will be reviewed shortly. We'll notify you of any updates.</p>
                  </div>
                </div>
              )}

              {applicationStatus === "under-review" && (
                <div className="mb-4 bg-white/5 rounded-lg p-4 text-white/70">
                  <div className="flex items-start">
                    <Info size={20} className="mr-2 flex-shrink-0 mt-1" />
                    <p>Our team is currently reviewing your application. We may contact you if additional information is needed.</p>
                  </div>
                </div>
              )}

              {applicationStatus === "approved" && (
                <div className="mb-4 bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                  <h3 className="text-emerald-300 font-medium mb-2">Congratulations! Your application is approved.</h3>
                  <p className="text-white/70">Your first payment is due on {new Date().toLocaleDateString()}</p>
                  <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                    Set Up Auto-Payments
                  </Button>
                </div>
              )}

              {applicationStatus === "rejected" && (
                <div className="mb-4 bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <h3 className="text-red-300 font-medium mb-2">Your application was not approved at this time</h3>
                  <p className="text-white/70">We'd like to help you improve your chances of approval.</p>
                  <Button className="mt-4 bg-primary text-black hover:bg-primary/90">
                    Get Assistance
                  </Button>
                </div>
              )}

              {(applicationStatus === "under-review" || applicationStatus === "pending") && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-2">Application Timeline</h3>
                  <ol className="relative border-l border-white/20">
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 text-black text-xs">✓</span>
                      <h4 className="text-white font-medium">Application Submitted</h4>
                      <p className="text-sm text-white/50">{new Date().toLocaleDateString()}</p>
                    </li>
                    <li className="mb-6 ml-6">
                      <span className={`absolute flex items-center justify-center w-6 h-6 ${applicationStatus === "under-review" ? "bg-primary" : "bg-white/20"} rounded-full -left-3 text-black text-xs`}>
                        {applicationStatus === "under-review" ? "✓" : "2"}
                      </span>
                      <h4 className={applicationStatus === "under-review" ? "text-white font-medium" : "text-white/50 font-medium"}>
                        Under Review
                      </h4>
                      {applicationStatus === "under-review" && (
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
                  <p className="text-white font-medium">{applicationData.propertyAddress}</p>
                  <p>{applicationData.propertyCity}, {applicationData.propertyState} {applicationData.propertyZip}</p>
                  <div className="pt-2">
                    <p className="text-sm text-white/50">Monthly Rent</p>
                    <p className="text-xl font-semibold text-white">${applicationData.monthlyRent}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-white/50">Lease Start Date</p>
                    <p>{applicationData.leaseStartDate}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-white/50">Landlord</p>
                    <p>{applicationData.landlordName}</p>
                    <p className="text-sm">{applicationData.landlordEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rewards Section */}
          {applicationStatus === "approved" && (
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
          {applicationStatus !== "approved" && (
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
