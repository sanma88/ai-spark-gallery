
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
  resetPassword: (email: string) => Promise<{ error: any | null; data: any | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token has been refreshed');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Setup session expiry detection
    const checkSessionExpiry = () => {
      // Get current session using getSession instead of directly accessing it
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (currentSession?.expires_at) {
          const expiresAt = new Date(currentSession.expires_at * 1000);
          const now = new Date();
          const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
          
          if (expiresAt < now) {
            toast.error("Votre session a expiré. Veuillez vous reconnecter.");
            signOut();
          } else if (expiresAt < fiveMinutesFromNow) {
            // Refresh token if it's about to expire
            supabase.auth.refreshSession();
            toast.info("Votre session a été prolongée");
          }
        }
      });
    };

    // Check session expiry every minute
    const intervalId = setInterval(checkSessionExpiry, 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Limiter le nombre de tentatives de connexion (simulation)
      const loginAttempts = sessionStorage.getItem(`loginAttempts_${email}`) || '0';
      const attempts = parseInt(loginAttempts, 10);
      
      if (attempts >= 5) {
        const lastAttempt = sessionStorage.getItem(`lastLoginAttempt_${email}`);
        const now = new Date().getTime();
        
        if (lastAttempt && now - parseInt(lastAttempt, 10) < 15 * 60 * 1000) {
          return { 
            data: null, 
            error: new Error("Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.") 
          };
        } else {
          // Reset counter after 15 minutes
          sessionStorage.setItem(`loginAttempts_${email}`, '0');
        }
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Increment login attempts on failure
        sessionStorage.setItem(`loginAttempts_${email}`, (attempts + 1).toString());
        sessionStorage.setItem(`lastLoginAttempt_${email}`, new Date().getTime().toString());
      } else if (data?.session) {
        // Reset login attempts on success
        sessionStorage.removeItem(`loginAttempts_${email}`);
        sessionStorage.removeItem(`lastLoginAttempt_${email}`);
        navigate("/admin");
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  
  // Add reset password functionality
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    signIn,
    signOut,
    loading,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
