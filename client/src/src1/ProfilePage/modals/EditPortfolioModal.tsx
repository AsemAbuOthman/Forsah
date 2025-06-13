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
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { storage } from "../../../services/Firebase";
import { UserContext } from "../../../store/UserProvider";


function extractFirebasePath(downloadUrl: string): string | null {
  const match = downloadUrl.match(/\/o\/(.*?)\?/);
  return match ? decodeURIComponent(match[1]) : null;
}

interface Technology {
  id: number;
  name: string;
  category: string;
}

export function EditPortfolioModal({ portfolio, isOpen, onClose }: {
  portfolio?: Portfolio;
  isOpen: boolean;
  onClose: () => void;
}) {
  const isEditing = !!portfolio;
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTechnologyId, setSelectedTechnologyId] = useState(0);
  const [userData] = useContext(UserContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flatten and map all available technologies
  const allTechnologies: Technology[] = SKILL_CATEGORIES.flatMap(category => 
    category.options.map(option => ({
      id: option.value,
      name: option.label,
      category: category.name
    })));

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

  // Initialize form data based on portfolio prop
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

  const portfolioMutation = useMutation({
    mutationFn: (data: Omit<Portfolio, 'portfolioId' | 'userId' | 'sampleProjectId'>) => {
      return isEditing && portfolio 
        ? updatePortfolio(portfolio.portfolioId, data)
        : createPortfolio({ ...data, userId: userData?.userId });
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTechnology = () => {
    if (!selectedTechnologyId) return;

    const tech = allTechnologies.find(t => t.id === selectedTechnologyId);
    if (!tech || formData.skillId.includes(tech.id)) return;

    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, tech.id],
      skillId: [...prev.skillId, tech.id],
      skillName: [...prev.skillName, tech.name]
    }));
    setSelectedTechnologyId("");
  };

  const handleRemoveTechnology = (techId: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(id => id !== techId),
      skillId: prev.skillId.filter(id => id !== techId),
      skillName: prev.skillName.filter((_, index) => prev.skillId[index] !== techId)
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
    if (!e.target.files?.length) return;
  
    const files = Array.from(e.target.files);
    const maxImages = 10;
    
    if (formData.images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can upload up to ${maxImages} images. You currently have ${formData.images.length}.`,
        variant: "destructive",
      });
      return;
    }
  
    setIsUploading(true);
  
    try {
      const uploadPromises = files.map(async (file) => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file",
            description: `${file.name} is not an image.`,
            variant: "destructive",
          });
          return null;
        }
  
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 5MB.`,
            variant: "destructive",
          });
          return null;
        }
  
        try {
          const fileExtension = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExtension}`;
          const storageRef = ref(storage, `portfolio-images/${fileName}`);
  
          await uploadBytes(storageRef, file, {
            contentType: file.type
          });
  
          const url = await getDownloadURL(storageRef);
  
          toast({
            title: "Upload successful",
            description: `${file.name} has been uploaded successfully.`,
          });
  
          return {
            imageUrl: url,
            imageableId: 0,
            imageableType: "portfolio"
          };
        } catch (uploadError) {
          console.error(`Upload failed for ${file.name}:`, uploadError);
          toast({
            title: "Upload failed",
            description: `${file.name} could not be uploaded.`,
            variant: "destructive",
          });
          return null;
        }
      });
  
      const newImages = (await Promise.all(uploadPromises)).filter(Boolean);
      
      if (newImages.length) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Upload error",
        description: "Something went wrong while uploading your images.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImage = () => fileInputRef.current?.click();

  const handleRemoveImage = async (imageUrl: string) => {
    if (!imageUrl) return;

    try {
      const firebasePath = extractFirebasePath(imageUrl);
      if (firebasePath) {
        const imageRef = ref(storage, `portfolio-images/${firebasePath}`);
        await deleteObject(imageRef);
        console.log("Image deleted from Firebase:", firebasePath);
      }
    } catch (error) {
      console.error("Failed to delete image from Firebase:", error);
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.imageUrl !== imageUrl),
    }));
  };

  console.log("Form Data:", formData);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
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
                {formData.skillId.map((id, index) => {
                  const techName = formData.skillName[index];
                  return (
                    <span key={id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                      {techName}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-1 h-4 w-4 text-blue-800 hover:text-blue-900 hover:bg-transparent"
                        onClick={() => handleRemoveTechnology(id)}
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Select 
                  value={selectedTechnologyId} 
                  onValueChange={setSelectedTechnologyId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a technology..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allTechnologies.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  className="gradient-blue text-white"
                  onClick={handleAddTechnology}
                  disabled={!selectedTechnologyId || isUploading}
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
                onChange={e => setFormData(prev => ({
                  ...prev,
                  completionDate: e.target.value
                }))}
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