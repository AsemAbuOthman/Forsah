import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { useProfile } from '../../../store/ProfileContext';
import { useTheme } from '../../../store/ThemeContext';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function ExperienceSection({ id }) {
  const { experience, addExperience, updateExperience, deleteExperience } = useProfile();
  const { darkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleOpenModal = (exp = null) => {
    if (exp) {
      setCurrentExperience(exp);
      setFormData({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate || '',
        description: exp.description
      });
    } else {
      setCurrentExperience(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const experienceData = {
      ...formData,
      // If endDate is empty, don't include it to represent "Present"
      ...(formData.endDate ? { endDate: formData.endDate } : {})
    };
    
    if (currentExperience) {
      updateExperience({ ...currentExperience, ...experienceData });
    } else {
      addExperience(experienceData);
    }
    
    setShowModal(false);
  };

  const handleDelete = () => {
    if (experienceToDelete) {
      deleteExperience(experienceToDelete.id);
      setShowDeleteModal(false);
      setExperienceToDelete(null);
    }
  };

  const openDeleteModal = (exp) => {
    setExperienceToDelete(exp);
    setShowDeleteModal(true);
  };

  return (
    <section id={id} className={`p-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="section-title">
        <h2>Experience</h2>
        <Button 
          variant="primary" 
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenModal()}
        >
          Add Experience
        </Button>
      </div>
      <div className="space-y-8">
        {experience.length > 0 ? (
          experience.map((exp, index) => (
            <div 
              key={exp.id} 
              className={`flex gap-4 ${index !== 0 ? 'pt-8 border-t ' + (darkMode ? 'border-gray-700' : 'border-gray-200') : ''}`}
            >
              <div className="flex-shrink-0">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {exp.title}
                    </h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {exp.company} • {exp.location}
                    </p>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                      {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Pencil size={14} />}
                      onClick={() => handleOpenModal(exp)}
                      aria-label={`Edit ${exp.title} experience`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Trash2 size={14} />}
                      onClick={() => openDeleteModal(exp)}
                      aria-label={`Delete ${exp.title} experience`}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {exp.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No experience added yet. Add your work history to showcase your career.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Experience Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={currentExperience ? "Edit Experience" : "Add New Experience"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Job Title
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
              Company
            </label>
            <input 
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Location
            </label>
            <input 
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Start Date
              </label>
              <input 
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                End Date (leave empty for "Present")
              </label>
              <input 
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
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
              {currentExperience ? 'Update Experience' : 'Add Experience'}
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
            Are you sure you want to delete the experience at "{experienceToDelete?.company}"? This action cannot be undone.
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