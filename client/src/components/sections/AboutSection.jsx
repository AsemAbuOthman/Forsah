import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Modal from '../common/Modal';

export default function AboutSection({ activeProfile, setActiveProfile, showSuccessToast }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    about: activeProfile.about,
    skills: activeProfile.skills.join(', ')
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.about.trim()) {
      return; // Don't submit if about is empty
    }
    
    const updatedSkills = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);
    
    setActiveProfile(prev => ({
      ...prev,
      about: formData.about,
      skills: updatedSkills
    }));
    
    setShowEditModal(false);
    showSuccessToast('About section updated successfully');
  };
  
  return (
    <section id="about" className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">About Me</h2>
        <button 
          onClick={() => {
            setFormData({
              about: activeProfile.about,
              skills: activeProfile.skills.join(', ')
            });
            setShowEditModal(true);
          }}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          aria-label="Edit about section"
        >
          <Pencil size={20} />
        </button>
      </div>
      
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{activeProfile.about}</p>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm transition-colors duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Edit About Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit About Section</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              About Me
            </label>
            <textarea
              id="about"
              rows={6}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skills (comma separated)
            </label>
            <input
              id="skills"
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}