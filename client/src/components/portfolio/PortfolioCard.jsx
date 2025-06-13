import React from 'react';
import PortfolioSlider from './PortfolioSlider';

const PortfolioCard = ({ portfolio, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform duration-200 flex flex-col h-full max-w-xs"
      onClick={() => onClick(portfolio)}
    >
      <PortfolioSlider 
        images={portfolio.images} 
        title={portfolio.title} 
        autoplaySpeed={4000} 
      />
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{portfolio.title}</h3>
        <p className="text-gray-600 mt-1 text-sm line-clamp-2 flex-grow">{portfolio.description}</p>
        
        <div className="mt-3 flex flex-wrap gap-1.5">
          {portfolio.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {tech}
            </span>
          ))}
          {portfolio.technologies.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{portfolio.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;