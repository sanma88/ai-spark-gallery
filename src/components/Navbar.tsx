import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Menu, X, Sparkles } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI2Share</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Galerie
            </Link>
            <Link to="/featured" className="font-medium hover:text-primary transition-colors">
              Coups de cœur
            </Link>
            <Link to="/suggest" className="font-medium hover:text-primary transition-colors">
              Suggérer
            </Link>
            <Link to="/login">
              <Button variant="outline" className="ml-4">
                Admin
              </Button>
            </Link>
            <ThemeSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3 animate-fade-in">
            <Link
              to="/"
              className="block py-2 px-4 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Galerie
            </Link>
            <Link
              to="/featured"
              className="block py-2 px-4 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Coups de cœur
            </Link>
            <Link
              to="/suggest"
              className="block py-2 px-4 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Suggérer
            </Link>
            <Link
              to="/login"
              className="block py-2 px-4 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
