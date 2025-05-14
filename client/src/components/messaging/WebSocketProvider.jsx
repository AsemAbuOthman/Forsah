import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

// Create WebSocket context
const WebSocketContext = createContext(null);

// Custom hook to use WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const socketRef = useRef(null);
  
  const connect = () => {
    // If WebSocket is not supported by the browser
    if (!('WebSocket' in window)) {
      console.error('WebSocket is not supported by your browser');
      return;
    }
    
    try {
      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      socketRef.current = new WebSocket(wsUrl);
      
      // Connection opened
      socketRef.current.addEventListener('open', () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        setReconnectAttempt(0);
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
          setReconnectAttempt(prev => prev + 1);
        }, Math.min(1000 * Math.pow(2, reconnectAttempt), 30000)); // Exponential backoff
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
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  };
  
  // Connect to WebSocket on mount and reconnect if needed
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [reconnectAttempt]);
  
  // Provide WebSocket context to children
  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;