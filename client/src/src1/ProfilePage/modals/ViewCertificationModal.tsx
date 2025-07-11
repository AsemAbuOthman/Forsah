import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Certification } from "../../lib/types";
import { format } from "date-fns";
import { X, ExternalLink, PencilIcon } from "lucide-react";
import {CERTIFICATE_IMAGES} from '../../lib/constants'

interface ViewCertificationModalProps {
  certification: Certification;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function ViewCertificationModal({ certification, isOpen, onClose, onEdit }: ViewCertificationModalProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] transition-all hover:scale-125 duration-300 scale-100">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{certification.certificationTitle}</DialogTitle>
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
          <div className="flex items-center justify-center mb-6">
            <img 
              src={CERTIFICATE_IMAGES[0]} 
              alt={certification.certificationTitle} 
              className="max-h-[300px] object-contain rounded-md" 
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Issuing Organization</h3>
              <p className="text-gray-700 mt-1">{certification.certificationOrganization}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Issue Date</h3>
                <p className="text-gray-700">
                  {formatDate(certification.startDate)}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Expiry Date</h3>
                <p className="text-gray-700">
                  {certification.endDate ? formatDate(certification.endDate) : 'No Expiration'}
                </p>
              </div>
            </div>
            
            {certification.certificationUrl && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Certificate URL</h3>
                <a 
                  href={certification.certificationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  View Certificate <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
