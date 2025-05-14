import React from 'react';
import { MessageCircle, Clock, Award, Star } from 'lucide-react';

/**
 * ProposalCard component displays an individual proposal with freelancer details
 * @param {Object} props
 * @param {Object} props.proposal - The proposal data
 * @param {Function} props.onChatClick - Handler for chat button click
 * @param {Function} props.onAwardClick - Handler for award button click (client view only)
 * @param {boolean} props.isClientView - Whether this is being viewed by the client or freelancer
 * @returns {JSX.Element}
 */
const ProposalCard = ({ 
  proposal, 
  onChatClick, 
  onAwardClick,
  isClientView = false 
}) => {
  if (!proposal || !proposal.userId) {
    return null;
  }
  
  const { 
      proposalId,
      projectId,
      userId,
      proposalAmount,
      proposalDeadline,
      proposalDescription,
      createdAt,
      proposalStateId,
      firstName,
      lastName,
      imageUrl,
      city,
      countryName,
      rating,
      totalReviews,
      totalEarned,
      projectsCompleted

  } = proposal;
  
  const calculateDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysAgo = calculateDaysAgo(createdAt);
  const isAwarded = proposalStateId === 2;
  
  // Get delivery time in days if it's a date string
  let deliveryDays = proposalDeadline;
  if (proposalDeadline ) {
    try {
      const estimatedDate = new Date(proposalDeadline);
      const today = new Date();
      const diffTime = Math.abs(estimatedDate - today);
      deliveryDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + ' days';
    } catch (e) {
      // If parsing fails, use the original string
      deliveryDays = proposalDeadline;
    }
  }
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all bg-white shadow-md hover:shadow-lg transition-shadow transition-transform duration-300 overflow-hidden cursor-pointer hover:scale-105 hover:shadow-2xl" >
      <div className="p-4 border-b border-gray-100  ">
        <div className="flex items-center gap-3 ">
          {/* Freelancer Avatar */}
          <div className="flex-shrink-0">
            {imageUrl ? (
              <a href={`/profile/${userId}`} className="block">
                <img 
                  src={imageUrl} 
                  alt={firstName + " " + lastName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100" 
                />
              </a>
            ) : (
              <a href={`/profile/${userId}`} className="block">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                  {firstName?.charAt(0).toUpperCase()}
                </div>
              </a>
            )}
          </div>
          
          {/* Freelancer Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <a href={`/profile/${userId}`} className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                {firstName}
              </a>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-3 h-3 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-medium ml-1 text-sm">{rating || 0}</span>
                <span className="ml-1 text-xs text-gray-500">({totalReviews || 0})</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-sm text-gray-600">{city || 'Location not specified'}</div>
              <div className="text-sm text-gray-600">{0} projects</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Bid Amount</div>
            <div className="text-xl font-bold text-blue-700">${proposalAmount} <span className="text-xs font-normal text-gray-500">USD</span></div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Delivery Time</div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-md font-bold text-gray-700">{proposalDeadline} days</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 text-sm">
            {proposalDescription && proposalDescription.length > 150 
              ? `${proposalDescription.substring(0, 150)}...` 
              : proposalDescription}
          </p>
          {proposalDescription && proposalDescription.length > 150 && (
            <button className="text-blue-600 text-sm mt-1 hover:underline">
              Read more
            </button>
          )}
        </div>
        
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Submitted {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onChatClick(proposal)}
            className="flex items-center justify-center px-3 py-1.5 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Chat
          </button>
          
          {isClientView && !isAwarded && (
            <button 
              onClick={() => onAwardClick(proposal)}
              className="flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <Award className="w-4 h-4 mr-1" />
              Award
            </button>
          )}
          
          {isAwarded && (
            <div className="flex items-center justify-center px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm">
              <Award className="w-4 h-4 mr-1" />
              Awarded
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;