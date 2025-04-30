
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Mail, Phone, Lock, User } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  user: SupabaseUser | null;
  formData: SignupFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const SignupForm = ({ user, formData, onInputChange, isLoading, onSubmit }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isExistingUser = !!user;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-5">
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
  );
};

export default SignupForm;
