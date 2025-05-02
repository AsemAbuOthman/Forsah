import { User } from "../../lib/types";
import { Button } from "../ui/button";
import { PencilIcon } from "lucide-react";

interface AboutSectionProps {
  user: User;
  onEdit: () => void;
}

export default function AboutSection({ user, onEdit }: AboutSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">About Me</h3>
        <Button 
          size="icon"
          variant="ghost"
          className="text-gray-400 hover:text-gray-600"
          onClick={onEdit}
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-gray-700">
        {user.profileDescription || "No information provided yet."}
      </p>
    </div>
  );
}
