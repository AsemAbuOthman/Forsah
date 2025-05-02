import { useCallback } from "react";
import { User } from "../../lib/types";
import { Camera, PencilIcon, Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../../lib/api";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { Badge } from "../ui/badge";

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
  onSwitchProfile: () => void;
}

export default function ProfileHeader({ user, onEdit, onSwitchProfile }: ProfileHeaderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => {
      // In a real implementation, this would upload the file to a server
      // and return the URL. For now, we'll simulate it by using a FileReader
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // For demo purposes, we'll use the result directly
          // In production, this would be a URL returned from the server
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      }).then((avatarUrl) => {
        return updateUserProfile(user.userId, { imageUrl: avatarUrl });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.userId}`] });
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile picture",
        description: "There was an error updating your profile picture. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating profile picture:", error);
    },
  });

  const handleEditProfilePicture = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        mutation.mutate(file);
      }
    };
    input.click();
  }, [mutation]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
      <div className="flex flex-col md:flex-row">
        <div className="relative mb-4 md:mb-0">
          <div className="w-24 h-24 relative">
            <img 
              src={user?.imageUrl || 'https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg?w=740'} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white" 
            />
            <button 
              className="absolute bottom-0 right-0 bg-gray-100 p-1 rounded-full border border-gray-300 text-gray-600"
              onClick={handleEditProfilePicture}
              aria-label="Edit profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="md:ml-6 flex-1">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{`${user.firstName || ''} ${user.lastName  || ''} ` || ''} <span className = 'font-light'>@{user.username} </span></h2>
              <p className="text-gray-600">{`${user.companyName || ''}, ${user.professionalTitle || ''}` || ''}</p>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{`${user.countryName || ''}, ${user.city  || ''}` || ''}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="flex items-center">
                  <span className="text-yellow-500 flex">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <span className="ml-1 text-gray-700 font-medium">{user.userId}</span>
                </div>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-700"><span className="font-medium">{user.countryId || ''}</span> Projects</span>
                <Button 
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onEdit}
                    >
                    <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{10}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {/* <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 bg-blue-100 text-${}-800 rounded-full text-sm`}>Web Development</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">UI/UX</span>
              <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Mobile Apps</span>
            </div> */}
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex space-x-2">

      </div>
    </div>
  );
}
