import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            À propos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Découvrez l'histoire et la mission d'AI2Share
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Notre mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              AI2Share est né d'une passion pour l'innovation dans le domaine de l'intelligence artificielle. 
              Notre mission est de mettre en lumière les projets d'IA les plus créatifs, utiles et inspirants 
              pour aider les curieux, les professionnels et les passionnés à découvrir les nouvelles frontières 
              de cette technologie en constante évolution.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Ce que nous proposons</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Une curation attentive de projets d'IA provenant de divers domaines
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Des mises à jour régulières pour rester au courant des dernières innovations
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Une plateforme pour partager et découvrir des outils qui façonnent l'avenir
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Un espace communautaire pour les passionnés d'intelligence artificielle
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Participez à l'aventure</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nous croyons en la puissance de la communauté. Si vous connaissez un projet d'IA 
              innovant qui mérite d'être mis en avant, n'hésitez pas à nous le faire savoir. 
              Votre contribution aide à enrichir cette bibliothèque de ressources pour tous.
            </p>
            <Link to="/suggest">
              <Button>Suggérer un projet</Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              AI2Share est un projet indépendant, créé avec passion et dédié 
              à la communauté des enthousiastes de l'intelligence artificielle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
