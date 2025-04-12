
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
import { Loader2 } from "lucide-react";

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

interface ProjectFormProps {
  onSuccess?: () => void;
  initialData?: Partial<ProjectFormValues>;
}

const ProjectForm = ({ onSuccess, initialData }: ProjectFormProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      url: initialData?.url || "",
      image_url: initialData?.image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      tags: initialData?.tags || "",
      featured: initialData?.featured || false,
    },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      // Convert tags string to array
      const tagsArray = values.tags.split(',').map(tag => tag.trim());
      
      const { error } = await supabase
        .from("projects")
        .insert({
          title: values.title,
          description: values.description,
          url: values.url,
          image_url: values.image_url,
          tags: tagsArray,
          featured: values.featured,
        });
      
      if (error) throw error;
      
      toast.success("Projet ajouté avec succès !");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Erreur lors de l'ajout du projet");
    }
  };

  return (
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
                Envoi en cours...
              </>
            ) : (
              "Ajouter le projet"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
