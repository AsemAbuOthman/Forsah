import { useState } from 'react';
import { GraduationCap, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';

export default function EducationSection({ 
  education, 
  setEducation, 
  showDeleteConfirmation,
  showSuccessToast 
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    degree: '',
    institution: '',
    year: '',
    description: ''
  });
  
  const handleEditClick = (edu) => {
    setSelectedEducation(edu);
    setFormData({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
      description: edu.description,
    });
    setShowModal(true);
  };
  
  const handleAddNew = () => {
    setSelectedEducation(null);
    setFormData({
      id: null,
      degree: '',
      institution: '',
      year: '',
      description: ''
    });
    setShowModal(true);
  };
  
  const validateForm = () => {
    if (!formData.degree.trim()) return false;
    if (!formData.institution.trim()) return false;
    if (!formData.year.trim()) return false;
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Don't submit if required fields are missing
    }
    
    if (selectedEducation) {
      // Update existing education
      setEducation(prev => prev.map(edu => 
        edu.id === selectedEducation.id ? { ...formData } : edu
      ));
      showSuccessToast('Education updated successfully');
    } else {
      // Add new education
      const newId = Math.max(0, ...education.map(e => e.id)) + 1;
      setEducation(prev => [...prev, { ...formData, id: newId }]);
      showSuccessToast('Education added successfully');
    }
    
    setShowModal(false);
  };
  
  return (
    <section id="education" className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Education</span>
        </button>
      </div>
      
      {education.length === 0 ? (
        <div className="text-center py-8">
          <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No education history added yet</p>
          <button
            onClick={handleAddNew}
            className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            + Add your first education
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {education.map(edu => (
            <div key={edu.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                    <p className="text-gray-500 dark:text-gray-400">{edu.year}</p>
                    {edu.description && (
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{edu.description}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(edu)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      aria-label="Edit education"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation('education', edu.id, edu.degree)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      aria-label="Delete education"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Education Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {selectedEducation ? "Edit Education" : "Add Education"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edu-degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Degree*
            </label>
            <input
              id="edu-degree"
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="e.g., Master's in Computer Science"
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="edu-institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Institution*
            </label>
            <input
              id="edu-institution"
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g., Stanford University"
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="edu-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Year*
            </label>
            <input
              id="edu-year"
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="e.g., 2018"
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="edu-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="edu-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Specialized in Distributed Systems and Machine Learning"
              rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {selectedEducation ? 'Update' : 'Add'} Education
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}