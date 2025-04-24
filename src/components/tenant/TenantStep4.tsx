import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

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

  // Calculate remaining months for current residence
  const calculateRemainingMonths = () => {
    if (!data.leaseStartDate || !data.leaseDuration) return 0;
    const startDate = new Date(data.leaseStartDate);
    const totalMonths = parseInt(data.leaseDuration);
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + totalMonths));
    const today = new Date();
    const remainingMonths = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return remainingMonths;
  };

  const remainingMonths = isCurrentResidence ? calculateRemainingMonths() : null;
  const showWarning = isCurrentResidence && remainingMonths !== null && remainingMonths < 2;

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

      {showWarning && (
        <Alert variant="destructive">
          <AlertDescription>
            Warning: Your current lease has less than 2 months remaining. This may affect your application.
          </AlertDescription>
        </Alert>
      )}

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
            <div className="flex items-center gap-2">
              <Label htmlFor="leaseStartDate">
                {isCurrentResidence ? 'Original Lease Start Date' : 'Lease Start Date'}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-white/50" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {isCurrentResidence 
                        ? 'The date your current lease began'
                        : 'When would you like to start your new lease?'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="leaseStartDate"
              type="date"
              value={data.leaseStartDate}
              onChange={(e) => updateData({ leaseStartDate: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="leaseDuration">
                {isCurrentResidence ? 'Remaining Lease Duration' : 'Lease Duration'}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-white/50" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {isCurrentResidence
                        ? 'Remaining time on your current lease. Must be at least 2 months.'
                        : 'Minimum lease duration is 12 months for new applications.'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select 
              value={data.leaseDuration} 
              onValueChange={(value) => updateData({ leaseDuration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lease duration" />
              </SelectTrigger>
              <SelectContent>
                {!isCurrentResidence ? (
                  <>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="18">18 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="2">2 months</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <p className="text-sm text-white/50">
              {isCurrentResidence
                ? 'Minimum 2 months remaining on current lease'
                : 'Minimum 12 months for new leases'}
            </p>
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
