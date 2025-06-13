
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Tag,
  ChevronDown,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';
import { UserContext } from '../../store/UserProvider';
import { useNavigate } from 'react-router-dom';


/**
 * MultiStep Project Posting Form Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Function to call when project is successfully posted
 * @param {Function} props.onCancel - Function to call when user cancels the form
 * @param {string} props.apiUrl - API endpoint URL for posting the project (default: '/api/projects')
 * @returns {JSX.Element} - Rendered component
 */
const PostProjectForm = ({ onSuccess, onCancel, apiUrl = '/api/project/' }) => {
  // Form state
  const [skillCategories, setSkillCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useContext(UserContext);
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    minBudget: '',
    maxBudget: '',
    projectDeadline: '',
    projectSkills: [], // Will store the skill values (IDs)
    projectStateId: 1, // Draft by default
    userId: userData.userId?.[0] || -1
  });
  
  const navigate = useNavigate();

  // Map to keep track of skill value to label mapping
  const [skillsMap, setSkillsMap] = useState({});
  
  // UI state
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Total number of steps in the form
  const totalSteps = 4;
  
  useEffect(() => {
    const fetchCategories = async() => {
      try {
        const res = await axios.get('/api/categoriesWithSkills');
        setSkillCategories(res.data.data);
        
        // Build a map of skill value to label from all categories
        const skillMap = {};
        res.data.data.forEach(category => {
          category.options.forEach(option => {
            skillMap[option.value] = option.label;
          });
        });
        setSkillsMap(skillMap);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setCategoryDropdownOpen(false);
      setSkillsDropdownOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Add a new skill to the required skills array
  const addSkill = () => {
    if (newSkill.trim() && !formData.projectSkills.includes(newSkill.trim())) {
      // For custom skills, use the same value as label
      const skillValue = newSkill.trim();
      
      // Update skillsMap to include this custom skill
      setSkillsMap(prev => ({
        ...prev,
        [skillValue]: skillValue // For custom skills, value equals label
      }));
      
      setFormData({
        ...formData,
        projectSkills: [...formData.projectSkills, skillValue]
      });
      
      setNewSkill('');
    }
  };

  // Handle category selection
  const handleCategorySelect = (category, e) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
    setSkillsDropdownOpen(true);
  };

  // Handle skill selection from category
  const handleSelectSkill = (skill) => {
    if (!formData.projectSkills.includes(skill.value)) {
      setFormData({
        ...formData,
        projectSkills: [...formData.projectSkills, skill.value]
      });
    }
  };

  // Remove a skill from the required skills array
  const removeSkill = (skillValueToRemove) => {
    setFormData({
      ...formData,
      projectSkills: formData.projectSkills.filter(value => value !== skillValueToRemove)
    });
  };

  // Get label for a skill value
  const getSkillLabel = (skillValue) => {
    return skillsMap[skillValue] || skillValue;
  };

  // Validate current step before proceeding
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Title is required';
      if (formData.projectTitle.length < 5) newErrors.projectTitle = 'Title should be at least 5 characters';
    } else if (step === 2) {
      if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Description is required';
      if (formData.projectDescription.length < 100) newErrors.projectDescription = 'Description should be at least 100 characters';
    } else if (step === 3) {
      if (!formData.minBudget) newErrors.minBudget = 'Minimum budget is required';
      if (!formData.maxBudget) newErrors.maxBudget = 'Maximum budget is required';
      if (Number(formData.minBudget) <= 0) newErrors.minBudget = 'Minimum budget must be greater than 0';
      if (Number(formData.maxBudget) <= 0) newErrors.maxBudget = 'Maximum budget must be greater than 0';
      if (Number(formData.minBudget) >= Number(formData.maxBudget)) {
        newErrors.maxBudget = 'Maximum budget must be greater than minimum budget';
      }
      if (!formData.projectDeadline) newErrors.projectDeadline = 'Deadline is required';
      
      // Check if deadline is in the future
      const selectedDate = new Date(formData.projectDeadline);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.projectDeadline = 'Deadline must be in the future';
      }
    } else if (step === 4) {
      if (formData.projectSkills.length === 0) {
        newErrors.projectSkills = 'At least one skill is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Move to next step
  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  // Move to previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      // Convert budget strings to numbers
      const data = {
        ...formData,
        minBudget: Number(formData.minBudget),
        maxBudget: Number(formData.maxBudget)
      };

      // Send data to the server using axios
      const response = await axios.post(apiUrl, data);
      
      // Store response data for success modal
      setSuccessData(response.data);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error posting project:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to create project. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close the success modal
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Reset form data if needed
    setFormData({
      projectTitle: '',
      projectDescription: '',
      minBudget: '',
      maxBudget: '',
      projectDeadline: '',
      projectSkills: [],
      projectStateId: 1,
    });
    setStep(1);
  };

  // Render different form sections based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 1: Project Title</h2>
            <div className="space-y-2">
              <label htmlFor="projectTitle" className="block text-sm font-medium">
                Project Title
              </label>
              <input
                id="projectTitle"
                name="projectTitle"
                type="text"
                value={formData.projectTitle}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.projectTitle ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="e.g., E-commerce Website Development"
              />
              {errors.projectTitle && <p className="text-red-500 text-sm">{errors.projectTitle}</p>}
              <p className="text-gray-500 text-sm mt-2">
                Enter a clear and descriptive title for your project. A good title helps freelancers understand what you need.
              </p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 2: Project Description</h2>
            <div className="space-y-2">
              <label htmlFor="projectDescription" className="block text-sm font-medium">
                Project Description
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows={8}
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 font-mono ${
                  errors.projectDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Describe your project in detail..."
                style={{ whiteSpace: 'pre-wrap' }} // This preserves spaces and line breaks
              />
              {errors.projectDescription && <p className="text-red-500 text-sm">{errors.projectDescription}</p>}
              <p className="text-gray-500 text-sm mt-2">
                Provide a detailed description of your project. Include information about what you want to achieve, specific features,
                and any other relevant details that will help freelancers understand your requirements.
              </p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 3: Budget & Deadline</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="minBudget" className="block text-sm font-medium">
                  Minimum Budget ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    id="minBudget"
                    name="minBudget"
                    type="number"
                    value={formData.minBudget}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                      errors.minBudget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="e.g., 1000"
                  />
                </div>
                {errors.minBudget && <p className="text-red-500 text-sm">{errors.minBudget}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxBudget" className="block text-sm font-medium">
                  Maximum Budget ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    id="maxBudget"
                    name="maxBudget"
                    type="number"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                      errors.maxBudget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="e.g., 2000"
                  />
                </div>
                {errors.maxBudget && <p className="text-red-500 text-sm">{errors.maxBudget}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="projectDeadline" className="block text-sm font-medium">
                Project Deadline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="projectDeadline"
                  name="projectDeadline"
                  type="date"
                  value={formData.projectDeadline}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                    errors.projectDeadline ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.projectDeadline && <p className="text-red-500 text-sm">{errors.projectDeadline}</p>}
              <p className="text-gray-500 text-sm mt-2">
                Set a realistic deadline for your project. This helps freelancers determine if they can complete
                the work within your timeframe.
              </p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Step 4: Required Skills</h2>
            
            <div className="space-y-4">
              <label htmlFor="projectSkills" className="block text-sm font-medium">
                Skills Required for the Project
              </label>
              
              {/* Category Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select a Category
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategoryDropdownOpen(!categoryDropdownOpen);
                    }}
                    className="flex justify-between items-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>{selectedCategory ? selectedCategory.name : 'Select a category'}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                  
                  {categoryDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
                      {skillCategories.map((category) => (
                        <button
                          key={category.name}
                          type="button"
                          className="block w-full px-4 py-2 text-left hover:bg-blue-50"
                          onClick={(e) => handleCategorySelect(category, e)}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Skills from selected category */}
              {selectedCategory && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Skills in {selectedCategory.name}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedCategory.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelectSkill(option)}
                        className={`px-3 py-2 border text-left rounded-lg text-sm transition-colors ${
                          formData.projectSkills.includes(option.value)
                            ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Manual skill entry */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Custom Skill
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      id="newSkill"
                      name="newSkill"
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-l-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a custom skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {errors.projectSkills && <p className="text-red-500 text-sm">{errors.projectSkills}</p>}
              
              {/* Selected skills list */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Selected Skills
                </label>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[100px] shadow-inner">
                  {formData.projectSkills.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No skills selected yet. Select skills from the categories above or add custom skills.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.projectSkills.map((skillValue) => (
                        <div 
                          key={skillValue} 
                          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm hover:shadow transition-shadow"
                        >
                          <span>{getSkillLabel(skillValue)}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skillValue)}
                            className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mt-2">
                Select skills that are required for your project. This helps match your project with the right
                freelancers who have the expertise you need.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Project Summary</h3>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                <div className="space-y-4 text-gray-700">
                  <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Title:</span> 
                    <span className="col-span-2 font-semibold text-gray-800">{formData.projectTitle}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 items-start pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Description:</span> 
                    <div className="col-span-2">
                      <p className="text-gray-800">
                        {formData.projectDescription.length > 150 
                          ? `${formData.projectDescription.substring(0, 150)}...` 
                          : formData.projectDescription}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Budget:</span> 
                    <span className="col-span-2 text-green-600 font-semibold">
                      ${formData.minBudget} - ${formData.maxBudget}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 items-center pb-3 border-b border-gray-100">
                    <span className="font-medium text-gray-500 col-span-1">Deadline:</span> 
                    <span className="col-span-2 text-orange-600 font-semibold">
                      {formData.projectDeadline ? new Date(formData.projectDeadline).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 items-start">
                    <span className="font-medium text-gray-500 col-span-1">Required Skills:</span> 
                    <div className="col-span-2">
                      {formData.projectSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {formData.projectSkills.map(skillValue => (
                            <span key={skillValue} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                              {getSkillLabel(skillValue)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No skills selected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {errors.general && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg">
                  {errors.general}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Success Modal
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button 
          onClick={handleCloseSuccessModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project Posted Successfully!</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your project has been posted successfully and is now visible to freelancers.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-left mb-4">
            <p className="font-medium text-gray-700 mb-1"> {successData?.projectTitle}</p>
            <p className="text-gray-600">: {successData?.id}</p>
          </div>
          
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={handleCloseSuccessModal}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                handleCloseSuccessModal();
                navigate('/projects');
              }}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 animate-pulse"
            >
              View Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Post a New Project</h1>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-500">Project Details</span>
          <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
        </div>
      </div>
      
      <form onSubmit={step === totalSteps ? handleSubmit : e => e.preventDefault()}>
        {renderStep()}
        
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-shadow"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          ) : (
            onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center px-6 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-shadow"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
            ) : (
              <div>{/* Empty div to maintain spacing */}</div>
            )
          )}
          
          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Post Project
                </>
              )}
            </button>
          )}
        </div>
      </form>
      
      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default PostProjectForm;
