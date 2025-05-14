import React from 'react';
import { Search, MoreVertical, ArrowLeft } from 'lucide-react';

const ConversationHeader = ({ contact, onBackClick, onSearchToggle, onProfileView }) => {
  if (!contact) return null;
  
  return (
    <div className="p-3 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <button 
          onClick={onBackClick} 
          className="md:hidden mr-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center" onClick={onProfileView}>
          <div className="relative">
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
            {contact.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          
          <div className="ml-3 cursor-pointer">
            <h3 className="text-sm font-medium text-gray-900">{contact.name}</h3>
            <p className="text-xs text-gray-500">
              {contact.online ? 'Online' : contact.lastSeen ? `Last seen ${contact.lastSeen}` : 'Offline'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={onSearchToggle}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <Search size={18} />
        </button>
        
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;