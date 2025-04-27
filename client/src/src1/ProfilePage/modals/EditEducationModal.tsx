import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEducation, updateEducation } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { Education } from "../../lib/types";
import { DEFAULT_USER_ID } from "../../lib/constants";
import { X } from "lucide-react";

interface EditEducationModalProps {
  education?: Education;
  isOpen: boolean;
  onClose: () => void;
}

export function EditEducationModal({ education, isOpen, onClose }: EditEducationModalProps) {
  const isEditing = !!education;
  const [currentlyStudying, setCurrentlyStudying] = useState(false);
  
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    startYear: "",
    endYear: "",
    description: ""
  });

  useEffect(() => {
    if (education) {
      setFormData({
        degree: education.degree,
        institution: education.institution,
        startYear: education.startYear,
        endYear: education.endYear || "",
        description: education.description || ""
      });
      setCurrentlyStudying(!education.endYear);
    } else {
      // Default values for new education
      const currentYear = new Date().getFullYear().toString();
      setFormData({
        degree: "",
        institution: "",
        startYear: "",
        endYear: currentYear,
        description: ""
      });
      setCurrentlyStudying(false);
    }
  }, [education, isOpen]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create or update education mutation
  const educationMutation = useMutation({
    mutationFn: (data: Partial<Education>) => {
      if (isEditing && education) {
        return updateEducation(education.id, data);
      } else {
        return createEducation({
          ...data as any,
          userId: DEFAULT_USER_ID
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEFAULT_USER_ID}/educations`] });
      toast({
        title: isEditing ? "Education updated" : "Education added",
        description: isEditing ? "Your education has been updated successfully." : "Your education has been added successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? 'update' : 'add'} education`,
        description: `There was an error ${isEditing ? 'updating' : 'adding'} your education.`,
        variant: "destructive",
      });
      console.error(`Error ${isEditing ? 'updating' : 'adding'} education:`, error);
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const educationData: Partial<Education> = {
      ...formData,
      endYear: currentlyStudying ? undefined : formData.endYear
    };
    
    educationMutation.mutate(educationData);
  };

  // Generate year options from 1950 to current year + 10
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 10 + 1 }, (_, i) => (1950 + i).toString());
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Education' : 'Add Education'}</DialogTitle>
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
              <Label htmlFor="degree">Degree / Field of Study</Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Computer Science"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="e.g. University of California, Berkeley"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startYear">Start Year</Label>
                <select
                  id="startYear"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleChange as any}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Year</option>
                  {yearOptions.map(year => (
                    <option key={`start-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endYear" className={currentlyStudying ? "text-gray-400" : ""}>
                    End Year
                  </Label>
                </div>
                <select
                  id="endYear"
                  name="endYear"
                  value={formData.endYear}
                  onChange={handleChange as any}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentlyStudying ? "bg-gray-100" : ""}`}
                  disabled={currentlyStudying}
                  required={!currentlyStudying}
                >
                  <option value="">Select Year</option>
                  {yearOptions.map(year => (
                    <option key={`end-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="currentlyStudying" 
                checked={currentlyStudying}
                onCheckedChange={(checked) => {
                  setCurrentlyStudying(checked === true);
                }}
              />
              <label 
                htmlFor="currentlyStudying" 
                className="text-sm text-gray-600 cursor-pointer"
              >
                I am currently studying here
              </label>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your achievements, activities, awards, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-yellow text-white"
              disabled={educationMutation.isPending}
            >
              {educationMutation.isPending 
                ? (isEditing ? "Updating..." : "Adding...") 
                : (isEditing ? "Update Education" : "Add Education")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
