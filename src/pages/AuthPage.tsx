import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import RoleSelection from "@/components/role-selection/RoleSelection";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [intendedRole, setIntendedRole] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the location state has the 'showSignup' property
    if (location.state && location.state.showSignup === true) {
      setIsLogin(false);
    }

    // Check if the location state has the 'showRoleSelection' property
    if (location.state && location.state.showRoleSelection === true) {
      setShowRoleSelection(true);
    }

    // Check if the location state has the 'intendedRole' property
    if (location.state && location.state.intendedRole) {
      setIntendedRole(location.state.intendedRole);
    }
  }, [location.state]);

  const handleAuthAction = async () => {
    setIsLoading(true);
    try {
      if (isLogin) {
        // Sign In
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
      } else {
        // Sign Up
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

        setShowRoleSelection(true);
      }
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

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleRoleSelectionComplete = () => {
    // After role selection, navigate to the appropriate dashboard
    navigate("/");
  };

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[450px] p-4">
        {showRoleSelection ? (
          <RoleSelection
            email={email}
            onComplete={handleRoleSelectionComplete}
            intendedRole={intendedRole}
          />
        ) : (
          <div className="grid gap-6">
            <div className="flex flex-col space-y-1.5 text-center">
              <h1 className="text-2xl font-semibold">
                {isLogin ? "Login" : "Create an account"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Enter your email and password to login"
                  : "Enter your details to create an account"}
              </p>
            </div>
            {!isLogin && (
              <>
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
              </>
            )}
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
            <Button onClick={handleAuthAction} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
            <Separator />
            <div className="text-center">
              <Button variant="link" size="sm" onClick={toggleAuthMode}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
