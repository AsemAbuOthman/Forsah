import React, { useState, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Smile, Paperclip, Send, Image, File, X, CornerUpLeft } from 'lucide-react';

const MessageInput = ({ 
  value, 
  onChange, 
  onSend, 
  showEmojiPicker,
  setShowEmojiPicker,
  showAttachmentOptions,
  setShowAttachmentOptions,
  replyingTo,
  onCancelReply,
  contact
}) => {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Memoized emoji list to prevent recreation on every render
  const emojis = useMemo(() => [
    "😀", "😂", "😊", "❤️", "👍", "🙏", "🎉", "🔥",
    "😎", "🤔", "😢", "😍", "🥰", "⭐", "✅", "🚀",
    "🤣", "😉", "🫡", "🥳", "🤝", "👏", "🙌", "💯"
  ], []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = useCallback(() => {
    if ((typeof value === 'string' && value.trim()) || typeof value === 'object') {
      onSend();
      resetInputState();
    }
  }, [value, onSend]);

  const resetInputState = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
    setShowAttachmentOptions(false);
  }, [setShowEmojiPicker, setShowAttachmentOptions]);

  const toggleAttachmentOptions = useCallback(() => {
    setShowAttachmentOptions(prev => !prev);
    setShowEmojiPicker(false);
  }, [setShowAttachmentOptions, setShowEmojiPicker]);
  
  const handleEmojiSelect = useCallback((emoji) => {
    onChange(prev => (typeof prev === 'string' ? prev + emoji : emoji));
    inputRef.current?.focus();
  }, [onChange]);
  
  const handleFileChange = useCallback((e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image' && !file.type.includes('image/')) {
      alert('Please select an image file');
      return;
    }

    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    
    onChange({
      type,
      name: file.name,
      size: file.size,
      url: fileUrl,
      contentType: file.type
    });

    setShowAttachmentOptions(false);
    e.target.value = ''; // Reset file input
  }, [onChange, setShowAttachmentOptions]);

  const handleFileSelection = useCallback((e) => handleFileChange(e, 'file'), [handleFileChange]);
  const handleImageSelection = useCallback((e) => handleFileChange(e, 'image'), [handleFileChange]);

  const removeSelectedFile = useCallback(() => {
    setSelectedFile(null);
    onChange('');
  }, [onChange]);

  return (
    <div className="p-3 border-t border-gray-200 relative bg-white">
      {/* Reply indicator */}
      {replyingTo && (
        <div className="mb-2 p-2 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <CornerUpLeft size={16} className="mr-2 text-blue-500" />
            <div>
              <div className="text-xs font-medium text-gray-700">
                Replying to {replyingTo.senderId === 'me' ? 'yourself' : contact?.name}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-[200px]">
                {replyingTo.text || (replyingTo.image ? 'Image' : 'File')}
              </div>
            </div>
          </div>
          <button 
            onClick={onCancelReply}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Cancel reply"
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
        accept="*" 
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
              onClick={toggleEmojiPicker}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close emoji picker"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {emojis.map(emoji => (
              <button 
                key={emoji} 
                onClick={() => handleEmojiSelect(emoji)}
                className="hover:bg-gray-100 rounded p-1 text-xl"
                aria-label={`Select ${emoji} emoji`}
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
              onClick={toggleAttachmentOptions}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close attachment options"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 rounded text-gray-700"
              aria-label="Attach image"
            >
              <Image size={24} className="mb-1 text-blue-500" />
              <span className="text-xs">Image</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 rounded text-gray-700"
              aria-label="Attach file"
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
              <span className="text-xs text-gray-700 truncate max-w-[200px]" title={selectedFile.name}>
                {selectedFile.name}
              </span>
            </div>
            <button 
              onClick={removeSelectedFile}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Remove file"
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
                onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Clean up memory
              />
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button 
          onClick={toggleEmojiPicker}
          className={`p-2 text-gray-500 hover:text-gray-700 rounded-full ${showEmojiPicker ? 'bg-gray-200' : ''}`}
          aria-label="Toggle emoji picker"
        >
          <Smile size={20} />
        </button>
        
        <button 
          onClick={toggleAttachmentOptions}
          className={`p-2 text-gray-500 hover:text-gray-700 rounded-full ${showAttachmentOptions ? 'bg-gray-200' : ''}`}
          aria-label="Toggle attachment options"
        >
          <Paperclip size={20} />
        </button>
        
        <input 
          ref={inputRef}
          type="text" 
          value={typeof value === 'object' ? '' : value} 
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={typeof value === 'object' ? 
            (value.type === 'image' ? 'Image ready to send' : 'File ready to send') : 
            'Type a message...'} 
          disabled={typeof value === 'object'}
          className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-gray-700"
          aria-label="Message input"
        />
        
        <button 
          onClick={handleSend}
          disabled={!value || (typeof value === 'string' && !value.trim())}
          className={`p-2 rounded-full ${value ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      type: PropTypes.oneOf(['image', 'file']).isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.number,
      url: PropTypes.string.isRequired,
      contentType: PropTypes.string.isRequired
    })
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  showEmojiPicker: PropTypes.bool.isRequired,
  setShowEmojiPicker: PropTypes.func.isRequired,
  showAttachmentOptions: PropTypes.bool.isRequired,
  setShowAttachmentOptions: PropTypes.func.isRequired,
  replyingTo: PropTypes.shape({
    senderId: PropTypes.string.isRequired,
    text: PropTypes.string,
    image: PropTypes.string
  }),
  onCancelReply: PropTypes.func,
  contact: PropTypes.shape({
    name: PropTypes.string
  })
};

MessageInput.defaultProps = {
  replyingTo: null,
  onCancelReply: () => {},
  contact: null
};

export default MessageInput;