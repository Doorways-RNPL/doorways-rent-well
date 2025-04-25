
import { PropertyType } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface BasicInfoStepProps {
  onNext: (data: {
    property_type: PropertyType;
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
  }) => void;
  initialData?: {
    property_type: PropertyType;
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
  };
}

const BasicInfoStep = ({ onNext, initialData }: BasicInfoStepProps) => {
  const [propertyType, setPropertyType] = useState<PropertyType>(initialData?.property_type || 'house');
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms || 1);
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms || 1);

  const propertyTypes: PropertyType[] = [
    'house',
    'townhouse',
    'duplex',
    'apartment',
    'bachelor',
    'cottage',
    'flat',
    'student accommodation',
    'retirement village unit'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      property_type: propertyType,
      address,
      city,
      bedrooms,
      bathrooms
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label>Property Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {propertyTypes.map((type) => (
                <Card 
                  key={type}
                  className={`cursor-pointer transition-all ${
                    propertyType === type ? 'border-primary bg-primary/5' : 'border-white/20'
                  }`}
                  onClick={() => setPropertyType(type)}
                >
                  <CardContent className="p-4">
                    <p className="text-center capitalize">{type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter street address"
              required
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min={0}
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              min={0}
              step={0.5}
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default BasicInfoStep;
