import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../store/ThemeContext';

export default function Modal({ isOpen, onClose, title, children, size = 'default' }) {
  const { darkMode } = useTheme();
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    default: 'max-w-2xl',
    large: 'max-w-4xl'
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div 
          ref={modalRef}
          className={`${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl transition-all duration-300 transform ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          <div className="relative">
            {title && (
              <div className={`px-6 pt-6 pb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <h2 id="modal-title" className="text-2xl font-bold">{title}</h2>
              </div>
            )}
            <button
              className={`absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'focus:ring-blue-500 text-gray-300' : 'focus:ring-blue-600 text-gray-500'}`}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}