
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour accéder à cette page");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Administration
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Gérez votre galerie de projets IA
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Tableau de bord</h2>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Ajouter un projet
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-medium mb-2">Projets totaux</h3>
            <p className="text-3xl font-bold text-primary">7</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-medium mb-2">Coups de cœur</h3>
            <p className="text-3xl font-bold text-primary">3</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-medium mb-2">Suggestions reçues</h3>
            <p className="text-3xl font-bold text-primary">2</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border mb-8">
          <h3 className="text-xl font-medium mb-4">Gestion des projets</h3>
          <p className="text-muted-foreground mb-8">
            Dans une version complète de l'application, cette section permettrait d'ajouter, modifier ou supprimer 
            des projets via une interface intuitive.
          </p>
          <div className="flex justify-center">
            <Button disabled>Fonctionnalité à venir</Button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-xl font-medium mb-4">Suggestions en attente</h3>
          <p className="text-muted-foreground mb-4">
            Liste des projets suggérés par les visiteurs en attente de validation.
          </p>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">URL</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 text-sm">Llama 3</td>
                    <td className="px-4 py-3 text-sm">https://ai.meta.com/llama/</td>
                    <td className="px-4 py-3 text-sm">visitor@example.com</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        Voir
                      </Button>
                      <Button size="sm">
                        Approuver
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">Gemini Pro</td>
                    <td className="px-4 py-3 text-sm">https://gemini.google.com/</td>
                    <td className="px-4 py-3 text-sm">-</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        Voir
                      </Button>
                      <Button size="sm">
                        Approuver
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
