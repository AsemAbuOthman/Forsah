import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../../lib/types";
import { DialogTitle, DialogContent, DialogDescription } from "../ui/dialog";
import { BaseModal } from "./BaseModal";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { PlusCircle, UserCircle, Briefcase } from "lucide-react";

interface SwitchProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  profiles: User[];
  onOpenCreateProfile: () => void;
}

const SwitchProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  profiles,
  onOpenCreateProfile
}: SwitchProfileModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchProfile = async (profile: User) => {
    if (profile.id === currentUser.id) {
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      // In a real implementation, we might call an API to switch the active profile
      // For this demo, we'll just redirect to the profile page of the selected profile
      
      // Invalidate all queries to refresh data
      await queryClient.invalidateQueries();
      
      // Simulate profile switch (in a real app, we would navigate to the new profile)
      setTimeout(() => {
        toast({
          title: "Profile switched",
          description: `You are now using the ${profile.profileType} profile.`,
        });
        onClose();
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error switching profile:", error);
      toast({
        title: "Failed to switch profile",
        description: "There was an error switching profiles. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <DialogTitle className="text-xl font-bold">Switch Profile</DialogTitle>
      <DialogDescription className="text-sm text-gray-500 mb-4">
        Choose the profile you want to switch to
      </DialogDescription>
      <DialogContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Current profile</h3>
          <div 
            className="p-4 border rounded-md flex items-center gap-3 bg-gray-50 cursor-default"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              {currentUser.profileType === 'freelancer' ? (
                <UserCircle className="w-6 h-6 text-blue-500" />
              ) : (
                <Briefcase className="w-6 h-6 text-indigo-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{currentUser.fullName} <span className="text-xs uppercase font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded ml-2">{currentUser.profileType}</span></p>
              <p className="text-sm text-gray-500">{currentUser.title || "No title set"}</p>
            </div>
          </div>
        </div>

        {profiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Your profiles</h3>
            <div className="space-y-2">
              {profiles.map((profile) => (
                <div 
                  key={profile.id}
                  className="p-4 border rounded-md flex items-center gap-3 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => handleSwitchProfile(profile)}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {profile.profileType === 'freelancer' ? (
                      <UserCircle className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{profile.fullName} <span className="text-xs uppercase font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded ml-2">{profile.profileType}</span></p>
                    <p className="text-sm text-gray-500">{profile.title || "No title set"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full flex items-center gap-2 justify-center mt-4"
          onClick={onOpenCreateProfile}
        >
          <PlusCircle className="w-4 h-4" />
          Create New Profile
        </Button>
      </DialogContent>
    </BaseModal>
  );
};

export default SwitchProfileModal;