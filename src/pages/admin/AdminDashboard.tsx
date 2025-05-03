import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
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
import { Json } from "@/integrations/supabase/types";
import { Tables } from "@/integrations/supabase/types";
import { NotificationService } from "@/services/notificationService";
import { EmailService } from "@/services/emailService";
import { WhatsAppService } from "@/services/whatsappService";

type Application = Tables<'tenant_applications'> & {
  property?: {
    address: string;
    city: string;
    rent_amount: number | null;
  };
};

type Offer = Tables<'offers'> & {
  property?: {
    address: string;
    city: string;
    rent_amount: number | null;
  };
  tenant_application?: {
    tenant_first_name: string;
    tenant_last_name: string;
    tenant_email: string;
  };
};

type PaymentBreakdown = {
  monthlyRent: number;
  tenantUpfrontPayment: number;
  doorwaysCoverage: number;
  repaymentInstallments: {
    amount: number;
    dueDate: string;
  }[];
};

const calculatePaymentBreakdown = (monthlyRent: number): PaymentBreakdown => {
  const tenantUpfrontPayment = monthlyRent * 0.5;
  const doorwaysCoverage = monthlyRent * 0.5;
  const installmentAmount = doorwaysCoverage / 3;

  // Calculate due dates for the 3 installments
  const today = new Date();
  const firstInstallment = new Date(today);
  firstInstallment.setDate(today.getDate() + 1); // First payment due tomorrow

  const secondInstallment = new Date(today);
  secondInstallment.setDate(today.getDate() + 15); // Second payment due in 15 days

  const thirdInstallment = new Date(today);
  thirdInstallment.setDate(today.getDate() + 25); // Third payment due in 25 days

  return {
    monthlyRent,
    tenantUpfrontPayment,
    doorwaysCoverage,
    repaymentInstallments: [
      { amount: installmentAmount, dueDate: firstInstallment.toISOString().split('T')[0] },
      { amount: installmentAmount, dueDate: secondInstallment.toISOString().split('T')[0] },
      { amount: installmentAmount, dueDate: thirdInstallment.toISOString().split('T')[0] }
    ]
  };
};

const AdminDashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { role, setRole } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusChangeId, setStatusChangeId] = useState<string | null>(null);
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [offerSearchQuery, setOfferSearchQuery] = useState("");
  
  useEffect(() => {
    // Check if user has admin privileges
    const checkAdminAccess = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      console.log('Checking admin access for user:', user.id);
      
      // Check if user has admin role in database
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error("Error checking admin role:", roleError);
        toast({
          variant: "destructive",
          title: "Access Error",
          description: "Unable to verify admin privileges."
        });
        navigate('/');
        return;
      }

      if (roleData?.role !== 'admin') {
        console.log('User does not have admin role:', roleData?.role);
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have administrator privileges."
        });
        navigate('/');
        return;
      }

      // User has admin role, proceed with setup
      if (role !== "admin") {
        try {
          await setRole("admin");
          toast({
            title: "Admin Access Granted",
            description: "You now have administrator privileges.",
          });
        } catch (error) {
          console.error("Error setting admin role:", error);
          toast({
            variant: "destructive",
            title: "Access Error",
            description: "Failed to grant admin privileges."
          });
          navigate('/');
        }
      }
    };

    checkAdminAccess();
  }, [user, role, setRole, toast, navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      
      try {
        console.log('Fetching all applications...');
        
        // Fetch applications with status 'pending_admin_offer' with property join
        const { data: pendingData, error: pendingError } = await supabase
          .from('tenant_applications')
          .select(`
            *,
            property:properties!property_id(
              address,
              city,
              rent_amount
            )
          `)
          .in('status', ['pending_admin_offer'])
          .order('created_at', { ascending: false });

        if (pendingError) {
          console.error("Error fetching applications:", pendingError);
          throw pendingError;
        }
        
        console.log('Applications found:', pendingData);
        setPendingApplications(pendingData as Application[]);

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

        if (Array.isArray(offersData)) {
          setOffers(offersData as Offer[]);
        }

      } catch (error: any) {
        console.error("Error in fetchApplications:", error);
        toast({
          variant: "destructive",
          title: "Error loading applications",
          description: error.message
        });
      } finally {
        setIsDataLoading(false);
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
        }, async (payload) => {
          console.log('Application change detected:', payload);
          // Refresh data when changes occur
          await fetchApplications();
          
          toast({
            title: "Application Updated",
            description: `An application has been ${payload.eventType}`,
          });
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'offers' 
        }, async (payload) => {
          console.log('Offer change detected:', payload);
          // Refresh data when changes occur
          await fetchApplications();
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to real-time changes');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Error subscribing to real-time changes');
            toast({
              variant: "destructive",
              title: "Subscription Error",
              description: "Failed to subscribe to real-time updates"
            });
          }
        });
        
      return () => {
        console.log('Cleaning up real-time subscription');
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
          property_id: application.property_id,
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

  const sendPaymentBreakdownToTenant = async (application: Application) => {
    if (!application.property?.rent_amount) return;

    const paymentBreakdown = calculatePaymentBreakdown(application.property.rent_amount);
    
    try {
      // Update the application with payment breakdown
      const { error: updateError } = await supabase
        .from('tenant_applications')
        .update({
          additional_info: {
            ...(application.additional_info as Record<string, any> || {}),
            payment_breakdown: paymentBreakdown
          } as Json,
          message: `
            Dear ${application.tenant_first_name} ${application.tenant_last_name},
            
            Your application for ${application.property.address} has been approved!
            
            Payment Breakdown:
            - Monthly Rent: $${paymentBreakdown.monthlyRent}
            - Upfront Payment (50%): $${paymentBreakdown.tenantUpfrontPayment.toFixed(2)}
            - Doorways Coverage (50%): $${paymentBreakdown.doorwaysCoverage.toFixed(2)}
            
            Repayment Schedule:
            ${paymentBreakdown.repaymentInstallments.map((installment, index) => `
              - Installment ${index + 1}: $${installment.amount.toFixed(2)} (Due: ${installment.dueDate})
            `).join('\n')}
            
            Please make your upfront payment to proceed with the lease agreement.
            
            Best regards,
            Doorways Team
          `
        })
        .eq('id', application.id);

      if (updateError) throw updateError;

      // Create notification
      await NotificationService.createNotification(
        application.tenant_id || '',
        'Application Approved',
        `Your application for ${application.property.address} has been approved!`,
        'application',
        { application_id: application.id, payment_breakdown: paymentBreakdown }
      );

      // Send email
      await EmailService.sendApplicationApprovalEmail(
        application.tenant_email,
        application.tenant_first_name,
        application.property.address,
        paymentBreakdown
      );

      // Send WhatsApp message if phone number is available
      if (application.phone) {
        await WhatsAppService.sendApplicationApprovalMessage(
          application.phone,
          application.tenant_first_name,
          application.property.address,
          paymentBreakdown
        );
      }

      toast({
        title: "Payment breakdown sent",
        description: "The tenant has been notified of their payment schedule via email, WhatsApp, and dashboard notification."
      });
    } catch (error: any) {
      console.error("Error sending payment breakdown:", error);
      toast({
        variant: "destructive",
        title: "Error sending payment breakdown",
        description: error.message
      });
    }
  };

  const changeApplicationStatus = async (applicationId: string, newStatus: string) => {
    setStatusChangeId(applicationId);
    
    try {
      console.log('Attempting to change application status for ID:', applicationId);
      // Debug: Check if the application exists before updating
      const { data: checkData, error: checkError } = await supabase
        .from('tenant_applications')
        .select('*')
        .eq('id', applicationId)
        .maybeSingle();
      console.log('Pre-update select result:', checkData, checkError);
      if (!checkData) {
        throw new Error('No application found with this ID');
      }
      // Update application status
      const { data, error } = await supabase
        .from('tenant_applications')
        .update({ 
          status: newStatus,
          processed_at: newStatus === 'pending' ? null : new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating application status:', error);
        throw error;
      }

      console.log('Current application status in DB:', data);

      // If application is approved, send payment breakdown
      if (newStatus === 'approved' && data) {
        await sendPaymentBreakdownToTenant(data);
      }

      // Verify the update
      const verifyUpdate = async (attempts = 0): Promise<void> => {
        if (attempts >= 3) {
          throw new Error('Update verification failed after multiple attempts!');
        }

        // Add a small delay before checking
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: verificationData, error: verificationError } = await supabase
          .from('tenant_applications')
          .select('status')
          .eq('id', applicationId)
          .single();

        if (verificationError) {
          console.error('Verification error:', verificationError);
          throw verificationError;
        }

        console.log(`Validation attempt ${attempts + 1} result:`, verificationData);

        if (verificationData?.status !== newStatus) {
          console.warn(`Status mismatch on attempt ${attempts + 1}! Expected: ${newStatus}, Got: ${verificationData?.status}`);
          return verifyUpdate(attempts + 1);
        }
      };

      // Verify the update
      await verifyUpdate();

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}.`
      });

      // Update both pending and approved applications lists
      if (newStatus === 'approved') {
        // Move from pending to approved
        const approvedApp = pendingApplications.find(app => app.id === applicationId);
        if (approvedApp) {
          setApplications(prev => [...prev, { ...approvedApp, status: newStatus }]);
          setPendingApplications(prev => prev.filter(app => app.id !== applicationId));
        }
      } else if (newStatus === 'pending') {
        // Move from approved to pending
        const pendingApp = applications.find(app => app.id === applicationId);
        if (pendingApp) {
          setPendingApplications(prev => [...prev, { ...pendingApp, status: newStatus }]);
          setApplications(prev => prev.filter(app => app.id !== applicationId));
        } else {
          // Update status in pending applications
          setPendingApplications(prev => 
            prev.map(app => 
              app.id === applicationId ? { ...app, status: newStatus } : app
            )
          );
        }
      } else {
        // For other statuses, just update the status in pending applications
        setPendingApplications(prev => 
          prev.map(app => 
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error: any) {
      console.error('Error in changeApplicationStatus:', error);
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

  const isApplicationApproved = async (id: string): Promise<boolean> => {
    const { data } = await supabase
      .from("tenant_applications")
      .select("status")
      .eq("id", id)
      .single();
    return data?.status === "approved";
  };

  // Filter applications based on search query
  const filteredPendingApplications = pendingApplications.filter(app => 
    app.tenant_first_name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
    app.tenant_last_name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
    app.tenant_email.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
    (app.property?.address?.toLowerCase() || '').includes(appSearchQuery.toLowerCase())
  );

  if (isAuthLoading || isDataLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
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
                  {isDataLoading ? (
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
                                {application.property?.address}, {application.property?.city}
                              </TableCell>
                              <TableCell>
                                ${application.property?.rent_amount}/month
                              </TableCell>
                              <TableCell>
                                {renderStatusBadge(application.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(application.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {(application.status === 'pending' || application.status === 'pending_admin_offer') ? (
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
                                    <div className="space-y-4">
                                      <div className="bg-muted p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">Payment Breakdown</h4>
                                        {application.property?.rent_amount && (
                                          <>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div>Monthly Rent:</div>
                                              <div className="font-medium">${application.property?.rent_amount}</div>
                                              
                                              <div>Tenant Upfront (50%):</div>
                                              <div className="font-medium">${(application.property?.rent_amount * 0.5).toFixed(2)}</div>
                                              
                                              <div>Doorways Coverage (50%):</div>
                                              <div className="font-medium">${(application.property?.rent_amount * 0.5).toFixed(2)}</div>
                                            </div>
                                            
                                            <div className="mt-4">
                                              <h5 className="font-medium mb-2">Repayment Schedule</h5>
                                              {calculatePaymentBreakdown(application.property?.rent_amount).repaymentInstallments.map((installment, index) => (
                                                <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                                                  <div>Installment {index + 1} (Due {installment.dueDate}):</div>
                                                  <div className="font-medium">${installment.amount.toFixed(2)}</div>
                                                </div>
                                              ))}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      
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
                                    </div>
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
                  {isDataLoading ? (
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
                                {application.property?.address}, {application.property?.city}
                              </TableCell>
                              <TableCell>
                                ${application.property?.rent_amount}/month
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
                  {isDataLoading ? (
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
