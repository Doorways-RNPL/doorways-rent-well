
import { CardContent, CardDescription, CardHeader, CardTitle, Card } from "@/components/ui/card";
import { User, Home, Shield } from "lucide-react";

type RoleType = "tenant" | "landlord" | "admin";

interface RoleCardProps {
  type: RoleType;
  isSelected: boolean;
  onClick: () => void;
}

const RoleCard = ({ type, isSelected, onClick }: RoleCardProps) => {
  const roleInfo = {
    tenant: {
      icon: <User className="h-6 w-6 text-primary" />,
      title: "Tenant",
      description: "I want to apply for affordable housing with reduced upfront costs"
    },
    landlord: {
      icon: <Home className="h-6 w-6 text-primary" />,
      title: "Landlord",
      description: "I want to list my property and find reliable tenants"
    },
    admin: {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Admin",
      description: "I am an administrator and want to manage the platform"
    }
  };

  const { icon, title, description } = roleInfo[type];

  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary ${isSelected ? "border-primary bg-primary/5" : "border-white/20 bg-white/5"}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2 mx-auto">
          {icon}
        </div>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
