import { Certification } from "../../lib/types";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCertification } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { format } from "date-fns";
import { PlusIcon, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface CertificationsSectionProps {
  certifications: Certification[];
  onAddCertification: () => void;
  onEditCertification: (certification: Certification) => void;
  onViewCertification: (certification: Certification) => void;
}

export default function CertificationsSection({ 
  certifications, 
  onAddCertification, 
  onEditCertification,
  onViewCertification
}: CertificationsSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: deleteCertification,
    onSuccess: (_, certificationId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Certification deleted",
        description: "Your certification has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete certification",
        description: "There was an error deleting your certification.",
        variant: "destructive",
      });
      console.error("Error deleting certification:", error);
    },
  });

  const handleDelete = (certificationId: number) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      deleteMutation.mutate(certificationId);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No Expiration';
    return format(new Date(dateString), 'MMM yyyy');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Certifications</h3>
        <Button 
          className="text-white gradient-violet"
          onClick={onAddCertification}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Certification
        </Button>
      </div>
      
      {certifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No certifications yet</div>
          <Button 
            className="mt-4 text-white gradient-violet"
            onClick={onAddCertification}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Your First Certification
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((certification) => (
            <div 
              key={certification.id} 
              className="border border-gray-200 rounded-lg p-4 relative hover:border-blue-300 transition-all card-hover"
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src={certification.certificateImage || ''} 
                    alt={certification.title} 
                    className="w-12 h-12 object-contain" 
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{certification.title}</h4>
                  <p className="text-gray-600 text-sm">{certification.issuer}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Issued {formatDate(certification.issueDate)}
                    {certification.expiryDate && ` · Expires ${formatDate(certification.expiryDate)}`}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm mr-3"
                  onClick={() => onViewCertification(certification)}
                >
                  <EyeIcon className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-600 mr-2 h-6 w-6"
                  onClick={() => onEditCertification(certification)}
                >
                  <PencilIcon className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-600 h-6 w-6"
                  onClick={() => handleDelete(certification.id)}
                >
                  <Trash2Icon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
