
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface SuggestionFormData {
  name: string;
  project_url: string;
  description: string;
  email: string;
  tags: string;
}

const initialFormData: SuggestionFormData = {
  name: "",
  project_url: "",
  description: "",
  email: "",
  tags: ""
};

const SuggestPage = () => {
  const [formData, setFormData] = useState<SuggestionFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('suggestions')
        .insert({
          name: formData.name,
          project_url: formData.project_url,
          description: formData.description,
          email: formData.email || null,
          tags: formData.tags || null,
          status: 'pending'
        });

      if (error) throw error;
      
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Votre suggestion a été envoyée avec succès !");
      setFormData(initialFormData);
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      toast.error("Une erreur est survenue lors de l'envoi de votre suggestion");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Suggérer un projet
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Vous connaissez un projet IA innovant ? Partagez-le avec notre communauté !
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du projet *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ex: MidJourney"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_url">URL du projet *</Label>
              <Input
                id="project_url"
                name="project_url"
                value={formData.project_url}
                onChange={handleChange}
                placeholder="https://exemple.com"
                type="url"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez brièvement ce projet et ce qui le rend intéressant..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="ex: Génératif, Images, Art"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Votre email (facultatif)</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                type="email"
              />
              <p className="text-xs text-muted-foreground">
                Uniquement pour vous informer si votre suggestion est publiée.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Envoyé avec succès !
                </>
              ) : (
                "Envoyer ma suggestion"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuggestPage;
