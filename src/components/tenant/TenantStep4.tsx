
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyOption {
  id: string;
  address: string;
  city: string;
  rent_amount: number;
}

interface TenantStep4Props {
  data: {
    propertyId: string;
    propertyAddress: string;
    propertyCity: string;
    monthlyRent: string;
    leaseStartDate: string;
    leaseDuration: string;
    landlordName: string;
    landlordEmail: string;
    landlordPhone: string;
  };
  updateData: (data: Partial<TenantStep4Props['data']>) => void;
  properties: PropertyOption[];
  isLoading: boolean;
}

const TenantStep4 = ({ data, updateData, properties, isLoading }: TenantStep4Props) => {
  const handlePropertySelect = (propertyId: string) => {
    // Find the selected property
    const selectedProperty = properties.find(prop => prop.id === propertyId);
    
    if (selectedProperty) {
      updateData({
        propertyId: selectedProperty.id,
        propertyAddress: selectedProperty.address,
        propertyCity: selectedProperty.city,
        monthlyRent: selectedProperty.rent_amount.toString()
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Property Selection</h2>
        <p className="text-white/70 mb-6">Please select the property you want to apply for.</p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="propertySelect">Select Property <span className="text-red-500">*</span></Label>
            <Select 
              value={data.propertyId} 
              onValueChange={handlePropertySelect}
            >
              <SelectTrigger id="propertySelect" className="w-full">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.length === 0 ? (
                  <SelectItem value="none" disabled>No properties available</SelectItem>
                ) : (
                  properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.address}, {property.city} - ${property.rent_amount}/month
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="leaseStartDate">Lease Start Date <span className="text-red-500">*</span></Label>
          <Input
            id="leaseStartDate"
            type="date"
            value={data.leaseStartDate}
            onChange={(e) => updateData({ leaseStartDate: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="leaseDuration">Lease Duration (months) <span className="text-red-500">*</span></Label>
          <Select 
            value={data.leaseDuration} 
            onValueChange={(value) => updateData({ leaseDuration: value })}
          >
            <SelectTrigger id="leaseDuration" className="w-full">
              <SelectValue placeholder="Select lease duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="18">18 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
              <SelectItem value="36">36 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TenantStep4;
