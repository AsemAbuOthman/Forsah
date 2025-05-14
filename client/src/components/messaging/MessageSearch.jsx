import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowUp, ArrowDown, X } from 'lucide-react';

const MessageSearch = ({ 
  isOpen, 
  onClose, 
  messages, 
  onResultSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const inputRef = useRef(null);
  
  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]);
  
  // Search messages when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const results = messages
      .filter(message => message.text.toLowerCase().includes(term))
      .map((message, index) => ({
        ...message,
        index,
        highlightedText: highlightSearchTerm(message.text, term),
      }));
    
    setSearchResults(results);
    setCurrentResultIndex(0);
    
    // If we have results, scroll to the first one
    if (results.length > 0 && onResultSelect) {
      onResultSelect(results[0]);
    }
  }, [searchTerm, messages]);
  
  // Highlight search term in text
  const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() 
        ? <span key={i} className="bg-yellow-200 text-gray-900">{part}</span>
        : part
    );
  };
  
  // Navigate to next/previous result
  const navigateResults = (direction) => {
    if (searchResults.length === 0) return;
    
    let newIndex = direction === 'next'
      ? (currentResultIndex + 1) % searchResults.length
      : (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    
    setCurrentResultIndex(newIndex);
    
    if (onResultSelect) {
      onResultSelect(searchResults[newIndex]);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-0 left-0 right-0 bg-white z-10 border-b border-gray-200 p-2">
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
            placeholder="Search in conversation..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="flex ml-2">
          <button
            onClick={() => navigateResults('prev')}
            disabled={searchResults.length === 0}
            className={`p-2 rounded ${
              searchResults.length > 0 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <ArrowUp size={16} />
          </button>
          
          <button
            onClick={() => navigateResults('next')}
            disabled={searchResults.length === 0}
            className={`p-2 rounded ${
              searchResults.length > 0 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <ArrowDown size={16} />
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded ml-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {searchResults.length > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          {currentResultIndex + 1} of {searchResults.length} results
        </div>
      )}
    </div>
  );
};

export default MessageSearch;