
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProjectEditForm from "@/components/ProjectEditForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) throw new Error("Project ID is required");
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const handleSuccess = () => {
    navigate("/admin");
  };

  const handleBack = () => {
    navigate("/admin");
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6 gap-2" 
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'administration
        </Button>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <h3 className="font-bold mb-2">Erreur</h3>
            <p>Impossible de charger les détails du projet. Veuillez réessayer plus tard.</p>
          </div>
        ) : project ? (
          <ProjectEditForm
            projectId={id!}
            initialData={project}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="bg-muted p-4 rounded-md">
            <p>Projet non trouvé.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default EditProjectPage;
