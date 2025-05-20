import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useSocket } from '../components/messaging/WebSocketProvider';
import ContactList from '../components/messaging/ContactList';
import ConversationHeader from '../components/messaging/ConversationHeader';
import MessagesList from '../components/messaging/MessagesList';
import MessageInput from '../components/messaging/MessageInput';
import MessageSearch from '../components/messaging/MessageSearch';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MessagingPage = () => {
  const [location, setLocation] = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const { isConnected, sendMessage, subscribe} = useSocket();

  // Extract contactId from URL path
  const contactIdFromUrl = location.startsWith('/messages/') 
    ? location.split('/')[2]
    : null;

    console.log('contactIdFromUrl : ', contactIdFromUrl);
    

  // State management
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const typingTimeoutRef = useRef(null);
  const messagesListRef = useRef(null);

  // Authenticate socket connection
  // useEffect(() => {
  //   if (isConnected && userData?.userId[0]) {
  //     sendMessage('authenticate', { userId: userData.userId[0] });
  //   }
  // }, [isConnected, userData?.userId[0], sendMessage]);

  // Initialize with contactId from URL if present
  useEffect(() => {
    if (contactIdFromUrl && contacts.length > 0) {
      const contactId = parseInt(contactIdFromUrl, 10);
      if (!isNaN(contactId)) {
        const existingContact = contacts.find(c => c.id === contactId);
        if (existingContact) {

          console.log('existingContact : ', existingContact);
          
          setActiveContact(existingContact);
        } else {
          fetchContact(contactId);
        }
      }
    }
  }, [contactIdFromUrl, contacts]);

  // Socket.IO event subscriptions
  useEffect(() => {
    if (!isConnected) return;


    // const handleTypingEvent = (data) => {
    //   handleTypingIndicator(data);
    // };



    const handleDeletedMessage = (data) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
    };



    const subscriptions = [
      subscribe('new_message', handleNewMessage),
      // subscribe('typing', handleTypingIndicator),
      subscribe('message_read', handleMessageRead),
      subscribe('online_status', handleOnlineStatusUpdate),
      subscribe('message_deleted', handleDeletedMessage)
    ];
  
    return () => {
      subscriptions.forEach(unsub => unsub());
    };
  }, [isConnected, activeContact?.id, userData.userId, subscribe]);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Load messages when active contact changes
  useEffect(() => {
    console.log('activeContact : ', activeContact);

    if (activeContact) {
      const loadMessagesAndUpdate = async () => {
        await fetchMessages(activeContact.id);

          updateUrl(activeContact.id);
        
        if (isConnected) {
          sendMessage('join_conversation', {
            userId: userData.userId[0],
            contactId: activeContact.id
          });
        }
      };
      
      loadMessagesAndUpdate();
    }
  }, [activeContact?.id]);

  // API Functions
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/contacts/${userData?.userId[0]}`);
      
      setContacts(response.data.contacts.map(contact => ({
        id: contact.userId,
        name: `${contact.firstName} ${contact.lastName}`,
        username: contact.username,
        avatar: contact.imageUrl,
        lastMessage: contact.lastMessage || '',
        timestamp: contact.lastMessageTime || '',
        unreadCount: contact.unreadCount || 0,
        online: onlineUsers.includes(contact.userId),
        typing: false
      })));
      
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContact = async (contactId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/users/${contactId}`);
      const contact = response.data.user;
      
      console.log('contact : ', contact);
      

      setContacts(prev => [...prev, {
        id: contact.userId[0],
        name: `${contact.firstName} ${contact.lastName}`,
        username: contact.username,
        avatar: contact.avatarUrl,
        lastMessage: '',
        timestamp: '',
        unreadCount: 0,
        online: false,
        typing: false
      }]);
      
      setActiveContact({
        id: contact.userId,
        name: `${contact.firstName} ${contact.lastName}`,
        username: contact.username,
        avatar: contact.avatarUrl,
      });
      
    } catch (err) {
      setError('Failed to load contact');
      console.error('Error fetching contact:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      setIsLoading(true);
      
      const response = await axios.get('/api/messages', {
        params: {
          userId: userData.userId[0],
          contactId: contactId,
          limit: 50
        }
      });
      
      const formattedMessages = response.data.map(msg => ({
        id: msg.messageId,
        messageId: msg.messageId, // Ensure consistency
        senderId: msg.senderId === userData.userId[0] ? 'me' : msg.senderId,
        text: msg.messageContent,
        timestamp: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: msg.status || 'delivered',
        ...(msg.replyTo && { replyingTo: msg.replyTo })
      }));
      
      setMessages(formattedMessages);
      
      if (formattedMessages.length > 0) {
        const lastMsg = formattedMessages[formattedMessages.length - 1];
        setContacts(prev => prev.map(c => 
          c.id === contactId
            ? { 
                ...c, 
                lastMessage: lastMsg.text, 
                timestamp: lastMsg.timestamp,
                unreadCount: 0
              }
            : c
        ));
      }
      
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }

  };

  // Message Handlers
  const handleNewMessage = useCallback((messageData) => {
    const newMessage = {
      id: messageData.id || Date.now(), // Use messageId or fallback to a temporary ID
      messageId: messageData.id, // Ensure consistency
      senderId: messageData.senderId === userData.userId[0] ? 'me' : messageData.senderId,
      text: messageData.messageContent,
      timestamp: new Date(messageData.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: messageData.status || 'delivered',
      ...(messageData.replyTo && { replyingTo: messageData.replyTo }), // Include replyTo if present
    };
  
    // Add to current conversation if active
    if (
      activeContact &&
      (messageData.senderId === activeContact.id || messageData.receiverId === activeContact.id)
    ) {
      setMessages((prev) => [...prev, newMessage]);
  
      // Send read receipt if the message is from the active contact
      if (messageData.senderId === activeContact.id) {
        sendMessage('mark_read', {
          messageId: messageData.messageId,
          senderId: userData.userId[0],
          receiverId: messageData.senderId,
        });
      }
    }
  
    // Update the contact list with the latest message
    setContacts((prev) =>
      prev.map((contact) => {
        if (
          contact.id === messageData.senderId ||
          (messageData.senderId === userData.userId[0] && contact.id === messageData.receiverId)
        ) {
          return {
            ...contact,
            lastMessage: messageData.messageContent,
            timestamp: 'Just now',
            unreadCount:
              messageData.senderId === contact.id
                ? (contact.unreadCount || 0) + 1 // Increment unread count if the message is from the contact
                : contact.unreadCount,
          };
        }
        return contact;
      })
    );
  }, [activeContact, sendMessage, userData.userId]);

  const handleMessageRead = (readData) => {
    setMessages(prev => prev.map(msg => 
      msg.messageId === readData.messageId
        ? { ...msg, status: 'read' }
        : msg
    ));
  };

  const handleOnlineStatusUpdate = (statusData) => {
    setContacts(prev => prev.map(contact => 
      contact.id === statusData.userId
        ? { ...contact, online: statusData.isOnline }
        : contact
    ));
  };

  // UI Handlers
  const handleContactSelect = useCallback((contact) => {
    setActiveContact(contact);
    setError(null);
    updateUrl(contact.id);
    
    setContacts(prev => prev.map(c => 
      c.id === contact.id
        ? { ...c, unreadCount: 0 }
        : c
    ));
    
    if (isConnected) {
      sendMessage('join_conversation', {
        userId: userData.userId[0],
        contactId: contact.id
      });
    }
  }, [isConnected, sendMessage, userData.userId]);

  const handleSendMessage = async () => {
    if (!activeContact || !inputValue.trim()) return;
  
    const messageData = {
      messageContent: inputValue, 
      senderId: userData.userId[0],
      receiverId: activeContact.id,
      ...(replyingTo && { replyTo: replyingTo.id })
    };
  
    const tempId = Date.now().toString();
  
    // Optimistic update
    setMessages(prev => [...prev, {
      id: tempId,
      messageId: tempId,
      senderId: 'me',
      text: inputValue,
      timestamp: 'Just now',
      status: 'sending',
      ...(replyingTo && { replyingTo })
    }]);
  
    try {
      if (isConnected) {
        sendMessage('send_message', messageData, (response) => {
          if (response?.status === 'success') {
            setMessages(prev => prev.map(msg => 
              msg.id === tempId ? { 
                ...msg, 
                id: response.message.id,
                messageId: response.message.id,
                status: 'sent'
              } : msg
            ));
          }
        });
      } else {
        // HTTP fallback
        const response = await axios.post('/api/send', messageData);
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { 
            ...msg, 
            id: response.data.id,
            messageId: response.data.id,
            status: 'sent'
          } : msg
        ));
      }
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, status: 'failed' } : msg
      ));
    } finally {
      setInputValue('');
      setReplyingTo(null);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      // Optimistically remove from UI immediately
      setMessages(prev => prev.filter(msg => msg.messageId !== messageId));
      
      // Send delete request to server
      await axios.delete(`/api/message`, {
        params: { 
          userId: userData.userId[0],
          messageId: messageId
        }
      });
  
      // Notify other participants via WebSocket
      if (isConnected && activeContact) {
        sendMessage('delete_message', {
          messageId,
          senderId: userData.userId[0],
          receiverId: activeContact.id
        });
      }
      
    } catch (err) {
      // Revert if deletion failed
      setError('Failed to delete message');
      console.error('Error deleting message:', err);
      
      // Refresh messages to restore the deleted one
      if (activeContact) {
        fetchMessages(activeContact.id);
      }
    }
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    
    if (isConnected && activeContact) {
      clearTimeout(typingTimeoutRef.current);
      
      sendMessage('typing', {
        senderId: userData.userId[0],
        receiverId: activeContact.id,
        isTyping: value.trim() !== ''
      });
      
      typingTimeoutRef.current = setTimeout(() => {
        sendMessage('typing', {
          senderId: userData.userId[0],
          receiverId: activeContact.id,
          isTyping: false
        });
      }, 2000);
    }
  };

  const handleReplyMessage = (message) => {
    setReplyingTo(message);
    setTimeout(() => {
      document.querySelector('.message-input')?.focus();
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const updateUrl = (contactId) => {
    setLocation(`/messages/${contactId}`, { replace: true });
  };

  const handleRetry = () => {
    setError(null);
    if (activeContact) {
      fetchMessages(activeContact.id);
    } else {
      fetchContacts();
    }
  };

  // Render loading state
  if (isLoading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-4 max-w-md">
          <div className="text-red-500 font-medium mb-2">{error}</div>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>
        
        <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row h-[calc(100vh-150px)]">
          {/* Contact list sidebar */}
          <div className={`${activeContact ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-gray-200`}>
            <ContactList 
              contacts={contacts}
              activeContact={activeContact}
              onContactSelect={handleContactSelect}
              onlineUsers={onlineUsers}
              isLoading={isLoading}
            />
          </div>
          
          {/* Conversation area */}
          <div className={`${!activeContact ? 'hidden md:flex' : 'flex'} flex-col flex-1`}>
            {activeContact ? (
              <>
                <ConversationHeader 
                  contact={activeContact}
                  onBackClick={() => {
                    setActiveContact(null);
                    setLocation('/messages');
                  }}
                  onSearchToggle={() => setShowSearchBar(!showSearchBar)}
                  onProfileView={() => navigate(`/profile/${activeContact.id}`)}
                />
                
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
                
                {isLoading && messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <h3 className="text-lg font-medium">No messages yet</h3>
                    <p className="text-sm">Start the conversation by sending a message</p>
                  </div>
                ) : (
                  <MessagesList 
                    messages={messages} 
                    contact={activeContact}
                    selectedMessageId={selectedMessageId}
                    onMessageRef={messagesListRef}
                    onDeleteMessage={handleDeleteMessage}
                    onReplyMessage={handleReplyMessage}
                  />
                )}
                
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
                  isLoading={isLoading}
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <h3 className="text-lg font-medium">Your messages</h3>
                <p className="text-sm">Select a contact to start a conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;