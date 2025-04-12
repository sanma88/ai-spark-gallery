
import { ExternalLink } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  tags: string[];
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="project-card group h-full">
      {project.featured && (
        <span className="featured-badge animate-pulse-glow">Coup de cœur</span>
      )}
      
      <img 
        src={project.imageUrl} 
        alt={project.title} 
        className="h-60 w-full object-cover"
      />
      
      <div className="overlay"></div>
      
      <div className="content">
        <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
        <p className="text-white/80 text-sm line-clamp-2 mb-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span key={tag} className="tag tag-dark">
              {tag}
            </span>
          ))}
        </div>
        
        <a 
          href={project.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-white underline decoration-primary decoration-2 underline-offset-2 font-medium text-sm hover:text-primary transition-colors"
        >
          Voir le projet <ExternalLink size={14} />
        </a>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{project.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
