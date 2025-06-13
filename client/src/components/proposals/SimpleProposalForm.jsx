import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, DollarSign, Calendar, Clock, Send } from 'lucide-react';

/**
 * A form component for submitting project proposals
 * @param {Object} props
 * @param {Object} props.project - Project details
 * @param {string} props.freelancerId - ID of the freelancer submitting the proposal
 * @param {Function} props.onSuccess - Callback when proposal is submitted successfully
 * @param {string} props.apiUrl - API endpoint for proposals
 * @returns {JSX.Element}
 */

const SimpleProposalForm = ({
  project,
  freelancerId,
  onSuccess,
  apiUrl = '/api/proposals/'
}) => {
  // Form state
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalDeadline, setProposalDeadline] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalData, setProposalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form validation
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!proposalAmount || proposalAmount <= 0) {
      newErrors.proposalAmount = 'Please enter a valid bid amount';
    }
    
    if (!proposalDeadline) {
      newErrors.proposalDeadline = 'Please specify delivery time';
    }
    
    if (!proposalDescription || proposalDescription.trim().length < 50) {
      newErrors.proposalDescription = 'Cover letter should be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {

      setProposalData({
        projectId: project?.projectId,
        userId: freelancerId,
        proposalAmount: parseInt(proposalAmount),
        proposalDeadline: proposalDeadline,
        proposalDescription: proposalDescription
      });

      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      
      console.log("SimpleProposalForm ", {
        projectId: project?.projectId,
        userId: freelancerId,
        proposalAmount: parseInt(proposalAmount),
        proposalDeadline: proposalDeadline,
        proposalDescription: proposalDescription
      });
      
      const res = await axios.post(apiUrl, {
        projectId: project?.projectId,
        userId: freelancerId,
        proposalAmount: parseInt(proposalAmount),
        proposalDeadline: proposalDeadline,
        proposalDescription: proposalDescription
      });
      
      if(res){

        console.log(res.data.proposals);
      }

      // For demo purposes, simulate a successful response
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear form
      // setProposalAmount('');
      // setProposalDeadline('');
      // setProposalDescription('');
      
      // Call success callback
      if (onSuccess) {
        onSuccess(res.data.proposals);
      }
      
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setError('Failed to submit proposal. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
        Project information not available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Submit a Proposal</h2>
        <p className="text-gray-600 mt-1">
          Provide details about your bid for "{project.title || 'this project'}"
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        {/* Project Budget Reference */}
        <div className="bg-blue-50 p-4 rounded-lg text-sm">
          <div className="font-medium text-blue-800 mb-1">Project Budget</div>
          <div className="text-blue-700">
            ${project.minBudget || '10'}.00 - ${project.maxBudget || '30'}.00 {project.currency || 'AUD'}
          </div>
        </div>
        
        {/* Bid Amount */}
        <div>
          <label htmlFor="proposalAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Your Bid Amount ({project.currency || 'AUD'})
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="proposalAmount"
              name="proposalAmount"
              value={proposalAmount}
              onChange={(e) => setProposalAmount(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md ${
                errors.proposalAmount ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter your bid amount"
            />
          </div>
          {errors.proposalAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.proposalAmount}</p>
          )}
        </div>
        
        {/* Delivery Time */}
        <div>
          <label htmlFor="proposalDeadline" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Delivery Time (days)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="1"
              max="90"
              id="proposalDeadline"
              name="proposalDeadline"
              value={proposalDeadline}
              onChange={(e) => setProposalDeadline(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md ${
                errors.proposalDeadline ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter number of days"
            />
          </div>
          {errors.proposalDeadline && (
            <p className="mt-1 text-sm text-red-600">{errors.proposalDeadline}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Please enter the estimated number of days needed to complete the project.
          </p>
        </div>
        
        {/* Cover Letter */}
        <div>
          <label htmlFor="proposalDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter
          </label>
          <div className="mt-1">
            <textarea
              id="proposalDescription"
              name="proposalDescription"
              rows={6}
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              className={`block w-full sm:text-sm border-gray-300 rounded-md ${
                errors.proposalDescription ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Introduce yourself, explain why you're a good fit for this project, describe your approach, and ask any questions you may have."
            />
          </div>
          {errors.proposalDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.proposalDescription}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Minimum 50 characters. Explain your experience, approach, and why you're the best choice for this project.
          </p>
        </div>
        
        {/* Form Error Message */}
        {error && (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Proposal
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimpleProposalForm;