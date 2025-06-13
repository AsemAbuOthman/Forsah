import React from 'react';
import PortfolioSlider from './PortfolioSlider';
import { X, Edit2, Trash2 } from 'lucide-react';

const PortfolioModal = ({ isOpen, onClose, portfolio, onEdit, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <PortfolioSlider 
            images={portfolio.images} 
            title={portfolio.title} 
            autoplaySpeed={5000}
            height="h-72"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={onEdit}
              className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-md"
              aria-label="Edit portfolio"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={onDelete}
              className="bg-white/80 hover:bg-white text-red-500 rounded-full p-1.5 shadow-md"
              aria-label="Delete portfolio"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-md"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-900">{portfolio.title}</h2>
          
          <p className="text-gray-600 mt-4">{portfolio.description}</p>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {portfolio.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;