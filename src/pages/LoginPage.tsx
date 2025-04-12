
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate("/admin");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error("Identifiants incorrects");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-muted-foreground mt-2">
            Connectez-vous pour accéder au tableau de bord
          </p>
        </div>

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
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-sm text-center text-muted-foreground">
          <p>Contactez l'administrateur du site pour obtenir des identifiants.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
