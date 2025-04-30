
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { Icons } from "@/components/Icons";
import { useAuth } from "@/components/AuthProvider";
import { Separator } from "@/components/ui/separator";

interface SignupFormProps {
  onToggleAuthMode: () => void;
  onSignupComplete: () => void;
}

const SignupForm = ({ onToggleAuthMode, onSignupComplete }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const credentials: SignUpWithPasswordCredentials = {
        email: email,
        password: password,
      };
      await signUp(credentials);

      // Store basic info in localStorage for later use
      localStorage.setItem("tenant-firstName", firstName);
      localStorage.setItem("tenant-lastName", lastName);
      localStorage.setItem("tenant-email", email);

      toast({
        title: "Signup successful",
        description:
          "Your account has been created. Please check your email to verify your account.",
      });

      onSignupComplete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-muted-foreground">
          Enter your details to create an account
        </p>
      </div>
      <Separator />
      <div className="grid gap-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder="John"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          placeholder="Doe"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Separator />
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="johndoe@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button onClick={handleSignup} disabled={isLoading}>
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Sign Up"
        )}
      </Button>
      <Separator />
      <div className="text-center">
        <Button variant="link" size="sm" onClick={onToggleAuthMode}>
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
};

export default SignupForm;
