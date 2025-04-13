
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  docsUrl?: string; // Nouvelle propriété pour l'URL de documentation
  tags: string[];
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const handleCardClick = () => {
    window.open(project.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="project-card group h-full cursor-pointer" 
      onClick={handleCardClick}
    >
      {project.featured && (
        <span className="featured-badge animate-pulse-glow">Coup de cœur</span>
      )}
      
      <img 
        src={project.imageUrl} 
        alt={project.title} 
        className="h-60 w-full object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{project.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs">
          <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary underline decoration-primary decoration-1 underline-offset-2 hover:text-primary/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Projet <ExternalLink size={12} />
          </a>
          
          {project.docsUrl && (
            <a 
              href={project.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary underline decoration-primary decoration-1 underline-offset-2 hover:text-primary/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Documentation <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
