import { useCallback } from "react";
import { Camera, PencilIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../../lib/api";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { User } from "../../lib/types";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL, deleteObject  } from "firebase/storage";
import { storage } from "../../../services/Firebase"; // path to your firebase config
import { string } from "zod";
interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
  onSwitchProfile?: () => void;
  isEditable?: boolean; // <-- Added
}

function extractFirebasePath(downloadUrl: string): string | null {
  const match = downloadUrl.match(/\/o\/(.*?)\?/);
  if (!match) return null;
  return decodeURIComponent(match[1]); 
}

export default function ProfileHeader({ user, onEdit, isEditable = false }: ProfileHeaderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      const storageRef = ref(storage, `profile-pictures/${fileName}`);
      
      await uploadBytes(storageRef, file);
      
      const downloadUrl = await getDownloadURL(storageRef);
      const firebasePath = extractFirebasePath(user.imageUrl);

      if (downloadUrl) {
        const storageRef = ref(storage, `profile-pictures/${firebasePath}`);
        await deleteObject(storageRef);
        console.log("Deleted from Firebase:", firebasePath);
      } else {
        console.error("Invalid image URL");
      }
    
      await updateUserProfile(user.userId, { ...user, imageUrl: downloadUrl });
    
      return downloadUrl;
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.userId}`] });
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating profile picture:", error);
      toast({
        title: "Failed to update profile picture",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditProfilePicture = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) mutation.mutate(file);
    };
    input.click();
  }, [mutation]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
      <div className="flex flex-col md:flex-row">
        {/* Profile Image */}
        <div className="relative mb-4 md:mb-0">
          <div className="w-24 h-24 relative">
            <img
              src={
                user.imageUrl ||
                "https://img.freepik.com/premium-photo/user-icon-account-icon-3d-illustration_118019-6801.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid&w=740"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
            {isEditable && (
              <button
                onClick={handleEditProfilePicture}
                className="absolute bottom-0 right-0 bg-gray-100 p-1 rounded-full border border-gray-300 text-gray-600"
                aria-label="Edit profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="md:ml-6 flex-1">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.firstName || ""} {user.lastName || ""}{" "}
                <span className="font-light">@{user.username || "username"}</span>
              </h2>
              <p className="text-gray-600">
                {user.companyName || "Company"},{" "}
                {user.professionalTitle || "Professional Title"}
              </p>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <svg
                  className="h-4 w-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{user.countryName || "Country"}, {user.city || "City"}</span>
              </div>
            </div>

            {/* Edit and Stats */}
            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <span className="ml-2 text-gray-700 font-medium">{user.userId}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-700">
                  <span className="font-medium">{user.countryId || 0}</span> Projects
                </span>

                {isEditable && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-gray-600 ml-2"
                    onClick={onEdit}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="text-sm text-gray-500 mt-1">
                <svg
                  className="h-4 w-4 inline mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{10}</span>
              </div>
            </div>
          </div>

          {/* Placeholder for tags or badges */}
          <div className="mt-4">{/* Add skills or badges here */}</div>
        </div>
      </div>
    </div>
  );
}
