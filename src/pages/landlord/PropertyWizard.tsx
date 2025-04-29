
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicInfoStep from "@/components/property-wizard/BasicInfoStep";
import DetailsStep from "@/components/property-wizard/DetailsStep";
import ImagesStep from "@/components/property-wizard/ImagesStep";
import ReviewStep from "@/components/property-wizard/ReviewStep";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PropertyWizard = () => {
  const { user, isLoading } = useAuth();
  const { role, setRole } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    property_type: 'house',
    address: '',
    city: '',
    bedrooms: 1,
    bathrooms: 1,
    rent_amount: 0,
    description: '',
    amenities: []
  });
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [landlordId, setLandlordId] = useState<string | null>(null);
  const [isLoadingLandlord, setIsLoadingLandlord] = useState(true);
  
  useEffect(() => {
    // Ensure user has landlord role
    if (role !== "landlord" && user) {
      setRole("landlord");
    }
    
    // Fetch landlord ID
    const fetchLandlordId = async () => {
      if (!user) return;
      
      setIsLoadingLandlord(true);
      try {
        const { data, error } = await supabase
          .from('landlords')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No landlord record found, create one
            const { data: newLandlord, error: createError } = await supabase
              .from('landlords')
              .insert({
                email: user.email || '',
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                user_id: user.id
              })
              .select('id')
              .single();
              
            if (createError) throw createError;
            setLandlordId(newLandlord?.id || null);
          } else {
            throw error;
          }
        } else {
          setLandlordId(data?.id || null);
        }
      } catch (error: any) {
        console.error("Error fetching landlord ID:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not retrieve your landlord profile. Please try again later."
        });
      } finally {
        setIsLoadingLandlord(false);
      }
    };
    
    fetchLandlordId();
  }, [user, toast, role, setRole]);
  
  if (isLoading || isLoadingLandlord) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleBasicInfoSubmit = (data: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleDetailsSubmit = (data: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleImagesSubmit = (uploadedImages: PropertyImage[]) => {
    setImages(uploadedImages);
    setStep(4);
  };

  const handleCreateProperty = async () => {
    if (!landlordId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Landlord profile not found. Please try again later."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create the property with correct landlord_id
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          ...formData,
          landlord_id: landlordId
        })
        .select()
        .single();

      if (propertyError || !propertyData) {
        throw new Error(propertyError?.message || 'Failed to create property');
      }

      // Upload images
      for (const image of images) {
        if (!image.file) continue;
        
        const fileExt = image.file.name.split('.').pop();
        const filePath = `${propertyData.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(filePath, image.file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        // Create image record
        await supabase.from('property_images').insert({
          property_id: propertyData.id,
          storage_path: filePath,
          description: image.description
        });
      }

      toast({
        title: "Success!",
        description: "Your property has been created successfully.",
      });

      // Redirect to dashboard
      navigate('/landlord/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfoStep
            onNext={handleBasicInfoSubmit}
            initialData={formData}
          />
        );
      case 2:
        return (
          <DetailsStep
            onNext={handleDetailsSubmit}
            onBack={() => setStep(1)}
            initialData={formData}
          />
        );
      case 3:
        return (
          <ImagesStep
            onNext={handleImagesSubmit}
            onBack={() => setStep(2)}
            initialImages={images}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            images={images}
            onSubmit={handleCreateProperty}
            onBack={() => setStep(3)}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Add New Property</h1>
            <p className="text-white/70">Complete the form below to list your property.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Step {step} of 4</CardTitle>
            </CardHeader>
            <CardContent>
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyWizard;
