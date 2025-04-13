
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/components/ProjectCard";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        throw new Error(error.message);
      }

      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        url: item.url,
        docsUrl: item.docs_url || undefined,
        tags: item.tags || [],
        featured: item.featured || false
      }));
    }
  });
};

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ["featured-projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching featured projects:", error);
        throw new Error(error.message);
      }

      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        url: item.url,
        docsUrl: item.docs_url || undefined,
        tags: item.tags || [],
        featured: item.featured || false
      }));
    }
  });
};
