import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Check, Clock, MoreVertical, Reply, Trash2 } from 'lucide-react';

const MessagesList = ({ 
  messages = [], 
  contact = {}, 
  selectedMessageId, 
  onMessageRef,
  onDeleteMessage = () => {},
  onReplyMessage = () => {},
  currentUserId = 'me'
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesRefs = useRef({});
  const [activeMenu, setActiveMenu] = useState(null);

  // Auto scroll to bottom when new messages arrive (unless we're searching)
  useEffect(() => {
    if (!selectedMessageId) {
      scrollToBottom();
    }
  }, [messages, selectedMessageId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
    if (typeof onMessageRef === 'function') {
      onMessageRef({
        container: messagesContainerRef.current,
        messages: messagesRefs.current,
        scrollToBottom
      });
    }
  }, [onMessageRef, scrollToBottom]);

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenu && !e.target.closest('.message-menu-container')) {
        setActiveMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  // Format message date
  const formatMessageDate = useCallback((timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    if (
      timestamp.includes('Just now') ||
      timestamp.includes('Yesterday') ||
      !timestamp.includes(',')
    ) {
      return timestamp;
    }
  
    return timestamp.split(',')[0];
  }, []);
  
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups, message) => {
      let date = formatMessageDate(message.timestamp);
  
      if (!groups[date]) {
        groups[date] = [];
      }
  
      groups[date].push(message);
      return groups;
    }, {});
  }, [messages, formatMessageDate]);

  return (
    <div 
      ref={messagesContainerRef} 
      className="flex-1 p-4 overflow-y-auto bg-gray-50"
      data-testid="messages-container"
    >
      {Object.entries(groupedMessages).map(([date, dateMessages], groupIndex) => (
        <div key={`${date}-${groupIndex}`} className="mb-6 last:mb-0">
          <div className="flex justify-center mb-4">
            <div 
              className="bg-white text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm"
              data-testid="date-divider"
            >
              {date.includes('Just now') ? 'Today' : date}
            </div>
          </div>
          
          {dateMessages.map((message, index) => (
            <div 
              key={message.id}
              ref={el => { messagesRefs.current[message.id] = el; }}
              className={selectedMessageId === message.id ? '' : ''}
              data-testid={`message-${message.id}`}
            >
              <MessageBubble 
                message={message} 
                contact={contact}
                currentUserId={currentUserId}
                isConsecutive={index > 0 && dateMessages[index - 1].senderId === message.senderId}
                isHighlighted={selectedMessageId === message.id}
                isMenuOpen={activeMenu === message.id}
                onMenuToggle={(id) => setActiveMenu(activeMenu === id ? null : id)}
                onDeleteMessage={onDeleteMessage}
                onReplyMessage={onReplyMessage}
              />
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} data-testid="messages-end" />
    </div>
  );
};

const MessageBubble = ({ 
  message, 
  contact = {}, 
  currentUserId,
  isConsecutive, 
  isHighlighted,
  isMenuOpen,
  onMenuToggle,
  onDeleteMessage,
  onReplyMessage
}) => {
  const { id, senderId, text, timestamp, status, highlightedText, image, file, replyingTo } = message;
  

  // FIXED: Proper message ownership check
  const isMe = senderId === currentUserId || senderId === 'me';
  const isSystem = senderId === 'system';
  const time = timestamp?.includes(',') ? timestamp.split(',')[1].trim() : timestamp;

  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  const handleAwardProject = useCallback(() => {
    const event = new CustomEvent('awardProject', { 
      detail: { 
        contactId: contact.id,
        messageId: id
      } 
    });
    document.dispatchEvent(event);
  }, [contact.id, id]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 ">
        <div 
          className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm border border-blue-200 max-w-[80%] "
          data-testid="system-message"
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div 
      id={`message-${id}`}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 ${isConsecutive ? 'mt-1' : 'mt-3'}`}
      data-testid={isMe ? 'sent-message' : 'received-message'}
    >
      <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
        {!isConsecutive && !isMe && (
          <div className="flex items-center mb-1">
            <img 
              src={contact.avatar || 'https://img.freepik.com/premium-photo/user-icon-account-icon-3d-illustration_118019-6801.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid&w=740'} 
              alt={contact.name} 
              className="w-6 h-6 rounded-full object-cover mr-2"
              onError={(e) => {
                e.target.src = 'https://img.freepik.com/premium-photo/user-icon-account-icon-3d-illustration_118019-6801.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid&w=740';
              }}
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
            aria-label="Message options"
            data-testid="message-options-button"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          
          {/* Message action menu */}
          {isMenuOpen && (
            <div 
              className={`absolute z-10 bg-white rounded-lg shadow-lg py-1 ${
                isMe ? 'right-full mr-2' : 'left-full ml-2'
              } top-0 min-w-[120px]`}
              data-testid="message-menu"
            >
              <button
                className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                onClick={() => onReplyMessage(message)}
                data-testid="reply-button"
              >
                <Reply size={14} className="mr-2 text-blue-500" />
                Reply
              </button>
              {isMe && (
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 text-red-500"
                  onClick={() => onDeleteMessage(id)}
                  data-testid="delete-button"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          )}
          
          {/* Replied message reference */}
          {replyingTo && (
            <div 
              className={`mb-1 px-3 py-1 text-xs rounded-t-lg border-l-2 ${
                isMe ? 'bg-blue-700 border-blue-400' : 'bg-gray-100 border-gray-300'
              }`}
              data-testid="reply-reference"
            >
              <div className={`font-medium mb-0.5 ${isMe ? 'text-white' : 'text-gray-700'}`}>
                {replyingTo.senderId === currentUserId ? 'You' : contact.name}
              </div>
              <div className={`truncate ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                {replyingTo.text || (replyingTo.image ? 'Image' : 'File')}
              </div>
            </div>
          )}
          
          {/* Message bubble */}
          <div 
            className={`
              px-4 py-2 rounded-2xl 
              ${isConsecutive ? (isMe ? 'rounded-tr-md' : 'rounded-tl-md') : ''} 
              ${isMe ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-300/60 shadow-sm text-gray-800 border border-gray-200'}
              ${isHighlighted ? 'ring-2 ring-violet-400 scale-95  animate-bounce' : ''}
              ${replyingTo ? (isMe ? 'rounded-tl-none' : 'rounded-tr-none') : ''}
            `}
            data-testid="message-bubble"
          >
            {/* Image message */}
            {image && (
              <div className="mb-2">
                <img 
                  src={image.url} 
                  alt={image.name || "Image"} 
                  className="rounded-lg max-w-full max-h-60 object-contain mb-1"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <div className={`text-xs ${isMe ? 'text-white/80' : 'text-gray-500'}`}>
                  {image.name} {image.size && `(${formatFileSize(image.size)})`}
                </div>
              </div>
            )}
            
            {/* File message */}
            {file && (
              <div 
                className={`flex items-center p-2 rounded-lg mb-2 ${isMe ? 'bg-blue-700/30' : 'bg-gray-100'}`}
                data-testid="file-message"
              >
                <div className={`p-2 mr-3 rounded-full ${isMe ? 'bg-white/20' : 'bg-white'}`}>
                  <File size={24} className={isMe ? 'text-white' : 'text-gray-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${isMe ? 'text-white' : 'text-gray-800'}`}>
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
                  aria-label="Download file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            )}
            
            {/* Text content */}
            {(text || highlightedText) && (
              <p className="mb-1" data-testid="message-text">
                {highlightedText || text}
              </p>
            )}
            
            {/* Award project button for freelancer messages */}
            {!isMe && !isConsecutive && text && text.toLowerCase().includes('proposal') && (
              <div className="mt-1 mb-2">
                <button 
                  onClick={handleAwardProject}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded"
                  data-testid="award-project-button"
                >
                  Award Project
                </button>
              </div>
            )}
            
            {/* Message timestamp and status */}
            <div 
              className={`text-xs flex items-center justify-end ${isMe ? 'text-white/70' : 'text-gray-500'}`}
              data-testid="message-status"
            >
              <span>{time}</span>
              {isMe && (
                <span className="ml-1">
                  {status === 'sending' && <Clock size={12} data-testid="sending-icon" />}
                  {status === 'sent' && <Check size={12} data-testid="sent-icon" />}
                  {status === 'delivered' && (
                    <div className="relative">
                      <Check size={12} className="absolute" data-testid="delivered-icon-1" />
                      <Check size={12} className="ml-1" data-testid="delivered-icon-2" />
                    </div>
                  )}
                  {status === 'read' && (
                    <div className="relative text-blue-400">
                      <Check size={12} className="absolute" data-testid="read-icon-1" />
                      <Check size={12} className="ml-1" data-testid="read-icon-2" />
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

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      senderId: PropTypes.string.isRequired,
      text: PropTypes.string,
      timestamp: PropTypes.string,
      status: PropTypes.oneOf(['sending', 'sent', 'delivered', 'read']),
      image: PropTypes.shape({
        url: PropTypes.string.isRequired,
        name: PropTypes.string,
        size: PropTypes.number
      }),
      file: PropTypes.shape({
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        size: PropTypes.number,
        contentType: PropTypes.string
      }),
      replyingTo: PropTypes.shape({
        senderId: PropTypes.string,
        text: PropTypes.string,
        image: PropTypes.string
      })
    })
  ),
  contact: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string
  }),
  selectedMessageId: PropTypes.string,
  onMessageRef: PropTypes.func,
  onDeleteMessage: PropTypes.func,
  onReplyMessage: PropTypes.func,
  currentUserId: PropTypes.string
};

MessagesList.defaultProps = {
  messages: [],
  contact: {},
  onDeleteMessage: () => {},
  onReplyMessage: () => {},
  currentUserId: 'me'
};

MessageBubble.propTypes = {
  message: PropTypes.object.isRequired,
  contact: PropTypes.object,
  currentUserId: PropTypes.string,
  isConsecutive: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  isMenuOpen: PropTypes.bool,
  onMenuToggle: PropTypes.func,
  onDeleteMessage: PropTypes.func,
  onReplyMessage: PropTypes.func
};

MessageBubble.defaultProps = {
  contact: {},
  currentUserId: 'me',
  isConsecutive: false,
  isHighlighted: false,
  isMenuOpen: false,
  onMenuToggle: () => {},
  onDeleteMessage: () => {},
  onReplyMessage: () => {}
};

export default MessagesList;