
import { Project } from "../components/ProjectCard";

export const projects: Project[] = [
  {
    id: "1",
    title: "Midjourney",
    description: "Un outil de génération d'images basé sur l'IA, créant des visuels de haute qualité à partir de descriptions textuelles.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    url: "https://www.midjourney.com/",
    tags: ["Génératif", "Images", "Art"],
    featured: true
  },
  {
    id: "2",
    title: "ChatGPT",
    description: "Un modèle de langage conversationnel qui peut dialoguer sur presque n'importe quel sujet et aider à diverses tâches.",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    url: "https://chat.openai.com/",
    tags: ["Génératif", "Texte", "Conversation"]
  },
  {
    id: "3",
    title: "Stable Diffusion",
    description: "Un modèle open-source de génération d'images qui a révolutionné l'accessibilité à la création visuelle par IA.",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    url: "https://stability.ai/",
    tags: ["Génératif", "Images", "Open Source"]
  },
  {
    id: "4",
    title: "Runway ML",
    description: "Une plateforme créative qui propose des outils d'IA pour l'édition vidéo, la génération d'images et plus encore.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    url: "https://runwayml.com/",
    tags: ["Vidéo", "Édition", "Studio"]
  },
  {
    id: "5",
    title: "DALL-E",
    description: "Un système d'IA développé par OpenAI capable de créer des images réalistes à partir de descriptions textuelles.",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    url: "https://openai.com/dall-e-2",
    tags: ["Génératif", "Images", "OpenAI"],
    featured: true
  },
  {
    id: "6",
    title: "Anthropic Claude",
    description: "Un assistant IA conversationnel conçu pour être utile, inoffensif et honnête dans ses interactions.",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    url: "https://www.anthropic.com/claude",
    tags: ["Génératif", "Texte", "Assistant"]
  },
  {
    id: "7",
    title: "Perplexity AI",
    description: "Un moteur de recherche alimenté par l'IA qui fournit des réponses détaillées avec des références aux sources.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    url: "https://www.perplexity.ai/",
    tags: ["Recherche", "Information", "No-code"],
    featured: true
  }
];
