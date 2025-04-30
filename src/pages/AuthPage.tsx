
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoleSelection from "@/components/RoleSelection";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useUserRole } from "@/components/UserRoleProvider";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { role, isLoadingRole } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const [checkingExistingData, setCheckingExistingData] = useState(true);
  
  // Get state from location if passed
  const showSignupFromState = location.state?.showSignup;
  const intendedRole = location.state?.intendedRole;
  const showRoleSelection = location.state?.showRoleSelection;

  // Set the default tab based on state
  const [activeTab, setActiveTab] = useState(showSignupFromState ? "signup" : "login");

  // Check if user is already authenticated on load and redirect if needed
  useEffect(() => {
    if (!user || isLoadingRole) {
      if (!isLoadingRole && !user) {
        setCheckingExistingData(false);
      }
      return;
    }

    const checkUserAndRedirect = async () => {
      try {
        console.log("AuthPage: Checking user status:", { user, role, showRoleSelection });
        
        // If showRoleSelection is explicitly set to true, show role selection regardless of other factors
        if (showRoleSelection) {
          console.log("showRoleSelection is true, showing role selection");
          setAuthCompleted(true);
          setCheckingExistingData(false);
          return;
        }
        
        // Get redirect path if one was saved
        const redirectPath = sessionStorage.getItem('redirectAfterAuth');
        
        // If user is already authenticated and has a role, check their status and redirect
        if (role) {
          switch (role) {
            case "tenant":
              await handleTenantRedirect(redirectPath);
              break;
            case "landlord":
              await handleLandlordRedirect(redirectPath);
              break;
            case "admin":
              navigate(redirectPath || '/admin/dashboard');
              break;
            default:
              // No recognized role, show role selection
              setAuthCompleted(true);
              setCheckingExistingData(false);
          }
        } else {
          // No role yet, show role selection
          console.log("User authenticated but no role set, showing role selection");
          setAuthCompleted(true);
          setCheckingExistingData(false);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        setCheckingExistingData(false);
      }
    };

    // Helper function to handle tenant redirect logic
    const handleTenantRedirect = async (redirectPath?: string | null) => {
      // Check if tenant has a profile
      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (tenant) {
        // Check if tenant has applications
        const { count } = await supabase
          .from('tenant_applications')
          .select('id', { count: 'exact' })
          .eq('tenant_id', tenant.id)
          .limit(1);
          
        if (count && count > 0) {
          console.log("Tenant found with application, redirecting to dashboard");
          navigate(redirectPath || '/tenant/dashboard');
        } else {
          console.log("Tenant found without application, redirecting to application");
          navigate('/tenant/application');
        }
      } else {
        console.log("Tenant role but no tenant found, redirecting to signup");
        navigate('/tenant-signup');
      }
    };
    
    // Helper function to handle landlord redirect logic
    const handleLandlordRedirect = async (redirectPath?: string | null) => {
      // Check if landlord has a profile
      const { data: landlord } = await supabase
        .from('landlords')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (landlord) {
        console.log("Landlord profile found, redirecting to dashboard");
        navigate(redirectPath || '/landlord/dashboard');
      } else {
        // No landlord profile, create one
        console.log("Landlord role but no profile, redirecting to property wizard");
        navigate('/landlord/property/new');
      }
    };

    checkUserAndRedirect();
  }, [user, role, isLoadingRole, navigate, showRoleSelection]);

  // Handle signup from intended role
  useEffect(() => {
    if (intendedRole) {
      localStorage.setItem("intended-role", intendedRole);
    }
  }, [intendedRole]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);
    
    const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (signUpError) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: signUpError.message,
      });
      setLoading(false);
      return;
    }

    // Store in local storage for persistence across pages
    localStorage.setItem("tenant-email", email);
    localStorage.setItem("tenant-firstName", firstName);
    localStorage.setItem("tenant-lastName", lastName);

    toast({
      title: "Account Created Successfully",
      description: "Please select how you'd like to use Doorways.",
    });
    setAuthCompleted(true);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error logging in",
          description: error.message,
        });
        setLoading(false);
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in",
        });
        // We'll set authCompleted to true here to begin role checking
        // If the user has a role, the useEffect will handle the redirect
        // If the user has no role, they will be shown the role selection component
        setAuthCompleted(true);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error logging in",
        description: error.message || "An unexpected error occurred",
      });
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const breadcrumbItems = [
    { label: "Authentication", active: true }
  ];

  // If we're still checking user data, show loading
  if (user && checkingExistingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="mx-auto max-w-md text-center">
            <p className="text-foreground/70">Checking account information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mx-auto max-w-md">
          <BreadcrumbNav items={breadcrumbItems} />
          
          {/* Show auth form if not authenticated yet */}
          {!authCompleted && !user ? (
            <Card className="border-primary/20 bg-background/50 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-primary">Welcome</CardTitle>
                <CardDescription className="text-foreground/70">
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                      {/* Login form content */}
                      <div className="space-y-1">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Mail className="h-5 w-5" />
                          </div>
                          <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                        variant="default"
                      >
                        {loading ? "Logging in..." : "Log In"}
                      </Button>
                      
                      <p className="text-sm text-center text-white/50 mt-4">
                        Don't have an account yet? <button type="button" onClick={() => setActiveTab("signup")} className="text-primary hover:underline">Sign Up</button>
                      </p>
                    </form>
                  </CardContent>
                </TabsContent>
                <TabsContent value="signup">
                  <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-5">
                      {/* Signup form content */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* First name and last name inputs */}
                        <div className="space-y-1">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                              <User className="h-5 w-5" />
                            </div>
                            <Input
                              type="text"
                              placeholder="First name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                              <User className="h-5 w-5" />
                            </div>
                            <Input
                              type="text"
                              placeholder="Last name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Mail className="h-5 w-5" />
                          </div>
                          <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {password && (
                          <div className="h-1 w-full bg-gray-300 mt-1">
                            <div 
                              className={`h-full ${
                                password.length < 6 ? "bg-red-500 w-1/3" : 
                                password.length < 10 ? "bg-yellow-500 w-2/3" : 
                                "bg-green-500 w-full"
                              }`}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                        variant="default"
                      >
                        {loading ? "Creating account..." : "Sign Up"}
                      </Button>
                      
                      <p className="text-sm text-center text-white/50 mt-4">
                        Already have an account? <button type="button" onClick={() => setActiveTab("login")} className="text-primary hover:underline">Log In</button>
                      </p>
                    </form>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            /* Show role selection after authentication */
            <Card className="border-primary/20 bg-background/50 shadow-lg">
              <CardContent className="pt-6">
                <RoleSelection 
                  email={email} 
                  intendedRole={intendedRole}
                  onComplete={() => {
                    // Reset state if needed
                    setEmail("");
                    setPassword("");
                    setAuthCompleted(false);
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
