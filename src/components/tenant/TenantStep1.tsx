
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TenantStep1Props {
  data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    idNumber: string;
    idType: string;
  };
  updateData: (data: Partial<TenantStep1Props['data']>) => void;
}

const TenantStep1 = ({ data, updateData }: TenantStep1Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
        <p className="text-white/70 mb-6">Please provide your basic personal details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder="Your first name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            placeholder="Your last name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => updateData({ dateOfBirth: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="idType">ID Type</Label>
        <Select 
          value={data.idType} 
          onValueChange={(value) => updateData({ idType: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ID Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="drivers-license">Driver's License</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="state-id">State ID</SelectItem>
            <SelectItem value="military-id">Military ID</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="idNumber">ID Number</Label>
        <Input
          id="idNumber"
          value={data.idNumber}
          onChange={(e) => updateData({ idNumber: e.target.value })}
          placeholder="Enter your ID number"
          required
        />
      </div>
    </div>
  );
};

export default TenantStep1;
