import { Education } from "../../lib/types";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEducation } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface EducationSectionProps {
  educations: Education[];
  onAddEducation: () => void;
  onEditEducation: (education: Education) => void;
}

export default function EducationSection({ 
  educations, 
  onAddEducation, 
  onEditEducation 
}: EducationSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: (_, educationId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Education deleted",
        description: "Your education entry has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete education",
        description: "There was an error deleting your education entry.",
        variant: "destructive",
      });
      console.error("Error deleting education:", error);
    },
  });

  const handleDelete = (educationId: number) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      deleteMutation.mutate(educationId);
    }
  };

  // Sort educations by end year (most recent first)
  const sortedEducations = [...educations].sort((a, b) => {
    const endYearA = a.endDate || '9999';
    const endYearB = b.endDate || '9999';
    return endYearB.localeCompare(endYearA);
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Education</h3>
        <Button 
          className="text-white gradient-yellow"
          onClick={onAddEducation}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </div>
      
      {educations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No education entries yet</div>
          <Button 
            className="mt-4 text-white gradient-yellow"
            onClick={onAddEducation}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Your First Education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEducations.map((education) => (
            <div 
              key={education.educationId} 
              className="border border-gray-200 rounded-lg p-4 relative hover:border-blue-300 transition-all card-hover"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{education.educationDegree}</h4>
                  <p className="text-gray-600">{education.educationOrganization}</p>
                  <p className="text-gray-500 text-sm">
                    {education.startDate} - {education.endDate || 'Present'}
                  </p>
                  {education.educationDescription && (
                    <p className="text-gray-700 mt-2 text-sm">
                      {education.educationDescription}
                    </p>
                  )}
                </div>
                <div className="flex items-start space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600 h-6 w-6"
                    onClick={() => onEditEducation(education)}
                  >
                    <PencilIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 h-6 w-6"
                    onClick={() => handleDelete(education.educationId)}
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
