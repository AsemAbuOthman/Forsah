import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, CheckCircle, MessageSquare } from 'lucide-react';
import PropTypes from 'prop-types';

const ContactList = ({ 
  contacts = [], 
  activeContact, 
  onContactSelect, 
  onlineUsers = [], 
  loading = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Memoized filtered contacts for better performance
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        contact.username?.toLowerCase().includes(query) ||
        contact.lastMessage?.toLowerCase().includes(query)
      );
    });
  }, [contacts, searchQuery]);
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full md:w-80 border-r border-gray-200 flex flex-col h-full bg-white">
      {/* Search and options header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            disabled={loading}
          />
        </div>
      </div>
      
      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="animate-pulse flex flex-col space-y-4 w-full px-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No contacts found</p>
            <p className="text-sm">
              {searchQuery ? 'Try a different search term' : 'Your contact list is empty'}
            </p>
          </div>
        ) : (
          <ul>
            {filteredContacts.map((contact) => (
              <ContactItem 
                key={contact.userId} 
                contact={contact} 
                isActive={activeContact?.userId === contact.userId}
                isOnline={onlineUsers.includes(contact.userId)}
                onClick={() => onContactSelect(contact)}
                formatTimestamp={formatTimestamp}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ContactItem = ({ 
  contact, 
  isActive, 
  isOnline, 
  onClick,
  formatTimestamp 
}) => {
  const {
    id, 
    name , 
    username,
    avatar ,
    lastMessage, 
    createdAt, 
    unreadCount = 0,
    typing = false,
  } = contact;
  
  return (
    <li 
      className={`
        flex items-center p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50
        transition-colors duration-150
        ${isActive ? 'bg-purple-50 hover:bg-purple-50' : ''}
      `}
      onClick={onClick}
      aria-label={`Chat with ${name}`}
    >
      <div className="relative flex-shrink-0">
        <img 
          src={avatar ||  'https://img.freepik.com/premium-photo/user-icon-account-icon-3d-illustration_118019-6801.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid&w=740'} 
          alt={`${name}`} 
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
        {isOnline && (
          <span 
            className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            aria-label="Online"
          />
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {name} {username && ` @${username}`}
          </h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatTimestamp(createdAt)}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p 
            className={`text-xs truncate pr-2 max-w-[160px] ${
              typing ? 'text-purple-600 font-medium' : 'text-gray-500'
            }`}
          >
            {typing ? 'Typing...' : (lastMessage || "No messages yet")}
          </p>
          
          <div className="flex items-center">
            {unreadCount > 0 ? (
              <span 
                className="bg-purple-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                aria-label={`${unreadCount} unread messages`}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : lastMessage ? (
              <CheckCircle size={16} className="text-blue-500" aria-label="Message read" />
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
};

// Prop type validation
ContactList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string,
      username: PropTypes.string,
      imageUrl: PropTypes.string,
      lastMessage: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      unreadCount: PropTypes.number,
      typing: PropTypes.bool
    })
  ),
  activeContact: PropTypes.object,
  onContactSelect: PropTypes.func.isRequired,
  onlineUsers: PropTypes.array,
  loading: PropTypes.bool
};

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  isOnline: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  formatTimestamp: PropTypes.func.isRequired
};

export default ContactList;