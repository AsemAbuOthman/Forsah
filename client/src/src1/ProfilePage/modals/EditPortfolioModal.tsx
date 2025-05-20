import { useState, useEffect, useRef, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPortfolio, updatePortfolio } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { DEFAULT_USER_ID, PORTFOLIO_IMAGES, SKILL_CATEGORIES } from "../../lib/constants";
import { X, PlusIcon, XIcon, Loader2 } from "lucide-react";
import { Portfolio } from "../../lib/types";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { storage as app } from '../../../services/Firebase';
import { UserContext } from "../../../store/UserProvider";

export function EditPortfolioModal({ portfolio, isOpen, onClose }: {
  portfolio?: Portfolio;
  isOpen: boolean;
  onClose: () => void;
}) {
  const isEditing = !!portfolio;
  const storage = app;
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Portfolio, 'portfolioId' | 'userId' | 'sampleProjectId'>>({
    sampleProjectTitle: "",
    sampleProjectDescription: "",
    images: [],
    completionDate: new Date().toISOString().split('T')[0],
    sampleProjectUrl: "",
    sampleProjectSkillId: [],
    skillId: [],
    skillName: [],
    categoryId: [],
    categoryName: [],
    imageableId: [],
    imageableType: "portfolio",
    technologies: [],
  });

  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [userData, setUserData] = useContext(UserContext);

  useEffect(() => {
    if (portfolio) {
      setFormData({
        sampleProjectTitle: portfolio.sampleProjectTitle,
        sampleProjectDescription: portfolio.sampleProjectDescription,
        images: portfolio.images || [],
        completionDate: portfolio.completionDate,
        sampleProjectUrl: portfolio.sampleProjectUrl || "",
        sampleProjectSkillId: portfolio.sampleProjectSkillId || [],
        skillId: portfolio.skillId || [],
        skillName: portfolio.skillName || [],
        categoryId: portfolio.categoryId || [],
        categoryName: portfolio.categoryName || [],
        imageableId: portfolio.imageableId || [],
        imageableType: portfolio.imageableType || "portfolio",
        technologies: portfolio.technologies || [],
      });
    } else {
      // Reset to default values for new portfolio
      setFormData({
        sampleProjectTitle: "",
        sampleProjectDescription: "",
        images: [],
        completionDate: new Date().toISOString().split('T')[0],
        sampleProjectUrl: "",
        sampleProjectSkillId: [],
        skillId: [],
        skillName: [],
        categoryId: [],
        categoryName: [],
        imageableId: [],
        imageableType: "portfolio",
        technologies: [],
      });
    }
  }, [portfolio, isOpen]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const portfolioMutation = useMutation({
    mutationFn: (data: Omit<Portfolio, 'portfolioId' | 'userId' | 'sampleProjectId'>) => {
      if (isEditing && portfolio) {
        return updatePortfolio(portfolio.portfolioId, data);
      } else {
        return createPortfolio({
          ...data,
          userId: userData?.userId
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${DEFAULT_USER_ID}/portfolios`] });
      toast({
        title: isEditing ? "Portfolio updated" : "Portfolio created",
        description: isEditing ? "Your portfolio has been updated successfully." : "Your portfolio has been created successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? 'update' : 'create'} portfolio`,
        description: `There was an error ${isEditing ? 'updating' : 'creating'} your portfolio.`,
        variant: "destructive",
      });
      console.error(`Error ${isEditing ? 'updating' : 'creating'} portfolio:`, error);
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddTechnology = () => {
    if (selectedTechnology && !formData.technologies.includes(selectedTechnology)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, selectedTechnology]
      }));
      setSelectedTechnology("");
    }
  };
  
  const handleRemoveTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast({
        title: "Image required",
        description: "Please add at least one image for your portfolio.",
        variant: "destructive",
      });
      return;
    }
    
    portfolioMutation.mutate(formData);
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of 5 images. You currently have ${formData.images.length}.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
          throw new Error('File is not an image');
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('File size exceeds 5MB');
        }

        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, `portfolio-images/${fileName}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        return {
          imageUrl: url,
          imageableId: 0, // Will be set when saved
          imageableType: "portfolio"
        };
      });
      
      const newImages = await Promise.all(uploadPromises);
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading your images.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddImage = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(img => img.imageUrl !== imageUrl)
    }));
  };

  const allTechnologies = SKILL_CATEGORIES.flatMap(category => 
    category.options.map(option => ({
      value: option.value,
      label: option.label,
      category: category.name
    }))
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto transition-all hover:scale-125 duration-300 scale-100">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Portfolio Project' : 'Add Portfolio Project'}</DialogTitle>
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
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
            multiple
            disabled={isUploading}
          />
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sampleProjectTitle">Project Title</Label>
              <Input
                id="sampleProjectTitle"
                name="sampleProjectTitle"
                value={formData.sampleProjectTitle}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sampleProjectDescription">Description</Label>
              <Textarea
                id="sampleProjectDescription"
                name="sampleProjectDescription"
                value={formData.sampleProjectDescription}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Images</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative bg-gray-100 rounded-md overflow-hidden h-28">
                    <img 
                      src={image.imageUrl} 
                      alt={`Project image ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-5 w-5 rounded-full"
                      onClick={() => handleRemoveImage(image.imageUrl)}
                      type="button"
                      disabled={isUploading}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {formData.images.length < 5 && (
                  <div
                    className={`border-2 border-dashed rounded-md h-28 flex items-center justify-center cursor-pointer ${
                      isUploading 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={!isUploading ? handleAddImage : undefined}
                  >
                    {isUploading ? (
                      <div className="text-gray-500 text-center">
                        <Loader2 className="h-6 w-6 mx-auto mb-1 animate-spin" />
                        <div className="text-xs">Uploading...</div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center">
                        <PlusIcon className="h-6 w-6 mx-auto mb-1" />
                        <div className="text-xs">Add Image</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">You can add up to 5 images (Max 5MB each)</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="technologies">Technologies Used</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.technologies.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                    {tech}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-1 h-4 w-4 text-blue-800 hover:text-blue-900 hover:bg-transparent"
                      onClick={() => handleRemoveTechnology(tech)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a technology..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allTechnologies.map((tech) => (
                      <SelectItem key={tech.value} value={tech.label}>
                        {tech.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  className="gradient-blue text-white"
                  onClick={handleAddTechnology}
                  disabled={!selectedTechnology || isUploading}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="completionDate">Completion Date</Label>
              <Input
                id="completionDate"
                name="completionDate"
                type="date"
                value={formData.completionDate}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    completionDate: e.target.value
                  }));
                }}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sampleProjectUrl">Project URL (optional)</Label>
              <Input
                id="sampleProjectUrl"
                name="sampleProjectUrl"
                type="url"
                value={formData.sampleProjectUrl}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={portfolioMutation.isPending || isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-blue text-white"
              disabled={portfolioMutation.isPending || isUploading}
            >
              {portfolioMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}