import { useState, useEffect, useRef } from "react";
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
import { X, PlusIcon, XIcon } from "lucide-react";

/**
 * Edit Portfolio Modal Component
 * @param {Object} props - Component props
 * @param {Object} props.portfolio - Portfolio data (undefined for new portfolio)
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @returns {JSX.Element} Edit Portfolio Modal
 */
export function EditPortfolioModal({ portfolio, isOpen, onClose }) {
  const isEditing = !!portfolio;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    technologies: [],
    completedDate: "",
    projectUrl: ""
  });

  const [selectedTechnology, setSelectedTechnology] = useState("");
  
  useEffect(() => {
    if (portfolio) {
      setFormData({
        title: portfolio.title,
        description: portfolio.description,
        images: portfolio.images || [],
        technologies: portfolio.technologies || [],
        completedDate: portfolio.completedDate ? new Date(portfolio.completedDate).toISOString().split('T')[0] : "",
        projectUrl: portfolio.projectUrl || ""
      });
    } else {
      // Default values for new portfolio
      setFormData({
        title: "",
        description: "",
        images: [PORTFOLIO_IMAGES[0]],
        technologies: [],
        completedDate: new Date().toISOString().split('T')[0],
        projectUrl: ""
      });
    }
  }, [portfolio, isOpen]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create or update portfolio mutation
  const portfolioMutation = useMutation({
    mutationFn: (data) => {
      if (isEditing && portfolio) {
        return updatePortfolio(portfolio.id, data);
      } else {
        return createPortfolio({
          ...data,
          userId: DEFAULT_USER_ID
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
  
  const handleChange = (e) => {
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
  
  const handleRemoveTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure we have at least one image
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
  
  // Handle file upload from user's device
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Check if adding these files would exceed the limit of 5 images
      if (formData.images.length + files.length > 5) {
        toast({
          title: "Too many images",
          description: `You can only upload a maximum of 5 images. You currently have ${formData.images.length}.`,
          variant: "destructive",
        });
        return;
      }
      
      // Create object URLs for the selected files
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
    }
  };
  
  // Create a hidden file input that will be triggered by our custom button
  const fileInputRef = useRef(null);
  
  const handleAddImage = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleRemoveImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  // Flatten all technology options from skill categories
  const allTechnologies = SKILL_CATEGORIES.flatMap(category => 
    category.options.map(option => option)
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
          {/* Hidden file input for multiple image upload */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
            multiple
          />
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
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
                      src={image} 
                      alt={`Project image ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-5 w-5 rounded-full"
                      onClick={() => handleRemoveImage(image)}
                      type="button"
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {formData.images.length < 5 && (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-md h-28 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={handleAddImage}
                  >
                    <div className="text-gray-500 text-center">
                      <PlusIcon className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-xs">Add Image</div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">You can add up to 5 images. In a real application, this would allow file uploads.</p>
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
                  disabled={!selectedTechnology}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="completedDate">Completion Date</Label>
              <Input
                id="completedDate"
                name="completedDate"
                type="date"
                value={formData.completedDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="projectUrl">Project URL (optional)</Label>
              <Input
                id="projectUrl"
                name="projectUrl"
                type="url"
                value={formData.projectUrl}
                onChange={handleChange}
                placeholder="https://example.com"
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
              disabled={portfolioMutation.isPending}
            >
              {portfolioMutation.isPending 
                ? (isEditing ? "Updating..." : "Creating...") 
                : (isEditing ? "Update Project" : "Create Project")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
