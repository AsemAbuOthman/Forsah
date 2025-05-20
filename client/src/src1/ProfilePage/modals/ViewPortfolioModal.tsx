import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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

export function ViewPortfolioModal({
  portfolio,
  isOpen,
  onClose,
  onEdit,
}: ViewPortfolioModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl p-6 bg-white shadow-xl ">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {portfolio.sampleProjectTitle}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onEdit}>
              <PencilIcon className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Image Carousel */}
        {portfolio.images?.length > 0 && (
          <div className="mb-8">
            <ImageCarousel
              images={portfolio.images}
              className="h-[450px] w-full rounded-xl object-cover"
              alt={portfolio.sampleProjectTitle}
            />
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Description & Technologies */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
              <div
                className="text-gray-700 text-base leading-[1.5rem] whitespace-pre-wrap 
                            overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin rounded-md 
                          border-gray-300 bg-white p-3"
                style={{
                  maxHeight: '5.5rem', // 3 lines tall
                  wordBreak: 'break-word',
                }}
              >
                {portfolio.sampleProjectDescription || "No description provided."}
              </div>
            </div>



            {/* Technologies */}
            {portfolio.skillName?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skillName.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Completion Date */}
            <div className=" rounded-lg p-4 bg-gray-50 h-[calc(4.5rem+3.5rem)]"> {/* Matches description height + heading */}
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                Completion Date
              </h3>
              <p className="text-gray-700 text-base">
                {portfolio.completionDate
                  ? format(new Date(portfolio.completionDate), "MMMM d, yyyy")
                  : "Not specified"}
              </p>
            </div>

            {/* Project URL */}
            {portfolio.sampleProjectUrl && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  Project URL
                </h3>
                <a
                  href={portfolio.sampleProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
                >
                  Visit Project <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}