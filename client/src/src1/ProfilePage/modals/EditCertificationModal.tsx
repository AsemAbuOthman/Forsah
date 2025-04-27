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
    title: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    certificateImage: "",
    certificateUrl: ""
  });

  useEffect(() => {
    if (certification) {
      setFormData({
        title: certification.title,
        issuer: certification.issuer,
        issueDate: certification.issueDate ? new Date(certification.issueDate).toISOString().split('T')[0] : "",
        expiryDate: certification.expiryDate ? new Date(certification.expiryDate).toISOString().split('T')[0] : "",
        certificateImage: certification.certificateImage || CERTIFICATE_IMAGES[0],
        certificateUrl: certification.certificateUrl || ""
      });
      setNoExpiration(!certification.expiryDate);
    } else {
      // Default values for new certification
      setFormData({
        title: "",
        issuer: "",
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: "",
        certificateImage: CERTIFICATE_IMAGES[0],
        certificateUrl: ""
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
        return updateCertification(certification.id, data);
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
      expiryDate: noExpiration ? undefined : formData.expiryDate
    };
    
    certificationMutation.mutate(certificationData);
  };

  // Simulated function to change certificate image
  const handleChangeImage = () => {
    // Find the index of the current image
    const currentIndex = CERTIFICATE_IMAGES.findIndex(img => img === formData.certificateImage);
    
    // Select the next image in the array, or the first if we're at the end
    const nextIndex = (currentIndex + 1) % CERTIFICATE_IMAGES.length;
    
    setFormData(prev => ({
      ...prev,
      certificateImage: CERTIFICATE_IMAGES[nextIndex]
    }));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
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
              <Label htmlFor="title">Certification Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AWS Certified Solutions Architect"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issuer">Issuing Organization</Label>
              <Input
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                placeholder="e.g. Amazon Web Services"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expiryDate" className={noExpiration ? "text-gray-400" : ""}>
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
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                disabled={noExpiration}
                className={noExpiration ? "bg-gray-100" : ""}
                required={!noExpiration}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Certificate Image</Label>
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={formData.certificateImage} 
                    alt="Certificate" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleChangeImage}
                >
                  Change Image
                </Button>
                <div className="text-xs text-gray-500">
                  This would be an image upload in a real application.
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="certificateUrl">Certificate URL (optional)</Label>
              <Input
                id="certificateUrl"
                name="certificateUrl"
                type="url"
                value={formData.certificateUrl}
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
