import React, { useState } from 'react';
import { MessageCircle, Clock, Award, Star, Check, MapPin, Briefcase, DollarSign, ChevronRight, ChevronDown } from 'lucide-react';

const ProposalCard = ({ 
  proposal, 
  onChatClick, 
  onAwardClick,
  isClientView = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!proposal || !proposal.userId) {
    return null;
  }
  
  const { 
    proposalId,
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
    projectsCompleted,
    skills = []
  } = proposal;
  
  const calculateDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const daysAgo = calculateDaysAgo(createdAt);
  const isAwarded = proposalStateId === 2;
  
  // Format delivery time
  let deliveryTime = proposalDeadline;
  if (typeof proposalDeadline === 'string') {
    try {
      const estimatedDate = new Date(proposalDeadline);
      const today = new Date();
      const diffTime = Math.abs(estimatedDate - today);
      deliveryTime = `${Math.ceil(diffTime / (1000 * 60 * 60 * 24))} days`;
    } catch (e) {
      deliveryTime = proposalDeadline;
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative group overflow-hidden rounded-xl bg-white shadow-sm border transition-all duration-300 hover:shadow-md 
      ${isAwarded ? 'border-2 border-emerald-200 ring-1 ring-emerald-100' : 'border-gray-200'}`}>
      
      {/* Awarded badge */}
      {isAwarded && (
        <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium flex items-center z-10">
          <Check className="w-3 h-3 mr-1" />
          Awarded
        </div>
      )}
      
      <div className="p-5">
        {/* Freelancer Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <a href={`/profile/${proposal.userId}`} className="block">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={`${firstName} ${lastName}`}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  {firstName?.charAt(0).toUpperCase()}
                </div>
              )}
            </a>
          </div>
          
          {/* Freelancer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <a 
                  href={`/profile/${proposal.userId}`} 
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                >
                  {firstName} {lastName}
                </a>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  <span>{city || 'Location not specified'}, {countryName || ''}</span>
                </div>
              </div>
              
              <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm font-medium text-gray-900">{rating?.toFixed(1) || '0.0'}</span>
                <span className="ml-1 text-xs text-gray-500">({totalReviews || 0})</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-xs text-gray-600">
                <Briefcase className="w-3.5 h-3.5 mr-1" />
                {projectsCompleted || 0} projects
              </div>
            </div>
          </div>
        </div>
        
        {/* Proposal Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center text-xs text-blue-600 mb-1">
              <DollarSign className="w-3 h-3 mr-1" />
              Bid Amount
            </div>
            <div className="text-xl font-bold text-gray-900">${proposalAmount}</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center text-xs text-blue-600 mb-1">
              <Clock className="w-3 h-3 mr-1" />
              Delivery Time
            </div>
            <div className="text-xl font-bold text-gray-900">{deliveryTime}</div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <p className={`text-gray-700 text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
            {proposalDescription}
          </p>
          {proposalDescription?.length > 150 && (
            <button 
              onClick={toggleExpand}
              className="text-blue-600 text-sm mt-1 hover:underline flex items-center hover:cursor-pointer"
            >
              {isExpanded ? 'Show less' : 'Read more'} 
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 ml-0.5" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-0.5" />
              )}
            </button>
          )}
        </div>
        
        {/* Expanded Details (shown when expanded) */}
        {isExpanded && (
          <div className="mb-4 space-y-3">
            {/* Additional details can be added here */}
            <div className="text-sm">
              <h4 className="font-medium text-gray-900 mb-1">Proposal Details</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block min-w-[120px] font-medium">Proposal ID:</span>
                  <span>{proposalId}</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block min-w-[120px] font-medium">Submitted:</span>
                  <span>{new Date(createdAt).toLocaleDateString()}</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block min-w-[120px] font-medium">Status:</span>
                  <span>
                    {isAwarded ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                        Awarded
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Under Review
                      </span>
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Skills */}
        {skills?.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, isExpanded ? skills.length : 4).map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
              {!isExpanded && skills.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Submitted {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago
        </div>
        
      </div>
    </div>
  );
};

export default ProposalCard;