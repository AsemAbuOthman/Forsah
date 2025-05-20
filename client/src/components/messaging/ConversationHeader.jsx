import React from 'react';
import PropTypes from 'prop-types';
import { Search, MoreVertical, ArrowLeft } from 'lucide-react';

const ConversationHeader = ({ 
  contact, 
  onBackClick, 
  onSearchToggle, 
  onProfileView,
  onMenuClick 
}) => {
  if (!contact) {
    return (
      <div className="p-3 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  const { avatar, name, online, lastSeen, username } = contact;

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Offline';
    const now = new Date();
    const lastSeenDate = new Date(timestamp);
    const diffInHours = Math.floor((now - lastSeenDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
      return `Last seen ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `Last seen ${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `Last seen ${lastSeenDate.toLocaleDateString()}`;
    }
  };

  return (
    <div className="p-3 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={onBackClick} 
          className="md:hidden mr-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back to contacts"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div 
          className="flex items-center hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          onClick={onProfileView}
          role="button"
          aria-label={`View ${name}'s profile`}
        >
          <div className="relative">
            <img 
              src={avatar || 'https://img.freepik.com/premium-photo/user-icon-account-icon-3d-illustration_118019-6801.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid&w=740'} 
              alt={name} 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            {online && (
              <span 
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                aria-label="Online"
              />
            )}
          </div>
          
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {name && ` ${name} `}
              {username && (
                <span className="text-xs text-gray-500 ">
                  {` @${username}`}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500">
              {online ? 'Online' : formatLastSeen(lastSeen)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <button 
          onClick={onSearchToggle}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Search messages"
        >
          <Search size={18} />
        </button>
        
        <button 
          onClick={onMenuClick}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Conversation menu"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

ConversationHeader.propTypes = {
  contact: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired,
    username: PropTypes.string,
    online: PropTypes.bool,
    lastSeen: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onBackClick: PropTypes.func.isRequired,
  onSearchToggle: PropTypes.func.isRequired,
  onProfileView: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func
};

ConversationHeader.defaultProps = {
  onMenuClick: () => {}
};

export default ConversationHeader;