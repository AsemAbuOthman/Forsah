// components/EducationSection.tsx
import { useState } from "react";
import { Education } from "../../lib/types";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEducation } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { DeleteConfirmationModal } from "../ui/delete-confirmation-modal";

interface EducationSectionProps {
  educations: Education[];
  isEditable?: boolean;
  onAddEducation?: () => void;
  onEditEducation?: (education: Education) => void;
  refetchEducations?: () => Promise<void>;
}

export default function EducationSection({ 
  educations, 
  isEditable = false, 
  onAddEducation, 
  onEditEducation,
  refetchEducations
}: EducationSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [educationToDelete, setEducationToDelete] = useState<Education | null>(null);
  
  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onMutate: async (educationId) => {
      await queryClient.cancelQueries(['educations']);
      const previousEducations = queryClient.getQueryData<Education[]>(['educations']);
      queryClient.setQueryData(['educations'], (old: Education[] = []) => 
        old.filter(e => e.educationId !== educationId)
      );
      return { previousEducations };
    },
    onSuccess: async () => {
      await refetchEducations?.();
      toast({
        title: "Education deleted",
        description: "Your education entry has been deleted successfully.",
      });
      setEducationToDelete(null);
    },
    onError: (error, educationId, context) => {
      queryClient.setQueryData(['educations'], context?.previousEducations);
      toast({
        title: "Failed to delete education",
        description: "There was an error deleting your education entry.",
        variant: "destructive",
      });
      console.error("Error deleting education:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['educations']);
    },
  });

  const handleDeleteClick = (education: Education, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Add this to prevent any default behavior
    setEducationToDelete(education);
  };

  const handleConfirmDelete = () => {
    if (educationToDelete) {
      deleteMutation.mutate(educationToDelete.educationId);
    }
  };

  const handleCancelDelete = () => {
    setEducationToDelete(null);
  };

  // Sort educations by end year (most recent first)
  const sortedEducations = [...educations].sort((a, b) => {
    const endYearA = a.endDate || '9999';
    const endYearB = b.endDate || '9999';
    return endYearB.localeCompare(endYearA);
  });
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!educationToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={educationToDelete ? `"${educationToDelete.educationDegree}"` : "this education entry"}
        isLoading={deleteMutation.isPending}
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Education</h3>
        {isEditable && onAddEducation && (
          <Button 
            className="text-white gradient-yellow"
            onClick={onAddEducation}
            disabled={deleteMutation.isPending}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Education
          </Button>
        )}
      </div>
      
      {educations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No education entries yet</div>
          {isEditable && onAddEducation && (
            <Button 
              className="mt-4 text-white gradient-yellow"
              onClick={onAddEducation}
              disabled={deleteMutation.isPending}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Your First Education
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEducations.map((education) => (
            <div 
              key={education.educationId} 
              className={`border border-gray-200 rounded-lg p-4 relative hover:border-blue-300 transition-all card-hover ${
                deleteMutation.isPending && educationToDelete?.educationId === education.educationId 
                  ? 'opacity-50' : ''
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{education.educationDegree}</h4>
                  <p className="text-gray-600">{education.educationOrganization}</p>
                  <p className="text-gray-500 text-sm">
                    {education.startDate} - {education.endDate || 'Present'}
                  </p>
                </div>
                <div className="flex items-start space-x-1">
                  {isEditable && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-600 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEducation?.(education);
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 h-6 w-6"
                        onClick={(e) => handleDeleteClick(education, e)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2Icon className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {education.educationDescription && (
                <p className="text-gray-700 mt-2 text-sm">
                  {education.educationDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}