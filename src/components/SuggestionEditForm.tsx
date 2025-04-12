
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
import { Loader2 } from "lucide-react";
import { Suggestion } from "@/hooks/useSuggestions";

const suggestionSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
  project_url: z.string().url({ message: "Veuillez entrer une URL valide" }),
  tags: z.string(),
  email: z.string().email({ message: "Veuillez entrer un email valide" }).nullable().optional(),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

interface SuggestionEditFormProps {
  suggestion: Suggestion;
  onSave: (values: SuggestionFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const SuggestionEditForm = ({ 
  suggestion, 
  onSave, 
  onCancel, 
  isSubmitting 
}: SuggestionEditFormProps) => {
  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      name: suggestion.name || "",
      description: suggestion.description || "",
      project_url: suggestion.project_url || "",
      tags: suggestion.tags || "",
      email: suggestion.email || "",
    },
  });

  const onSubmit = async (values: SuggestionFormValues) => {
    await onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du projet *</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="project_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL du projet *</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
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
              <FormLabel>Tags (séparés par des virgules)</FormLabel>
              <FormControl>
                <Input placeholder="Génératif, Images, Art" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optionnel)</FormLabel>
              <FormControl>
                <Input type="email" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SuggestionEditForm;
