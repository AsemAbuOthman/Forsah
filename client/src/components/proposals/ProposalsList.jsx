import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { 
  Star, 
  Clock, 
  DollarSign, 
  MessageCircle, 
  Award,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  User,
  Flag,
  Briefcase
} from 'lucide-react';

/**
 * Component to display a list of proposals for a project with award and chat options
 * 
 * @param {Object} props - Component props
 * @param {Array} props.proposals - Array of proposal objects
 * @param {Object} props.project - Project details
 * @param {boolean} props.isClientView - Whether the component is being viewed by the client (project owner)
 * @param {Function} props.onChatClick - Function to call when chat button is clicked
 * @param {Function} props.onAwardClick - Function to call when award button is clicked
 * @param {Function} props.onProposalUpdate - Function to call when proposal status changes
 * @returns {JSX.Element} - Rendered component
 */
const ProposalsList = ({ 
  proposals = [], 
  projectId,
  isClientView = false,
  onChatClick,
  onAwardClick,
  onProposalUpdate,
  apiUrl
}) => {
  const [expandedProposal, setExpandedProposal] = useState(null);

  // Toggle proposal details expansion
  const toggleExpand = (proposalId) => {
    if (expandedProposal === proposalId) {
      setExpandedProposal(null);
    } else {
      setExpandedProposal(proposalId);
    }
  };

  // Handle chat button click
  const handleChatClick = (proposal) => {
    if (onChatClick) {
      onChatClick(proposal);
    }
  };

  // Handle award button click
  const handleAwardClick = async (proposal) => {
    if (onAwardClick) {
      onAwardClick(proposal);
    }
  };

  // Log to debug
  console.log("Rendering proposals list with:", proposals);
  

  // const [useProposals, setUseProposals] = useState(null);

  // TEMPORARY: If there are no proposals, use demo data directly in the component
  const useProposals = proposals.length > 0 ? proposals : [
    {
      proposalId: 1001,
      projectId: projectId || 123,
      userId: 789,
      proposalAmount: 350,
      proposalDeadline: "2023-06-15",
      proposalDescription: "Hello! I'm very experienced with Excel formulas and VBA. I've worked on many financial spreadsheets that deal with fiscal year calculations. I can fix your issue with the date formulas and ensure they account for the fiscal year differences correctly.\n\nI've attached some examples of similar work I've done in the past. I would approach this by first analyzing your current formulas, understanding the fiscal year requirements, and then implementing a solution that's both accurate and easy to maintain.\n\nLooking forward to working with you!",
      createdAt: new Date().toISOString(),
      proposalStateId: 1,
      firstName: "John",
      lastName: "Smith",
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      city: "New York, USA",
      countryName: "United States",
      rating: 4.8,
      totalReviews: 57,
      totalEarned: 12500,
      projectsCompleted: 23,
      skills: ["Excel", "VBA", "Python", "Financial Analysis", "Data Visualization", "SQL", "Power BI"]
      }
  ];
  
  useEffect(() => {
    const fetchProposals = async () => {

      try {

        // const response = await axios.get(`${apiUrl}/${projectId}`);
        // setUseProposals(response.data.proposals || []);
        
      } catch (err) {
        console.error('Error fetching proposals:', err);
        // setError('Failed to load proposals. Please try again later.');
        // setLoading(false);
      }
    };

    fetchProposals();
  }, [projectId]);

  console.log("Using proposals:", useProposals);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Proposals ({useProposals.length})</h2>
      </div>
      
      {useProposals.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No proposals yet for this project.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {useProposals.map((proposal) => (
            <div key={proposal.proposalId} className="p-0">
              {/* Proposal Header - Always visible */}
              <div 
                className={`px-4 py-4 cursor-pointer hover:bg-gray-50 transition-all ${
                  expandedProposal === proposal.proposalId ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleExpand(proposal.proposalId)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  {/* Freelancer Info */}
                  <div className="flex items-start space-x-3 mb-3 md:mb-0">
                    <div className="flex-shrink-0">
                      {proposal.imageUrl ? (
                        <img 
                          src={proposal.imageUrl} 
                          alt={proposal.firstName + " " + proposal.lastName}
                          className="h-14 w-14 rounded-full object-cover border-2 border-blue-100"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                          {proposal.firstName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">{proposal.firstName}</h3>
                        <div className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">ID #{proposal.proposalId}</div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-0.5">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                          {/* <span className="font-medium">{proposal.freelancer.rating}</span> */}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{proposal.countryName}</span>
                        {/* {proposal.freelancer.totalReviews > 0 && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{proposal.freelancer.totalReviews} reviews</span>
                          </>
                        )} */}
                      </div>
                      
                      {/* Skills - First 3 only */}
                      {/* {proposal.freelancer.skills && proposal.freelancer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proposal.freelancer.skills.slice(0, 3).map((skill, index) => (
                            <span 
                              key={index}
                              className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {proposal.freelancer.skills.length > 3 && (
                            <span className="text-xs text-gray-500">+{proposal.freelancer.skills.length - 3} more</span>
                          )}
                        </div>
                      )} */}
                    </div>
                  </div>
                  
                  {/* Proposal Summary */}
                  <div className="flex flex-wrap md:flex-col items-center md:items-end gap-4 md:gap-1">
                    <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                      <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                      <span className="font-bold text-green-700">${proposal.proposalAmount}</span>
                    </div>
                    <div className="flex items-center bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                      <Clock className="h-5 w-5 mr-1 text-orange-600" />
                      <span className="font-bold text-orange-700">{proposal.proposalDeadline}</span>
                    </div>
                    <div className="md:mt-2 flex items-center text-gray-400">
                      {expandedProposal === proposal.proposalId ? (
                        <div className="flex items-center text-blue-600">
                          <span className="text-sm mr-1">Hide details</span>
                          <ChevronUp className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex items-center text-blue-600">
                          <span className="text-sm mr-1">View details</span>
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center text-xs">
                    <span className="text-gray-500">Submitted:</span>
                    <span className="ml-1 text-gray-700">
                      {proposal.createdAt && new Date(proposal.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {proposal.proposalStateId === 1 ? 'Pending' : 
                      proposal.proposalStateId === 2 ? 'Awarded' : 'Under Review'}
                  </div>
                </div>
              </div>

              {/* Expanded Proposal Details */}
              {expandedProposal === proposal.proposalId && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
                  {/* Freelancer Detailed Info */}
                  <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {proposal.imageUrl ? (
                          <img 
                            src={proposal.imageUrl} 
                            alt={proposal.imageUrl}
                            className="h-16 w-16 rounded-full object-cover border-2 border-blue-100"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                            {proposal.firstName.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{proposal.firstName + " " + proposal.lastName}</h3>
                          <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-sm">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                            <span className="font-medium">{proposal.rating}/5.0</span>
                            <span className="mx-1 text-gray-400">•</span>
                            <span className="text-gray-600">{proposal.totalReviews} reviews</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-gray-500 font-medium">Location</div>
                              <div className="text-gray-800">
                                {proposal.city || 'Not specified'}
                                {proposal.country && proposal.city && 
                                  `${proposal.city}, ${proposal.country}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-gray-500 font-medium">Member since</div>
                              <div className="text-gray-800">
                                {proposal.joinedDate ? new Date(proposal.joinedDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) : 'Not available'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-gray-500 font-medium">Total earnings</div>
                              <div className="text-green-600 font-medium">
                                ${proposal.totalEarned ? proposal.totalEarned.toLocaleString() : '0'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-gray-500 font-medium">Projects completed</div>
                              <div className="text-gray-800">
                                {proposal.projectsCompleted || 0}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-gray-500 font-medium">Proposal ID</div>
                              <div className="text-gray-800">#{proposal.proposalId}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Flag className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-gray-500 font-medium">Project ID</div>
                              <div className="text-gray-800">#{proposal.projectId}</div>
                            </div>
                          </div>
                        </div>
                        
                        {proposal.proposalDescription && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">About me</h4>
                            <p className="text-sm text-gray-600">{proposal.proposalDescription}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Proposal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-xs uppercase text-green-600 font-semibold mb-1">Bid Amount</div>
                      <div className="text-xl font-bold text-green-700">${proposal.proposalAmount}</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="text-xs uppercase text-orange-600 font-semibold mb-1">Delivery Time</div>
                      <div className="text-xl font-bold text-orange-700">{proposal.proposalDeadline}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-xs uppercase text-blue-600 font-semibold mb-1">Project ID</div>
                      <div className="text-xl font-bold text-blue-700">#{proposal.projectId}</div>
                    </div>
                  </div>
                  
                  {/* Cover Letter */}
                  <div className="text-sm text-gray-700 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 whitespace-pre-wrap">
                      {proposal.proposalDescription}
                    </div>
                  </div>
                  
                  {/* Skills Tags */}
                  {proposal.skills && proposal.skills.length > 0 && (
                    <div className="mb-5">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {proposal.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatClick(proposal);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Chat
                    </button>
                    
                    {isClientView && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAwardClick(proposal);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Award
                      </button>
                    )}
                  </div>
                  
                  {/* Submission Date */}
                  <div className="mt-4 text-xs text-gray-500">
                    Submitted {proposal.createdAt && new Date(proposal.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalsList;