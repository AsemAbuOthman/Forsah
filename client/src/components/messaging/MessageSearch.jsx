import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Search, ArrowUp, ArrowDown, X } from 'lucide-react';

const MessageSearch = ({ 
  isOpen, 
  onClose, 
  messages = [], 
  onResultSelect,
  searchPlaceholder = "Search in conversation..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const inputRef = useRef(null);
  
    // Highlight search term in text
  const highlightSearchTerm = useCallback((text, term) => {
    if (!term || !text) return text;
    
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark>
        : part
    );
  }, []);


  // Memoized search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return messages
      .filter(message => message.text && message.text.toLowerCase().includes(term))
      .map((message, index) => ({
        ...message,
        index,
        highlightedText: highlightSearchTerm(message.text, term),
      }));
  }, [searchTerm, messages]);


  // Focus management
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setSearchTerm('');
      setCurrentResultIndex(0);
    }
  }, [isOpen]);

  // Auto-select first result when results change
  useEffect(() => {
    if (searchResults.length > 0 && onResultSelect) {
      setCurrentResultIndex(0);
      onResultSelect(searchResults[0]);
    }
  }, [searchResults, onResultSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          navigateResults('prev');
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateResults('next');
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, currentResultIndex, onClose]);

  // Navigate to next/previous result
  const navigateResults = useCallback((direction) => {
    if (searchResults.length === 0) return;
  
    setCurrentResultIndex((prevIndex) => {
      const newIndex = direction === 'next'
        ? (prevIndex + 1) % searchResults.length
        : (prevIndex - 1 + searchResults.length) % searchResults.length;
  
      onResultSelect?.(searchResults[newIndex]);
      return newIndex;
    });
  }, [searchResults, onResultSelect]);
  
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-sm p-2">
      <div className="flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            aria-label="Search messages"
          />
        </div>
        
        <div className="flex ml-2 space-x-1">
          <button
            onClick={() => navigateResults('prev')}
            disabled={searchResults.length === 0}
            className={`p-2 rounded-md ${
              searchResults.length > 0 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Previous result"
          >
            <ArrowUp size={16} />
          </button>
          
          <button
            onClick={() => navigateResults('next')}
            disabled={searchResults.length === 0}
            className={`p-2 rounded-md ${
              searchResults.length > 0 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Next result"
          >
            <ArrowDown size={16} />
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {searchResults.length > 0 && (
        <div className="mt-1 text-xs text-gray-500 px-2">
          {currentResultIndex + 1} of {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
        </div>
      )}

      {searchTerm && searchResults.length === 0 && (
        <div className="mt-1 text-xs text-gray-500 px-2">
          No results found for "{searchTerm}"
        </div>
      )}
    </div>
  );
};

MessageSearch.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      // Add other message properties as needed
    })
  ),
  onResultSelect: PropTypes.func,
  searchPlaceholder: PropTypes.string
};

MessageSearch.defaultProps = {
  messages: [],
  onResultSelect: () => {},
  searchPlaceholder: "Search in conversation..."
};

export default MessageSearch;