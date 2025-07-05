import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useProfile } from '../../../store/ProfileContext';
import { useTheme } from '../../../store/ThemeContext';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Select from 'react-select';

const SKILLS_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'gcp', label: 'Google Cloud' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'redis', label: 'Redis' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'rest', label: 'REST APIs' },
];

export default function AboutSection({ id }) {
  const { activeProfile, updateProfile } = useProfile();
  const { darkMode } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    about: activeProfile.about,
    skills: activeProfile.skills.map(skill => ({
      value: skill.toLowerCase(),
      label: skill
    }))
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...activeProfile,
      about: formData.about,
      skills: formData.skills.map(skill => skill.label)
    };
    updateProfile(updatedProfile);
    setShowEditModal(false);
  };

  return (
    <section id={id} className={`p-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="section-title">
        <h2>About Me</h2>
        <Button 
          variant="text" 
          startIcon={<Pencil size={18} />} 
          onClick={() => setShowEditModal(true)}
          aria-label="Edit about section"
        >
          Edit
        </Button>
      </div>
      <div className="space-y-6">
        <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{activeProfile.about}</p>
        
        <div className="animate-slide-up">
          <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skills</h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.skills.map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                  darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit About Me"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="about" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              About
            </label>
            <textarea
              id="about"
              rows={5}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label htmlFor="skills" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Skills
            </label>
            <Select
              isMulti
              id="skills"
              options={SKILLS_OPTIONS}
              value={formData.skills}
              onChange={(selected) => setFormData({ ...formData, skills: selected || [] })}
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

          <div className="flex justify-end space-x-3 pt-3">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}