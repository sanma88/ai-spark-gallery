
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormData {
  email: string;
  password: string;
}

enum AuthMode {
  LOGIN,
  FORGOT_PASSWORD
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);
  const { signIn, user, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Utiliser useEffect pour rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add a cooldown for login attempts to prevent brute force
      if (lastAttempt && new Date().getTime() - lastAttempt.getTime() < 2000) {
        toast.error("Veuillez patienter avant de réessayer");
        setIsSubmitting(false);
        return;
      }
      
      setLastAttempt(new Date());
      
      if (authMode === AuthMode.LOGIN) {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          // Sanitize error message to not give too much information
          toast.error("Identifiants incorrects");
          console.error("Login error:", error);
        }
      } else {
        const { error } = await resetPassword(formData.email);
        
        if (error) {
          toast.error("Une erreur est survenue lors de l'envoi de l'email de réinitialisation");
          console.error("Reset password error:", error);
        } else {
          setEmailSent(true);
          toast.success("Un email de réinitialisation a été envoyé");
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion");
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === AuthMode.LOGIN ? AuthMode.FORGOT_PASSWORD : AuthMode.LOGIN);
    setEmailSent(false);
  };

  // Si l'utilisateur est déjà connecté, ne pas afficher le formulaire
  if (user) {
    return null; // Ne rien afficher pendant la redirection
  }

  return (
    <div className="min-h-screen flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-muted-foreground mt-2">
            {authMode === AuthMode.LOGIN 
              ? "Connectez-vous pour accéder au tableau de bord" 
              : "Réinitialiser votre mot de passe"}
          </p>
        </div>

        {emailSent ? (
          <div className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Un email de réinitialisation a été envoyé à {formData.email}. Veuillez vérifier votre boîte de réception.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={toggleAuthMode} 
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Retour à la connexion
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                  autoComplete={authMode === AuthMode.LOGIN ? "username" : "email"}
                />
              </div>
            </div>

            {authMode === AuthMode.LOGIN && (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {authMode === AuthMode.LOGIN ? "Connexion en cours..." : "Envoi en cours..."}
                </>
              ) : (
                authMode === AuthMode.LOGIN ? "Se connecter" : "Envoyer l'email"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-sm text-primary hover:underline focus:outline-none"
              >
                {authMode === AuthMode.LOGIN
                  ? "Mot de passe oublié ?"
                  : "Retour à la connexion"}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-4 text-sm text-center text-muted-foreground">
          <p>Contactez l'administrateur du site pour obtenir des identifiants.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
