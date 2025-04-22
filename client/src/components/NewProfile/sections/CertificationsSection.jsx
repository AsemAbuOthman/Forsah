import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Award } from 'lucide-react';
import { useProfile } from '../../../store/ProfileContext';
import { useTheme } from '../../../store/ThemeContext';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function CertificationsSection({ id }) {
  const { certifications, addCertification, updateCertification, deleteCertification } = useProfile();
  const { darkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [currentCertification, setCurrentCertification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificationToDelete, setCertificationToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    credentialId: ''
  });

  const handleOpenModal = (cert = null) => {
    if (cert) {
      setCurrentCertification(cert);
      setFormData({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        expiryDate: cert.expiryDate || '',
        credentialId: cert.credentialId
      });
    } else {
      setCurrentCertification(null);
      setFormData({
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const certificationData = {
      ...formData,
      // If expiryDate is empty, don't include it
      ...(formData.expiryDate ? { expiryDate: formData.expiryDate } : {})
    };
    
    if (currentCertification) {
      updateCertification({ ...currentCertification, ...certificationData });
    } else {
      addCertification(certificationData);
    }
    
    setShowModal(false);
  };

  const handleDelete = () => {
    if (certificationToDelete) {
      deleteCertification(certificationToDelete.id);
      setShowDeleteModal(false);
      setCertificationToDelete(null);
    }
  };

  const openDeleteModal = (cert) => {
    setCertificationToDelete(cert);
    setShowDeleteModal(true);
  };

  return (
    <section id={id} className={`p-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
      <div className="section-title">
        <h2>Certifications</h2>
        <Button 
          variant="primary" 
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenModal()}
        >
          Add Certification
        </Button>
      </div>
      <div className="space-y-8">
        {certifications.length > 0 ? (
          certifications.map((cert, index) => (
            <div 
              key={cert.id} 
              className={`flex gap-4 ${index !== 0 ? 'pt-8 border-t ' + (darkMode ? 'border-gray-700' : 'border-gray-200') : ''}`}
            >
              <div className="flex-shrink-0">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Award className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {cert.name}
                    </h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {cert.issuer}
                    </p>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Issued {format(new Date(cert.date), 'MMM yyyy')}
                      {cert.expiryDate && ` • Expires ${format(new Date(cert.expiryDate), 'MMM yyyy')}`}
                    </p>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Credential ID: {cert.credentialId}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Pencil size={14} />}
                      onClick={() => handleOpenModal(cert)}
                      aria-label={`Edit ${cert.name} certification`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Trash2 size={14} />}
                      onClick={() => openDeleteModal(cert)}
                      aria-label={`Delete ${cert.name} certification`}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No certifications added yet. Add your professional certifications to highlight your expertise.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Certification Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={currentCertification ? "Edit Certification" : "Add New Certification"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Certification Name
            </label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., AWS Certified Solutions Architect"
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Issuer
            </label>
            <input 
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({...formData, issuer: e.target.value})}
              placeholder="e.g., Amazon Web Services"
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Issue Date
              </label>
              <input 
                type="month"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Expiry Date (optional)
              </label>
              <input 
                type="month"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Credential ID
            </label>
            <input 
              type="text"
              value={formData.credentialId}
              onChange={(e) => setFormData({...formData, credentialId: e.target.value})}
              placeholder="e.g., AWS-123456"
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
              {currentCertification ? 'Update Certification' : 'Add Certification'}
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
            Are you sure you want to delete the certification "{certificationToDelete?.name}"? This action cannot be undone.
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