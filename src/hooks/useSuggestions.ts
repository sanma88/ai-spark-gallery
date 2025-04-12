
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
