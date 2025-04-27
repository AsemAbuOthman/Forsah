import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { User } from "../../lib/types";
import { X } from "lucide-react";

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    title: user.title,
    location: user.location,
    hourlyRate: "75", // Example default value
    about: user.about || ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateUserMutation = useMutation({
    mutationFn: (userData: Partial<User>) => {
      return updateUserProfile(user.id, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}`] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserMutation.mutate({
      fullName: formData.fullName,
      title: formData.title,
      location: formData.location,
      about: formData.about
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
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
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="about">About Me</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
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
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
