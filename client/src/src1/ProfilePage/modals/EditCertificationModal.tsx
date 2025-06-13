import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCertification, updateCertification } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { Certification } from "../../lib/types";
import { DEFAULT_USER_ID, CERTIFICATE_IMAGES } from "../../lib/constants";
import { X } from "lucide-react";

interface EditCertificationModalProps {
  certification?: Certification;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCertificationModal({ certification, isOpen, onClose }: EditCertificationModalProps) {
  const isEditing = !!certification;
  const [noExpiration, setNoExpiration] = useState(false);
  
  const [formData, setFormData] = useState({
    certificationTitle: "",
    certificationOrganization: "",
    startDate: "",
    endDate: "",
    certificateImage: "",
    certificationUrl: ""
  });

  useEffect(() => {
    if (certification) {
      setFormData({
        certificationTitle: certification.certificationTitle,
        certificationOrganization: certification.certificationOrganization,
        startDate: certification.startDate ? new Date(certification.startDate).toISOString().split('T')[0] : "",
        endDate: certification.endDate ? new Date(certification.endDate).toISOString().split('T')[0] : "",
        certificateImage: certification.certificateImage || CERTIFICATE_IMAGES[0],
        certificationUrl: certification.certificationUrl || ""
      });
      setNoExpiration(!certification.endDate);
    } else {
      // Default values for new certification
      setFormData({
        certificationTitle: "",
        certificationOrganization: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        certificateImage: CERTIFICATE_IMAGES[0],
        certificationUrl: ""
      });
      setNoExpiration(false);
    }
  }, [certification, isOpen]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create or update certification mutation
  const certificationMutation = useMutation({
    mutationFn: (data: Partial<Certification>) => {
      if (isEditing && certification) {
        return updateCertification(certification.certificationId, data);
      } else {
        return createCertification({
          ...data as any,
          userId: DEFAULT_USER_ID
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEFAULT_USER_ID}/certifications`] });
      toast({
        title: isEditing ? "Certification updated" : "Certification created",
        description: isEditing ? "Your certification has been updated successfully." : "Your certification has been created successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? 'update' : 'create'} certification`,
        description: `There was an error ${isEditing ? 'updating' : 'creating'} your certification.`,
        variant: "destructive",
      });
      console.error(`Error ${isEditing ? 'updating' : 'creating'} certification:`, error);
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const certificationData: Partial<Certification> = {
      ...formData,
      endDate: noExpiration ? undefined : formData.endDate
    };
    
    certificationMutation.mutate(certificationData);
  };

  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] transition-all hover:scale-125 duration-300 scale-100">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
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
              <Label htmlFor="certificationTitle">Certification Title</Label>
              <Input
                id="certificationTitle"
                name="certificationTitle"
                value={formData.certificationTitle}
                onChange={handleChange}
                placeholder="e.g. AWS Certified Solutions Architect"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="certificationOrganization">Issuing Organization</Label>
              <Input
                id="certificationOrganization"
                name="certificationOrganization"
                value={formData.certificationOrganization}
                onChange={handleChange}
                placeholder="e.g. Amazon Web Services"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="startDate">Issue Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate" className={noExpiration ? "text-gray-400" : ""}>
                  Expiry Date
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="noExpiration" 
                    checked={noExpiration}
                    onCheckedChange={(checked) => {
                      setNoExpiration(checked === true);
                    }}
                  />
                  <label 
                    htmlFor="noExpiration" 
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    No Expiration
                  </label>
                </div>
              </div>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={noExpiration}
                className={noExpiration ? "bg-gray-100" : ""}
                required={!noExpiration}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="certificationUrl">Certificate URL (optional)</Label>
              <Input
                id="certificationUrl"
                name="certificationUrl"
                type="url"
                value={formData.certificationUrl}
                onChange={handleChange}
                placeholder="https://example.com/certificate"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-violet text-white"
              disabled={certificationMutation.isPending}
            >
              {certificationMutation.isPending 
                ? (isEditing ? "Updating..." : "Creating...") 
                : (isEditing ? "Update Certification" : "Add Certification")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
