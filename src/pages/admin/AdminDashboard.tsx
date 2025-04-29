
import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { 
  Loader2, 
  AlertCircle, 
  UserCheck, 
  Building, 
  FileText,
  Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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

interface Offer {
  id: string;
  status: string;
  created_at: string;
  property_id: string;
  tenant_application_id: string;
  property: {
    address: string;
    city: string;
    rent_amount: number | null;
  };
  tenant_application: {
    tenant_first_name: string;
    tenant_last_name: string;
    tenant_email: string;
  };
}

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const { role, setRole } = useUserRole();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusChangeId, setStatusChangeId] = useState<string | null>(null);
  const [appSearchQuery, setAppSearchQuery] = useState("");
  
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
        const { data: approvedData, error: approvedError } = await supabase
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

        if (approvedError) {
          console.error("Error fetching approved applications:", approvedError);
          throw approvedError;
        }
        
        // Fetch all pending/under-review applications
        const { data: pendingData, error: pendingError } = await supabase
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
          .in('status', ['pending', 'under-review'])
          .order('created_at', { ascending: false });

        if (pendingError) {
          console.error("Error fetching pending applications:", pendingError);
          throw pendingError;
        }
        
        // Fetch all offers
        const { data: offersData, error: offersError } = await supabase
          .from('offers')
          .select(`
            *,
            property:property_id (
              address,
              city,
              rent_amount
            ),
            tenant_application:tenant_application_id (
              tenant_first_name,
              tenant_last_name,
              tenant_email
            )
          `)
          .order('created_at', { ascending: false });

        if (offersError) {
          console.error("Error fetching offers:", offersError);
          throw offersError;
        }

        console.log("Applications that need offers:", approvedData);
        setApplications(approvedData as Application[]);
        setPendingApplications(pendingData as Application[]);
        setOffers(offersData as Offer[]);
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
      
      // Setup realtime subscription to changes in applications
      const channel = supabase
        .channel('admin-dashboard-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'tenant_applications' 
        }, (payload) => {
          console.log('Application change detected:', payload);
          // Refresh data when changes occur
          fetchApplications();
          
          toast({
            title: "Application Updated",
            description: `An application has been ${payload.eventType}`,
          });
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'offers' 
        }, (payload) => {
          console.log('Offer change detected:', payload);
          // Refresh data when changes occur
          fetchApplications();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
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

  const changeApplicationStatus = async (applicationId: string, newStatus: string) => {
    setStatusChangeId(applicationId);
    
    try {
      // Update application status
      const { error } = await supabase
        .from('tenant_applications')
        .update({ 
          status: newStatus,
          processed_at: newStatus === 'pending' ? null : new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}.`
      });

      // Refresh the applications lists immediately
      setPendingApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message
      });
    } finally {
      setStatusChangeId(null);
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

  // Filter applications based on search query
  const filteredPendingApplications = pendingApplications.filter(app => 
    app.tenant_first_name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
    app.tenant_last_name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
    app.tenant_email.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
    app.property.address.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Pending Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingApplications.length}</div>
                <p className="text-sm text-muted-foreground">Requiring review</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <UserCheck className="mr-2 h-5 w-5 text-primary" />
                  Approved Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{applications.length}</div>
                <p className="text-sm text-muted-foreground">Ready for offer generation</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Building className="mr-2 h-5 w-5 text-primary" />
                  Active Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{offers.length}</div>
                <p className="text-sm text-muted-foreground">Pending tenant acceptance</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending-applications">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending-applications">Pending Applications</TabsTrigger>
              <TabsTrigger value="pending-offers">Generate Offers</TabsTrigger>
              <TabsTrigger value="active-offers">Active Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="pending-applications">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Applications Needing Review</CardTitle>
                    <div className="w-full md:w-1/3">
                      <Input 
                        placeholder="Search applications..." 
                        value={appSearchQuery}
                        onChange={(e) => setAppSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredPendingApplications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {appSearchQuery ? "No applications match your search." : "No applications currently need review."}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Monthly Rent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Application Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPendingApplications.map((application) => (
                            <TableRow key={application.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{application.tenant_first_name} {application.tenant_last_name}</div>
                                  <div className="text-sm text-muted-foreground">{application.tenant_email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {application.property.address}, {application.property.city}
                              </TableCell>
                              <TableCell>
                                ${application.property.rent_amount}/month
                              </TableCell>
                              <TableCell>
                                {renderStatusBadge(application.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(application.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {application.status === 'pending' ? (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => changeApplicationStatus(application.id, 'under-review')}
                                      disabled={statusChangeId === application.id}
                                    >
                                      {statusChangeId === application.id ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      ) : null}
                                      Start Review
                                    </Button>
                                  ) : application.status === 'under-review' ? (
                                    <Select 
                                      onValueChange={(value) => changeApplicationStatus(application.id, value)}
                                      disabled={statusChangeId === application.id}
                                    >
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Change Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="approved">Approve</SelectItem>
                                        <SelectItem value="rejected">Reject</SelectItem>
                                        <SelectItem value="pending">Reset to Pending</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : null}
                                </div>
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

            <TabsContent value="active-offers">
              <Card>
                <CardHeader>
                  <CardTitle>Active Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : offers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No active offers at this time.
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
                            <TableHead>Created Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {offers.map((offer) => (
                            <TableRow key={offer.id}>
                              <TableCell>
                                {offer.tenant_application?.tenant_first_name} {offer.tenant_application?.tenant_last_name}
                              </TableCell>
                              <TableCell>{offer.tenant_application?.tenant_email}</TableCell>
                              <TableCell>
                                {offer.property?.address}, {offer.property?.city}
                              </TableCell>
                              <TableCell>
                                {renderStatusBadge(offer.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(offer.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm"
                                  variant="outline" 
                                >
                                  View Details
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
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
