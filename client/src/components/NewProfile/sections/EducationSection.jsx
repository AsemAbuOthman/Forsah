import { useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { useProfile } from '../../../store/ProfileContext';
import { useTheme } from '../../../store/ThemeContext';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function EducationSection({ id }) {
  const { education, addEducation, updateEducation, deleteEducation } = useProfile();
  const { darkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    year: '',
    description: ''
  });

  const handleOpenModal = (edu = null) => {
    if (edu) {
      setCurrentEducation(edu);
      setFormData({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
        description: edu.description
      });
    } else {
      setCurrentEducation(null);
      setFormData({
        degree: '',
        institution: '',
        year: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const educationData = { ...formData };
    
    if (currentEducation) {
      updateEducation({ ...currentEducation, ...educationData });
    } else {
      addEducation(educationData);
    }
    
    setShowModal(false);
  };

  const handleDelete = () => {
    if (educationToDelete) {
      deleteEducation(educationToDelete.id);
      setShowDeleteModal(false);
      setEducationToDelete(null);
    }
  };

  const openDeleteModal = (edu) => {
    setEducationToDelete(edu);
    setShowDeleteModal(true);
  };

  return (
    <section id={id} className={`p-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="section-title">
        <h2>Education</h2>
        <Button 
          variant="primary" 
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenModal()}
        >
          Add Education
        </Button>
      </div>
      <div className="space-y-8">
        {education.length > 0 ? (
          education.map((edu, index) => (
            <div 
              key={edu.id} 
              className={`flex gap-4 ${index !== 0 ? 'pt-8 border-t ' + (darkMode ? 'border-gray-700' : 'border-gray-200') : ''}`}
            >
              <div className="flex-shrink-0">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'
                }`}>
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {edu.degree}
                    </h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {edu.institution}
                    </p>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {edu.year}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Pencil size={14} />}
                      onClick={() => handleOpenModal(edu)}
                      aria-label={`Edit ${edu.degree} education`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Trash2 size={14} />}
                      onClick={() => openDeleteModal(edu)}
                      aria-label={`Delete ${edu.degree} education`}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {edu.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No education added yet. Add your academic background to enhance your profile.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Education Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={currentEducation ? "Edit Education" : "Add New Education"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Degree / Certification
            </label>
            <input 
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({...formData, degree: e.target.value})}
              placeholder="e.g., Master's in Computer Science"
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Institution
            </label>
            <input 
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
              placeholder="e.g., Stanford University"
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Year
            </label>
            <input 
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              placeholder="e.g., 2018"
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
              placeholder="e.g., Specialized in Distributed Systems and Machine Learning"
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
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
              {currentEducation ? 'Update Education' : 'Add Education'}
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
            Are you sure you want to delete the education record for "{educationToDelete?.degree}"? This action cannot be undone.
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