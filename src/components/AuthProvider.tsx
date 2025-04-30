
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<any>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<any>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInWithPasswordCredentials) => {
    return supabase.auth.signInWithPassword(credentials);
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    return supabase.auth.signUp(credentials);
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
