
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import { supabase } from "@/integrations/supabase/client";
import SignupHeader from "@/components/tenant/SignupHeader";
import SignupForm from "@/components/tenant/SignupForm";

const TenantSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { role } = useUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const isExistingUser = !!user;

  // Check if user is already authenticated on load
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // If user is already authenticated
        if (user) {
          console.log("TenantSignup: User is already authenticated:", user.id);
          
          // If user does not have a role yet, allow them to stay on this page
          // but will need to select a role after signup
          if (!role) {
            console.log("User has no role yet, allowing tenant signup form");
            setIsCheckingUser(false);
            return;
          }
          
          // Verify user has tenant role before checking profile
          if (role !== 'tenant') {
            console.log("User has a non-tenant role, redirecting to role selection");
            navigate("/auth", { state: { showRoleSelection: true } });
            return;
          }
          
          // Check if user already has tenant profile
          const { data: tenantData } = await supabase
            .from('tenants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (tenantData) {
            console.log("User already has tenant profile, redirecting to dashboard");
            navigate("/tenant/dashboard");
            return;
          }
          
          // If no tenant profile yet, but user is authenticated with tenant role, 
          // prefill form with user data
          if (user.email) {
            setFormData(prev => ({
              ...prev,
              email: user.email || "",
              firstName: user.user_metadata?.first_name || "",
              lastName: user.user_metadata?.last_name || ""
            }));
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setIsCheckingUser(false);
      }
    };
    
    checkUserStatus();
  }, [user, navigate, role]);

  // Pre-fill form with data from localStorage if available
  useEffect(() => {
    const userEmail = localStorage.getItem("tenant-email");
    const firstName = localStorage.getItem("tenant-firstName");
    const lastName = localStorage.getItem("tenant-lastName");
    const phone = localStorage.getItem("tenant-phone");
    
    if (userEmail || firstName || lastName || phone) {
      setFormData(prev => ({ 
        ...prev, 
        email: userEmail || prev.email, 
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        phone: phone || prev.phone
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // If user is already authenticated, just update their info and proceed
      if (user) {
        console.log("User is already authenticated, storing info and redirecting to role selection");
        
        // Store in local storage for persistence across pages
        localStorage.setItem("tenant-email", formData.email || user.email || "");
        localStorage.setItem("tenant-phone", formData.phone);
        localStorage.setItem("tenant-firstName", formData.firstName || user.user_metadata?.first_name || "");
        localStorage.setItem("tenant-lastName", formData.lastName || user.user_metadata?.last_name || "");
        
        toast({
          title: "Information saved!",
          description: "Please select your role to continue.",
        });
        
        // Always redirect to role selection if the user is already authenticated
        // This prevents automatic assignment to tenant role
        navigate("/auth", { state: { showRoleSelection: true, intendedRole: 'tenant' } });
        return;
      }
    
      // For new users, validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
        toast({
          title: "Missing information",
          description: "Please fill out all required fields.",
        });
        setIsLoading(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure both passwords match.",
        });
        setIsLoading(false);
        return;
      }

      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (error) {
        throw error;
      }

      // Store in local storage for persistence across pages
      localStorage.setItem("tenant-email", formData.email);
      localStorage.setItem("tenant-phone", formData.phone);
      localStorage.setItem("tenant-firstName", formData.firstName);
      localStorage.setItem("tenant-lastName", formData.lastName);
      
      toast({
        title: "Account created!",
        description: "Please select your role to continue.",
      });
      
      // Redirect to the auth page for role selection
      navigate("/auth", { state: { showRoleSelection: true, intendedRole: 'tenant' } });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <p className="text-foreground/70">Checking account information...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <SignupHeader isExistingUser={isExistingUser} />

            <Card className="border-primary/20 bg-background/50 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-primary">
                  {isExistingUser ? "Complete Your Tenant Profile" : "Apply as a Tenant"}
                </CardTitle>
                <CardDescription className="text-foreground/70">
                  {isExistingUser 
                    ? "Complete your profile details to access affordable housing through our Rent Now, Pay Later solution." 
                    : "Create your account to access affordable housing through our Rent Now, Pay Later solution."}
                </CardDescription>
              </CardHeader>
              
              <SignupForm 
                user={user}
                formData={formData}
                onInputChange={handleInputChange}
                isLoading={isLoading}
                onSubmit={handleSubmit}
              />
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantSignup;
