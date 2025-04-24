
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TenantStep3Props {
  data: {
    employerName: string;
    jobTitle: string;
    employmentStartDate: string;
    monthlyIncome: string;
    employerPhone: string;
    employerAddress: string;
  };
  updateData: (data: Partial<TenantStep3Props['data']>) => void;
}

const TenantStep3 = ({ data, updateData }: TenantStep3Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Employment Information</h2>
        <p className="text-white/70 mb-6">Please provide details about your current employment.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="employerName">Employer Name</Label>
          <Input
            id="employerName"
            value={data.employerName}
            onChange={(e) => updateData({ employerName: e.target.value })}
            placeholder="Company or employer name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={data.jobTitle}
            onChange={(e) => updateData({ jobTitle: e.target.value })}
            placeholder="Your position or role"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employmentStartDate">Employment Start Date</Label>
          <Input
            id="employmentStartDate"
            type="date"
            value={data.employmentStartDate}
            onChange={(e) => updateData({ employmentStartDate: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={data.monthlyIncome}
            onChange={(e) => updateData({ monthlyIncome: e.target.value })}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employerPhone">Employer Phone</Label>
          <Input
            id="employerPhone"
            value={data.employerPhone}
            onChange={(e) => updateData({ employerPhone: e.target.value })}
            placeholder="(555) 123-4567"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employerAddress">Employer Address</Label>
          <Input
            id="employerAddress"
            value={data.employerAddress}
            onChange={(e) => updateData({ employerAddress: e.target.value })}
            placeholder="123 Business Ave, Suite 100, City, State, ZIP"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default TenantStep3;
