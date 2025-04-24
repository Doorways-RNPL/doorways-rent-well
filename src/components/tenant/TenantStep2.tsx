
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TenantStep2Props {
  data: {
    currentAddress: string;
    currentCity: string;
    currentState: string;
    currentZip: string;
    moveInDate: string;
    previousAddress: string;
    previousCity: string;
    previousState: string;
    previousZip: string;
  };
  updateData: (data: Partial<TenantStep2Props['data']>) => void;
}

const TenantStep2 = ({ data, updateData }: TenantStep2Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Address History</h2>
        <p className="text-white/70 mb-6">Please provide your current and previous address information.</p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white/90 mb-4">Current Address</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentAddress">Street Address</Label>
            <Input
              id="currentAddress"
              value={data.currentAddress}
              onChange={(e) => updateData({ currentAddress: e.target.value })}
              placeholder="123 Main St, Apt 4B"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentCity">City</Label>
              <Input
                id="currentCity"
                value={data.currentCity}
                onChange={(e) => updateData({ currentCity: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentState">State</Label>
              <Input
                id="currentState"
                value={data.currentState}
                onChange={(e) => updateData({ currentState: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentZip">ZIP Code</Label>
              <Input
                id="currentZip"
                value={data.currentZip}
                onChange={(e) => updateData({ currentZip: e.target.value })}
                required
              />
            </div>
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

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-medium text-white/90 mb-4">Previous Address</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="previousAddress">Street Address</Label>
            <Input
              id="previousAddress"
              value={data.previousAddress}
              onChange={(e) => updateData({ previousAddress: e.target.value })}
              placeholder="456 Oak St"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="previousCity">City</Label>
              <Input
                id="previousCity"
                value={data.previousCity}
                onChange={(e) => updateData({ previousCity: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="previousState">State</Label>
              <Input
                id="previousState"
                value={data.previousState}
                onChange={(e) => updateData({ previousState: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="previousZip">ZIP Code</Label>
              <Input
                id="previousZip"
                value={data.previousZip}
                onChange={(e) => updateData({ previousZip: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantStep2;
