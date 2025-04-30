
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { Icons } from "@/components/Icons";
import { useAuth } from "@/components/AuthProvider";

interface LoginFormProps {
  onToggleAuthMode: () => void;
}

const LoginForm = ({ onToggleAuthMode }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const credentials: SignInWithPasswordCredentials = {
        email: email,
        password: password,
      };
      await signIn(credentials);
      toast({
        title: "Login successful",
        description: "You have successfully logged in.",
      });
      // No navigation here; AuthGuard handles redirection
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
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-muted-foreground">
          Enter your email and password to login
        </p>
      </div>
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
      <Button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Sign In"
        )}
      </Button>
      <div className="text-center">
        <Button variant="link" size="sm" onClick={onToggleAuthMode}>
          Don't have an account? Sign Up
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
