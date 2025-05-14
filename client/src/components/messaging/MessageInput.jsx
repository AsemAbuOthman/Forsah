import React, { useState, useRef } from 'react';
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
  onCancelReply
}) => {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [placeholder, setPlaceholder] = useState("Type a message...");
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
      // Reset placeholder and clear selected files after sending
      setPlaceholder("Type a message...");
      setSelectedFile(null);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachmentOptions(false);
  };

  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
    setShowEmojiPicker(false);
  };
  
  const handleEmojiSelect = (emoji) => {
    onChange(value + emoji);
    inputRef.current?.focus();
  };
  
  const handleFileSelection = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a file URL for demo purposes
      const fileUrl = URL.createObjectURL(file);
      
      // Store the file info in the message data (not showing in typing area)
      onChange({
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
      onChange({
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
  
  return (
    <div className="p-3 border-t border-gray-200 relative">
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
                onChange(''); // Clear the input value
                setPlaceholder("Type a message..."); // Reset placeholder
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
          
          {/* Image preview */}
          {selectedFile.type.includes('image/') && typeof value === 'object' && value.type === 'image' && (
            <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden mb-1">
              <img 
                src={value.url} 
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
          value={typeof value === 'object' ? '' : value} 
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder} 
          disabled={typeof value === 'object'}
          className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-gray-700"
        />
        
        <button 
          onClick={() => {
            onSend();
            // Reset placeholder and clear selected files after sending
            setPlaceholder("Type a message...");
            setSelectedFile(null);
          }}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;