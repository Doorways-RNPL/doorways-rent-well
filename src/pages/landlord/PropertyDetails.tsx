import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Home, MapPin, DollarSign, Calendar, Users, Edit } from "lucide-react";
import { Json } from "type-fest";

interface Property {
  id: string;
  address: string;
  city: string;
  rent_amount: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string | null;
  property_type: string | null;
  amenities: Json | null;
  landlord_id: string;
  created_at: string | null;
  updated_at: string | null;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Verify the property belongs to the current landlord
        if (data.landlord_id !== user?.id) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have permission to view this property.",
          });
          navigate('/landlord/dashboard');
          return;
        }

        setProperty(data);
      } catch (error: any) {
        console.error("Error fetching property:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load property details",
        });
        navigate('/landlord/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, user, navigate, toast]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/landlord/dashboard" },
    { label: "Property Details", active: true },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-foreground/70">Loading property details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <BreadcrumbNav items={breadcrumbItems} />
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-4">{property.address}</h1>
              <p className="text-white/70">{property.city}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-primary/20 bg-background/50">
                <CardHeader>
                  <CardTitle className="text-xl">Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-primary" />
                    <span>{property.bedrooms} Bedrooms, {property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span>R{property.rent_amount?.toLocaleString() || 'N/A'} per month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Available from {property.created_at ? new Date(property.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-background/50">
                <CardHeader>
                  <CardTitle className="text-xl">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{property.description || 'N/A'}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/landlord/property/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Property
              </Button>
              <Button
                onClick={() => navigate('/landlord/applications')}
              >
                View Applications
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetails; 