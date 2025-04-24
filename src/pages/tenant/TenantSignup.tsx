
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const TenantSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!formData.email || !formData.phone || !formData.password) {
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
      
      toast({
        title: "Account created!",
        description: "You can now complete your application.",
      });
      
      // Redirect to the application form
      navigate("/tenant/application");
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-primary mb-2">Start Your Tenant Journey</h1>
              <p className="text-white/70">
                Create your account to access affordable housing through our Rent Now, Pay Later solution.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-black hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account & Continue"}
              </Button>
              
              <p className="text-sm text-center text-white/50 mt-4">
                Already have an account? <a href="/login" className="text-primary hover:underline">Log in</a>
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantSignup;
