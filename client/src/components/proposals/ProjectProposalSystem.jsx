import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Flag, Star, Clock, User, AlertTriangle } from 'lucide-react';
import SimpleProposalForm from './SimpleProposalForm';
import SimpleProposalsList from './SimpleProposalsList';
import { useLocation } from 'react-router-dom';
import ProposalsList from './ProposalsList';
import ProjectProposalForm from './ProjectProposalForm';

/**
 * ProjectProposalSystem component combines proposal submission form and list
 * @param {Object} props
 * @param {Object} props.project - Project details
 * @param {string} props.freelancerId - ID of the current freelancer (null if viewed by client)
 * @param {boolean} props.isClientView - Whether component is viewed by client
 * @param {string} props.apiUrl - Base API URL
 * @returns {JSX.Element}
 */
const ProjectProposalSystem = ({
  project,
  freelancerId,
  isClientView = false,
  apiUrl = '/api/proposals'
}) => {
  const [activeTab, setActiveTab] = useState(isClientView ? 'proposals' : 'form');
  const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false);
  const [refreshProposals, setRefreshProposals] = useState(0);

  // Define sample project if none provided
  const sampleProject = project || {
    id: "39393525",
    title: "Animation of Trifold Pamphlet Folding",
    description: "I need an animation of my trifold pamphlet folding. The animation should resemble realistic paper folding.",
    minBudget: 10,
    maxBudget: 30,
    currency: "AUD",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    biddingEndsIn: { days: 6, hours: 23 },
    requirements: [
      "Animation style should be realistic paper folding",
      "Use provided PNG, PDF, or Microsoft Edge PDF formats",
      "No specific elements or text need emphasis"
    ],
    idealSkills: [
      "Proficiency in animation software",
      "Experience with realistic animation",
      "Ability to work with various file formats"
    ],
    additionalInfo: "Please provide samples of similar work.",
    requiredSkills: ["Graphic Design", "Illustrator", "Animation", "After Effects", "3D Animation"],
    complexity: "Intermediate",
    projectId: "39393525"
  };

  // Check if current freelancer has already submitted a proposal
  useEffect(() => {
    const checkExistingProposal = async () => {
      if (!freelancerId || isClientView) return;

      try {
        
        const response = await axios.get(`${apiUrl}/check?projectId=${project.projectId}&freelancerId=${freelancerId}`);
        setHasSubmittedProposal(response.data.hasSubmitted);

      } catch (err) {
        console.error("Error checking existing proposal:", err);
      }
    };

    checkExistingProposal();
  }, [freelancerId, isClientView, project?.id]);

  // Handle successful proposal submission
  const handleProposalSuccess = (proposals) => {
    setHasSubmittedProposal(true);
    setActiveTab('proposals');
    setRefreshProposals(prev => prev + 1);
  };

  const formattedDate = new Date(sampleProject.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',   // optional
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-xl font-bold text-gray-800 ">Project Details</h1>
                <div className="text-right">
                  <div className="text-gray-900 font-bold">${sampleProject.minBudget}.00 – ${sampleProject.maxBudget}.00 {sampleProject.currency}</div>
                  <div className="flex items-center mt-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                    <span>BIDDING ENDS IN {sampleProject.projectDeadline?.days} DAYS, {sampleProject.projectDeadline?.hours} HOURS</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-5 text-sm">{sampleProject.projectDescription}</p>

              <p className="text-gray-700 mb-5">{sampleProject.additionalInfo}</p>
              
              <div className="mb-5">
                <h3 className="font-medium text-gray-800 mb-3">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {sampleProject.skills?.map((skill) => (
                    <span 
                      key={skill.skillId} 
                      className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-600 mt-3">
                <span>Project ID: {sampleProject.projectId}</span>
                <button className="ml-auto flex items-center text-gray-700 hover:text-gray-900">
                  <AlertTriangle className="h-5 w-5 mr-1 text-gray-500" />
                  Report Project
                </button>
              </div>
            </div>
            
            {/* Client Details Section */}
            <div className="w-full md:w-64 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-5">About the Client</h3>
              
              <div className="space-y-3">
                
                
              <div className="flex items-center text-gray-700">
                  <div className="flex items-center">
                    <span className="flex items-center mr-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className="h-4 w-4 text-gray-300"
                        />
                      ))}
                    </span>
                    <span className="font-medium">0.0</span>
                  </div>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="text-gray-600">0</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span className='text-sm'>{sampleProject.countryName}</span>
                </div>
                
                
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5  mr-2 text-gray-500 " />
                  <span className='text-xs'>Member since {formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for Proposal Form/List */}
      {!isClientView && (
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('form')}
            disabled={hasSubmittedProposal}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'form'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ${hasSubmittedProposal ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Submit Proposal
            {hasSubmittedProposal && ' (Already Submitted)'}
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'proposals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            View Proposals
          </button>
        </div>
      )}
      
      {/* Content based on active tab */}
      {!isClientView && activeTab === 'form' && !hasSubmittedProposal && (
        <ProjectProposalForm
          project={sampleProject}
          freelancerId={freelancerId}
          onSuccess={handleProposalSuccess}
          apiUrl={apiUrl}
        />
      )}
      
      {isClientView ? (
        <ProposalsList
          projectId={sampleProject.projectId}
          isClientView={isClientView}
          apiUrl={apiUrl}
          key={refreshProposals} // Force refresh
        />
      ) : (
        (activeTab === 'proposals' || hasSubmittedProposal) && (
          <SimpleProposalsList
            projectId={sampleProject.projectId}
            isClientView={isClientView}
            apiUrl={apiUrl}
            key={refreshProposals} // Force refresh
          />
        )
      )}
    </div>
  );
};

export default ProjectProposalSystem;