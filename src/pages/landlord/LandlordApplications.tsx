
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
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
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RealtimeChannel } from "@supabase/supabase-js";

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
  };
}

// Define the payload type for realtime updates with proper typing
interface RealtimePayload {
  new: Application;
  old: Application;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  commit_timestamp: string;
  errors: null | unknown;
}

const LandlordApplications = () => {
  const { user, isLoading } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [landlordId, setLandlordId] = useState<string | null>(null);
  const [hasProperties, setHasProperties] = useState(false);
  const [landlordName, setLandlordName] = useState<string>("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching applications for user:", user.id);
        
        // Get the landlord's ID first
        const { data: landlordData, error: landlordError } = await supabase
          .from('landlords')
          .select('id, first_name, last_name')
          .eq('user_id', user.id)
          .single();

        if (landlordError) {
          console.error("Error fetching landlord data:", landlordError);
          throw landlordError;
        }
        
        setLandlordId(landlordData.id);
        setLandlordName(`${landlordData.first_name} ${landlordData.last_name}`);
        console.log("Landlord data:", landlordData);

        // Get property IDs for this landlord
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', landlordData.id);
          
        if (propertiesError) {
          console.error("Error fetching properties:", propertiesError);
          throw propertiesError;
        }
        
        const propertyIds = propertiesData ? propertiesData.map(prop => prop.id) : [];
        setHasProperties(propertyIds.length > 0);
        console.log("Property IDs:", propertyIds);
        
        // Early return if no properties
        if (propertyIds.length === 0) {
          console.log("No properties found for this landlord");
          setApplications([]);
          setLoading(false);
          return;
        }

        // Get applications for those properties
        const { data, error } = await supabase
          .from('tenant_applications')
          .select(`
            *,
            property:property_id (
              id, 
              address, 
              city,
              rent_amount
            )
          `)
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching applications:", error);
          throw error;
        }
        
        console.log("Applications found:", data);
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

    if (user) {
      fetchApplications();
      
      // Setup realtime subscription for application updates
      let channel: RealtimeChannel | null = null;
      
      try {
        channel = supabase
          .channel('landlord-application-updates')
          .on('postgres_changes', 
            {
              event: '*', 
              schema: 'public', 
              table: 'tenant_applications'
            }, 
            (payload) => {
              console.log('Application change detected:', payload);
              
              // Type assertion to properly handle the payload
              const typedPayload = payload as unknown as RealtimePayload;
              
              if (typedPayload.new && applications.some(app => app.id === typedPayload.new.id)) {
                // Update the local state with the new data
                setApplications(prevApps => 
                  prevApps.map(app => 
                    app.id === typedPayload.new.id ? { ...app, ...typedPayload.new } : app
                  )
                );
                
                // Show toast notification
                toast({
                  title: "Application Updated",
                  description: `Application status is now ${typedPayload.new.status}`,
                });
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error("Error setting up realtime subscription:", error);
      }
        
      return () => {
        // Properly clean up the channel when component unmounts
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [user, toast]);

  const sendAdminNotification = async (application: Application, newStatus: string) => {
    try {
      // Send notification to admin
      const notificationPayload = {
        applicationId: application.id,
        propertyAddress: `${application.property.address}, ${application.property.city}`,
        tenantName: `${application.tenant_first_name} ${application.tenant_last_name}`,
        landlordName: landlordName,
        status: newStatus,
        notificationType: 'application_status_change'
      };
      
      console.log("Sending admin notification with payload:", notificationPayload);
      
      const notificationResponse = await supabase.functions.invoke('send-admin-notification', {
        body: notificationPayload
      });
      
      console.log("Admin notification response:", notificationResponse);
      
      if (notificationResponse.error) {
        console.warn("Notification failed but continuing process:", notificationResponse.error);
      } else {
        console.log("Admin notification sent successfully for application:", application.id);
      }
    } catch (error) {
      console.error("Error sending admin notification:", error);
      // Don't block the main flow if notification fails
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setProcessingId(applicationId);
    
    try {
      // Find the application
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        throw new Error("Application not found");
      }
      
      console.log("Attempting to change application status", {
        applicationId,
        currentStatus: application.status,
        newStatus,
      });
      
      // First verify the current status in the database
      const { data: currentAppData, error: checkError } = await supabase
        .from('tenant_applications')
        .select('status')
        .eq('id', applicationId)
        .single();
        
      if (checkError) {
        console.error("Error checking current application status:", checkError);
        throw checkError;
      }
      
      console.log("Current application status in DB:", currentAppData);
      
      // Update application status - use transaction-like approach for better reliability
      console.log("Sending update to database...");
      const updateTimestamp = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('tenant_applications')
        .update({ 
          status: newStatus,
          processed_at: updateTimestamp
        })
        .eq('id', applicationId)
        .select();

      if (error) {
        console.error("Error updating application status:", error);
        throw error;
      }
      
      console.log("Application status updated successfully:", data);

      // Update the application in the local state first for immediate feedback
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus } 
          : app
      ));

      // Verify the update was successful by fetching the latest data
      const { data: verifyData, error: verifyError } = await supabase
        .from('tenant_applications')
        .select('id, status, processed_at')
        .eq('id', applicationId)
        .single();
        
      if (verifyError) {
        console.error("Error verifying update:", verifyError);
        // Don't throw here, as the update might have succeeded
        toast({
          variant: "default",
          title: "Update verification issue",
          description: "The status was updated but verification failed. The admin should still receive the notification."
        });
      } else {
        console.log("✅ Verification of status update successful:", verifyData);
        
        if (verifyData.status !== newStatus) {
          console.error("⚠️ Status mismatch after update! Expected:", newStatus, "Got:", verifyData.status);
          toast({
            variant: "destructive",
            title: "Status update inconsistency",
            description: "The application status may not have updated properly. Please try again."
          });
          return;
        }
      }

      // Now that we've confirmed the DB update, send the admin notification
      await sendAdminNotification(application, newStatus);

      // Show appropriate toast based on the status
      if (newStatus === 'approved') {
        toast({
          title: "Application approved",
          description: "The Doorways admin team has been notified and will generate an offer shortly."
        });
      } else if (newStatus === 'rejected') {
        toast({
          title: "Application rejected",
          description: "The tenant will be notified."
        });
      }
      
    } catch (error: any) {
      console.error("Error processing application:", error);
      toast({
        variant: "destructive",
        title: "Error processing application",
        description: error.message || "Failed to update application status."
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

  // Calculate whether an applicant passes the income check (3x rent amount)
  const passesIncomeCheck = (application: Application) => {
    if (!application.monthly_income || !application.property.rent_amount) return false;
    return application.monthly_income >= application.property.rent_amount * 3;
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
            Review tenant applications for your properties.
          </p>
        </div>

        {!hasProperties && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No properties found</AlertTitle>
            <AlertDescription>
              You need to add properties before you can receive applications.
            </AlertDescription>
          </Alert>
        )}

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
                No applications found. This could be because:
                <ul className="list-disc list-inside mt-2 text-left max-w-md mx-auto">
                  <li>You don't have any properties yet</li>
                  <li>No tenants have applied to your properties</li>
                </ul>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Income Check</TableHead>
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
                          <div className="text-xs text-muted-foreground">
                            ${application.property.rent_amount}/month
                          </div>
                        </TableCell>
                        <TableCell>
                          {application.monthly_income ? (
                            passesIncomeCheck(application) ? (
                              <Badge variant="outline" className="bg-green-500/20 text-green-500">
                                Passes
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-500/20 text-red-500">
                                Fails
                              </Badge>
                            )
                          ) : (
                            <span className="text-muted-foreground text-xs">No data</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(application.status)}
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {application.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleStatusChange(application.id, 'approved')}
                                disabled={processingId === application.id}
                              >
                                {processingId === application.id ? (
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                ) : 'Approve'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500/10"
                                onClick={() => handleStatusChange(application.id, 'rejected')}
                                disabled={processingId === application.id}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {application.status === 'approved' && (
                            <div className="flex items-center">
                              <Badge variant="outline" className="bg-purple-500/20 text-purple-300">
                                Awaiting Admin Offer
                              </Badge>
                            </div>
                          )}
                          {application.status === 'pending_offer' && (
                            <div className="flex items-center">
                              <Badge variant="outline" className="bg-purple-500/20 text-purple-300">
                                Offer Being Generated
                              </Badge>
                            </div>
                          )}
                          {application.status === 'rejected' && (
                            <span className="text-muted-foreground text-xs">Rejected</span>
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
