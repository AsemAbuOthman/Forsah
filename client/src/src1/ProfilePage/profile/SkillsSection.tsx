import { Skill } from "../../lib/types";
import { Button } from "..//ui/button";
import { PencilIcon } from "lucide-react";
import { SKILL_CATEGORY_COLORS } from "../../lib/constants";

interface SkillsSectionProps {
  skills: Skill[];
  onEditSkills: () => void;
}

export default function SkillsSection({ skills, onEditSkills }: SkillsSectionProps) {
  // Group skills by category
  const groupedSkills = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.categoryName]) {
      acc[skill.categoryName] = [];
    }
    acc[skill.categoryName].push(skill);
    return acc;
  }, {});

  // Get background and text color class based on category
  const getCategoryColorClasses = (category: string) => {
    const color = SKILL_CATEGORY_COLORS[category] || 'blue';
    return {
      container: `bg-${color}-100 text-${color}-800`,
      badge: `bg-${color}-200 text-${color}-800`
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Skills</h3>
        <Button 
          size="icon"
          variant="ghost"
          className="text-gray-400 hover:text-gray-600"
          onClick={onEditSkills}
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {Object.keys(groupedSkills).length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No skills added yet</div>
          <Button 
            className="mt-4 text-white gradient-blue"
            onClick={onEditSkills}
          >
            Add Your Skills
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h4 className="font-medium text-gray-700 mb-2 ">{category}</h4>
              <div className="flex flex-wrap gap-2 ">
                {categorySkills.map((skill) => {
                  const colorClasses = getCategoryColorClasses(category);
                  return (
                    <span 
                      key={skill.skillId} 
                      className={`px-3 py-1.5 ${colorClasses.container} rounded-full text-sm flex items-end`}
                    >
                      {skill.skillName}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
