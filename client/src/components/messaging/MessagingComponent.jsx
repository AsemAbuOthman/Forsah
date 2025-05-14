import React, { useState, useEffect, useRef } from 'react';
import { Smile, Paperclip, Send, Image, File, X, CornerUpLeft, Check, Clock, MoreVertical, Reply, Trash2 } from 'lucide-react';

/**
 * A complete messaging component that can be easily imported and used in any project
 * Features:
 * - Contact list with online status
 * - Conversation view with message bubbles
 * - File and image sharing
 * - Message deletion
 * - Reply to specific messages
 * - Emoji picker
 * - Message search functionality
 * 
 * @param {Object} props
 * @param {Object} props.user - Current user object with id, name, avatar
 * @param {Array} props.initialContacts - Array of contact objects 
 * @param {Object} props.initialMessages - Object of conversations keyed by contact ID
 * @param {Function} props.onSendMessage - Optional callback when a message is sent
 * @param {Function} props.onDeleteMessage - Optional callback when a message is deleted
 * @param {Function} props.onProfileView - Optional callback when viewing a contact's profile
 * @param {boolean} props.useRealWebSocket - Whether to use real WebSocket connection (default: false)
 * @param {string} props.webSocketUrl - WebSocket URL if using real connection
 */
const MessagingComponent = ({ 
  user = { 
    id: 1, 
    name: 'Current User', 
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
  },
  initialContacts = [],
  initialMessages = {},
  onSendMessage,
  onDeleteMessage,
  onProfileView,
  useRealWebSocket = false,
  webSocketUrl
}) => {
  // State
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [placeholder, setPlaceholder] = useState("Type a message...");
  const [onlineUsers, setOnlineUsers] = useState([]); 
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  
  // Refs
  const typingTimeoutRef = useRef(null);
  const messagesListRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  // Initialize WebSocket connection
  useEffect(() => {
    if (useRealWebSocket) {
      connectWebSocket();
      
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [useRealWebSocket, webSocketUrl]);
  
  // Connect to WebSocket
  const connectWebSocket = () => {
    // If WebSocket is not supported by the browser
    if (!('WebSocket' in window)) {
      console.error('WebSocket is not supported by your browser');
      return;
    }
    
    try {
      // Create WebSocket connection
      const wsUrl = webSocketUrl || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
      socketRef.current = new WebSocket(wsUrl);
      
      // Connection opened
      socketRef.current.addEventListener('open', () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
      });
      
      // Listen for messages
      socketRef.current.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      });
      
      // Connection closed
      socketRef.current.addEventListener('close', () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after delay
        setTimeout(() => {
          connectWebSocket();
        }, 3000);
      });
      
      // Connection error
      socketRef.current.addEventListener('error', (error) => {
        console.error('WebSocket Error', error);
      });
    } catch (error) {
      console.error('WebSocket initialization error', error);
    }
  };
  
  // Send message through WebSocket
  const sendWebSocketMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  };
  
  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage && useRealWebSocket) {
      console.log('Received message:', lastMessage);
      
      switch (lastMessage.type) {
        case 'message':
          if (activeContact && lastMessage.from === activeContact.id) {
            // Add new message to conversation
            setMessages(prev => [...prev, {
              id: lastMessage.id,
              senderId: lastMessage.from,
              text: lastMessage.content,
              timestamp: 'Just now',
              status: 'read'
            }]);
            
            // Mark as read
            if (lastMessage.from) {
              sendWebSocketMessage({
                type: 'read',
                to: lastMessage.from,
                messageId: lastMessage.id
              });
            }
          } else {
            // Update unread count for contact
            setContacts(prev => prev.map(contact => 
              contact.id === lastMessage.from
                ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1, lastMessage: lastMessage.content }
                : contact
            ));
          }
          break;
          
        case 'typing':
          if (lastMessage.isTyping) {
            // Show typing indicator
            setContacts(prev => prev.map(contact => 
              contact.id === lastMessage.from
                ? { ...contact, typing: true }
                : contact
            ));
          } else {
            // Hide typing indicator
            setContacts(prev => prev.map(contact => 
              contact.id === lastMessage.from
                ? { ...contact, typing: false }
                : contact
            ));
          }
          break;
          
        case 'read':
          // Update message status to read
          if (activeContact && lastMessage.from === activeContact.id) {
            setMessages(prev => prev.map(msg => 
              msg.id === lastMessage.messageId
                ? { ...msg, status: 'read' }
                : msg
            ));
          }
          break;
      }
    }
  }, [lastMessage, activeContact]);
  
  // Select a contact to chat with
  const handleContactSelect = (contact) => {
    setActiveContact(contact);
    
    // Load conversation history for the selected contact
    if (initialMessages[contact.id]) {
      setMessages(initialMessages[contact.id]);
    } else {
      setMessages([]);
    }
    
    // Reset unread count
    setContacts(prev => prev.map(c => 
      c.id === contact.id
        ? { ...c, unreadCount: 0 }
        : c
    ));
    
    // Tell server we've read messages from this contact
    if (isConnected && useRealWebSocket) {
      sendWebSocketMessage({
        type: 'identify',
        userId: user.id
      });
    }
  };
  
  // Send a new message (text, image, or file)
  const handleSendMessage = () => {
    if (!activeContact) return;
    if (typeof inputValue === 'string' && inputValue.trim() === '') return;
    
    let newMessage;
    let contentForContact;
    let contentForWebSocket;
    
    // Generate a unique ID for the message
    const messageId = Date.now();
    
    // Handle different message types (text, image, file)
    if (typeof inputValue === 'object') {
      // It's an image or file message
      if (inputValue.type === 'image') {
        newMessage = {
          id: messageId,
          senderId: 'me',
          text: '', // Remove the text description
          image: {
            url: inputValue.url,
            name: inputValue.name,
            size: inputValue.size
          },
          timestamp: 'Just now',
          status: 'sending',
          replyingTo: replyingTo // Include the message being replied to (if any)
        };
        contentForContact = `[Image]`;
        contentForWebSocket = JSON.stringify({
          messageType: 'image',
          filename: inputValue.name,
          url: inputValue.url,
          replyToId: replyingTo ? replyingTo.id : null
        });
      } else {
        newMessage = {
          id: messageId,
          senderId: 'me',
          text: '', // Remove the text description
          file: {
            url: inputValue.url,
            name: inputValue.name,
            size: inputValue.size,
            contentType: inputValue.contentType
          },
          timestamp: 'Just now',
          status: 'sending',
          replyingTo: replyingTo // Include the message being replied to (if any)
        };
        contentForContact = `[File]`;
        contentForWebSocket = JSON.stringify({
          messageType: 'file',
          filename: inputValue.name,
          url: inputValue.url,
          replyToId: replyingTo ? replyingTo.id : null
        });
      }
    } else {
      // It's a regular text message
      newMessage = {
        id: messageId,
        senderId: 'me',
        text: inputValue,
        timestamp: 'Just now',
        status: 'sending',
        replyingTo: replyingTo // Include the message being replied to (if any)
      };
      contentForContact = inputValue;
      contentForWebSocket = replyingTo ? 
        JSON.stringify({
          messageType: 'text',
          content: inputValue,
          replyToId: replyingTo.id
        }) : 
        inputValue;
    }
    
    // Add message to conversation
    setMessages(prev => [...prev, newMessage]);
    
    // Update contact's last message
    setContacts(prev => prev.map(contact => 
      contact.id === activeContact.id
        ? { ...contact, lastMessage: contentForContact, timestamp: 'Just now' }
        : contact
    ));
    
    // Send message via WebSocket if connected
    if (isConnected && useRealWebSocket) {
      sendWebSocketMessage({
        type: 'message',
        to: activeContact.id,
        content: contentForWebSocket
      });
    }
    
    // Call callback if provided
    if (onSendMessage) {
      onSendMessage(newMessage, activeContact);
    }
    
    // Clear input field and reset any selected files
    setInputValue('');
    setShowEmojiPicker(false);
    setShowAttachmentOptions(false);
    setReplyingTo(null);
    setSelectedFile(null);
    
    // Reset the placeholder text
    setPlaceholder("Type a message...");
    
    // Clear typing indicator
    clearTimeout(typingTimeoutRef.current);
    if (useRealWebSocket) {
      sendWebSocketMessage({
        type: 'typing',
        to: activeContact.id,
        isTyping: false
      });
    }
  };
  
  // Handle typing indicator and message input changes
  const handleInputChange = (value) => {
    setInputValue(value);
    
    // Only send typing indicators for text messages, not for file/image uploads
    if (isConnected && activeContact && typeof value === 'string' && useRealWebSocket) {
      // Reset placeholder if user starts typing
      if (value.trim() !== '') {
        setPlaceholder("Type a message...");
      }
      
      // Clear previous timeout
      clearTimeout(typingTimeoutRef.current);
      
      // Send typing indicator
      sendWebSocketMessage({
        type: 'typing',
        to: activeContact.id,
        isTyping: value.trim() !== ''
      });
      
      // Set timeout to clear typing indicator after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        sendWebSocketMessage({
          type: 'typing',
          to: activeContact.id,
          isTyping: false
        });
      }, 2000);
    }
  };
  
  // Handle file selection
  const handleFileSelection = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a file URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      // Store the file info in the message data
      setInputValue({
        type: 'file',
        name: file.name,
        size: file.size,
        url: fileUrl,
        contentType: file.type
      });
      
      // Update placeholder text
      setPlaceholder("File ready to send");
      
      setShowAttachmentOptions(false);
    }
  };
  
  // Handle image selection
  const handleImageSelection = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setSelectedFile(file);
      
      // Create an image URL for preview
      const imageUrl = URL.createObjectURL(file);
      
      // Store the image info in the message data
      setInputValue({
        type: 'image',
        name: file.name,
        size: file.size,
        url: imageUrl,
        contentType: file.type
      });
      
      // Update placeholder text
      setPlaceholder("Image ready to send");
      
      setShowAttachmentOptions(false);
    }
  };
  
  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachmentOptions(false);
  };
  
  // Toggle attachment options
  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
    setShowEmojiPicker(false);
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setInputValue(typeof inputValue === 'string' ? inputValue + emoji : emoji);
    inputRef.current?.focus();
  };
  
  // Handle key press in input field
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle deleting a message
  const handleDeleteMessage = (messageId) => {
    // Remove the message from the conversation
    setMessages(prev => prev.filter(message => message.id !== messageId));
    
    // Call callback if provided
    if (onDeleteMessage) {
      onDeleteMessage(messageId, activeContact);
    }
    
    // Add a system message to indicate the message was deleted
    const systemMessage = {
      id: Date.now(),
      senderId: 'system',
      text: 'You deleted a message',
      timestamp: 'Just now',
      status: 'read'
    };
    
    // Add system message to conversation
    setMessages(prev => [...prev, systemMessage]);
  };
  
  // Handle replying to a message
  const handleReplyMessage = (message) => {
    // Set the message being replied to
    setReplyingTo(message);
    // Focus on the input field
    inputRef.current?.focus();
  };
  
  // Cancel replying to a message
  const handleCancelReply = () => {
    setReplyingTo(null);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row h-[calc(100vh-150px)]">
      {/* Contact list sidebar */}
      <div className={`${activeContact ? 'hidden md:flex' : 'flex'} w-full md:w-1/4 flex-col border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          <div className="mt-2 relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search contacts" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => handleContactSelect(contact)}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${activeContact?.id === contact.id ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start">
                <div className="relative">
                  <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  {onlineUsers.includes(contact.id) && (
                    <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.typing ? (
                      <span className="text-blue-500">Typing...</span>
                    ) : (
                      contact.lastMessage
                    )}
                  </p>
                </div>
                {contact.unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Conversation area */}
      <div className={`${!activeContact ? 'hidden md:flex' : 'flex'} flex-col flex-1`}>
        {activeContact ? (
          <>
            {/* Conversation header */}
            <div className="border-b border-gray-200 p-3 flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  className="md:hidden p-1 mr-2 rounded-full text-gray-500 hover:bg-gray-100"
                  onClick={() => setActiveContact(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="relative">
                  <img 
                    src={activeContact.avatar} 
                    alt={activeContact.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {onlineUsers.includes(activeContact.id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">{activeContact.name}</h3>
                  <p className="text-xs text-gray-500">
                    {onlineUsers.includes(activeContact.id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button 
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  onClick={() => setShowSearchBar(!showSearchBar)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button 
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  onClick={() => onProfileView ? onProfileView(activeContact) : null}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Message search panel */}
            {showSearchBar && (
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <button 
                    className="p-1 mr-2 text-gray-500"
                    onClick={() => {
                      setShowSearchBar(false);
                      setSelectedMessageId(null);
                    }}
                  >
                    <X size={18} />
                  </button>
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search in conversation" 
                  />
                </div>
              </div>
            )}
            
            {/* Messages list */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const { id, senderId, text, timestamp, status, highlightedText, image, file, replyingTo } = message;
                  const isMe = senderId === 'me';
                  const isSystem = senderId === 'system';
                  const isConsecutive = index > 0 && messages[index - 1].senderId === senderId;
                  
                  if (isSystem) {
                    return (
                      <div key={id} className="flex justify-center my-4">
                        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm border border-blue-200 max-w-[80%]">
                          {text}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 ${isConsecutive ? 'mt-1' : 'mt-3'}`}>
                      <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                        {!isConsecutive && !isMe && (
                          <div className="flex items-center mb-1">
                            <img 
                              src={activeContact.avatar} 
                              alt={activeContact.name} 
                              className="w-6 h-6 rounded-full object-cover mr-2"
                            />
                            <span className="text-xs text-gray-700 font-medium">{activeContact.name}</span>
                          </div>
                        )}
                        
                        <div className="relative message-menu-container">
                          {/* Message options button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessageId(selectedMessageId === id ? null : id);
                            }}
                            className={`absolute ${isMe ? '-left-10' : '-right-10'} top-2 p-1 rounded-full hover:bg-gray-200`}
                          >
                            <MoreVertical size={16} className="text-gray-500" />
                          </button>
                          
                          {/* Message action menu */}
                          {selectedMessageId === id && (
                            <div 
                              className={`absolute z-10 bg-white rounded-lg shadow-lg py-1 ${
                                isMe ? 'right-full mr-2' : 'left-full ml-2'
                              } top-0 min-w-[120px]`}
                            >
                              <button
                                className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                                onClick={() => {
                                  handleReplyMessage(message);
                                  setSelectedMessageId(null);
                                }}
                              >
                                <Reply size={14} className="mr-2 text-blue-500" />
                                Reply
                              </button>
                              {isMe && (
                                <button
                                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 text-red-500"
                                  onClick={() => {
                                    handleDeleteMessage(id);
                                    setSelectedMessageId(null);
                                  }}
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                          
                          {/* Replied message reference */}
                          {message.replyingTo && (
                            <div className={`mb-1 px-3 py-1 text-xs rounded-t-lg border-l-2 ${
                              isMe ? 'bg-blue-700 border-blue-400' : 'bg-gray-100 border-gray-300'
                            }`}>
                              <div className={`font-medium mb-0.5 ${isMe ? 'text-white' : 'text-gray-700'}`}>
                                {message.replyingTo.senderId === 'me' ? 'You' : activeContact.name}
                              </div>
                              <div className={`truncate ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                                {message.replyingTo.text || (message.replyingTo.image ? 'Image' : 'File')}
                              </div>
                            </div>
                          )}
                          
                          {/* Message bubble */}
                          <div className={`
                            px-4 py-2 rounded-2xl 
                            ${isConsecutive ? (isMe ? 'rounded-tr-md' : 'rounded-tl-md') : ''} 
                            ${isMe ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}
                            ${selectedMessageId === id ? 'ring-2 ring-yellow-400' : ''}
                            ${message.replyingTo ? (isMe ? 'rounded-tl-none' : 'rounded-tr-none') : ''}
                          `}>
                            {/* Image message */}
                            {image && (
                              <div className="mb-2">
                                <img 
                                  src={image.url} 
                                  alt="Image" 
                                  className="rounded-lg max-w-full max-h-60 object-contain"
                                />
                              </div>
                            )}
                            
                            {/* File message */}
                            {file && (
                              <div className={`flex items-center p-2 rounded-lg mb-2 ${isMe ? 'bg-blue-700/30' : 'bg-gray-100'}`}>
                                <div className={`p-2 mr-3 rounded-full ${isMe ? 'bg-white/20' : 'bg-white'}`}>
                                  <File size={18} className={isMe ? 'text-white' : 'text-gray-500'} />
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
                            {text && (
                              <p className="mb-1">
                                {highlightedText ? highlightedText : text}
                              </p>
                            )}
                            
                            {/* Message timestamp and status */}
                            <div className={`text-xs flex items-center justify-end ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                              <span>{timestamp}</span>
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
                })
              )}
            </div>
            
            {/* Message input */}
            <div className="p-3 border-t border-gray-200 relative">
              {/* Reply indicator */}
              {replyingTo && (
                <div className="mb-2 p-2 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <CornerUpLeft size={16} className="mr-2 text-blue-500" />
                    <div>
                      <div className="text-xs font-medium text-gray-700">
                        Replying to {replyingTo.senderId === 'me' ? 'yourself' : activeContact?.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {replyingTo.text || (replyingTo.image ? 'Image' : 'File')}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleCancelReply}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {/* Hidden file inputs */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelection} 
                className="hidden" 
              />
              <input 
                type="file" 
                ref={imageInputRef} 
                accept="image/*" 
                onChange={handleImageSelection} 
                className="hidden" 
              />
              
              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-3 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-64 z-10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Emojis</h4>
                    <button 
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {["😀", "😂", "😊", "❤️", "👍", "🙏", "🎉", "🔥",
                      "😎", "🤔", "😢", "😍", "🥰", "⭐", "✅", "🚀",
                      "🤣", "😉", "🫡", "🥳", "🤝", "👏", "🙌", "💯"].map(emoji => (
                      <button 
                        key={emoji} 
                        onClick={() => handleEmojiSelect(emoji)}
                        className="hover:bg-gray-100 rounded p-1 text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Attachment Options Popup */}
              {showAttachmentOptions && (
                <div className="absolute bottom-16 left-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Attach</h4>
                    <button 
                      onClick={() => setShowAttachmentOptions(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => imageInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 rounded text-gray-700"
                    >
                      <Image size={24} className="mb-1 text-blue-500" />
                      <span className="text-xs">Image</span>
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 rounded text-gray-700"
                    >
                      <File size={24} className="mb-1 text-green-500" />
                      <span className="text-xs">Document</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Selected file indicator */}
              {selectedFile && (
                <div className="mb-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {selectedFile.type.includes('image/') ? (
                        <Image size={16} className="mr-2 text-blue-500" />
                      ) : (
                        <File size={16} className="mr-2 text-green-500" />
                      )}
                      <span className="text-xs text-gray-700 truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedFile(null);
                        setInputValue(''); // Clear the input value
                        setPlaceholder("Type a message..."); // Reset placeholder
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  {/* Image preview */}
                  {selectedFile.type.includes('image/') && typeof inputValue === 'object' && inputValue.type === 'image' && (
                    <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden mb-1">
                      <img 
                        src={inputValue.url} 
                        alt="Preview" 
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={toggleEmojiPicker}
                  className={`p-2 text-gray-500 hover:text-gray-700 rounded-full ${showEmojiPicker ? 'bg-gray-200' : ''}`}
                >
                  <Smile size={20} />
                </button>
                
                <button 
                  onClick={toggleAttachmentOptions}
                  className={`p-2 text-gray-500 hover:text-gray-700 rounded-full ${showAttachmentOptions ? 'bg-gray-200' : ''}`}
                >
                  <Paperclip size={20} />
                </button>
                
                <input 
                  ref={inputRef}
                  type="text" 
                  value={typeof inputValue === 'object' ? '' : inputValue} 
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder} 
                  disabled={typeof inputValue === 'object'}
                  className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-gray-700"
                />
                
                <button 
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
            <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Your messages</h3>
            <p className="text-gray-500 mb-4">Select a contact to start a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default MessagingComponent;