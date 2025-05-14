import React, { useState } from 'react';
import { Search, MoreVertical, CheckCircle, MessageSquare } from 'lucide-react';

const ContactList = ({ contacts, activeContact, onContactSelect, onlineUsers = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.lastMessage && contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="w-full md:w-80 border-r border-gray-200 flex flex-col h-full">
      {/* Search and options header */}
      <div className="p-4 border-b border-gray-200">
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
          />
        </div>
      </div>
      
      {/* Contact list */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No contacts found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          <ul>
            {filteredContacts.map((contact) => (
              <ContactItem 
                key={contact.id} 
                contact={contact} 
                isActive={activeContact?.id === contact.id}
                isOnline={onlineUsers.includes(contact.id)}
                onClick={() => onContactSelect(contact)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ContactItem = ({ contact, isActive, isOnline, onClick }) => {
  const {
    id, 
    name, 
    avatar, 
    lastMessage, 
    timestamp, 
    unreadCount = 0,
    typing = false,
  } = contact;
  
  return (
    <li 
      className={`
        flex items-center p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50
        ${isActive ? 'bg-purple-50 hover:bg-purple-50' : ''}
      `}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={avatar} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500 truncate pr-2 max-w-[160px]">
            {typing ? (
              <span className="text-purple-600 font-medium">Typing...</span>
            ) : (
              lastMessage || "No messages yet"
            )}
          </p>
          
          {unreadCount > 0 && (
            <span className="bg-purple-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          
          {unreadCount === 0 && lastMessage && (
            <CheckCircle size={16} className="text-blue-500" />
          )}
        </div>
      </div>
    </li>
  );
};

export default ContactList;