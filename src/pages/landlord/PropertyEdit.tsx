import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Home, MapPin, DollarSign, Calendar } from "lucide-react";

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

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
            description: "You don't have permission to edit this property.",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          address: property.address,
          city: property.city,
          rent_amount: property.rent_amount,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          description: property.description,
          property_type: property.property_type,
          amenities: property.amenities,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property details updated successfully",
      });
      navigate(`/landlord/property/${id}`);
    } catch (error: any) {
      console.error("Error updating property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update property details",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/landlord/dashboard" },
    { label: "Property Details", href: `/landlord/property/${id}` },
    { label: "Edit Property", active: true },
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-primary/20 bg-background/50">
                <CardHeader>
                  <CardTitle className="text-xl">Edit Property Details</CardTitle>
                  <CardDescription>Update your property information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      value={property.address}
                      onChange={(e) => setProperty({ ...property, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input
                      value={property.city}
                      onChange={(e) => setProperty({ ...property, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rent Amount (R)</label>
                      <Input
                        type="number"
                        value={property.rent_amount}
                        onChange={(e) => setProperty({ ...property, rent_amount: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Available From</label>
                      <Input
                        type="date"
                        value={property.available_from}
                        onChange={(e) => setProperty({ ...property, available_from: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bedrooms</label>
                      <Input
                        type="number"
                        value={property.bedrooms}
                        onChange={(e) => setProperty({ ...property, bedrooms: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bathrooms</label>
                      <Input
                        type="number"
                        value={property.bathrooms}
                        onChange={(e) => setProperty({ ...property, bathrooms: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={property.description}
                      onChange={(e) => setProperty({ ...property, description: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/landlord/property/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyEdit; 