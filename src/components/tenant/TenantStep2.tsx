
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ResidenceTypeSelection from "./ResidenceTypeSelection";

interface TenantStep2Props {
  data: {
    residenceType: 'current' | 'new';
    currentAddress: string;
    currentCity: string;
    moveInDate: string;
  };
  updateData: (data: Partial<TenantStep2Props['data']>) => void;
}

const TenantStep2 = ({ data, updateData }: TenantStep2Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Address Information</h2>
        <p className="text-white/70 mb-6">Please provide your current address information.</p>
      </div>

      <ResidenceTypeSelection
        value={data.residenceType}
        onChange={(value) => updateData({ residenceType: value })}
      />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentAddress">Current Street Address</Label>
          <Input
            id="currentAddress"
            value={data.currentAddress}
            onChange={(e) => updateData({ currentAddress: e.target.value })}
            placeholder="123 Main St, Apt 4B"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentCity">City</Label>
          <Input
            id="currentCity"
            value={data.currentCity}
            onChange={(e) => updateData({ currentCity: e.target.value })}
            placeholder="Enter city"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="moveInDate">Move-In Date</Label>
          <Input
            id="moveInDate"
            type="date"
            value={data.moveInDate}
            onChange={(e) => updateData({ moveInDate: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default TenantStep2;
