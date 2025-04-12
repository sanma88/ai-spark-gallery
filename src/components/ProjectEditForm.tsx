
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const projectSchema = z.object({
  title: z.string().min(2, { message: "Le titre doit contenir au moins 2 caractères" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
  url: z.string().url({ message: "Veuillez entrer une URL valide" }),
  image_url: z.string().url({ message: "Veuillez entrer une URL valide pour l'image" }),
  tags: z.string().refine(value => value.trim().length > 0, {
    message: "Veuillez entrer au moins un tag",
  }),
  featured: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectEditFormProps {
  projectId: string;
  initialData: ProjectFormValues;
  onSuccess?: () => void;
}

const ProjectEditForm = ({ projectId, initialData, onSuccess }: ProjectEditFormProps) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      url: initialData.url || "",
      image_url: initialData.image_url || "",
      tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : initialData.tags || "",
      featured: initialData.featured || false,
    },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      // Convert tags string to array
      const tagsArray = values.tags.split(',').map(tag => tag.trim());
      
      const { error } = await supabase
        .from("projects")
        .update({
          title: values.title,
          description: values.description,
          url: values.url,
          image_url: values.image_url,
          tags: tagsArray,
          featured: values.featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);
      
      if (error) throw error;
      
      toast.success("Projet mis à jour avec succès !");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Erreur lors de la mise à jour du projet");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);
      
      if (error) throw error;
      
      toast.success("Projet supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Erreur lors de la suppression du projet");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Modifier le projet</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Ce projet sera définitivement supprimé de la galerie.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du projet *</FormLabel>
                <FormControl>
                  <Input placeholder="ChatGPT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Décrivez brièvement ce projet..." 
                    rows={3} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL du projet *</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemple.com" type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'image *</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemple.com/image.jpg" type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (séparés par des virgules) *</FormLabel>
                <FormControl>
                  <Input placeholder="Génératif, Images, Art" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Coup de cœur</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour en cours...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectEditForm;
