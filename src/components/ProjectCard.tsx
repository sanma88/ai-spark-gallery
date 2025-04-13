
import { ExternalLink } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  docsUrl?: string;
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
