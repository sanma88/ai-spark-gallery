
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut, Check, X, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { useState } from "react";
import { useSuggestions, Suggestion } from "@/hooks/useSuggestions";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import ProjectForm from "@/components/ProjectForm";
import SuggestionEditForm from "@/components/SuggestionEditForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const { data: suggestions, isLoading: suggestionsLoading } = useSuggestions();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const featuredCount = projects?.filter(p => p.featured).length || 0;
  const projectsCount = projects?.length || 0;
  const suggestionsCount = suggestions?.length || 0;

  const handleLogout = () => {
    signOut();
    toast.success("Déconnexion réussie");
  };

  const handleEditProject = (id: string) => {
    navigate(`/edit-project/${id}`);
  };

  const handleEditSuggestion = (suggestion: Suggestion) => {
    setEditingSuggestion(suggestion);
  };

  const handleSaveSuggestion = async (values: any) => {
    if (!editingSuggestion) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("suggestions")
        .update({
          name: values.name,
          description: values.description,
          project_url: values.project_url,
          tags: values.tags,
          email: values.email,
        })
        .eq("id", editingSuggestion.id);
      
      if (error) throw error;
      
      toast.success("Suggestion mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      setEditingSuggestion(null);
    } catch (error) {
      console.error("Error updating suggestion:", error);
      toast.error("Erreur lors de la mise à jour de la suggestion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveSuggestion = async (id: string) => {
    try {
      const suggestionToApprove = suggestions?.find(s => s.id === id);
      
      if (!suggestionToApprove) return;
      
      // First, update the suggestion status
      const { error: updateError } = await supabase
        .from("suggestions")
        .update({ status: "approved" })
        .eq("id", id);
      
      if (updateError) throw updateError;

      // Then convert the suggestion to a project
      const tags = suggestionToApprove.tags 
        ? suggestionToApprove.tags.split(',').map(tag => tag.trim()) 
        : [];
        
      const { error: insertError } = await supabase
        .from("projects")
        .insert({
          title: suggestionToApprove.name,
          description: suggestionToApprove.description,
          url: suggestionToApprove.project_url,
          image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", // Default image
          tags: tags,
          featured: false
        });
      
      if (insertError) throw insertError;
      
      toast.success("Suggestion approuvée et ajoutée à la galerie");
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      console.error("Error approving suggestion:", error);
      toast.error("Erreur lors de l'approbation de la suggestion");
    }
  };

  const handleRejectSuggestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from("suggestions")
        .update({ status: "rejected" })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("Suggestion rejetée");
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
      toast.error("Erreur lors du rejet de la suggestion");
    }
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
            <Button className="gap-2" onClick={() => setIsAddingProject(true)}>
              <PlusCircle className="h-4 w-4" />
              Ajouter un projet
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-medium mb-2">Projets totaux</h3>
            <p className="text-3xl font-bold text-primary">{projectsCount}</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-medium mb-2">Coups de cœur</h3>
            <p className="text-3xl font-bold text-primary">{featuredCount}</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-medium mb-2">Suggestions reçues</h3>
            <p className="text-3xl font-bold text-primary">{suggestionsCount}</p>
          </div>
        </div>

        {/* Liste des projets existants */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border mb-8">
          <h3 className="text-xl font-medium mb-4">Projets publiés</h3>
          <p className="text-muted-foreground mb-4">
            Liste des projets actuellement publiés dans la galerie. Vous pouvez les modifier ou les supprimer.
          </p>
          
          {projects && projects.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Coup de cœur</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell className="truncate max-w-[200px]">
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {project.url}
                          </a>
                        </TableCell>
                        <TableCell>{project.featured ? "Oui" : "Non"}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleEditProject(project.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">Aucun projet publié pour le moment.</p>
            </div>
          )}
        </div>

        {/* Liste des suggestions */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-xl font-medium mb-4">Suggestions en attente</h3>
          <p className="text-muted-foreground mb-4">
            Liste des projets suggérés par les visiteurs en attente de validation.
          </p>
          
          {suggestionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement des suggestions...</p>
            </div>
          ) : suggestions && suggestions.filter(s => s.status === 'pending').length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions.filter(s => s.status === 'pending').map((suggestion) => (
                      <TableRow key={suggestion.id}>
                        <TableCell className="font-medium">{suggestion.name}</TableCell>
                        <TableCell className="truncate max-w-[200px]">
                          <a 
                            href={suggestion.project_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {suggestion.project_url}
                          </a>
                        </TableCell>
                        <TableCell>{suggestion.email || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleEditSuggestion(suggestion)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Éditer
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleApproveSuggestion(suggestion.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectSuggestion(suggestion.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">Aucune suggestion en attente.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
        <DialogContent className="max-w-md sm:max-w-xl">
          <DialogTitle className="text-center">Ajouter un nouveau projet</DialogTitle>
          <ProjectForm onSuccess={() => setIsAddingProject(false)} />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={!!editingSuggestion} 
        onOpenChange={(open) => !open && setEditingSuggestion(null)}
      >
        <DialogContent className="max-w-md sm:max-w-xl">
          <DialogTitle className="text-center">Éditer la suggestion</DialogTitle>
          {editingSuggestion && (
            <SuggestionEditForm 
              suggestion={editingSuggestion}
              onSave={handleSaveSuggestion}
              onCancel={() => setEditingSuggestion(null)}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
