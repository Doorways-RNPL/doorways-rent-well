
import { Label } from "@/components/ui/label";

interface ResidenceTypeSelectionProps {
  value: 'new';
  onChange: (value: 'new') => void;
}

const ResidenceTypeSelection = ({ value, onChange }: ResidenceTypeSelectionProps) => {
  // Set default value to 'new' if component is rendered
  if (value !== 'new') {
    onChange('new');
  }
  
  return (
    <div className="space-y-4">
      <Label>Application Type</Label>
      <div className="p-4 border border-border rounded-md bg-card/50">
        <div className="space-y-1">
          <p className="font-medium">Applying for a new property</p>
          <p className="text-sm text-muted-foreground">
            Browse available properties and submit your application
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResidenceTypeSelection;
