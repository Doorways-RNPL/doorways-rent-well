
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Application {
  id: string;
  tenant_first_name: string;
  tenant_last_name: string;
  tenant_email: string;
  status: string;
  created_at: string;
  monthly_income: number | null;
  property: {
    id: string;
    address: string;
    city: string;
    rent_amount: number | null;
    landlord_id: string;
  };
}

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const { role, setRole } = useUserRole();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!user && !isLoading) {
      return;
    }

    // Setup role as admin for demo purposes
    const setupAdminRole = async () => {
      if (role !== "admin" && user) {
        try {
          await setRole("admin");
        } catch (error) {
          console.error("Error setting admin role:", error);
        }
      }
    };

    setupAdminRole();
  }, [user, isLoading, role, setRole]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      
      try {
        // Fetch all approved applications that need offer generation
        const { data, error } = await supabase
          .from('tenant_applications')
          .select(`
            *,
            property:property_id (
              id, 
              address, 
              city,
              rent_amount,
              landlord_id
            )
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching applications:", error);
          throw error;
        }
        
        console.log("Applications that need offers:", data);
        setApplications(data as Application[]);
      } catch (error: any) {
        console.error("Error in fetchApplications:", error);
        toast({
          variant: "destructive",
          title: "Error loading applications",
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && role === "admin") {
      fetchApplications();
    }
  }, [user, toast, role]);

  const markForOfferGeneration = async (applicationId: string) => {
    setProcessingId(applicationId);
    
    try {
      // Update application status to pending_offer
      const { error } = await supabase
        .from('tenant_applications')
        .update({ status: 'pending_offer' })
        .eq('id', applicationId);

      if (error) throw error;

      // Find the application to get property details
      const application = applications.find(app => app.id === applicationId);
      
      if (!application) throw new Error("Application not found");

      // Create an initial offer record
      const { error: offerError } = await supabase
        .from('offers')
        .insert({
          tenant_application_id: applicationId,
          property_id: application.property.id,
          status: 'pending'
        });

      if (offerError) throw offerError;

      toast({
        title: "Offer generation started",
        description: "The offer for this application is being generated."
      });

      // Update the application in the local state
      setApplications(prev => prev.filter(app => app.id !== applicationId));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error processing application",
        description: error.message
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case 'under-review':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Under Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">Rejected</Badge>;
      case 'pending_offer':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-500">Pending Offer</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role !== "admin" && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage tenant applications and generate offers.
            </p>
          </div>

          <Tabs defaultValue="pending-offers">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending-offers">Pending Offers</TabsTrigger>
              <TabsTrigger value="all-applications">All Applications</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>

            <TabsContent value="pending-offers">
              <Card>
                <CardHeader>
                  <CardTitle>Applications Needing Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No applications currently need offers generated. All approved applications have been processed.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Monthly Rent</TableHead>
                            <TableHead>Application Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.map((application) => (
                            <TableRow key={application.id}>
                              <TableCell>
                                {application.tenant_first_name} {application.tenant_last_name}
                              </TableCell>
                              <TableCell>{application.tenant_email}</TableCell>
                              <TableCell>
                                {application.property.address}, {application.property.city}
                              </TableCell>
                              <TableCell>
                                ${application.property.rent_amount}/month
                              </TableCell>
                              <TableCell>
                                {new Date(application.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  onClick={() => markForOfferGeneration(application.id)}
                                  disabled={processingId === application.id}
                                >
                                  {processingId === application.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Processing
                                    </>
                                  ) : (
                                    'Generate Offer'
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all-applications">
              <Card>
                <CardHeader>
                  <CardTitle>All Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    This section would display all applications in the system.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle>Property Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    This section would allow administrators to manage all properties in the system.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
