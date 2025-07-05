import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useProfile } from '../../../store/ProfileContext';
import { useTheme } from '../../../store/ThemeContext';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import PortfolioGallery from '../portfolio/PortfolioGallery';

export default function PortfolioSection({ id }) {
  const { portfolios, addPortfolio, updatePortfolio, deletePortfolio } = useProfile();
  const { darkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    duration: '',
    client: '',
    images: []
  });

  const handleOpenModal = (portfolio = null) => {
    if (portfolio) {
      setCurrentPortfolio(portfolio);
      setFormData({
        title: portfolio.title,
        description: portfolio.description,
        technologies: portfolio.technologies.join(', '),
        duration: portfolio.duration,
        client: portfolio.client,
        images: portfolio.images.join('\n')
      });
    } else {
      setCurrentPortfolio(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        duration: '',
        client: '',
        images: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const portfolioData = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
      duration: formData.duration,
      client: formData.client,
      images: formData.images.split('\n').filter(url => url.trim() !== '')
    };
    
    if (currentPortfolio) {
      updatePortfolio({ ...currentPortfolio, ...portfolioData });
    } else {
      addPortfolio(portfolioData);
    }
    
    setShowModal(false);
  };

  const handleDelete = () => {
    if (portfolioToDelete) {
      deletePortfolio(portfolioToDelete.id);
      setShowDeleteModal(false);
      setPortfolioToDelete(null);
    }
  };

  const openDeleteModal = (portfolio) => {
    setPortfolioToDelete(portfolio);
    setShowDeleteModal(true);
  };

  return (
    <section id={id} className={`p-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="section-title">
        <h2>Portfolio</h2>
        <Button 
          variant="primary" 
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenModal()}
        >
          Add Project
        </Button>
      </div>

      {portfolios.length > 0 ? (
        <div className="mt-8">
          <PortfolioGallery portfolios={portfolios} />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map(portfolio => (
              <div 
                key={portfolio.id}
                className={`rounded-lg overflow-hidden shadow-md transition-all duration-300 portfolio-card ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={portfolio.images[0]} 
                    alt={portfolio.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {portfolio.title}
                  </h3>
                  <p className={`mt-2 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {portfolio.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {portfolio.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs rounded-full ${
                          darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {portfolio.technologies.length > 3 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        +{portfolio.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="small"
                      startIcon={<Pencil size={14} />}
                      onClick={() => handleOpenModal(portfolio)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      startIcon={<Trash2 size={14} />}
                      onClick={() => openDeleteModal(portfolio)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg">No portfolio projects yet. Add your first project!</p>
        </div>
      )}

      {/* Add/Edit Portfolio Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={currentPortfolio ? "Edit Project" : "Add New Project"}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Project Title
            </label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Description
            </label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Technologies (comma separated)
            </label>
            <input 
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({...formData, technologies: e.target.value})}
              placeholder="React, Node.js, etc."
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Duration
              </label>
              <input 
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="3 months"
                className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Client
              </label>
              <input 
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({...formData, client: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Image URLs (one per line)
            </label>
            <textarea 
              rows={4}
              value={formData.images}
              onChange={(e) => setFormData({...formData, images: e.target.value})}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter one image URL per line. First image will be used as the thumbnail.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-3">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {currentPortfolio ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="small"
      >
        <div className="space-y-4">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to delete "{portfolioToDelete?.title}"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3 pt-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}