import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { DialogTitle, DialogContent, DialogDescription } from "..//ui/dialog";
import { BaseModal } from "./BaseModal";
import { Button } from "..//ui/button";
import { useToast } from "../../hooks/use-toast";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "..//ui/form";
import { RadioGroup, RadioGroupItem } from "..//ui/radio-group";
import { Label } from "..//ui/label";
import { createUserProfile } from "../../lib/api";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const createProfileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  title: z.string().optional(),
  profileType: z.enum(["freelancer", "client"], {
    required_error: "Please select a profile type",
  }),
});

type CreateProfileFormValues = z.infer<typeof createProfileSchema>;

const CreateProfileModal = ({
  isOpen,
  onClose,
  userId
}: CreateProfileModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateProfileFormValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      fullName: "",
      title: "",
      profileType: "freelancer",
    },
  });

  const onSubmit = async (data: CreateProfileFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create the profile
      await createUserProfile(userId, {
        ...data,
        userId: userId,
      });
      
      // Invalidate profiles query
      await queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/profiles`] });
      
      toast({
        title: "Profile created",
        description: `Your ${data.profileType} profile has been created.`,
      });
      
      onClose();
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Failed to create profile",
        description: "There was an error creating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <DialogTitle className="text-xl font-bold">Create New Profile</DialogTitle>
      <DialogDescription className="text-sm text-gray-500 mb-4">
        Create a new profile for your account
      </DialogDescription>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="profileType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Profile Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="freelancer" id="freelancer" />
                        <Label htmlFor="freelancer" className="font-normal">Freelancer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="client" id="client" />
                        <Label htmlFor="client" className="font-normal">Client</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </BaseModal>
  );
};

export default CreateProfileModal;