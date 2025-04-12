
import { useState } from 'react';
import ProjectCard, { Project } from './ProjectCard';
import { Button } from "@/components/ui/button";
import { Shuffle, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProjectsGridProps {
  projects: Project[];
  title?: string;
  description?: string;
  showRandomButton?: boolean;
  showFilters?: boolean;
}

const ProjectsGrid = ({ 
  projects, 
  title, 
  description, 
  showRandomButton = true,
  showFilters = true
}: ProjectsGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [randomIndex, setRandomIndex] = useState<number | null>(null);

  // Extract all unique tags
  const allTags = [...new Set(projects.flatMap(project => project.tags))];

  // Filter projects based on search term and selected tag
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? project.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const getRandomProject = () => {
    if (filteredProjects.length === 0) return;
    const newIndex = Math.floor(Math.random() * filteredProjects.length);
    setRandomIndex(newIndex);
    
    // Scroll to the random project
    setTimeout(() => {
      const element = document.getElementById(`project-${filteredProjects[newIndex].id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('animate-pulse-glow');
        setTimeout(() => {
          element.classList.remove('animate-pulse-glow');
        }, 2000);
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
      )}

      {showFilters && (
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un projet..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === '' ? "default" : "outline"}
              className="rounded-full text-xs h-8"
              onClick={() => setSelectedTag('')}
            >
              Tous
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="rounded-full text-xs h-8"
                onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {showRandomButton && filteredProjects.length > 0 && (
        <div className="flex justify-center mb-8">
          <Button onClick={getRandomProject} className="gap-2">
            <Shuffle className="h-4 w-4" />
            Projet aléatoire
          </Button>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Aucun projet trouvé</h3>
          <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              id={`project-${project.id}`}
              className={randomIndex === index ? 'animate-float' : ''}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsGrid;
