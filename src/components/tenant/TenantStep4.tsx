
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TenantStep4Props {
  data: {
    residenceType: 'current' | 'new';
    propertyAddress: string;
    propertyCity: string;
    monthlyRent: string;
    leaseStartDate: string;
    leaseDuration: string;
    landlordName: string;
    landlordEmail: string;
    landlordPhone: string;
    currentAddress?: string;
    currentCity?: string;
  };
  updateData: (data: Partial<TenantStep4Props['data']>) => void;
}

const TenantStep4 = ({ data, updateData }: TenantStep4Props) => {
  const isCurrentResidence = data.residenceType === 'current';

  // Auto-populate property details if it's the current residence
  if (isCurrentResidence && data.currentAddress && data.currentCity && 
      (data.propertyAddress !== data.currentAddress || data.propertyCity !== data.currentCity)) {
    updateData({
      propertyAddress: data.currentAddress,
      propertyCity: data.currentCity
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          {isCurrentResidence ? 'Current Lease Details' : 'New Lease Details'}
        </h2>
        <p className="text-white/70 mb-6">
          {isCurrentResidence 
            ? 'Please confirm your current lease information.'
            : 'Please provide information about the property you\'re applying for.'}
        </p>
      </div>

      <div className="space-y-6">
        {isCurrentResidence ? (
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-white/70">
              Using your current address for this application:
              <br />
              <span className="text-primary font-medium">
                {data.currentAddress}, {data.currentCity}
              </span>
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="propertyAddress">Property Street Address</Label>
              <Input
                id="propertyAddress"
                value={data.propertyAddress}
                onChange={(e) => updateData({ propertyAddress: e.target.value })}
                placeholder="789 Rental St"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="propertyCity">City</Label>
              <Input
                id="propertyCity"
                value={data.propertyCity}
                onChange={(e) => updateData({ propertyCity: e.target.value })}
                required
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent (R)</Label>
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
            <Label htmlFor="leaseStartDate">
              {isCurrentResidence ? 'Original Lease Start Date' : 'Lease Start Date'}
            </Label>
            <Input
              id="leaseStartDate"
              type="date"
              value={data.leaseStartDate}
              onChange={(e) => updateData({ leaseStartDate: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leaseDuration">
              {isCurrentResidence ? 'Remaining Lease Duration' : 'Lease Duration'}
            </Label>
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
        <h3 className="text-lg font-medium text-white/90 mb-4">
          {isCurrentResidence ? 'Current Landlord Information' : 'Landlord Information'}
        </h3>
        
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
                placeholder="+27 82 123 4567"
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
