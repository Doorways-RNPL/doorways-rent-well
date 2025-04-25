
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
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
  const { toast } = useToast();
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
  
  if (isLoading) {
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
    setIsSubmitting(true);
    try {
      // Get the landlord's ID
      const { data: landlordData, error: landlordError } = await supabase
        .from('landlords')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (landlordError || !landlordData) {
        throw new Error('Could not find landlord profile');
      }

      // Create the property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          ...formData,
          landlord_id: landlordData.id
        })
        .select()
        .single();

      if (propertyError || !propertyData) {
        throw new Error('Failed to create property');
      }

      // Upload images
      for (const image of images) {
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
      window.location.href = '/landlord/dashboard';
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
