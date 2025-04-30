import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const TenantDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [tenantProfile, setTenantProfile] = useState<any>(null);
  
  // Use this state to track if we've shown the multiple applications toast
  const [hasShownMultipleAppsToast, setHasShownMultipleAppsToast] = useState(false);
  
  useEffect(() => {
    // Check if we've already shown the toast in this session
    const toastShown = sessionStorage.getItem('multipleAppsToastShown');
    if (toastShown) {
      setHasShownMultipleAppsToast(true);
    }
  }, []);

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Get tenant profile
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (tenantError) throw tenantError;
        
        if (tenant) {
          setTenantProfile(tenant);
          
          // Get tenant applications
          const { data: applications, error: appError } = await supabase
            .from('tenant_applications')
            .select(`
              id, 
              status, 
              created_at, 
              property_id,
              properties:property_id (
                address,
                city,
                rent_amount
              )
            `)
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });
            
          if (appError) throw appError;
          
          if (applications && applications.length > 0) {
            setApplications(applications);
            
            // Only show multiple applications toast if: 
            // 1. We have more than one application
            // 2. We haven't shown it already in this session
            if (applications.length > 1 && !hasShownMultipleAppsToast) {
              toast({
                title: "Multiple Applications",
                description: "You have multiple applications in our system. The most recent one is shown first.",
              });
              
              // Mark that we've shown the toast
              setHasShownMultipleAppsToast(true);
              sessionStorage.setItem('multipleAppsToastShown', 'true');
            }
          }
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Failed to load your tenant information",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTenantData();
  }, [user, toast, hasShownMultipleAppsToast]);

  // Placeholder for the dashboard UI content
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-primary mb-8">Tenant Dashboard</h1>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p>Loading your information...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Your tenant information</CardDescription>
              </CardHeader>
              <CardContent>
                {tenantProfile ? (
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {tenantProfile.first_name} {tenantProfile.last_name}</p>
                    <p><span className="font-medium">Email:</span> {tenantProfile.email}</p>
                    {tenantProfile.phone && (
                      <p><span className="font-medium">Phone:</span> {tenantProfile.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No tenant profile found.</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Your rental applications</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app, index) => (
                      <div key={app.id} className={`rounded-lg p-4 ${index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{app.properties?.address}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            app.status === 'approved' ? 'bg-green-100 text-green-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm">{app.properties?.city}</p>
                        {app.properties?.rent_amount && (
                          <p className="text-sm mt-1">Rent: R{app.properties.rent_amount}/month</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted on {new Date(app.created_at).toLocaleDateString()}
                        </p>
                        {index === 0 && <p className="text-xs text-primary mt-1">Most recent application</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No applications found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TenantDashboard;
