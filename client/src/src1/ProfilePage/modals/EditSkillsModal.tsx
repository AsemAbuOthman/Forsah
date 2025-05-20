import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkill, updateSkill, deleteSkill } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { Skill } from "../../lib/types";
import { DEFAULT_USER_ID, SKILL_CATEGORIES, SKILL_LEVELS, SKILL_CATEGORY_COLORS } from "../../lib/constants";
import { X, PlusIcon } from "lucide-react";

interface EditSkillsModalProps {
  skills: Skill[];
  isOpen: boolean;
  onClose: () => void;
}

export function EditSkillsModal({ skills, isOpen, onClose }: EditSkillsModalProps) {
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0].name);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(SKILL_LEVELS[1].value); // Default to Intermediate
  
  // Group skills by category
  const groupedSkills = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: (skillData: Omit<Skill, 'id'>) => {
      return createSkill(skillData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEFAULT_USER_ID}/skills`] });
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully.",
      });
      setSelectedSkill("");
    },
    onError: (error) => {
      toast({
        title: "Failed to add skill",
        description: "There was an error adding your skill.",
        variant: "destructive",
      });
      console.error("Error adding skill:", error);
    },
  });
  
  // Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEFAULT_USER_ID}/skills`] });
      toast({
        title: "Skill removed",
        description: "Your skill has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove skill",
        description: "There was an error removing your skill.",
        variant: "destructive",
      });
      console.error("Error removing skill:", error);
    },
  });
  
  // Update skill level mutation
  const updateSkillMutation = useMutation({
    mutationFn: ({ id, level }: { id: number; level: string }) => {
      return updateSkill(id, { level });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEFAULT_USER_ID}/skills`] });
      toast({
        title: "Skill updated",
        description: "Your skill level has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update skill",
        description: "There was an error updating your skill level.",
        variant: "destructive",
      });
      console.error("Error updating skill:", error);
    },
  });
  
  const handleAddSkill = () => {
    if (!selectedSkill) return;
    
    // Check if the skill already exists in this category
    const categorySkills = groupedSkills[activeCategory] || [];
    const exists = categorySkills.some(skill => skill.name === selectedSkill);
    
    if (exists) {
      toast({
        title: "Skill already exists",
        description: `${selectedSkill} is already in your ${activeCategory} skills.`,
        variant: "destructive",
      });
      return;
    }
    
    createSkillMutation.mutate({
      userId: DEFAULT_USER_ID,
      category: activeCategory,
      name: selectedSkill,
      level: selectedLevel
    });
  };
  
  const handleRemoveSkill = (skillId: number) => {
    deleteSkillMutation.mutate(skillId);
  };
  
  const handleUpdateSkillLevel = (skillId: number, level: string) => {
    updateSkillMutation.mutate({ id: skillId, level });
  };
  
  // Get background and text color class based on category
  const getCategoryColorClasses = (category: string) => {
    const color = SKILL_CATEGORY_COLORS[category] || 'blue';
    return {
      container: `bg-${color}-100 text-${color}-800`,
      badge: `bg-${color}-200 text-${color}-800`
    };
  };
  
  // Get options for the selected category
  const getOptionsForCategory = (categoryName: string) => {
    const category = SKILL_CATEGORIES.find(c => c.name === categoryName);
    return category ? category.options : [];
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto transition-all hover:scale-125 duration-300 scale-100">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="py-4">
          {/* Category Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
            {SKILL_CATEGORIES.map((category) => (
              <button
                key={category.name}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeCategory === category.name
                    ? `bg-${SKILL_CATEGORY_COLORS[category.name]}-100 text-${SKILL_CATEGORY_COLORS[category.name]}-800 border border-${SKILL_CATEGORY_COLORS[category.name]}-300`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Current Skills in Category */}
          <div className="mb-6">
            <Label className="mb-2 block">Current {activeCategory} Skills</Label>
            <div className="flex flex-wrap gap-2 min-h-[50px]">
              {(groupedSkills[activeCategory] || []).map((skill) => {
                const colorClasses = getCategoryColorClasses(activeCategory);
                return (
                  <span 
                    key={skill.id} 
                    className={`px-3 py-1.5 ${colorClasses.container} rounded-full text-sm flex items-center`}
                  >
                    {skill.name}
                    <Select 
                      value={skill.level} 
                      onValueChange={(value) => handleUpdateSkillLevel(skill.id, value)}
                    >
                      <SelectTrigger className={`ml-1 ${colorClasses.badge} text-xs px-1.5 w-auto h-auto min-h-0 border-none shadow-none`}>
                        <SelectValue placeholder={skill.level} />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`ml-1 h-4 w-4 text-${SKILL_CATEGORY_COLORS[activeCategory]}-800 hover:bg-transparent`}
                      onClick={() => handleRemoveSkill(skill.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                );
              })}
              {(!groupedSkills[activeCategory] || groupedSkills[activeCategory].length === 0) && (
                <div className="text-gray-400 text-sm">No {activeCategory} skills added yet</div>
              )}
            </div>
          </div>
          
          {/* Add New Skill */}
          <div className="grid gap-4">
            <Label>Add New {activeCategory} Skill</Label>
            <div className="flex gap-2">
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={`Select a ${activeCategory.toLowerCase().slice(0, -1)}...`} />
                </SelectTrigger>
                <SelectContent>
                  {getOptionsForCategory(activeCategory).map((option) => (
                    <SelectItem key={option.value} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                className="gradient-blue text-white"
                onClick={handleAddSkill}
                disabled={!selectedSkill || createSkillMutation.isPending}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
