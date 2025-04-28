
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/landlord/DashboardLayout";
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
import { Loader2 } from "lucide-react";

interface Application {
  id: string;
  tenant_first_name: string;
  tenant_last_name: string;
  tenant_email: string;
  status: string;
  created_at: string;
  property: {
    id: string;
    address: string;
    city: string;
  };
}

const LandlordApplications = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Get the landlord's ID first
        const { data: landlordData, error: landlordError } = await supabase
          .from('landlords')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (landlordError) throw landlordError;

        // Get property IDs for this landlord
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', landlordData.id);
          
        const propertyIds = propertiesData ? propertiesData.map(prop => prop.id) : [];

        // Get applications for those properties
        const { data, error } = await supabase
          .from('tenant_applications')
          .select(`
            *,
            property:property_id (
              id, 
              address, 
              city
            )
          `)
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setApplications(data as Application[]);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error loading applications",
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user, toast]);

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
        title: "Application marked for offer generation",
        description: "The Doorways team has been notified to generate an offer."
      });

      // Update the application in the local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'pending_offer' } 
          : app
      ));
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground">
            Manage tenant applications and mark approved applications for offer generation.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No applications found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Status</TableHead>
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
                          {renderStatusBadge(application.status)}
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {application.status === 'approved' && (
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
                          )}
                          {application.status === 'pending_offer' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.location.href = `/landlord/offers/${application.id}`}
                            >
                              View Offer Process
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LandlordApplications;
