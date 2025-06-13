import { useState, useEffect } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import PortfolioGallery from '../portfolio/PortfolioGallery';
import Modal from '../common/Modal';

export default function PortfolioSection({ 
  portfolios, 
  setPortfolios, 
  showDeleteConfirmation, 
  showSuccessToast,
  showErrorToast
}) {
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [portfolioForm, setPortfolioForm] = useState({
    id: null,
    title: '',
    description: '',
    technologies: [],
    duration: '',
    client: '',
    images: []
  });
  
  const [techInput, setTechInput] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  
  useEffect(() => {
    if (selectedPortfolio) {
      setPortfolioForm({
        ...selectedPortfolio,
        technologies: [...selectedPortfolio.technologies]
      });
      setTechInput(selectedPortfolio.technologies.join(', '));
      setImageUrls(selectedPortfolio.images.join('\n'));
    } else {
      resetForm();
    }
  }, [selectedPortfolio]);
  
  const resetForm = () => {
    setPortfolioForm({
      id: null,
      title: '',
      description: '',
      technologies: [],
      duration: '',
      client: '',
      images: []
    });
    setTechInput('');
    setImageUrls('');
  };
  
  const handleAddPortfolio = () => {
    setSelectedPortfolio(null);
    resetForm();
    setShowPortfolioModal(true);
  };
  
  const handleEditPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowPortfolioModal(true);
  };
  
  const validateForm = () => {
    if (!portfolioForm.title.trim()) {
      showErrorToast('Project title is required');
      return false;
    }
    
    if (!portfolioForm.description.trim()) {
      showErrorToast('Project description is required');
      return false;
    }
    
    if (portfolioForm.technologies.length === 0) {
      showErrorToast('At least one technology is required');
      return false;
    }
    
    if (portfolioForm.images.length === 0) {
      showErrorToast('At least one image URL is required');
      return false;
    }
    
    // Validate image URLs
    const invalidUrls = portfolioForm.images.filter(url => {
      try {
        new URL(url);
        return false;
      } catch (e) {
        return true;
      }
    });
    
    if (invalidUrls.length > 0) {
      showErrorToast('One or more image URLs are invalid');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (selectedPortfolio) {
      // Update existing portfolio
      setPortfolios(prev => 
        prev.map(item => item.id === selectedPortfolio.id ? portfolioForm : item)
      );
      showSuccessToast('Project updated successfully');
    } else {
      // Add new portfolio
      const newId = Math.max(0, ...portfolios.map(p => p.id)) + 1;
      setPortfolios(prev => [...prev, { ...portfolioForm, id: newId }]);
      showSuccessToast('Project added successfully');
    }
    
    setShowPortfolioModal(false);
  };
  
  const handleTechChange = (e) => {
    setTechInput(e.target.value);
    const techs = e.target.value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    
    setPortfolioForm(prev => ({
      ...prev,
      technologies: techs
    }));
  };
  
  const handleImageUrlsChange = (e) => {
    setImageUrls(e.target.value);
    const urls = e.target.value
      .split('\n')
      .map(url => url.trim())
      .filter(Boolean);
    
    setPortfolioForm(prev => ({
      ...prev,
      images: urls
    }));
  };
  
  return (
    <section id="portfolio" className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h2>
        <button
          onClick={handleAddPortfolio}
          className="btn-primary flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Project</span>
        </button>
      </div>
      
      {portfolios.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects in your portfolio yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Show off your work by adding projects to your portfolio
          </p>
          <button
            onClick={handleAddPortfolio}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add Your First Project
          </button>
        </div>
      ) : (
        <div>
          <PortfolioGallery 
            portfolios={portfolios} 
            onEdit={handleEditPortfolio}
            onDelete={(id, title) => showDeleteConfirmation('portfolio', id, title)}
          />
        </div>
      )}
      
      {/* Add/Edit Portfolio Modal */}
      <Modal isOpen={showPortfolioModal} onClose={() => setShowPortfolioModal(false)} maxWidth="max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {selectedPortfolio ? 'Edit Project' : 'Add New Project'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Title*
            </label>
            <input 
              id="project-title"
              type="text" 
              value={portfolioForm.title}
              onChange={(e) => setPortfolioForm({...portfolioForm, title: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description*
            </label>
            <textarea 
              id="project-description"
              value={portfolioForm.description}
              onChange={(e) => setPortfolioForm({...portfolioForm, description: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              rows={4}
              required
            />
          </div>
          
          <div>
            <label htmlFor="project-technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Technologies* (comma separated)
            </label>
            <input 
              id="project-technologies"
              type="text" 
              value={techInput}
              onChange={handleTechChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              placeholder="React, Node.js, etc." 
              required
            />
            {portfolioForm.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {portfolioForm.technologies.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="project-duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration
              </label>
              <input 
                id="project-duration"
                type="text" 
                value={portfolioForm.duration}
                onChange={(e) => setPortfolioForm({...portfolioForm, duration: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                placeholder="3 months" 
              />
            </div>
            <div>
              <label htmlFor="project-client" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client
              </label>
              <input 
                id="project-client"
                type="text" 
                value={portfolioForm.client}
                onChange={(e) => setPortfolioForm({...portfolioForm, client: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="project-images" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Image URLs* (one per line)
            </label>
            <textarea 
              id="project-images"
              value={imageUrls}
              onChange={handleImageUrlsChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="https://example.com/image1.jpg"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add URLs to images that showcase your project. Use unsplash.com for free stock photos.
            </p>
            
            {portfolioForm.images.length > 0 && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {portfolioForm.images.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                    <img 
                      src={img} 
                      alt={`Preview ${idx+1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                      }}
                    />
                  </div>
                ))}
                {portfolioForm.images.length > 3 && (
                  <div className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      +{portfolioForm.images.length - 3} more
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowPortfolioModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {selectedPortfolio ? 'Update' : 'Add'} Project
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}