
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import DashboardLayout from "@/components/landlord/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Home, Users, FileText, FileCheck, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DashboardStats {
  totalProperties: number;
  activeApplications: number;
  activeLeases: number;
  pendingOffers: number;
}

const LandlordDashboard = () => {
  const { user, isLoading } = useAuth();
  const { role, setRole } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeApplications: 0,
    activeLeases: 0,
    pendingOffers: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [hasProperties, setHasProperties] = useState(false);

  useEffect(() => {
    // Ensure user has landlord role
    if (role !== "landlord" && user) {
      setRole("landlord");
    }
  }, [user, role, setRole]);

  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!user) return;
      
      try {
        console.log("Loading dashboard stats for user:", user.id);
        
        // Get the landlord's ID first
        const { data: landlordData, error: landlordError } = await supabase
          .from('landlords')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (landlordError) {
          if (landlordError.code === 'PGRST116') {
            // No landlord record found, create one
            const { data: newLandlord, error: createError } = await supabase
              .from('landlords')
              .insert({
                email: user.email || '',
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                user_id: user.id
              })
              .select('id')
              .single();
              
            if (createError) throw createError;
            
            // Set stats to zero for new users
            setStats({
              totalProperties: 0,
              activeApplications: 0,
              activeLeases: 0,
              pendingOffers: 0
            });
            setHasProperties(false);
            return;
          } else {
            console.error("Error fetching landlord data:", landlordError);
            throw landlordError;
          }
        }
        
        console.log("Landlord data:", landlordData);

        // Get properties count
        const { count: propertiesCount, error: propertiesError } = await supabase
          .from('properties')
          .select('id', { count: 'exact' })
          .eq('landlord_id', landlordData.id);
          
        if (propertiesError) {
          console.error("Error fetching properties count:", propertiesError);
          throw propertiesError;
        }

        setHasProperties(propertiesCount > 0);
        console.log("Properties count:", propertiesCount);

        // Get property IDs for this landlord
        const { data: propertiesData, error: propertiesDataError } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', landlordData.id);
          
        if (propertiesDataError) {
          console.error("Error fetching property IDs:", propertiesDataError);
          throw propertiesDataError;
        }
        
        const propertyIds = propertiesData ? propertiesData.map(prop => prop.id) : [];
        console.log("Property IDs:", propertyIds);

        let applicationsCount = 0;
        let leasesCount = 0;
        let pendingOffersCount = 0;

        // Only proceed if we have property IDs
        if (propertyIds.length > 0) {
          // Get active applications count
          const { count: appCount, error: applicationsError } = await supabase
            .from('tenant_applications')
            .select('id', { count: 'exact' })
            .in('property_id', propertyIds)
            .eq('status', 'pending');
            
          if (applicationsError) {
            console.error("Error fetching applications count:", applicationsError);
          } else {
            applicationsCount = appCount || 0;
          }
          console.log("Applications count:", applicationsCount);

          // Get active leases count
          const { count: leaseCount, error: leasesError } = await supabase
            .from('tenants')
            .select('id', { count: 'exact' })
            .in('property_id', propertyIds)
            .eq('is_active', true);
            
          if (leasesError) {
            console.error("Error fetching leases count:", leasesError);
          } else {
            leasesCount = leaseCount || 0;
          }
          console.log("Leases count:", leasesCount);
            
          // Get pending offers count
          const { count: offersCount, error: offersError } = await supabase
            .from('offers')
            .select('id', { count: 'exact' })
            .in('property_id', propertyIds)
            .eq('status', 'pending');
            
          if (offersError) {
            console.error("Error fetching offers count:", offersError);
          } else {
            pendingOffersCount = offersCount || 0;
          }
          console.log("Pending offers count:", pendingOffersCount);
        }

        setStats({
          totalProperties: propertiesCount || 0,
          activeApplications: applicationsCount,
          activeLeases: leasesCount,
          pendingOffers: pendingOffersCount
        });
      } catch (error: any) {
        console.error("Error in loadDashboardStats:", error);
        toast({
          variant: "destructive",
          title: "Error loading dashboard stats",
          description: error.message
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user) {
      loadDashboardStats();
    }
  }, [user, toast]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your properties, tenants, and rental payments all in one place.
          </p>
        </div>

        {!hasProperties && !isLoadingStats && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No properties found</AlertTitle>
            <AlertDescription>
              You haven't added any properties yet. Add your first property to start receiving applications.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : stats.totalProperties}
              </div>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8" 
                  onClick={() => navigate("/landlord/property/new")}
                >
                  Add Property
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : stats.activeApplications}
              </div>
              {!isLoadingStats && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-primary mt-2" 
                  onClick={() => navigate("/landlord/applications")}
                >
                  View all
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Leases
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : stats.activeLeases}
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Offers
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : stats.pendingOffers}
              </div>
              {!isLoadingStats && stats.pendingOffers > 0 && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-primary mt-2" 
                  onClick={() => navigate("/landlord/offers")}
                >
                  View all
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button onClick={() => navigate("/landlord/property/new")}>
                Add New Property
              </Button>
              <Button variant="outline" onClick={() => navigate("/landlord/applications")}>
                View Applications
              </Button>
              <Button variant="outline" onClick={() => navigate("/landlord/offers")}>
                Manage Offers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandlordDashboard;
