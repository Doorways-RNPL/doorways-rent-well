
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

const TenantSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  // Check if user is coming from role selection
  useEffect(() => {
    const userRole = localStorage.getItem("user-role");
    const userEmail = localStorage.getItem("tenant-email");
    
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }
    
    if (userRole !== "tenant" && !userEmail) {
      toast({
        title: "Information",
        description: "Please select your role before proceeding.",
      });
    }
  }, [toast]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // For demo purposes, we'll simulate a successful signup
    setTimeout(() => {
      // Store in local storage for persistence across pages
      localStorage.setItem("tenant-email", formData.email);
      localStorage.setItem("tenant-phone", formData.phone);
      localStorage.setItem("tenant-firstName", formData.firstName);
      localStorage.setItem("tenant-lastName", formData.lastName);
      localStorage.setItem("user-role", "tenant");
      
      toast({
        title: "Account created!",
        description: "You can now complete your application.",
      });
      
      // Redirect to the application form
      navigate("/tenant/application");
      
      setIsLoading(false);
    }, 1500);
  };

  const breadcrumbItems = [
    { label: "Apply", href: "/apply" },
    { label: "Create Account", active: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <BreadcrumbNav items={breadcrumbItems} />
            
            <div className="mb-6">
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "33%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>Create Account</span>
                <span>Basic Info</span>
                <span>Complete</span>
              </div>
            </div>

            <Card className="border-primary/20 bg-background/50 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-primary">Start Your Tenant Journey</CardTitle>
                <CardDescription className="text-foreground/70">
                  Create your account to access affordable housing through our Rent Now, Pay Later solution.
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

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account & Continue"}
                  </Button>
                  
                  <p className="text-sm text-center text-white/50 mt-4">
                    Already have an account? <a href="/auth" className="text-primary hover:underline">Log in</a>
                  </p>
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
