import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Home, Calendar } from "lucide-react";
import { useUserRole } from "@/components/UserRoleProvider";

interface Application {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  tenant: {
    first_name: string;
    last_name: string;
    email: string;
  };
  property: {
    id: string;
    address: string;
    city: string;
    rent_amount: number | null;
    landlord: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

const AdminApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { role } = useUserRole();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (userRole?.role !== 'admin') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        navigate('/');
        return;
      }
    };

    checkAdminAccess();
  }, [user, navigate, toast]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('tenant_applications')
          .select(`
            id,
            status,
            created_at,
            updated_at,
            tenant_first_name,
            tenant_last_name,
            tenant_email,
            property:properties!property_id(
              id,
              address,
              city,
              rent_amount,
              landlord:landlords!landlord_id(
                id,
                first_name,
                last_name,
                email
              )
            )
          `);

        if (error) throw error;

        const formattedApplications = data.map(app => ({
          id: app.id,
          status: app.status,
          created_at: app.created_at,
          updated_at: app.updated_at,
          tenant: {
            first_name: app.tenant_first_name,
            last_name: app.tenant_last_name,
            email: app.tenant_email
          },
          property: {
            id: app.property?.id || '',
            address: app.property?.address || '',
            city: app.property?.city || '',
            rent_amount: app.property?.rent_amount || 0,
            landlord: {
              id: app.property?.landlord?.id || '',
              first_name: app.property?.landlord?.first_name || '',
              last_name: app.property?.landlord?.last_name || '',
              email: app.property?.landlord?.email || ''
            }
          }
        }));

        setApplications(formattedApplications);
      } catch (error: any) {
        console.error("Error fetching applications:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load applications",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);

  const breadcrumbItems = [
    { label: "Admin Dashboard", href: "/admin/dashboard" },
    { label: "Applications", active: true },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-foreground/70">Loading applications...</p>
            </div>
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
          <div className="max-w-7xl mx-auto">
            <BreadcrumbNav items={breadcrumbItems} />
            
            <Card className="border-primary/20 bg-background/50 mt-8">
              <CardHeader>
                <CardTitle className="text-2xl">Application Management</CardTitle>
                <CardDescription>View and manage all tenant applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          {application.tenant.first_name} {application.tenant.last_name}
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {application.tenant.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          {application.property.address}
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {application.property.city}
                          </span>
                        </TableCell>
                        <TableCell>
                          {application.property.landlord.first_name} {application.property.landlord.last_name}
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {application.property.landlord.email}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(application.updated_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminApplications; 