import React, { useRef, useEffect, useState } from 'react';
import { Check, Clock, MoreVertical, Reply, Trash2 } from 'lucide-react';

const MessagesList = ({ 
  messages, 
  contact, 
  selectedMessageId, 
  onMessageRef,
  onDeleteMessage = () => {},
  onReplyMessage = () => {}
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesRefs = useRef({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  
  // Auto scroll to bottom when new messages arrive (unless we're searching)
  useEffect(() => {
    if (!selectedMessageId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedMessageId]);
  
  // Scroll to selected message when it changes
  useEffect(() => {
    if (selectedMessageId && messagesRefs.current[selectedMessageId]) {
      messagesRefs.current[selectedMessageId].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedMessageId]);
  
  // Share refs with parent
  useEffect(() => {
    if (onMessageRef) {
      onMessageRef({
        container: messagesContainerRef.current,
        messages: messagesRefs.current
      });
    }
  }, [onMessageRef]);
  
  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenu && !e.target.closest('.message-menu-container')) {
        setActiveMenu(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);
  
  // Handle delete message
  const handleDeleteMessage = (messageId) => {
    setActiveMenu(null);
    onDeleteMessage(messageId);
  };
  
  // Handle reply to message
  const handleReplyMessage = (message) => {
    setActiveMenu(null);
    onReplyMessage(message);
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.timestamp.includes('Just now') || 
                message.timestamp.includes('Yesterday') || 
                !message.timestamp.includes(',') 
      ? message.timestamp
      : message.timestamp.split(',')[0];
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(message);
    return groups;
  }, {});
  
  return (
    <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {Object.entries(groupedMessages).map(([date, dateMessages], groupIndex) => (
        <div key={date} className="mb-6 last:mb-0">
          <div className="flex justify-center mb-4">
            <div className="bg-white text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm">
              {date.includes('Just now') ? 'Today' : date}
            </div>
          </div>
          
          {dateMessages.map((message, index) => (
            <div 
              key={message.id}
              ref={el => { messagesRefs.current[message.id] = el; }}
              className={selectedMessageId === message.id ? 'animate-pulse' : ''}
            >
              <MessageBubble 
                message={message} 
                contact={contact}
                isConsecutive={index > 0 && dateMessages[index - 1].senderId === message.senderId}
                isHighlighted={selectedMessageId === message.id}
                isMenuOpen={activeMenu === message.id}
                onMenuToggle={(id) => setActiveMenu(activeMenu === id ? null : id)}
                onDeleteMessage={handleDeleteMessage}
                onReplyMessage={handleReplyMessage}
              />
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const MessageBubble = ({ 
  message, 
  contact, 
  isConsecutive, 
  isHighlighted,
  isMenuOpen,
  onMenuToggle,
  onDeleteMessage,
  onReplyMessage
}) => {
  const { id, senderId, text, timestamp, status, highlightedText, image, file, replyingTo } = message;
  const isMe = senderId === 'me';
  const isSystem = senderId === 'system';
  const time = timestamp.includes(',') ? timestamp.split(',')[1].trim() : timestamp;
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm border border-blue-200 max-w-[80%]">
          {text}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      id={`message-${id}`}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 ${isConsecutive ? 'mt-1' : 'mt-3'}`}
    >
      <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
        {!isConsecutive && !isMe && (
          <div className="flex items-center mb-1">
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="w-6 h-6 rounded-full object-cover mr-2"
            />
            <span className="text-xs text-gray-700 font-medium">{contact.name}</span>
          </div>
        )}
        
        <div className="relative message-menu-container">
          {/* Message options button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle(id);
            }}
            className={`absolute ${isMe ? '-left-10' : '-right-10'} top-2 p-1 rounded-full hover:bg-gray-200`}
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          
          {/* Message action menu */}
          {isMenuOpen && (
            <div 
              className={`absolute z-10 bg-white rounded-lg shadow-lg py-1 ${
                isMe ? 'right-full mr-2' : 'left-full ml-2'
              } top-0 min-w-[120px]`}
            >
              <button
                className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                onClick={() => onReplyMessage(message)}
              >
                <Reply size={14} className="mr-2 text-blue-500" />
                Reply
              </button>
              {isMe && (
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 text-red-500"
                  onClick={() => onDeleteMessage(id)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          )}
          
          {/* Replied message reference */}
          {replyingTo && (
            <div className={`mb-1 px-3 py-1 text-xs rounded-t-lg border-l-2 ${
              isMe ? 'bg-blue-700 border-blue-400' : 'bg-gray-100 border-gray-300'
            }`}>
              <div className={`font-medium mb-0.5 ${isMe ? 'text-white' : 'text-gray-700'}`}>
                {replyingTo.senderId === 'me' ? 'You' : contact.name}
              </div>
              <div className={`truncate ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                {replyingTo.text || (replyingTo.image ? 'Image' : 'File')}
              </div>
            </div>
          )}
          
          {/* Message bubble */}
          <div className={`
            px-4 py-2 rounded-2xl 
            ${isConsecutive ? (isMe ? 'rounded-tr-md' : 'rounded-tl-md') : ''} 
            ${isMe ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}
            ${isHighlighted ? 'ring-2 ring-yellow-400' : ''}
            ${replyingTo ? (isMe ? 'rounded-tl-none' : 'rounded-tr-none') : ''}
          `}>
            {/* Image message */}
            {image && (
              <div className="mb-2">
                <img 
                  src={image.url} 
                  alt={image.name || "Image"} 
                  className="rounded-lg max-w-full max-h-60 object-contain mb-1"
                />
                <div className={`text-xs ${isMe ? 'text-white/80' : 'text-gray-500'}`}>
                  {image.name} {image.size && `(${formatFileSize(image.size)})`}
                </div>
              </div>
            )}
            
            {/* File message */}
            {file && (
              <div className={`flex items-center p-2 rounded-lg mb-2 ${isMe ? 'bg-blue-700/30' : 'bg-gray-100'}`}>
                <div className={`p-2 mr-3 rounded-full ${isMe ? 'bg-white/20' : 'bg-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isMe ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className={`text-sm font-medium ${isMe ? 'text-white' : 'text-gray-800'}`}>
                    {file.name}
                  </div>
                  <div className={`text-xs ${isMe ? 'text-white/80' : 'text-gray-500'}`}>
                    {file.size && formatFileSize(file.size)}
                  </div>
                </div>
                <a 
                  href={file.url} 
                  download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ml-auto p-1.5 rounded-full ${isMe ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            )}
            
            {/* Text content - only show if there's text */}
            {(text || highlightedText) && (
              <p className="mb-1">
                {/* Support for highlighted search results */}
                {highlightedText ? highlightedText : text}
              </p>
            )}
            
            {/* Award project button for freelancer messages */}
            {!isMe && !isConsecutive && text && text.toLowerCase().includes('proposal') && (
              <div className="mt-1 mb-2">
                <button 
                  onClick={() => {
                    // Find the closest parent component with handleAwardProject
                    const event = new CustomEvent('awardProject', { detail: { contactId: contact.id } });
                    document.dispatchEvent(event);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded"
                >
                  Award Project
                </button>
              </div>
            )}
            
            {/* Message timestamp and status */}
            <div className={`text-xs flex items-center justify-end ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
              <span>{time}</span>
              {isMe && (
                <span className="ml-1">
                  {status === 'sending' && <Clock size={12} />}
                  {status === 'sent' && <Check size={12} />}
                  {status === 'delivered' && (
                    <div className="relative">
                      <Check size={12} className="absolute" />
                      <Check size={12} className="ml-1" />
                    </div>
                  )}
                  {status === 'read' && (
                    <div className="relative text-blue-400">
                      <Check size={12} className="absolute" />
                      <Check size={12} className="ml-1" />
                    </div>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesList;