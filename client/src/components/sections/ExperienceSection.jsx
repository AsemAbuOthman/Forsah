import { useState } from 'react';
import { format } from 'date-fns';
import { Briefcase, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';

export default function ExperienceSection({ 
  experience, 
  setExperience, 
  showDeleteConfirmation,
  showSuccessToast 
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  const handleEditClick = (exp) => {
    setSelectedExperience(exp);
    setFormData({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description,
    });
    setShowModal(true);
  };
  
  const handleAddNew = () => {
    setSelectedExperience(null);
    setFormData({
      id: null,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setShowModal(true);
  };
  
  const validateForm = () => {
    if (!formData.title.trim()) return false;
    if (!formData.company.trim()) return false;
    if (!formData.startDate) return false;
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Don't submit if required fields are missing
    }
    
    if (selectedExperience) {
      // Update existing experience
      setExperience(prev => prev.map(exp => 
        exp.id === selectedExperience.id ? { ...formData } : exp
      ));
      showSuccessToast('Experience updated successfully');
    } else {
      // Add new experience
      const newId = Math.max(0, ...experience.map(e => e.id)) + 1;
      setExperience(prev => [...prev, { ...formData, id: newId }]);
      showSuccessToast('Experience added successfully');
    }
    
    setShowModal(false);
  };
  
  return (
    <section id="experience" className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Experience</h2>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Experience</span>
        </button>
      </div>
      
      {experience.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No work experience added yet</p>
          <button
            onClick={handleAddNew}
            className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            + Add your first experience
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map(exp => (
            <div key={exp.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{exp.company} • {exp.location}</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                      {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
                    </p>
                    {exp.description && (
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{exp.description}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(exp)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      aria-label="Edit experience"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation('experience', exp.id, exp.title)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      aria-label="Delete experience"
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
      
      {/* Add/Edit Experience Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {selectedExperience ? "Edit Experience" : "Add Experience"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="exp-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title*
            </label>
            <input
              id="exp-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Senior Developer"
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="exp-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company*
            </label>
            <input
              id="exp-company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g., TechCorp"
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="exp-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              id="exp-location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, CA"
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="exp-start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date*
              </label>
              <input
                id="exp-start-date"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="exp-end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date <span className="text-gray-400">(leave empty if current)</span>
              </label>
              <input
                id="exp-end-date"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="exp-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="exp-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Led a team of 5 developers in building enterprise-level applications."
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
              {selectedExperience ? 'Update' : 'Add'} Experience
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}