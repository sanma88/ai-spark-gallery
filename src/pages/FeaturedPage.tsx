
import ProjectsGrid from "@/components/ProjectsGrid";
import { projects } from "@/data/projects";

const FeaturedPage = () => {
  const featuredProjects = projects.filter(project => project.featured);
  
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

      <ProjectsGrid 
        projects={featuredProjects} 
        showRandomButton={false}
        showFilters={false}
      />
    </div>
  );
};

export default FeaturedPage;
