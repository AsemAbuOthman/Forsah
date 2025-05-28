import { useState } from "react";
import { Experience } from "../../lib/types";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExperience } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { format, formatDistance } from "date-fns";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { DeleteConfirmationModal } from "../ui/delete-confirmation-modal";

interface ExperienceSectionProps {
  experiences: Experience[];
  isEditable?: boolean;
  onAddExperience?: () => void;
  onEditExperience?: (experience: Experience) => void;
  refetchExperiences?: () => Promise<void>;
}

export default function ExperienceSection({ 
  experiences, 
  isEditable = false, 
  onAddExperience, 
  onEditExperience,
  refetchExperiences
}: ExperienceSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);
  
  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    // Optimistic update implementation
    onMutate: async (experienceId) => {
      await queryClient.cancelQueries(['experiences']);
      
      const previousExperiences = queryClient.getQueryData<Experience[]>(['experiences']);
      
      queryClient.setQueryData(['experiences'], (old: Experience[] = []) => 
        old.filter(e => e.experienceId !== experienceId)
      );
      
      return { previousExperiences };
    },
    onSuccess: async () => {
      await refetchExperiences?.();
      toast({
        title: "Experience deleted",
        description: "Your work experience has been deleted successfully.",
      });
      setExperienceToDelete(null);
    },
    onError: (error, experienceId, context) => {
      queryClient.setQueryData(['experiences'], context?.previousExperiences);
      toast({
        title: "Failed to delete experience",
        description: "There was an error deleting your work experience.",
        variant: "destructive",
      });
      console.error("Error deleting experience:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['experiences']);
    },
  });

  const handleDeleteClick = (experience: Experience, e: React.MouseEvent) => {
    e.stopPropagation();
    setExperienceToDelete(experience);
  };

  const handleConfirmDelete = () => {
    if (experienceToDelete) {
      deleteMutation.mutate(experienceToDelete.experienceId);
    }
  };

  const handleCancelDelete = () => {
    setExperienceToDelete(null);
  };

  const formatExperienceDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    
    if (!endDate) {
      return `${format(start, 'MMM yyyy')} - Present · ${formatDistance(start, new Date())}`;
    }
    
    const end = new Date(endDate);
    return `${format(start, 'MMM yyyy')} - ${format(end, 'MMM yyyy')} · ${formatDistance(start, end)}`;
  };

  // Sort experiences by date (most recent first)
  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date();
    const dateB = b.endDate ? new Date(b.endDate) : new Date();
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!experienceToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={experienceToDelete ? `"${experienceToDelete.experienceTitle}" at ${experienceToDelete.experienceCompanyName}` : "this work experience"}
        isLoading={deleteMutation.isPending}
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Work Experience</h3>
        {isEditable && onAddExperience && (
          <Button 
            className="text-white gradient-orange"
            onClick={onAddExperience}
            disabled={deleteMutation.isPending}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Experience
          </Button>
        )}
      </div>
      
      {experiences.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No work experience yet</div>
          {isEditable && onAddExperience && (
            <Button 
              className="mt-4 text-white gradient-orange"
              onClick={onAddExperience}
              disabled={deleteMutation.isPending}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Your First Experience
            </Button>
          )}
        </div>
      ) : (
        <div className="relative pl-6 before:content-[''] before:absolute before:left-1 before:top-2 before:bottom-6 before:w-0.5 before:bg-gray-200">
          {sortedExperiences.map((experience, index) => (
            <div 
              key={experience.experienceId} 
              className={`mb-6 relative ${
                deleteMutation.isPending && experienceToDelete?.experienceId === experience.experienceId 
                  ? 'opacity-50' : ''
              }`}
            >
              <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 -left-[19px] top-1.5"></div>
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{experience.experienceTitle}</h4>
                    <p className="text-gray-600">{experience.experienceCompanyName}</p>
                    <p className="text-gray-500 text-sm">
                      {formatExperienceDuration(experience.startDate, experience.endDate)}
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
                            onEditExperience?.(experience);
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <PencilIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-600 h-6 w-6"
                          onClick={(e) => handleDeleteClick(experience, e)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2Icon className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {experience.experienceDescription && (
                  <p className="text-gray-700 mt-3 text-sm">
                    {experience.experienceDescription}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}