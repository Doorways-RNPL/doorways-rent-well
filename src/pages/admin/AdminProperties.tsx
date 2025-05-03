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
import { Home, MapPin, DollarSign, Calendar } from "lucide-react";

interface Property {
  id: string;
  address: string;
  city: string;
  rent_amount: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  available_from: string;
  property_type: string;
  landlord_id: string;
  created_at: string;
  landlord: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const AdminProperties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
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
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            landlord:landlords!inner(
              first_name,
              last_name,
              email
            )
          `);

        if (error) throw error;
        setProperties(data);
      } catch (error: any) {
        console.error("Error fetching properties:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load properties",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  const breadcrumbItems = [
    { label: "Admin Dashboard", href: "/admin/dashboard" },
    { label: "Properties", active: true },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-foreground/70">Loading properties...</p>
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
                <CardTitle className="text-2xl">Property Management</CardTitle>
                <CardDescription>View and manage all properties in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Bed/Bath</TableHead>
                      <TableHead>Available From</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          {property.address}
                        </TableCell>
                        <TableCell>{property.city}</TableCell>
                        <TableCell>R{property.rent_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          {property.bedrooms} / {property.bathrooms}
                        </TableCell>
                        <TableCell>
                          {new Date(property.available_from).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {property.landlord.first_name} {property.landlord.last_name}
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {property.landlord.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(property.created_at).toLocaleDateString()}
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

export default AdminProperties; 