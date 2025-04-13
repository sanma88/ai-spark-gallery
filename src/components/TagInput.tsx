
import { useState, useEffect } from 'react';
import { PlusCircle, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface TagSuggestion {
  tag: string;
  count: number;
}

const TagInput = ({ value, onChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([]);
  const [open, setOpen] = useState(false);

  // Load existing tags from projects
  useEffect(() => {
    loadExistingTags();
  }, []);

  // Initialize tags from value
  useEffect(() => {
    if (value) {
      setTags(value.split(',').map(tag => tag.trim()).filter(tag => tag));
    } else {
      setTags([]);
    }
  }, [value]);

  // Update parent component when tags change
  useEffect(() => {
    onChange(tags.join(', '));
  }, [tags, onChange]);

  const loadExistingTags = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('tags');
      
      if (error) {
        console.error('Error loading tags:', error);
        return;
      }

      // Extract all tags and count occurrences
      const allTags: Record<string, number> = {};
      data.forEach(project => {
        if (Array.isArray(project.tags)) {
          project.tags.forEach((tag: string) => {
            allTags[tag] = (allTags[tag] || 0) + 1;
          });
        }
      });

      // Convert to array and sort by usage count
      const suggestions: TagSuggestion[] = Object.entries(allTags)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      setTagSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading tag suggestions:', error);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleSelectTag = (tag: string) => {
    addTag(tag);
    setOpen(false);
  };

  // Filter suggestions based on input
  const filteredSuggestions = tagSuggestions.filter(
    suggestion => suggestion.tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px]">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-sm"
          >
            <Tag className="h-3 w-3" />
            <span>{tag}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full"
              onClick={() => removeTag(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        <div className="flex-1 min-w-[200px]">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex w-full">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ajouter un tag..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher un tag..." />
                <CommandList>
                  <CommandEmpty>
                    {inputValue ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        <p>Tag non trouvé</p>
                        <Button 
                          variant="outline"
                          className="w-full justify-start mt-2 text-left"
                          onClick={() => handleSelectTag(inputValue)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Ajouter "{inputValue}"
                        </Button>
                      </div>
                    ) : (
                      <p className="p-2 text-sm text-muted-foreground">Aucun tag disponible</p>
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredSuggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.tag}
                        value={suggestion.tag}
                        onSelect={handleSelectTag}
                        className="flex items-center gap-2"
                      >
                        <Tag className="h-4 w-4" />
                        <span>{suggestion.tag}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {suggestion.count} projet{suggestion.count > 1 ? 's' : ''}
                        </span>
                      </CommandItem>
                    ))}
                    {inputValue && !filteredSuggestions.some(s => s.tag.toLowerCase() === inputValue.toLowerCase()) && (
                      <CommandItem
                        value={inputValue}
                        onSelect={handleSelectTag}
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>Créer "{inputValue}"</span>
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default TagInput;
