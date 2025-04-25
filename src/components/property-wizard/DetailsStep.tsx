
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface DetailsStepProps {
  onNext: (data: {
    rent_amount: number;
    description: string;
    amenities: string[];
  }) => void;
  onBack: () => void;
  initialData?: {
    rent_amount: number;
    description: string;
    amenities: string[];
  };
}

const AMENITIES = [
  "Parking", "Air Conditioning", "Heating", "Washer/Dryer",
  "Dishwasher", "Furnished", "Pets Allowed", "Gym",
  "Pool", "Elevator", "Security System", "Storage"
];

const DetailsStep = ({ onNext, onBack, initialData }: DetailsStepProps) => {
  const [rentAmount, setRentAmount] = useState(initialData?.rent_amount || 0);
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      rent_amount: rentAmount,
      description,
      amenities: selectedAmenities
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="rent">Monthly Rent ($)</Label>
          <Input
            id="rent"
            type="number"
            min={0}
            value={rentAmount}
            onChange={(e) => setRentAmount(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Property Description</Label>
          <textarea
            id="description"
            className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your property..."
            required
          />
        </div>

        <div>
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {AMENITIES.map((amenity) => (
              <Card 
                key={amenity}
                className={`cursor-pointer transition-all ${
                  selectedAmenities.includes(amenity) ? 'border-primary bg-primary/5' : 'border-white/20'
                }`}
                onClick={() => toggleAmenity(amenity)}
              >
                <CardContent className="p-4">
                  <p className="text-center">{amenity}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
};

export default DetailsStep;
