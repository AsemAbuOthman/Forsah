import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

// Create context
const SocketContext = createContext(null);

// Custom hook for accessing socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default function SocketProvider({
  children,
  options = {},
  onConnect = () => {},
  onDisconnect = () => {},
  onError = () => {},
  onReconnectAttempt = () => {},
  onReconnectFailed = () => {},
  onReconnected = () => {},
}){
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastDisconnectReason, setLastDisconnectReason] = useState(null);

  // Refs
  const socketRef = useRef(null);
  const eventListeners = useRef(new Map());
  const messageQueue = useRef([]);
  const isMounted = useRef(true);
  const reconnectAttempts = useRef(0);
  const pingIntervalRef = useRef(null);

  // Default options with better defaults
  const defaultOptions = useMemo(
    () => ({
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      secure: false,
      rejectUnauthorized: false,
      ...options,
    }),
    [options]
  );

  // Connection health check
  const startPingInterval = useCallback(() => {
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

    pingIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected) {
        const start = Date.now();
        socketRef.current.emit('ping', () => {
          const latency = Date.now() - start;
          console.debug(`Socket latency: ${latency}ms`);
        });
      }
    }, 15000); // Ping every 15 seconds
  }, []);

  // Process queued messages when connection is restored
  const processMessageQueue = useCallback(() => {
    if (socketRef.current?.connected && messageQueue.current.length > 0) {
      console.log(`Processing ${messageQueue.current.length} queued messages`);
      const queueCopy = [...messageQueue.current];
      messageQueue.current = [];

      queueCopy.forEach(({ event, message, ackCallback }) => {
        try {
          if (ackCallback) {
            socketRef.current.emit(event, message, ackCallback);
          } else {
            socketRef.current.emit(event, message);
          }
        } catch (error) {
          console.error('Error processing queued message:', error);
          // Requeue failed messages
          messageQueue.current.push({ event, message, ackCallback });
        }
      });
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    if (socketRef.current) {
      // Remove all listeners to prevent memory leaks
      socketRef.current.off();

      // Only disconnect if connected to avoid errors
      if (socketRef.current.connected) {
        socketRef.current.disconnect();
      }

      socketRef.current = null;
    }
  }, []);

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    // Clean up any existing connection first
    cleanup();

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const socketUrl = options.url || `${protocol}://localhost:3000`;

      console.log(`Connecting to Socket.IO at ${socketUrl}`);

      // Create new socket instance with enhanced options
      socketRef.current = io(socketUrl, {
        ...defaultOptions
      });

      // Connection handler
      const handleConnect = () => {
        if (!isMounted.current) return;
        console.log('Socket.IO Connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
        startPingInterval();
        onConnect(socketRef.current);
        processMessageQueue();
      };

      // Disconnection handler
      const handleDisconnect = (reason) => {
        if (!isMounted.current) return;
        console.log('Socket.IO Disconnected', reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setLastDisconnectReason(reason);
        onDisconnect(reason);
      };

      // Error handler
      const handleError = (error) => {
        if (!isMounted.current) return;
        console.error('Socket.IO Error', error);
        setConnectionStatus('error');
        onError(error);
      };

      // Reconnection handlers
      const handleReconnecting = (attempt) => {
        if (!isMounted.current) return;
        reconnectAttempts.current = attempt;
        console.log(`Socket.IO Reconnecting (attempt ${attempt})`);
        setConnectionStatus(`reconnecting (attempt ${attempt})`);
        onReconnectAttempt(attempt);
      };

      const handleReconnect = (attempt) => {
        if (!isMounted.current) return;
        console.log(`Socket.IO Reconnected after ${attempt} attempts`);
        setConnectionStatus('connected');
        onReconnected(attempt);
      };

      const handleReconnectFailed = () => {
        if (!isMounted.current) return;
        console.error('Socket.IO Reconnection Failed');
        setConnectionStatus('failed');
        onReconnectFailed();
        cleanup();
      };

      // Core event listeners
      socketRef.current.on('connect', handleConnect);
      socketRef.current.on('disconnect', handleDisconnect);
      socketRef.current.on('connect_error', handleError);
      socketRef.current.on('error', handleError);
      socketRef.current.on('reconnecting', handleReconnecting);
      socketRef.current.on('reconnect', handleReconnect);
      socketRef.current.on('reconnect_failed', handleReconnectFailed);
      socketRef.current.on('pong', (latency) => {
        console.debug(`Socket latency: ${latency}ms`);
      });

      // Reattach custom event listeners
      eventListeners.current.forEach((callbacks, event) => {
        callbacks.forEach((callback) => {
          socketRef.current.on(event, callback);
        });
      });
    } catch (error) {
      console.error('Socket.IO initialization error', error);
      onError(error);
      cleanup();
    }
  }, [
    cleanup,
    defaultOptions,
    options.url,
    onConnect,
    onDisconnect,
    onError,
    onReconnectAttempt,
    onReconnected,
    onReconnectFailed,
    processMessageQueue,
    startPingInterval,
  ]);

  // Optimized message sending with queue and retry logic
  const sendMessage = useCallback((event, message, ackCallback) => {
    if (!socketRef.current) {
      console.warn('Socket not initialized - message discarded');
      return false;
    }

    if (!socketRef.current.connected) {
      console.warn('Socket not connected - queuing message');
      messageQueue.current.push({ event, message, ackCallback });
      return false;
    }

    try {
      if (ackCallback) {
        // Add timeout for ACK callbacks
        const ackTimeout = setTimeout(() => {
          console.warn(`ACK timeout for event ${event}`);
          if (typeof ackCallback === 'function') {
            ackCallback({ status: 'error', message: 'Timeout' });
          }
        }, 10000); // 10 second timeout

        socketRef.current.emit(event, message, (...args) => {
          clearTimeout(ackTimeout);
          ackCallback(...args);
        });
      } else {
        socketRef.current.emit(event, message);
      }
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, []);

  // Efficient event subscription with memory leak protection
  const subscribe = useCallback((event, callback) => {
    if (typeof callback !== 'function') {
      console.error('Subscription callback must be a function');
      return () => {};
    }

    if (!eventListeners.current.has(event)) {
      eventListeners.current.set(event, new Set());
    }

    const callbacks = eventListeners.current.get(event);
    callbacks.add(callback);

    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }

    // Return cleanup function
    return () => {
      if (eventListeners.current.has(event)) {
        const callbacks = eventListeners.current.get(event);
        callbacks.delete(callback);

        if (callbacks.size === 0) {
          eventListeners.current.delete(event);
        }

        if (socketRef.current) {
          socketRef.current.off(event, callback);
        }
      }
    };
  }, []);

  // Manual connection management
  const connect = useCallback(() => {
    if (!socketRef.current) {
      initializeSocket();
    } else if (!socketRef.current.connected) {
      socketRef.current.connect();
    }
  }, [initializeSocket]);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Get current socket instance
  const getSocket = useCallback(() => socketRef.current, []);

  // Initialize on mount and cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    initializeSocket();

    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [initializeSocket, cleanup]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isConnected,
      connectionStatus,
      lastDisconnectReason,
      sendMessage,
      subscribe,
      connect,
      disconnect,
      getSocket,
      socket: socketRef.current,
    }),
    [
      isConnected,
      connectionStatus,
      lastDisconnectReason,
      sendMessage,
      subscribe,
      connect,
      disconnect,
      getSocket,
    ]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  options: PropTypes.shape({
    url: PropTypes.string,
    transports: PropTypes.arrayOf(PropTypes.string),
    reconnectionAttempts: PropTypes.number,
    reconnectionDelay: PropTypes.number,
    reconnectionDelayMax: PropTypes.number,
    autoConnect: PropTypes.bool,
    timeout: PropTypes.number,
  }),
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
  onError: PropTypes.func,
  onReconnectAttempt: PropTypes.func,
  onReconnected: PropTypes.func,
  onReconnectFailed: PropTypes.func,
};

SocketProvider.defaultProps = {
  options: {},
  onConnect: () => {},
  onDisconnect: () => {},
  onError: () => {},
  onReconnectAttempt: () => {},
  onReconnected: () => {},
  onReconnectFailed: () => {},
};