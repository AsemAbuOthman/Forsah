import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, ExternalLink, Calendar, User, Clock } from 'lucide-react';
import { useTheme } from '../../../store/ThemeContext';
import Modal from '../shared/Modal';
import Select from 'react-select';
import { format } from 'date-fns';

const SKILLS_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'node', label: 'Node.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'aws', label: 'AWS' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'redis', label: 'Redis' },
];

export default function PortfolioGallery({ portfolios = [], onAdd, onUpdate, onDelete }) {
  const { darkMode } = useTheme();
  const [currentProject, setCurrentProject] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    duration: '',
    client: '',
    images: [],
    projectUrl: '',
    startDate: '',
    endDate: '',
    role: '',
    teamSize: '',
    challenges: '',
    solutions: '',
    outcomes: ''
  });
  
  useEffect(() => {
    let interval;
    if (selectedPortfolio && selectedPortfolio.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((current) => (current + 1) % selectedPortfolio.images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [selectedPortfolio]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const portfolio = {
      ...formData,
      technologies: formData.technologies.map(tech => tech.label),
      images: imagePreviews
    };

    if (selectedPortfolio) {
      onUpdate({ ...selectedPortfolio, ...portfolio });
    } else {
      onAdd(portfolio);
    }
    
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedPortfolio(null);
    setFormData({
      title: '',
      description: '',
      technologies: [],
      duration: '',
      client: '',
      images: [],
      projectUrl: '',
      startDate: '',
      endDate: '',
      role: '',
      teamSize: '',
      challenges: '',
      solutions: '',
      outcomes: ''
    });
    setImageFiles([]);
    setImagePreviews([]);
    setCurrentImageIndex(0);
  };

  const openEditModal = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setFormData({
      ...portfolio,
      technologies: portfolio.technologies.map(tech => ({
        value: tech.toLowerCase(),
        label: tech
      }))
    });
    setImagePreviews(portfolio.images);
    setShowModal(true);
  };

  const openDetailsModal = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setCurrentImageIndex(0);
    setShowDetailsModal(true);
  };

  const handleDelete = (portfolio) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      onDelete(portfolio.id);
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Featured Project */}
      {portfolios.length > 0 && (
        <div 
          className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          onClick={() => openDetailsModal(portfolios[currentProject])}
        >
          <div className="relative aspect-video">
            <img 
              src={portfolios[currentProject].images[0]} 
              alt={portfolios[currentProject].title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-gray-900' : 'from-black'} opacity-60`}></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold">{portfolios[currentProject].title}</h3>
              <p className="mt-2 text-gray-200">{portfolios[currentProject].description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolios[currentProject].technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-600 bg-opacity-70 text-white text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
            darkMode 
              ? 'border-gray-700 hover:border-gray-600 text-gray-400' 
              : 'border-gray-300 hover:border-gray-400 text-gray-500'
          }`}
        >
          <div className="text-center">
            <Plus size={40} className="mx-auto mb-2" />
            <span className="text-lg font-medium">Add New Project</span>
          </div>
        </button>

        {portfolios.map((portfolio) => (
          <div 
            key={portfolio.id}
            className={`relative group rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div 
              className="aspect-square overflow-hidden cursor-pointer"
              onClick={() => openDetailsModal(portfolio)}
            >
              <img 
                src={portfolio.images[0]} 
                alt={portfolio.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-gray-900' : 'from-black'} opacity-0 group-hover:opacity-60 transition-opacity duration-300`}></div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(portfolio);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(portfolio);
                    }}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {portfolio.title}
              </h3>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {portfolio.client}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {portfolio.technologies.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
                {portfolio.technologies.length > 3 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    +{portfolio.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPortfolio(null);
          setCurrentImageIndex(0);
        }}
        title="Project Details"
        size="large"
      >
        {selectedPortfolio && (
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={selectedPortfolio.images[currentImageIndex]}
                alt={`${selectedPortfolio.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {selectedPortfolio.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((current) => 
                      (current - 1 + selectedPortfolio.images.length) % selectedPortfolio.images.length
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((current) => 
                      (current + 1) % selectedPortfolio.images.length
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {selectedPortfolio.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPortfolio.title}
                  </h3>
                  <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedPortfolio.description}
                  </p>
                </div>

                <div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Technologies Used
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedPortfolio.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedPortfolio.challenges && (
                  <div>
                    <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Challenges & Solutions
                    </h4>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedPortfolio.challenges}
                    </p>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedPortfolio.solutions}
                    </p>
                  </div>
                )}

                {selectedPortfolio.outcomes && (
                  <div>
                    <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Outcomes
                    </h4>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedPortfolio.outcomes}
                    </p>
                  </div>
                )}
              </div>

              <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <User size={18} />
                    <span className="font-medium">Client:</span>
                  </div>
                  <p className="mt-1 ml-6">{selectedPortfolio.client}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Clock size={18} />
                    <span className="font-medium">Duration:</span>
                  </div>
                  <p className="mt-1 ml-6">{selectedPortfolio.duration}</p>
                </div>

                {selectedPortfolio.role && (
                  <div>
                    <div className="flex items-center space-x-2">
                      <User size={18} />
                      <span className="font-medium">Role:</span>
                    </div>
                    <p className="mt-1 ml-6">{selectedPortfolio.role}</p>
                  </div>
                )}

                {selectedPortfolio.teamSize && (
                  <div>
                    <div className="flex items-center space-x-2">
                      <User size={18} />
                      <span className="font-medium">Team Size:</span>
                    </div>
                    <p className="mt-1 ml-6">{selectedPortfolio.teamSize}</p>
                  </div>
                )}

                {selectedPortfolio.projectUrl && (
                  <a
                    href={selectedPortfolio.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-2 mt-4 ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <ExternalLink size={18} />
                    <span>View Project</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Portfolio Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={selectedPortfolio ? "Edit Project" : "Add New Project"}
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
              Technologies
            </label>
            <Select
              isMulti
              options={SKILLS_OPTIONS}
              value={formData.technologies}
              onChange={(selected) => setFormData({...formData, technologies: selected || []})}
              className="react-select-container"
              classNamePrefix="react-select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: '#3b82f6',
                  primary75: '#60a5fa',
                  primary50: '#93c5fd',
                  primary25: '#dbeafe',
                  neutral0: darkMode ? '#374151' : '#ffffff',
                  neutral10: darkMode ? '#4b5563' : '#f3f4f6',
                  neutral20: darkMode ? '#6b7280' : '#e5e7eb',
                  neutral30: darkMode ? '#9ca3af' : '#d1d5db',
                  neutral40: darkMode ? '#9ca3af' : '#9ca3af',
                  neutral50: darkMode ? '#d1d5db' : '#6b7280',
                  neutral60: darkMode ? '#e5e7eb' : '#4b5563',
                  neutral70: darkMode ? '#f3f4f6' : '#374151',
                  neutral80: darkMode ? '#f9fafb' : '#1f2937',
                  neutral90: darkMode ? '#ffffff' : '#111827',
                },
              })}
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
                placeholder="e.g., 3 months"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Role
              </label>
              <input 
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="e.g., Lead Developer"
                className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Team Size
              </label>
              <input 
                type="text"
                value={formData.teamSize}
                onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                placeholder="e.g., 5 members"
                className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Project URL
            </label>
            <input 
              type="url"
              value={formData.projectUrl}
              onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
              placeholder="https://example.com"
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Challenges & Solutions
            </label>
            <textarea 
              value={formData.challenges}
              onChange={(e) => setFormData({...formData, challenges: e.target.value})}
              placeholder="Describe the main challenges faced..."
              rows={3}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <textarea 
              value={formData.solutions}
              onChange={(e) => setFormData({...formData, solutions: e.target.value})}
              placeholder="Describe how you solved these challenges..."
              rows={3}
              className={`mt-2 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Outcomes
            </label>
            <textarea 
              value={formData.outcomes}
              onChange={(e) => setFormData({...formData, outcomes: e.target.value})}
              placeholder="Describe the project outcomes and impact..."
              rows={3}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Project Images
            </label>
            <input 
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-video">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className={`px-4 py-2 rounded-md ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {selectedPortfolio ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}