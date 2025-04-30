
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

interface SignupHeaderProps {
  isExistingUser: boolean;
}

const SignupHeader = ({ isExistingUser }: SignupHeaderProps) => {
  const getBreadcrumbItems = () => {
    if (isExistingUser) {
      return [
        { label: "Apply", href: "/apply" },
        { label: "Complete Profile", active: true },
      ];
    } else {
      return [
        { label: "Apply", href: "/apply" },
        { label: "Create Account", active: true },
      ];
    }
  };

  return (
    <>
      <BreadcrumbNav items={getBreadcrumbItems()} />
      
      <div className="mb-6">
        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: "33%" }}></div>
        </div>
        <div className="flex justify-between text-xs text-white/60">
          <span>{isExistingUser ? "Complete Profile" : "Create Account"}</span>
          <span>Basic Info</span>
          <span>Complete</span>
        </div>
      </div>
    </>
  );
};

export default SignupHeader;
