import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSkill, deleteSkill, createSkillsBatch } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { Skill } from "../../lib/types";
import {
  DEFAULT_USER_ID,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_CATEGORY_COLORS,
} from "../../lib/constants";
import { X, PlusIcon, Loader2 } from "lucide-react";

interface EditSkillsModalProps {
  skills: Skill[];
  isOpen: boolean;
  onClose: () => void;
}

interface PendingSkill {
  category: string;
  skillId: string;
  skillName: string;
  level: string;
}

export function EditSkillsModal({ skills: initialSkills, isOpen, onClose }: EditSkillsModalProps) {
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0].name);
  const [selectedSkill, setSelectedSkill] = useState<{ value: string; label: string } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(SKILL_LEVELS[1].value);
  const [pendingSkills, setPendingSkills] = useState<PendingSkill[]>([]);
  const [localSkills, setLocalSkills] = useState<Skill[]>(initialSkills);

  // Update local skills when initialSkills prop changes
  useEffect(() => {
    setLocalSkills(initialSkills);
  }, [initialSkills]);

  // Group skills by category
  const groupedSkills = localSkills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // STRONGER duplicate checking that handles both string and number IDs
  const skillExists = (skillId: string, category: string): boolean => {
    // Check in current skills
    const inCurrentSkills = (groupedSkills[category] || []).some(
      skill => skill.skillId.toString() === skillId.toString()
    );
    
    // Check in pending skills
    const inPendingSkills = pendingSkills.some(
      skill => skill.skillId.toString() === skillId.toString() && 
               skill.category === category
    );
    
    return inCurrentSkills || inPendingSkills;
  };

  // Only show skills that aren't already added
  const getAvailableSkills = () => {
    const category = SKILL_CATEGORIES.find(c => c.name === activeCategory);
    if (!category) return [];
    
    return category.options.filter(option => 
      !skillExists(option.value, activeCategory)
    );
  };

  // Create skills batch mutation with optimistic updates
  const createSkillsBatchMutation = useMutation({
    mutationFn: (skillsData: Omit<Skill, 'id'>[]) => createSkillsBatch(skillsData),
    onMutate: async (newSkills) => {
      await queryClient.cancelQueries({ queryKey: [`/api/skills/${DEFAULT_USER_ID}`] });
      
      const optimisticSkills = newSkills.map(skill => ({
        ...skill,
        id: Math.random(), // Temporary ID
        userId: DEFAULT_USER_ID,
      }));
      
      setLocalSkills(prev => [...prev, ...optimisticSkills]);
      setPendingSkills([]);
      
      return { previousSkills: localSkills };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/skills/${DEFAULT_USER_ID}`] });
      toast({ title: "Skills added", description: "Your skills were added successfully" });
    },
    onError: (err, newSkills, context) => {
      if (context?.previousSkills) {
        setLocalSkills(context.previousSkills);
      }
      toast({
        title: "Failed to add skills",
        description: "There was an error adding your skills",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/skills/${DEFAULT_USER_ID}`] });
    }
  });

  // Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: deleteSkill,
    onMutate: async (skillId) => {
      await queryClient.cancelQueries({ queryKey: [`/api/skills/${DEFAULT_USER_ID}`] });
      
      setLocalSkills(prev => prev.filter(skill => skill.id !== skillId));
      
      return { previousSkills: localSkills };
    },
    onSuccess: () => {
      toast({ title: "Skill removed", description: "Skill was removed successfully" });
    },
    onError: (err, skillId, context) => {
      if (context?.previousSkills) {
        setLocalSkills(context.previousSkills);
      }
      toast({
        title: "Failed to remove skill",
        description: "There was an error removing the skill",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/skills/${DEFAULT_USER_ID}`] });
    }
  });

  // Update skill mutation
  const updateSkillMutation = useMutation({
    mutationFn: ({ id, level }: { id: number; level: string }) => updateSkill(id, { level }),
    onMutate: async ({ id, level }) => {
      await queryClient.cancelQueries({ queryKey: [`/api/skills/${DEFAULT_USER_ID}`] });
      
      setLocalSkills(prev => 
        prev.map(skill => skill.id === id ? { ...skill, level } : skill)
      );
      
      return { previousSkills: localSkills };
    },
    onSuccess: () => {
      toast({ title: "Skill updated", description: "Skill level was updated" });
    },
    onError: (err, { id }, context) => {
      if (context?.previousSkills) {
        setLocalSkills(context.previousSkills);
      }
      toast({
        title: "Failed to update skill",
        description: "There was an error updating the skill level",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/skills/${DEFAULT_USER_ID}`] });
    }
  });

  const handleAddPendingSkill = () => {
    if (!selectedSkill) return;

    // FINAL verification before adding
    if (skillExists(selectedSkill.value, activeCategory)) {
      toast({
        title: "Duplicate Skill",
        description: `"${selectedSkill.label}" is already in your ${activeCategory} skills.`,
        variant: "destructive",
      });
      return;
    }

    setPendingSkills(prev => [...prev, {
      category: activeCategory,
      skillId: selectedSkill.value,
      skillName: selectedSkill.label,
      level: selectedLevel,
    }]);
    
    setSelectedSkill(null);
  };

  const handleRemovePendingSkill = (index: number) => {
    setPendingSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSkill = (skillId: number) => {
    deleteSkillMutation.mutate(skillId);
  };

  const handleUpdateSkillLevel = (skillId: number, level: string) => {
    updateSkillMutation.mutate({ id: skillId, level });
  };

  const handleSubmitSkills = () => {
    if (pendingSkills.length === 0) {
      onClose();
      return;
    }

    createSkillsBatchMutation.mutate(
      pendingSkills.map(skill => ({
        ...skill,
        userId: DEFAULT_USER_ID,
      }))
    );
  };

  const getCategoryColorClasses = (category: string) => {
    const color = SKILL_CATEGORY_COLORS[category] || "blue";
    return {
      container: `bg-${color}-100 text-${color}-800`,
      badge: `bg-${color}-200 text-${color}-800`,
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <Button size="icon" variant="ghost" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="py-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap space-x-2 overflow-x-auto pb-2 mb-4">
            {SKILL_CATEGORIES.map(category => (
              <button
                key={category.name}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeCategory === category.name
                    ? `bg-${SKILL_CATEGORY_COLORS[category.name]}-100 text-${SKILL_CATEGORY_COLORS[category.name]}-800 border border-${SKILL_CATEGORY_COLORS[category.name]}-300`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Current Skills */}
          <div className="mb-6">
            <Label className="mb-2 block">Current {activeCategory} Skills</Label>
            <div className="flex flex-wrap gap-2 min-h-[50px]">
              {(groupedSkills[activeCategory] || []).map(skill => {
                const colorClasses = getCategoryColorClasses(activeCategory);
                const isUpdating = updateSkillMutation.isLoading && updateSkillMutation.variables?.id === skill.id;
                const isDeleting = deleteSkillMutation.isLoading && deleteSkillMutation.variables === skill.id;

                return (
                  <span
                    key={skill.id}
                    className={`px-3 py-1.5 ${colorClasses.container} rounded-full text-sm flex items-center`}
                  >
                    {skill.skillName}
                    <Select
                      value={skill.level}
                      onValueChange={value => handleUpdateSkillLevel(skill.id, value)}
                      disabled={isUpdating || isDeleting}
                    >
                      <SelectTrigger
                        className={`ml-1 ${colorClasses.badge} text-xs px-1.5 w-auto h-auto min-h-0 border-none shadow-none`}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <SelectValue placeholder={skill.level} />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_LEVELS.map(level => (
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
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </Button>
                  </span>
                );
              })}
              {(!groupedSkills[activeCategory] || groupedSkills[activeCategory].length === 0) && (
                <div className="text-gray-400 text-sm">No {activeCategory} skills added yet</div>
              )}
            </div>
          </div>

          {/* Pending Skills */}
          {pendingSkills.filter(s => s.category === activeCategory).length > 0 && (
            <div className="mb-6">
              <Label className="mb-2 block">Pending {activeCategory} Skills</Label>
              <div className="flex flex-wrap gap-2 min-h-[50px]">
                {pendingSkills
                  .filter(skill => skill.category === activeCategory)
                  .map((skill, index) => {
                    const colorClasses = getCategoryColorClasses(activeCategory);
                    return (
                      <span
                        key={`${skill.skillId}-${index}`}
                        className={`px-3 py-1.5 ${colorClasses.container} rounded-full text-sm flex items-center`}
                      >
                        {skill.skillName}
                        <span className={`ml-1 ${colorClasses.badge} text-xs px-1.5 py-0.5 rounded`}>
                          {SKILL_LEVELS.find(l => l.value === skill.level)?.label}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`ml-1 h-4 w-4 text-${SKILL_CATEGORY_COLORS[activeCategory]}-800 hover:bg-transparent`}
                          onClick={() => handleRemovePendingSkill(index)}
                          disabled={createSkillsBatchMutation.isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </span>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Add New Skill */}
          <div className="grid gap-4">
            <Label>Add New {activeCategory} Skill</Label>
            <div className="flex gap-2">
              <Select
                value={selectedSkill?.value}
                onValueChange={(value) => {
                  const found = getAvailableSkills().find(opt => opt.value === value);
                  setSelectedSkill(found || null);
                }}
                disabled={createSkillsBatchMutation.isLoading}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={`Select ${activeCategory.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSkills().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedLevel} 
                onValueChange={setSelectedLevel}
                disabled={createSkillsBatchMutation.isLoading}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="gradient-blue text-white"
                onClick={handleAddPendingSkill}
                disabled={!selectedSkill || createSkillsBatchMutation.isLoading}
              >
                {createSkillsBatchMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <PlusIcon className="h-4 w-4 mr-1" />
                )}
                Add to List
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleSubmitSkills}
            disabled={createSkillsBatchMutation.isLoading || pendingSkills.length === 0}
          >
            {createSkillsBatchMutation.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save All"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}