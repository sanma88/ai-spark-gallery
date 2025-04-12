
import ProjectsGrid from "@/components/ProjectsGrid";
import { useFeaturedProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedPage = () => {
  const { data: featuredProjects, isLoading, error } = useFeaturedProjects();
  
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Coups de cœur
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Notre sélection de projets IA exceptionnels qui se démarquent par leur innovation et leur impact.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="h-60 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Une erreur est survenue</h2>
          <p className="text-muted-foreground">Impossible de charger les projets. Veuillez réessayer plus tard.</p>
        </div>
      ) : (
        <ProjectsGrid 
          projects={featuredProjects || []}
          showRandomButton={false}
          showFilters={false}
        />
      )}
    </div>
  );
};

export default FeaturedPage;
