
import { useState, useEffect } from 'react';
import ProjectCard, { Project } from './ProjectCard';
import { Button } from "@/components/ui/button";
import { Shuffle, Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [displayedTags, setDisplayedTags] = useState<string[]>([]);

  // Extract all unique tags
  const allTags = [...new Set(projects.flatMap(project => project.tags))];

  // Determine which tags to display based on a maximum threshold
  useEffect(() => {
    if (allTags.length > 0) {
      // Limit displayed tags to 5 most commonly used tags
      const tagCounts = allTags.reduce((acc, tag) => {
        const count = projects.filter(project => project.tags.includes(tag)).length;
        acc[tag] = count;
        return acc;
      }, {} as Record<string, number>);
      
      const sortedTags = [...allTags].sort((a, b) => tagCounts[b] - tagCounts[a]);
      setDisplayedTags(sortedTags.slice(0, 5));
    }
  }, [projects, allTags]);

  // Filter projects based on search term and selected tag
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? project.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const getRandomProject = () => {
    if (filteredProjects.length === 0) return;
    
    // Clear previous random state
    setRandomIndex(null);
    
    // Set new random index with slight delay to ensure animation triggers
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * filteredProjects.length);
      setRandomIndex(newIndex);
      
      // Scroll to the random project
      setTimeout(() => {
        const element = document.getElementById(`project-${filteredProjects[newIndex].id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('random-project-highlight');
          setTimeout(() => {
            element.classList.remove('random-project-highlight');
          }, 2000);
        }
      }, 100);
    }, 50);
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
          
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant={selectedTag === '' ? "default" : "outline"}
              className="rounded-full text-xs h-8"
              onClick={() => setSelectedTag('')}
            >
              Tous
            </Button>
            
            {/* Display a few common tags directly */}
            {displayedTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="rounded-full text-xs h-8"
                onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
              >
                {tag}
              </Button>
            ))}
            
            {/* Show dropdown for remaining tags if there are more */}
            {allTags.length > displayedTags.length && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full text-xs h-8">
                    Plus de tags <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    {allTags
                      .filter(tag => !displayedTags.includes(tag))
                      .sort()
                      .map(tag => (
                        <DropdownMenuItem 
                          key={tag}
                          className={selectedTag === tag ? "bg-primary/10" : ""}
                          onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                        >
                          {tag}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
