import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Smile, Paperclip, Send, Image, File, X, CornerUpLeft, Check, Clock, MoreVertical, Reply, Trash2 } from 'lucide-react';
import io from 'socket.io-client';
import { debounce } from 'lodash';

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
  useRealSocket = false,
  socketUrl = 'http://localhost:3000'
}) => {
  // State
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); 
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs
  const typingTimeoutRef = useRef(null);
  const messagesListRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (useRealSocket) {
      connectSocket();
      
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [useRealSocket, socketUrl, user.id]);

  // Connect to Socket.IO
  const connectSocket = () => {
    try {
      const socket = socketUrl 
        ? io(socketUrl, { 
            transports: ['websocket'],
            auth: { token: localStorage.getItem('token') }
          }) 
        : io({ 
            transports: ['websocket'],
            auth: { token: localStorage.getItem('token') }
          });
      
      socketRef.current = socket;

      // Connection handlers
      socket.on('connect', () => {
        console.log('Socket.IO Connected');
        setIsConnected(true);
        socket.emit('authenticate', { userId: user.id });
      });

      socket.on('authenticated', () => {
        console.log('Socket.IO Authenticated');
      });

      socket.on('new_message', handleIncomingMessage);
      socket.on('message_delivered', handleDeliveryReceipt);
      socket.on('message_read', handleReadReceipt);
      socket.on('typing', handleTypingIndicator);
      socket.on('online_users', setOnlineUsers);
      socket.on('user_online', handleUserOnline);
      socket.on('user_offline', handleUserOffline);

      socket.on('connect_error', (error) => {
        console.error('Socket.IO Connection Error', error);
        setIsConnected(false);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket.IO Disconnected', reason);
        setIsConnected(false);
        if (reason !== 'io client disconnect') {
          setTimeout(connectSocket, 3000);
        }
      });

      socket.on('error', (error) => {
        console.error('Socket.IO Error:', error);
      });
    } catch (error) {
      console.error('Socket.IO initialization error', error);
    }
  };

  // Handle incoming messages
  const handleIncomingMessage = useCallback((message) => {
    const newMessage = {
      id: message.id,
      senderId: message.senderId,
      text: message.content.text,
      image: message.content.image,
      file: message.content.file,
      timestamp: new Date(message.timestamp).toLocaleTimeString(),
      status: 'delivered',
      replyingTo: message.replyingTo
    };

    if (activeContact?.id === message.senderId) {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
      
      // Send read receipt if this is the active conversation
      if (isConnected) {
        socketRef.current.emit('mark_read', {
          messageId: message.id,
          senderId: message.senderId
        });
      }
    } else {
      // Update contact's last message
      setContacts(prev => prev.map(contact => 
        contact.id === message.senderId
          ? { 
              ...contact, 
              unreadCount: (contact.unreadCount || 0) + 1,
              lastMessage: message.content.text || (message.content.image ? '[Image]' : '[File]'),
              timestamp: new Date(message.timestamp).toLocaleTimeString()
            }
          : contact
      ));
    }
  }, [activeContact, isConnected]);

  // Handle delivery receipts
  const handleDeliveryReceipt = useCallback(({ messageId }) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'delivered' } : msg
    ));
  }, []);

  // Handle read receipts
  const handleReadReceipt = useCallback(({ messageId }) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ));
  }, []);

  // Handle typing indicators
  const handleTypingIndicator = useCallback(({ senderId, isTyping }) => {
    setContacts(prev => prev.map(contact => 
      contact.id === senderId ? { ...contact, typing: isTyping } : contact
    ));
  }, []);

  // Handle user online status
  const handleUserOnline = useCallback(({ userId }) => {
    setOnlineUsers(prev => [...new Set([...prev, userId])]);
  }, []);

  // Handle user offline status
  const handleUserOffline = useCallback(({ userId }) => {
    setOnlineUsers(prev => prev.filter(id => id !== userId));
  }, []);

  // Send typing indicator with debounce
  const sendTypingIndicator = useCallback(debounce((isTyping) => {
    if (isConnected && activeContact) {
      socketRef.current.emit('typing', {
        receiverId: activeContact.id,
        isTyping
      });
    }
    setIsTyping(false);
  }, 1000), [isConnected, activeContact]);

  // Handle input changes with typing indicator
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      sendTypingIndicator(true);
    } else if (!value.trim() && isTyping) {
      sendTypingIndicator(false);
    }
  };

  // Select a contact to chat with
  const handleContactSelect = (contact) => {
    setActiveContact(contact);
    setMessages(initialMessages[contact.id] || []);
    setSelectedMessageId(null);
    setReplyingTo(null);
    
    // Reset unread count
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ));
    
    // Notify server of conversation change
    if (isConnected) {
      socketRef.current.emit('conversation_opened', { 
        contactId: contact.id 
      });
    }
  };

  // Send a new message
  const handleSendMessage = () => {
    if (!activeContact || !inputValue) return;

    const messageId = Date.now().toString();
    let messageContent = {};
    let tempMessage = {
      id: messageId,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString(),
      status: 'sending',
      replyingTo: replyingTo?.id ? {
        id: replyingTo.id,
        senderId: replyingTo.senderId,
        text: replyingTo.text || (replyingTo.image ? '[Image]' : '[File]')
      } : null
    };

    if (typeof inputValue === 'object') {
      // File or image message
      if (inputValue.type === 'image') {
        messageContent = { image: inputValue };
        tempMessage = { ...tempMessage, image: inputValue };
      } else {
        messageContent = { file: inputValue };
        tempMessage = { ...tempMessage, file: inputValue };
      }
    } else {
      // Text message
      messageContent = { text: inputValue };
      tempMessage = { ...tempMessage, text: inputValue };
    }

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    scrollToBottom();

    // Update contact's last message
    const lastMessage = typeof inputValue === 'object' 
      ? inputValue.type === 'image' ? '[Image]' : '[File]'
      : inputValue;

    setContacts(prev => prev.map(contact => 
      contact.id === activeContact.id
        ? { ...contact, lastMessage, timestamp: new Date().toLocaleTimeString() }
        : contact
    ));

    // Send via Socket.IO
    if (isConnected) {
      socketRef.current.emit('send_message', {
        receiverId: activeContact.id,
        content: messageContent,
        tempId: messageId,
        replyingTo: tempMessage.replyingTo
      }, (response) => {
        if (response?.error) {
          console.error('Failed to send message:', response.error);
          updateMessageStatus(messageId, 'failed');
        } else {
          updateMessageStatus(messageId, 'sent', response.messageId);
        }
      });
    }

    // Call callback if provided
    if (onSendMessage) {
      onSendMessage(tempMessage, activeContact);
    }

    // Reset input
    resetInput();
  };

  // Update message status
  const updateMessageStatus = (tempId, status, serverId = null) => {
    setMessages(prev => prev.map(msg => 
      msg.id === tempId
        ? { ...msg, id: serverId || msg.id, status }
        : msg
    ));
  };

  // Reset input fields
  const resetInput = () => {
    setInputValue('');
    setSelectedFile(null);
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowAttachmentOptions(false);
    sendTypingIndicator(false);
  };

  // Handle file selection
  const handleFileSelection = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setInputValue({
        type: file.type.includes('image/') ? 'image' : 'file',
        name: file.name,
        size: file.size,
        url: fileUrl,
        contentType: file.type
      });
      setShowAttachmentOptions(false);
    }
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
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    if (isConnected) {
      socketRef.current.emit('delete_message', { messageId });
    }

    if (onDeleteMessage) {
      onDeleteMessage(messageId, activeContact);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesListRef.current?.scrollTo({
        top: messagesListRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
                  onClick={() => onProfileView?.(activeContact)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Messages list */}
            <div 
              ref={messagesListRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50"
            >
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
                  const { id, senderId, text, timestamp, status, image, file, replyingTo } = message;
                  const isMe = senderId === 'me';
                  const isConsecutive = index > 0 && messages[index - 1].senderId === senderId;
                  
                  return (
                    <div 
                      key={id} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 ${isConsecutive ? 'mt-1' : 'mt-3'}`}
                    >
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
                          {replyingTo && (
                            <div className={`mb-1 px-3 py-1 text-xs rounded-t-lg border-l-2 ${
                              isMe ? 'bg-blue-700 border-blue-400' : 'bg-gray-100 border-gray-300'
                            }`}>
                              <div className={`font-medium mb-0.5 ${isMe ? 'text-white' : 'text-gray-700'}`}>
                                {replyingTo.senderId === 'me' ? 'You' : activeContact.name}
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
                            ${selectedMessageId === id ? 'ring-2 ring-yellow-400' : ''}
                            ${replyingTo ? (isMe ? 'rounded-tl-none' : 'rounded-tr-none') : ''}
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
                            
                            {/* Text content */}
                            {text && <p className="mb-1">{text}</p>}
                            
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
                        Replying to {replyingTo.senderId === 'me' ? 'yourself' : activeContact.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {replyingTo.text || (replyingTo.image ? 'Image' : 'File')}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setReplyingTo(null)}
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
                onChange={handleFileSelection} 
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
                        onClick={() => {
                          setInputValue(prev => (typeof prev === 'string' ? prev : '') + emoji);
                          inputRef.current?.focus();
                        }}
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
                        setInputValue('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  {/* Image preview */}
                  {selectedFile.type.includes('image/') && (
                    <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden mb-1">
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Preview" 
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 text-gray-500 hover:text-gray-700 rounded-full ${showEmojiPicker ? 'bg-gray-200' : ''}`}
                >
                  <Smile size={20} />
                </button>
                
                <button 
                  onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                  className={`p-2 text-gray-500 hover:text-gray-700 rounded-full ${showAttachmentOptions ? 'bg-gray-200' : ''}`}
                >
                  <Paperclip size={20} />
                </button>
                
                <input 
                  ref={inputRef}
                  type="text" 
                  value={typeof inputValue === 'object' ? '' : inputValue} 
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..." 
                  disabled={typeof inputValue === 'object'}
                  className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-gray-700"
                />
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputValue}
                  className={`p-2 rounded-full ${inputValue ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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

export default MessagingComponent;