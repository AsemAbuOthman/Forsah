import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExperience, updateExperience } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { Experience } from "../../lib/types";
import { DEFAULT_USER_ID } from "../../lib/constants";
import { X } from "lucide-react";

interface EditExperienceModalProps {
  experience?: Experience;
  isOpen: boolean;
  onClose: () => void;
}

export function EditExperienceModal({ experience, isOpen, onClose }: EditExperienceModalProps) {
  const isEditing = !!experience;
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  
  const [formData, setFormData] = useState({
    experienceTitle: "",
    experienceCompanyName: "",
    startDate: "",
    endDate: "",
    experienceDescription: "",
    current: false
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        experienceTitle: experience.experienceTitle,
        experienceCompanyName: experience.experienceCompanyName,
        startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : "",
        endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : "",
        experienceDescription: experience.experienceDescription || "",
        current: experience.current
      });
      setCurrentlyWorking(experience.current);
    } else {
      // Default values for new experience
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        experienceTitle: "",
        experienceCompanyName: "",
        startDate: "",
        endDate: today,
        experienceDescription: "",
        current: false
      });
      setCurrentlyWorking(false);
    }
  }, [experience, isOpen]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create or update experience mutation
  const experienceMutation = useMutation({
    mutationFn: (data: Partial<Experience>) => {
      if (isEditing && experience) {
        return updateExperience(experience.experienceId, data);
      } else {
        return createExperience({
          ...data as any,
          userId: DEFAULT_USER_ID
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEFAULT_USER_ID}/experiences`] });
      toast({
        title: isEditing ? "Experience updated" : "Experience added",
        description: isEditing ? "Your work experience has been updated successfully." : "Your work experience has been added successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? 'update' : 'add'} experience`,
        description: `There was an error ${isEditing ? 'updating' : 'adding'} your work experience.`,
        variant: "destructive",
      });
      console.error(`Error ${isEditing ? 'updating' : 'adding'} experience:`, error);
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const experienceData: Partial<Experience> = {
      ...formData,
      endDate: currentlyWorking ? undefined : formData.endDate,
      current: currentlyWorking
    };
    
    experienceMutation.mutate(experienceData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Work Experience' : 'Add Work Experience'}</DialogTitle>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="experienceTitle">Job Title</Label>
              <Input
                id="experienceTitle"
                name="experienceTitle"
                value={formData.experienceTitle}
                onChange={handleChange}
                placeholder="e.g. Senior Full Stack Developer"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="experienceCompanyName">Company</Label>
              <Input
                id="experienceCompanyName"
                name="experienceCompanyName"
                value={formData.experienceCompanyName}
                onChange={handleChange}
                placeholder="e.g. Acme Inc."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate" className={currentlyWorking ? "text-gray-400" : ""}>
                  End Date
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="currentlyWorking" 
                    checked={currentlyWorking}
                    onCheckedChange={(checked) => {
                      setCurrentlyWorking(checked === true);
                      setFormData((prev) => ({
                        ...prev,
                        current: checked === true
                      }));
                    }}
                  />
                  <label 
                    htmlFor="currentlyWorking" 
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    I currently work here
                  </label>
                </div>
              </div>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={currentlyWorking}
                className={currentlyWorking ? "bg-gray-100" : ""}
                required={!currentlyWorking}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="experienceDescription">Description</Label>
              <Textarea
                id="experienceDescription"
                name="experienceDescription"
                value={formData.experienceDescription}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your responsibilities, achievements, and projects..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-orange text-white"
              disabled={experienceMutation.isPending}
            >
              {experienceMutation.isPending 
                ? (isEditing ? "Updating..." : "Adding...") 
                : (isEditing ? "Update Experience" : "Add Experience")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
