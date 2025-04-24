
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TenantStep4Props {
  data: {
    propertyAddress: string;
    propertyCity: string;
    propertyState: string;
    propertyZip: string;
    monthlyRent: string;
    leaseStartDate: string;
    leaseDuration: string;
    landlordName: string;
    landlordEmail: string;
    landlordPhone: string;
  };
  updateData: (data: Partial<TenantStep4Props['data']>) => void;
}

const TenantStep4 = ({ data, updateData }: TenantStep4Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Lease Details</h2>
        <p className="text-white/70 mb-6">Please provide information about the property you're applying for.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="propertyAddress">Property Street Address</Label>
          <Input
            id="propertyAddress"
            value={data.propertyAddress}
            onChange={(e) => updateData({ propertyAddress: e.target.value })}
            placeholder="789 Rental St, Apt 3C"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="propertyCity">City</Label>
            <Input
              id="propertyCity"
              value={data.propertyCity}
              onChange={(e) => updateData({ propertyCity: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="propertyState">State</Label>
            <Input
              id="propertyState"
              value={data.propertyState}
              onChange={(e) => updateData({ propertyState: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="propertyZip">ZIP Code</Label>
            <Input
              id="propertyZip"
              value={data.propertyZip}
              onChange={(e) => updateData({ propertyZip: e.target.value })}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
          <Input
            id="monthlyRent"
            type="number"
            value={data.monthlyRent}
            onChange={(e) => updateData({ monthlyRent: e.target.value })}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="leaseStartDate">Lease Start Date</Label>
            <Input
              id="leaseStartDate"
              type="date"
              value={data.leaseStartDate}
              onChange={(e) => updateData({ leaseStartDate: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leaseDuration">Lease Duration (months)</Label>
            <Select 
              value={data.leaseDuration} 
              onValueChange={(value) => updateData({ leaseDuration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lease duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="18">18 months</SelectItem>
                <SelectItem value="24">24 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-medium text-white/90 mb-4">Landlord Information</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="landlordName">Landlord/Property Manager Name</Label>
            <Input
              id="landlordName"
              value={data.landlordName}
              onChange={(e) => updateData({ landlordName: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="landlordEmail">Email</Label>
              <Input
                id="landlordEmail"
                type="email"
                value={data.landlordEmail}
                onChange={(e) => updateData({ landlordEmail: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="landlordPhone">Phone</Label>
              <Input
                id="landlordPhone"
                value={data.landlordPhone}
                onChange={(e) => updateData({ landlordPhone: e.target.value })}
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantStep4;
