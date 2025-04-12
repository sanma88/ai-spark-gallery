
import { Github, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Spark Gallery. Tous droits réservés.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/suggest" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Suggérer un projet
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              À propos
            </Link>
            
            <div className="flex items-center space-x-3 ml-4">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
              </a>
              <a href="#" aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
