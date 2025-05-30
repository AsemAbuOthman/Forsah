import React, { useState, useEffect } from 'react';
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
  Briefcase,
  CheckCircle,
  FileText,
  Send,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ProposalsList = ({ 
  proposals = [], 
  projectId,
  isClientView = false,
  apiUrl
}) => {
  const [expandedProposal, setExpandedProposal] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const userData = JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();
  const [useProposals, setUseProposals] = useState([]);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const toggleExpand = (proposalId) => {
    if (expandedProposal === proposalId) {
      setExpandedProposal(null);
    } else {
      setExpandedProposal(proposalId);
    }
  };

  const handleChatClick = async (proposal) => {
    setLoadingStates(prev => ({ ...prev, [proposal.proposalId]: { ...prev[proposal.proposalId], chatLoading: true } }));
    
    try {
      const response = await axios.post(`/api/contact?senderId=${userData.userId[0]}&recevierId=${proposal.userId}`);
      if(response.data) {
        navigate('/messages');
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [proposal.proposalId]: { ...prev[proposal.proposalId], chatLoading: false } }));
    }
  };

  const handleAwardClick = async (proposal) => {
    setLoadingStates(prev => ({ 
      ...prev, 
      [proposal.proposalId]: { 
        ...prev[proposal.proposalId], 
        awardLoading: true 
      } 
    }));

    console.log('This pro : ', proposal);
    
    
    try {
      // Safely get user data from localStorage
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('User data not found. Please log in again.');
      }
  
      const userData = JSON.parse(userDataString);
      
      // Validate we have a userId
      const userId = Array.isArray(userData.userId) 
        ? userData.userId[0] 
        : userData.userId;
      
      if (!userId) {
        throw new Error('User ID not found in user data.');
      }
  
      // Validate proposal data
      if (!proposal || !proposal.projectId) {
        throw new Error('Invalid proposal data.');
      }
  
      console.log('1 proposal: ', proposal);
      console.log('2 userId: ', userId);
      console.log('3 proposal.projectId: ', proposal.projectId);

      navigate('/payment', { 
        state: { 
          proposalData: proposal, 
          userId: userId, 
          projectId: proposal.projectId 
        } 
      });
    } catch (error) {
      console.error('Error awarding project:', error);
      // You might want to show this error to the user
      toast.error(error.message || 'Failed to award project. Please try again.');
    } finally {
      setLoadingStates(prev => ({ 
        ...prev, 
        [proposal.proposalId]: { 
          ...prev[proposal.proposalId], 
          awardLoading: false 
        } 
      }));
    }
  };

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${projectId}`);
        setUseProposals(response.data?.proposals || []);
      } catch (err) {
        console.error('Error fetching proposals:', err);
      }
    };

    fetchProposals();
  }, [projectId]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Project Proposals ({useProposals.length})</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sorted by:</span>
            <select className="text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Most Relevant</option>
              <option>Newest First</option>
              <option>Lowest Bid</option>
              <option>Highest Rating</option>
            </select>
          </div>
        </div>
      </div>
      
      {useProposals.length === 0 ? (
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-500 mb-6">This project hasn't received any proposals yet. Check back later or share the project to attract freelancers.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Share Project
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          <AnimatePresence>
            {useProposals.map((proposal) => (
              <motion.div
                key={proposal.proposalId}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
              >
                <div className="p-0">
                  {/* Proposal Header */}
                  <div 
                    className={`px-5 py-4 cursor-pointer transition-all hover:bg-blue-50 ${
                      expandedProposal === proposal.proposalId ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleExpand(proposal.proposalId)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Freelancer Info */}
                      <div className="flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          {proposal.imageUrl ? (
                            <img 
                              src={proposal.imageUrl} 
                              alt={proposal.username}
                              className="h-14 w-14 rounded-xl object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                              {proposal?.username?.charAt(0)}
                            </div>
                          )}
                          {proposal.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white">
                              <CheckCircle className="h-4 w-4 text-white" fill="currentColor" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {proposal.firstName || proposal.lastName ? 
                                `${proposal.firstName} ${proposal.lastName}` : 
                                `@${proposal.username}`}
                            </h3>
                            {proposal.topRated && (
                              <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                Top Rated
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                              <span className="font-medium">{proposal.rating || '5.0'}</span>
                              <span className="mx-1">•</span>
                              <span>{proposal.totalReviews || 0} reviews</span>
                            </div>
                            {proposal.countryName && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{proposal.countryName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Proposal Summary */}
                      <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4">
                        <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 shadow-sm">
                          <DollarSign className="h-5 w-5 mr-1.5 text-green-600" />
                          <span className="font-bold text-green-700">${proposal.proposalAmount}</span>
                        </div>
                        <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                          <Clock className="h-5 w-5 mr-1.5 text-blue-600" />
                          <span className="font-bold text-blue-700">{proposal.proposalDeadline}</span>
                        </div>
                        <div className="hidden md:flex items-center text-blue-600">
                          {expandedProposal === proposal.proposalId ? (
                            <div className="flex items-center">
                              <span className="text-sm mr-1">Less</span>
                              <ChevronUp className="h-5 w-5" />
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="text-sm mr-1">More</span>
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
                      
                      <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        proposal.proposalStateId === 1 ? 'bg-blue-100 text-blue-800' : 
                        proposal.proposalStateId === 2 ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {proposal.proposalStateId === 1 ? 'Pending Review' : 
                          proposal.proposalStateId === 2 ? 'Awarded' : 'Under Review'}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Proposal Details */}
                  <AnimatePresence>
                    {expandedProposal === proposal.proposalId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100">
                          {/* Freelancer Detailed Info */}
                          <div className="mb-6 p-5 bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="flex flex-col md:flex-row gap-5">
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <a href={`/profile/${proposal.userId}`} className="block">
                                  {proposal.imageUrl ? (
                                    <img 
                                      src={proposal.imageUrl} 
                                      alt={proposal.username}
                                      className="h-20 w-20 rounded-xl object-cover border-2 border-blue-100 shadow-md"
                                    />
                                  ) : (
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                      {proposal?.username?.charAt(0)}
                                    </div>
                                  )}
                                  {proposal.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                                      <Shield className="h-4 w-4 text-white" />
                                    </div>
                                  )}
                                  </a>
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex flex-wrap justify-between items-center mb-3">
                                <a href={`/profile/${proposal.userId}`} className="block">
                                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                                    {proposal.firstName || proposal.lastName ? 
                                      `${proposal.firstName} ${proposal.lastName}` : 
                                      `@${proposal.username}`}
                                  </h3>
                                  </a>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-md text-sm shadow-sm">
                                      <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                                      <span className="font-medium">{proposal.rating || '5.0'}</span>
                                      <span className="mx-1 text-gray-400">•</span>
                                      <span className="text-gray-600">{proposal.totalReviews || 0} reviews</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-gray-500 font-medium">Location</div>
                                      <div className="text-gray-800">
                                        {proposal.city && proposal.countryName ? 
                                          `${proposal.city}, ${proposal.countryName}` : 
                                          proposal.countryName || 'Not specified'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-gray-500 font-medium">Member since</div>
                                      <div className="text-gray-800">
                                        {proposal.joinedDate ? new Date(proposal.joinedDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short'
                                        }) : 'Not available'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <DollarSign className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-gray-500 font-medium">Total earnings</div>
                                      <div className="text-green-600 font-medium">
                                        ${proposal.totalEarned ? proposal.totalEarned.toLocaleString() : '0'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <Briefcase className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-gray-500 font-medium">Projects completed</div>
                                      <div className="text-gray-800">
                                        {proposal.projectsCompleted || 0}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Proposal Info Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-50 rounded-xl border border-green-100 shadow-sm">
                              <div className="flex items-center mb-2">
                                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                                <div className="text-sm uppercase text-green-600 font-semibold">Bid Amount</div>
                              </div>
                              <div className="text-2xl font-bold text-green-700">${proposal.proposalAmount}</div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl border border-blue-100 shadow-sm">
                              <div className="flex items-center mb-2">
                                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                                <div className="text-sm uppercase text-blue-600 font-semibold">Delivery Time</div>
                              </div>
                              <div className="text-2xl font-bold text-blue-700">{proposal.proposalDeadline}</div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-50 rounded-xl border border-purple-100 shadow-sm">
                              <div className="flex items-center mb-2">
                                <Flag className="h-5 w-5 text-purple-600 mr-2" />
                                <div className="text-sm uppercase text-purple-600 font-semibold">Project ID</div>
                              </div>
                              <div className="text-2xl font-bold text-purple-700">#{proposal.projectId}</div>
                            </div>
                          </div>
                          
                          {/* Cover Letter */}
                          <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-3 text-lg">Cover Letter</h4>
                            <div className="p-5 bg-white rounded-xl border border-gray-200 whitespace-pre-line shadow-sm">
                              {proposal.proposalDescription}
                            </div>
                          </div>
                          
                          {/* Skills Tags */}
                          {proposal.skills && proposal.skills.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-900 mb-3 text-lg">Skills & Expertise</h4>
                              <div className="flex flex-wrap gap-2">
                                {proposal.skills.map((skill, index) => (
                                  <span 
                                    key={index}
                                    className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200 hover:bg-blue-200 transition-colors"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChatClick(proposal);
                                navigate('messages/');
                              }}
                              disabled={loadingStates[proposal.proposalId]?.chatLoading}
                              className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {loadingStates[proposal.proposalId]?.chatLoading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                                  Start Chat
                                </>
                              )}
                            </motion.button>
                            
                            {isClientView && (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAwardClick(proposal);
                                }}
                                disabled={loadingStates[proposal.proposalId]?.awardLoading}
                                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {loadingStates[proposal.proposalId]?.awardLoading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Award className="h-4 w-4 mr-2" />
                                    Award Project
                                  </>
                                )}
                              </motion.button>
                            )}
                          </div>
                          
                          {/* Submission Date */}
                          <div className="mt-4 text-xs text-gray-500 text-center">
                            Proposal submitted on {proposal.createdAt && new Date(proposal.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProposalsList;