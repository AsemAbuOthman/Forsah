import { useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { User } from "../../lib/types";
import { X } from "lucide-react";
import { UserContext } from "../../../store/UserProvider";

interface EditAboutModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function EditAboutModal({ user, isOpen, onClose }: EditAboutModalProps) {
  const [about, setAbout] = useState(user.profileDescription || "");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useContext(UserContext);


  const updateAboutMutation = useMutation({
    mutationFn: async (aboutText: string) => {
      const updatedUser = await updateUserProfile(user.userId, {
        ...user,
        profileDescription: aboutText,
      });
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      setUserData(updatedUser);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.userId}`] });
      toast({
        title: "About section updated",
        description: "Your about section has been updated successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to update about section",
        description: "There was an error updating your about section.",
        variant: "destructive",
      });
      console.error("Error updating about section:", error);
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutMutation.mutate(about);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] transition-all hover:scale-125 duration-300 scale-100 ">
        <DialogHeader>
          <DialogTitle>Edit About Me</DialogTitle>
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
              <Label htmlFor="about">About Me</Label>
              <Textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={8}
                placeholder="Share information about yourself, your skills, experience, and what sets you apart as a freelancer."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-blue text-white"
              disabled={updateAboutMutation.isPending}
            >
              {updateAboutMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
