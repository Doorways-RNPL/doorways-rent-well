
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/landlord/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Home, Users, FileText, FileCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalProperties: number;
  activeApplications: number;
  activeLeases: number;
  pendingOffers: number;
}

const LandlordDashboard = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeApplications: 0,
    activeLeases: 0,
    pendingOffers: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        // Get the landlord's ID first
        const { data: landlordData, error: landlordError } = await supabase
          .from('landlords')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (landlordError) throw landlordError;

        // Get properties count
        const { count: propertiesCount } = await supabase
          .from('properties')
          .select('id', { count: 'exact' })
          .eq('landlord_id', landlordData.id);

        // Get property IDs for this landlord
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', landlordData.id);
          
        const propertyIds = propertiesData ? propertiesData.map(prop => prop.id) : [];

        // Get active applications count - Using the propertyIds array
        const { count: applicationsCount } = await supabase
          .from('tenant_applications')
          .select('id', { count: 'exact' })
          .in('property_id', propertyIds)
          .eq('status', 'pending');

        // Get active leases count - Using the propertyIds array
        const { count: leasesCount } = await supabase
          .from('tenants')
          .select('id', { count: 'exact' })
          .in('property_id', propertyIds)
          .eq('is_active', true);
          
        // Get pending offers count
        const { count: pendingOffersCount } = await supabase
          .from('offers')
          .select('id', { count: 'exact' })
          .in('property_id', propertyIds)
          .eq('status', 'pending');

        setStats({
          totalProperties: propertiesCount || 0,
          activeApplications: applicationsCount || 0,
          activeLeases: leasesCount || 0,
          pendingOffers: pendingOffersCount || 0
        });
      } catch (error: any) {
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.totalProperties}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.activeApplications}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Leases
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.activeLeases}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Offers
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats.pendingOffers}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button onClick={() => window.location.href = "/landlord/property/new"}>
                Add New Property
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/landlord/applications"}>
                View Applications
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/landlord/offers"}>
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
