
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    if (!loading) {
      if (user) {
        setIsAuthorized(true);
      } else {
        toast.error("Veuillez vous connecter pour accéder à cette page");
        navigate("/login");
      }
    } else if (loading) {
      // Ajouter un timeout pour éviter une attente infinie
      timeoutId = window.setTimeout(() => {
        if (loading) {
          toast.error("La vérification de votre session prend plus de temps que prévu");
          navigate("/login");
        }
      }, 5000);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;
