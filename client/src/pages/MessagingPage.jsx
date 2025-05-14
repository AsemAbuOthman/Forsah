import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useWebSocket } from '../components/messaging/WebSocketProvider';
import ContactList from '../components/messaging/ContactList';
import ConversationHeader from '../components/messaging/ConversationHeader';
import MessagesList from '../components/messaging/MessagesList';
import MessageInput from '../components/messaging/MessageInput';
import MessageSearch from '../components/messaging/MessageSearch';

// Mock data for demonstration
const MOCK_USER = {
  id: 1,
  name: 'Current User',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
};

const MOCK_CONTACTS = [
  {
    id: 2,
    name: 'Sarah Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    lastMessage: "I'd love to take on your project!",
    timestamp: 'Just now',
    unreadCount: 2,
    online: true
  },
  {
    id: 3,
    name: 'David Thompson',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    lastMessage: 'Please review my proposal',
    timestamp: '2:30 PM',
    unreadCount: 0,
    online: true
  },
  {
    id: 4,
    name: 'Emma Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    lastMessage: 'Are you available for a meeting tomorrow?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    online: false,
    lastSeen: '3 hours ago'
  },
  {
    id: 5,
    name: 'Michael Brown',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: "I've completed the first milestone",
    timestamp: 'May 2',
    unreadCount: 0,
    online: false,
    lastSeen: '1 day ago'
  },
  {
    id: 6,
    name: 'Olivia Martinez',
    avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
    lastMessage: 'Thanks for the feedback!',
    timestamp: 'Apr 29',
    unreadCount: 0,
    online: false,
    lastSeen: '2 days ago'
  }
];

// Messages store structure for demo
const MOCK_CONVERSATION_HISTORY = {
  2: [
    {
      id: 1,
      senderId: 2,
      text: 'Hi there! I saw your project posting for a mobile app developer.',
      timestamp: 'Today, 10:23 AM',
      status: 'read'
    },
    {
      id: 2,
      senderId: 'me',
      text: "Hi Sarah! Yes, I'm looking for someone with React Native experience.",
      timestamp: 'Today, 10:25 AM',
      status: 'read'
    },
    {
      id: 3,
      senderId: 2,
      text: 'Perfect! I have 4 years of experience with React Native and have built several apps that are currently in the App Store.',
      timestamp: 'Today, 10:28 AM',
      status: 'read'
    },
    {
      id: 4,
      senderId: 'me',
      text: 'That sounds great. Could you share some examples of your work?',
      timestamp: 'Today, 10:30 AM',
      status: 'read'
    },
    {
      id: 5,
      senderId: 2,
      text: "Of course! I've attached my portfolio with links to my previous projects. You can see the apps I've developed and their features.",
      timestamp: 'Today, 10:35 AM',
      status: 'read'
    },
    {
      id: 6,
      senderId: 2,
      text: "I'd love to take on your project! When would you be looking to start?",
      timestamp: 'Today, 10:36 AM',
      status: 'read'
    }
  ],
  3: [
    {
      id: 1,
      senderId: 3,
      text: "Hello, I'm interested in your web development project.",
      timestamp: 'Today, 2:15 PM',
      status: 'read'
    },
    {
      id: 2,
      senderId: 'me',
      text: "Hi David! Thanks for reaching out. What's your experience with React?",
      timestamp: 'Today, 2:20 PM',
      status: 'read'
    },
    {
      id: 3,
      senderId: 3,
      text: "I've been working with React for 3 years now and have completed several large-scale applications.",
      timestamp: 'Today, 2:25 PM',
      status: 'read'
    },
    {
      id: 4,
      senderId: 3,
      text: 'Please review my proposal and let me know if you have any questions.',
      timestamp: 'Today, 2:30 PM',
      status: 'read'
    }
  ],
  4: [
    {
      id: 1,
      senderId: 'me',
      text: "Hi Emma, I saw your profile and I'm impressed with your design skills.",
      timestamp: 'Yesterday, 11:45 AM',
      status: 'read'
    },
    {
      id: 2,
      senderId: 4,
      text: 'Thank you! I specialize in UI/UX design for mobile applications.',
      timestamp: 'Yesterday, 12:00 PM',
      status: 'read'
    },
    {
      id: 3,
      senderId: 'me',
      text: 'Would you be available for a quick call to discuss a potential project?',
      timestamp: 'Yesterday, 12:10 PM',
      status: 'read'
    },
    {
      id: 4,
      senderId: 4,
      text: 'Are you available for a meeting tomorrow at 2 PM?',
      timestamp: 'Yesterday, 4:30 PM',
      status: 'read'
    }
  ]
};

const MessagingPage = () => {
  const [location, navigate] = useLocation();
  const { isConnected, lastMessage, sendMessage } = useWebSocket();
  
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([2, 3]); // Mock online users for demo
  const [replyingTo, setReplyingTo] = useState(null); // Track which message is being replied to
  const typingTimeoutRef = useRef(null);
  const messagesListRef = useRef(null);
  
  // Setup event listener for award project button
  useEffect(() => {
    // Handle award project events from message bubbles
    const awardProjectHandler = (event) => {
      const { contactId } = event.detail;
      handleAwardProject(contactId);
    };
    
    document.addEventListener('awardProject', awardProjectHandler);
    
    return () => {
      document.removeEventListener('awardProject', awardProjectHandler);
    };
  }, []);
  
  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
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
              sendMessage({
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
  }, [lastMessage, activeContact, sendMessage]);
  
  // Select a contact to chat with
  const handleContactSelect = (contact) => {
    setActiveContact(contact);
    
    // Load conversation history for the selected contact
    if (MOCK_CONVERSATION_HISTORY[contact.id]) {
      setMessages(MOCK_CONVERSATION_HISTORY[contact.id]);
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
    if (isConnected) {
      sendMessage({
        type: 'identify',
        userId: MOCK_USER.id
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
    
    // Handle different message types (text, image, file)
    if (typeof inputValue === 'object') {
      // It's an image or file message
      if (inputValue.type === 'image') {
        newMessage = {
          id: Date.now(),
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
        contentForContact = `[Image] ${inputValue.name}`;
        contentForWebSocket = JSON.stringify({
          messageType: 'image',
          filename: inputValue.name,
          url: inputValue.url, // In a real app, this would be handled differently
          replyToId: replyingTo ? replyingTo.id : null
        });
      } else {
        newMessage = {
          id: Date.now(),
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
        contentForContact = `[File] ${inputValue.name}`;
        contentForWebSocket = JSON.stringify({
          messageType: 'file',
          filename: inputValue.name,
          url: inputValue.url, // In a real app, this would be handled differently
          replyToId: replyingTo ? replyingTo.id : null
        });
      }
    } else {
      // It's a regular text message
      newMessage = {
        id: Date.now(),
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
    
    // Send message via WebSocket
    if (isConnected) {
      sendMessage({
        type: 'message',
        to: activeContact.id,
        content: contentForWebSocket
      });
    }
    
    // Clear input field and reset any selected files
    setInputValue('');
    setShowEmojiPicker(false);
    setShowAttachmentOptions(false);
    setReplyingTo(null); // Clear the replying to state
    
    // Reset any file inputs by clearing their value
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });
    
    // Reset the input placeholder text
    const messageInput = document.querySelector('input[placeholder="Image ready to send"], input[placeholder="File ready to send"], input[placeholder="Type a message..."]');
    if (messageInput) {
      messageInput.placeholder = "Type a message...";
    }
    
    // Clear typing indicator
    clearTimeout(typingTimeoutRef.current);
    sendMessage({
      type: 'typing',
      to: activeContact.id,
      isTyping: false
    });
  };
  
  // Handle typing indicator and message input changes
  const handleInputChange = (value) => {
    setInputValue(value);
    
    // Only send typing indicators for text messages, not for file/image uploads
    if (isConnected && activeContact && typeof value === 'string') {
      // Reset placeholder if user starts typing
      if (value.trim() !== '') {
        const inputEl = document.querySelector('input[placeholder="Image ready to send"], input[placeholder="File ready to send"]');
        if (inputEl) {
          inputEl.placeholder = "Type a message...";
        }
      }
      
      // Clear previous timeout
      clearTimeout(typingTimeoutRef.current);
      
      // Send typing indicator
      sendMessage({
        type: 'typing',
        to: activeContact.id,
        isTyping: value.trim() !== ''
      });
      
      // Set timeout to clear typing indicator after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        sendMessage({
          type: 'typing',
          to: activeContact.id,
          isTyping: false
        });
      }, 2000);
    }
  };
  
  // Handle deleting a message
  const handleDeleteMessage = (messageId) => {
    // In a real app, this would send a request to the server
    // Remove the message from the conversation
    setMessages(prev => prev.filter(message => message.id !== messageId));
    
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
  };
  
  // Cancel replying to a message
  const handleCancelReply = () => {
    setReplyingTo(null);
  };
  
  // Award project to freelancer
  const handleAwardProject = (contactId) => {
    // In a real app, this would send a request to the server
    alert(`Project awarded to ${contacts.find(c => c.id === contactId)?.name}!`);
    
    // For demo purposes, we'll add a system message
    const systemMessage = {
      id: Date.now(),
      senderId: 'system',
      text: 'You have awarded this project to this freelancer. They have been notified and will begin work shortly.',
      timestamp: 'Just now',
      status: 'read'
    };
    
    // Add system message to conversation
    setMessages(prev => [...prev, systemMessage]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>
        
        <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row h-[calc(100vh-150px)]">
          {/* Contact list sidebar */}
          <div className={`${activeContact ? 'hidden md:flex' : 'flex'} w-full md:w-auto`}>
            <ContactList 
              contacts={contacts}
              activeContact={activeContact}
              onContactSelect={handleContactSelect}
              onlineUsers={onlineUsers}
            />
          </div>
          
          {/* Conversation area */}
          <div className={`${!activeContact ? 'hidden md:flex' : 'flex'} flex-col flex-1`}>
            {activeContact ? (
              <>
                <ConversationHeader 
                  contact={activeContact}
                  onBackClick={() => setActiveContact(null)}
                  onSearchToggle={() => setShowSearchBar(!showSearchBar)}
                  onProfileView={() => navigate(`/profile/${activeContact.id}`)}
                />
                
                {/* Message search panel */}
                {showSearchBar && (
                  <MessageSearch 
                    isOpen={showSearchBar}
                    onClose={() => {
                      setShowSearchBar(false);
                      setSelectedMessageId(null);
                    }}
                    messages={messages}
                    onResultSelect={(message) => {
                      setSelectedMessageId(message.id);
                    }}
                  />
                )}
                
                <MessagesList 
                  messages={messages} 
                  contact={activeContact}
                  selectedMessageId={selectedMessageId}
                  onMessageRef={(refs) => messagesListRef.current = refs}
                  onDeleteMessage={handleDeleteMessage}
                  onReplyMessage={handleReplyMessage}
                />
                
                <MessageInput 
                  value={inputValue}
                  onChange={handleInputChange}
                  onSend={handleSendMessage}
                  showEmojiPicker={showEmojiPicker}
                  setShowEmojiPicker={setShowEmojiPicker}
                  showAttachmentOptions={showAttachmentOptions}
                  setShowAttachmentOptions={setShowAttachmentOptions}
                  replyingTo={replyingTo}
                  onCancelReply={handleCancelReply}
                  contact={activeContact}
                />
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
      </div>
    </div>
  );
};

export default MessagingPage;