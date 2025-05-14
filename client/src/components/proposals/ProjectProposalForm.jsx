import React, { useState } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  X,
  Loader2
} from 'lucide-react';

/**
 * Project Proposal Form Component for Freelancers
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project details
 * @param {number} props.freelancerId - ID of the freelancer submitting the proposal
 * @param {Function} props.onSuccess - Function to call when proposal is successfully submitted
 * @param {Function} props.onCancel - Function to call when user cancels the form
 * @param {string} props.apiUrl - API endpoint URL for posting the proposal (default: '/api/proposals')
 * @returns {JSX.Element} - Rendered component
 */
const ProjectProposalForm = ({ 
  project, 
  freelancerId, 
  onSuccess, 
  onCancel, 
  apiUrl = '/api/proposals' 
}) => {
  // Form state
  const [formData, setFormData] = useState({
    projectId: project?.projectId || 0,
    userId: freelancerId || 0,
    proposalAmount: '',
    proposalDeadline: '',
    proposalDescription: ''
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

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

  // Validate form before submitting
  const validateForm = () => {
    const newErrors = {};

    if (!formData.proposalAmount) {
      newErrors.bidAmount = 'Bid amount is required';
    } else if (isNaN(formData.proposalAmount) || Number(formData.proposalAmount) <= 0) {
      newErrors.proposalAmount = 'Bid amount must be a positive number';
    }

    if (!formData.proposalDeadline) {
      newErrors.proposalDeadline = 'Delivery time is required';
    }

    if (!formData.proposalDescription.trim()) {
      newErrors.proposalDescription = 'Cover letter is required';
    } else if (formData.proposalDescription.length < 100) {
      newErrors.proposalDescription = 'Cover letter should be at least 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Convert bid amount to number
      const data = {
        ...formData,
        proposalAmount: Number(formData.proposalAmount)
      };


      const response = await axios.post(apiUrl, data);
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = { data: { ...data, id: Math.floor(Math.random() * 1000) + 1000 }};
      
      // Store response data for success modal
      setSuccessData(mockResponse.data);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(mockResponse.data);
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to submit proposal. Please try again.' });
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
      projectId: project?.id || 0,
      userId: freelancerId || 0,
      proposalAmount: '',
      proposalDeadline: '',
      proposalDescription: ''
    });
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Proposal Submitted Successfully!</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your proposal has been submitted successfully. The client will review your bid and get back to you.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-left mb-4">
            <p className="font-medium text-gray-700 mb-1">Project: {project?.projectTitle}</p>
            <p className="text-gray-600">Bid Amount: ${formData.proposalAmount}</p>
            <p className="text-gray-600">Delivery Time: {formData.proposalDeadline}</p>
          </div>
          
          <button
            type="button"
            onClick={handleCloseSuccessModal}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Submit a Proposal</h2>
        <p className="text-sm text-gray-500 mt-1">
          Provide details about your proposal for this project
        </p>
      </div>
      
      {/* Project Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Project: {project?.projectTitle}</h3>
        <p className="text-sm text-gray-600 mb-2">{project?.projectDescription}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {project?.skills?.map((skill) => (
            <span 
              key={skill.skillId} 
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {skill.skillName}
            </span>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-sm text-gray-600">
          <span>Budget: ${project?.minBudget} - ${project?.maxBudget}</span>
          <span>Deadline: {project?.projectDeadline && new Date(project.projectDeadline).toLocaleDateString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bid Amount */}
        <div className="space-y-2">
          <label htmlFor="proposalAmount" className="block text-sm font-medium text-gray-700">
            Bid Amount ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              id="proposalAmount"
              name="proposalAmount"
              type="number"
              value={formData.proposalAmount}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.bidAmount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter your bid amount"
            />
          </div>
          {errors.proposalAmount && <p className="text-red-500 text-sm">{errors.proposalAmount}</p>}
          {project?.minBudget && project?.maxBudget && (
            <p className="text-xs text-gray-500">
              Client's budget: ${project.minBudget} - ${project.maxBudget}
            </p>
          )}
        </div>

        {/* Estimated Delivery Time */}
        <div className="space-y-2">
          <label htmlFor="proposalDeadline" className="block text-sm font-medium text-gray-700">
            Estimated Delivery Time
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              id="proposalDeadline"
              name="proposalDeadline"
              type="number"
              value={formData.proposalDeadline}
              onChange={handleChange}
              placeholder="Enter number of days"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                errors.proposalDeadline ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>
          {errors.proposalDeadline && <p className="text-red-500 text-sm">{errors.proposalDeadline}</p>}
          {project?.projectDeadline && (
            <p className="text-xs text-gray-500">
              Client's deadline: {new Date(project.projectDeadline).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Cover Letter */}
        <div className="space-y-2">
          <label htmlFor="proposalDescription" className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <textarea
            id="proposalDescription"
            name="proposalDescription"
            value={formData.proposalDescription}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              errors.proposalDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Introduce yourself, explain why you're a good fit for this project, and outline your relevant experience and skills"
          />
          {errors.proposalDescription && <p className="text-red-500 text-sm">{errors.proposalDescription}</p>}
        </div>

        {errors.general && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-all flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Proposal'
            )}
          </button>
        </div>
      </form>
      
      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default ProjectProposalForm;