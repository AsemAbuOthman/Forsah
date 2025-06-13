import React from "react";
import { User } from "../lib/types";
import { 
  User as UserIcon, 
  Briefcase, 
  Award, 
  Layers, 
  GraduationCap, 
  Star, 
  Home,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/use-mobile";

interface NavigationProps {
  user: User;
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  // Define sections based on profile type
  const sections = [
    {
      id: "about",
      label: "About",
      icon: <UserIcon className="h-5 w-5" />,
      visibleFor: ["freelancer", "client"]
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: <Briefcase className="h-5 w-5" />,
      visibleFor: ["freelancer"]
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: <Award className="h-5 w-5" />,
      visibleFor: ["freelancer", "client"]
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Layers className="h-5 w-5" />,
      visibleFor: ["freelancer", "client"]
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="h-5 w-5" />,
      visibleFor: ["freelancer", "client"]
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star className="h-5 w-5" />,
      visibleFor: ["freelancer"]
    }
  ];

  // Filter sections based on user profile type
  const filteredSections = sections.filter(section => 
    section.visibleFor.includes(user.profileType as "freelancer" | "client")
  );

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home link */}
          <div>
            <a href="#" className="flex items-center text-primary font-bold text-xl">
              <Home className="h-5 w-5 mr-2" />
              Forixo
            </a>
          </div>

          {/* Mobile menu button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          {/* Desktop navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-6">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors"
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.icon}
                  <span className="ml-1">{section.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Mobile navigation menu */}
        {isMobile && isOpen && (
          <nav className="py-4 border-t border-gray-100">
            <ul className="space-y-3">
              {filteredSections.map((section) => (
                <li key={section.id}>
                  <button
                    className="flex items-center w-full py-2 text-gray-600 hover:text-primary transition-colors"
                    onClick={() => scrollToSection(section.id)}
                  >
                    {section.icon}
                    <span className="ml-2">{section.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Navigation;