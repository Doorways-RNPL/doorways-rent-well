
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TenantStep3Props {
  data: {
    employerName: string;
    jobTitle: string;
    monthlyIncome: string;
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
      </div>
    </div>
  );
};

export default TenantStep3;
