
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Suggestion {
  id: string;
  name: string;
  project_url: string;
  description: string;
  email: string | null;
  tags: string | null;
  status: string;
  created_at: string;
}

export const useSuggestions = () => {
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: async (): Promise<Suggestion[]> => {
      const { data, error } = await supabase
        .from("suggestions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching suggestions:", error);
        throw new Error(error.message);
      }

      return data || [];
    }
  });
};

export const useSuggestion = (id: string | undefined) => {
  return useQuery({
    queryKey: ["suggestion", id],
    queryFn: async (): Promise<Suggestion | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("suggestions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // PGRST116 means not found
          return null;
        }
        console.error("Error fetching suggestion:", error);
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id
  });
};
