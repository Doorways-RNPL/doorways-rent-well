
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ResidenceTypeSelectionProps {
  value: 'current' | 'new';
  onChange: (value: 'current' | 'new') => void;
}

const ResidenceTypeSelection = ({ value, onChange }: ResidenceTypeSelectionProps) => {
  return (
    <div className="space-y-4">
      <Label>Is this application for your current residence?</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-3"
      >
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="current" id="current" />
          <div className="space-y-1">
            <Label htmlFor="current" className="font-normal">
              Yes, I want RNPL for my current home
            </Label>
            <p className="text-sm text-white/50">
              We'll use your current address details for the application
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="new" id="new" />
          <div className="space-y-1">
            <Label htmlFor="new" className="font-normal">
              No, I'm applying for a new property
            </Label>
            <p className="text-sm text-white/50">
              You'll need to provide the new property details later
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ResidenceTypeSelection;
