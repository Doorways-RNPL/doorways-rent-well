
import { Button } from "@/components/ui/button";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ReviewStepProps {
  formData: PropertyFormData;
  images: PropertyImage[];
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const ReviewStep = ({ formData, images, onSubmit, onBack, isSubmitting }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Property Type</p>
                <p className="capitalize">{formData.property_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{formData.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p>{formData.city}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p>{formData.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p>{formData.bathrooms}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Property Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <p>${formData.rent_amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{formData.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amenities</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-primary/10 rounded-md text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.preview}
                  alt={`Property ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Property..." : "Create Property"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
