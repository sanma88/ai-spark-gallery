
import ProjectsGrid from "@/components/ProjectsGrid";
import { projects } from "@/data/projects";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Découvrez l'innovation en IA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Une curation des projets les plus impressionnants et inspirants dans le domaine de l'intelligence artificielle.
          </p>
        </div>
      </div>

      <ProjectsGrid 
        projects={projects}
        title="Tous les projets"
        description="Explorez notre collection de projets IA innovants et découvrez ce qui façonne l'avenir de la technologie."
      />
    </div>
  );
};

export default HomePage;
