import { useState } from "react";
import { Certification } from "../../lib/types";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCertification } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { format } from "date-fns";
import { PlusIcon, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { CERTIFICATE_IMAGES } from '../../lib/constants';
import { DeleteConfirmationModal } from "../ui/delete-confirmation-modal";

interface CertificationsSectionProps {
  certifications: Certification[];
  isEditable?: boolean;
  onAddCertification?: () => void;
  onEditCertification?: (certification: Certification) => void;
  onViewCertification: (certification: Certification) => void;
  refetchCertifications?: () => Promise<void>; // Add refetch capability
}

export default function CertificationsSection({ 
  certifications, 
  isEditable = false,
  onAddCertification,
  onEditCertification,
  onViewCertification,
  refetchCertifications
}: CertificationsSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [certificationToDelete, setCertificationToDelete] = useState<Certification | null>(null);
  
  const deleteMutation = useMutation({
    mutationFn: deleteCertification,
    // Optimistic update implementation
    onMutate: async (certificationId) => {
      await queryClient.cancelQueries(['certifications']);
      
      const previousCertifications = queryClient.getQueryData<Certification[]>(['certifications']);
      
      queryClient.setQueryData(['certifications'], (old: Certification[] = []) => 
        old.filter(c => c.certificationId !== certificationId)
      );
      
      return { previousCertifications };
    },
    onSuccess: async () => {
      if (refetchCertifications) {
        await refetchCertifications();
      }
      toast({
        title: "Certification deleted",
        description: "Your certification has been deleted successfully.",
      });
      setCertificationToDelete(null);
    },
    onError: (error, certificationId, context) => {
      queryClient.setQueryData(['certifications'], context?.previousCertifications);
      toast({
        title: "Failed to delete certification",
        description: "There was an error deleting your certification.",
        variant: "destructive",
      });
      console.error("Error deleting certification:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['certifications']);
    },
  });

  const handleDeleteClick = (certification: Certification) => {
    setCertificationToDelete(certification);
  };

  const handleConfirmDelete = () => {
    if (certificationToDelete) {
      deleteMutation.mutate(certificationToDelete.certificationId);
    }
  };

  const handleCancelDelete = () => {
    setCertificationToDelete(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No Expiration';
    return format(new Date(dateString), 'MMM yyyy');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <DeleteConfirmationModal
        isOpen={!!certificationToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={certificationToDelete ? `"${certificationToDelete.certificationTitle}"` : "this certification"}
        isLoading={deleteMutation.isPending}
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Certifications</h3>
        {isEditable && onAddCertification && (
          <Button 
            className="text-white gradient-violet"
            onClick={onAddCertification}
            disabled={deleteMutation.isPending}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Certification
          </Button>
        )}
      </div>
      
      {certifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No certifications yet</div>
          {isEditable && onAddCertification && (
            <Button 
              className="mt-4 text-white gradient-violet"
              onClick={onAddCertification}
              disabled={deleteMutation.isPending}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Your First Certification
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((certification) => (
            <div 
              key={certification.certificationId} 
              className={`border border-gray-200 rounded-lg p-4 relative hover:border-blue-300 transition-all card-hover ${
                deleteMutation.isPending && certificationToDelete?.certificationId === certification.certificationId 
                  ? 'opacity-50' : ''
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-3 mt-10">
                  <img 
                    src={certification.certificateImage || CERTIFICATE_IMAGES[0]} 
                    alt={certification.certificationTitle} 
                    className="w-12 h-12 object-contain" 
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{certification.certificationTitle}</h4>
                  <p className="text-gray-600 text-sm">{certification.certificationOrganization}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Issued {formatDate(certification.startDate)}
                    {certification.endDate && ` · Expires ${formatDate(certification.endDate)}`}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm mr-3"
                  onClick={() => onViewCertification(certification)}
                  disabled={deleteMutation.isPending}
                >
                  <EyeIcon className="h-3 w-3 mr-1" />
                  View
                </Button>
                {isEditable && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-600 mr-2 h-6 w-6"
                      onClick={() => onEditCertification?.(certification)}
                      disabled={deleteMutation.isPending}
                    >
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 h-6 w-6"
                      onClick={() => handleDeleteClick(certification)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}