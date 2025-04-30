
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import RoleSelection from "@/components/role-selection/RoleSelection";

interface RoleSelectionFormProps {
  email: string;
  onComplete: () => void;
  intendedRole?: string;
}

const RoleSelectionForm = ({ email, onComplete, intendedRole }: RoleSelectionFormProps) => {
  return (
    <div className="p-6">
      <RoleSelection
        email={email}
        onComplete={onComplete}
        intendedRole={intendedRole}
      />
    </div>
  );
};

export default RoleSelectionForm;
