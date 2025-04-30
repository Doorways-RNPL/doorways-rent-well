
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Mail, Phone, Lock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";
import { supabase } from "@/integrations/supabase/client";

const TenantSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { role } = useUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isCheckingUser, setIsCheckingUser] = useState(true);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  // Determine if this is a new user signup or existing user completing profile
  const isExistingUser = !!user;
  
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
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <User className="h-5 w-5" />
                        </div>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="First name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <User className="h-5 w-5" />
                        </div>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Phone className="h-5 w-5" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(+27) XX XXX XXXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {!user && (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="h-1 w-full bg-gray-300 mt-1">
                            <div 
                              className={`h-full ${
                                formData.password.length < 6 ? "bg-red-500 w-1/3" : 
                                formData.password.length < 10 ? "bg-yellow-500 w-2/3" : 
                                "bg-green-500 w-full"
                              }`}
                            ></div>
                          </div>
                        )}
                        <p className="text-xs text-white/60 mt-1">Password must be at least 6 characters</p>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (isExistingUser ? "Saving information..." : "Creating account...") 
                      : (isExistingUser ? "Complete Profile" : "Create Account & Continue")}
                  </Button>
                  
                  {!user && (
                    <div className="space-y-2">
                      <p className="text-sm text-center text-white/50">
                        Already have an account? <a href="/auth" className="text-primary hover:underline">Log in</a>
                      </p>
                      <p className="text-sm text-center text-white/50">
                        Looking to list your property? <a href="/auth" className="text-primary hover:underline">Sign up as a landlord</a>
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantSignup;
