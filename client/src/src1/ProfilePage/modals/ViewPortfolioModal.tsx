import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ImageCarousel } from "../ui/image-carousel";
import { Portfolio } from "../../lib/types";
import { format } from "date-fns";
import { X, ExternalLink, PencilIcon } from "lucide-react";

interface ViewPortfolioModalProps {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function ViewPortfolioModal({ portfolio, isOpen, onClose, onEdit }: ViewPortfolioModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{portfolio.sampleProjectTitle}</DialogTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              className="text-gray-500" 
              onClick={onEdit}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-gray-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-2">
          {/* Project Images Carousel */}
          <div className="mb-6">
            <ImageCarousel 
              images={portfolio.imageUrl || []}
              className="h-[400px] rounded-lg"
              alt={portfolio.sampleProjectTitle}
            />
          </div>
          
          {/* Project Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Description</h3>
              <p className="text-gray-700 mt-1">{portfolio.sampleProjectDescription}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Technologies Used</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {portfolio.technologies.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
                <p className="text-gray-700">
                  {format(new Date(portfolio.completionDate), 'MMMM d, yyyy')}
                </p>
              </div>
              
              {portfolio.projectUrl && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Project URL</h3>
                  <a 
                    href={portfolio.projectUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Visit Project <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
