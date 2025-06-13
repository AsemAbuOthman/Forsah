import { useState } from 'react';
import { format } from 'date-fns';
import { Award, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';

export default function CertificationsSection({ 
  certifications, 
  setCertifications, 
  showDeleteConfirmation,
  showSuccessToast 
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    credentialId: '',
  });
  
  const handleEditClick = (cert) => {
    setSelectedCertification(cert);
    setFormData({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId,
    });
    setShowModal(true);
  };
  
  const handleAddNew = () => {
    setSelectedCertification(null);
    setFormData({
      id: null,
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
    });
    setShowModal(true);
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) return false;
    if (!formData.issuer.trim()) return false;
    if (!formData.date) return false;
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Don't submit if required fields are missing
    }
    
    if (selectedCertification) {
      // Update existing certification
      setCertifications(prev => prev.map(cert => 
        cert.id === selectedCertification.id ? { ...formData } : cert
      ));
      showSuccessToast('Certification updated successfully');
    } else {
      // Add new certification
      const newId = Math.max(0, ...certifications.map(c => c.id)) + 1;
      setCertifications(prev => [...prev, { ...formData, id: newId }]);
      showSuccessToast('Certification added successfully');
    }
    
    setShowModal(false);
  };
  
  return (
    <section id="certifications" className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Certifications</h2>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Certification</span>
        </button>
      </div>
      
      {certifications.length === 0 ? (
        <div className="text-center py-8">
          <Award size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No certifications added yet</p>
          <button
            onClick={handleAddNew}
            className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            + Add your first certification
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {certifications.map(cert => (
            <div key={cert.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{cert.issuer}</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Issued {format(new Date(cert.date), 'MMM yyyy')}
                      {cert.expiryDate && ` • Expires ${format(new Date(cert.expiryDate), 'MMM yyyy')}`}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Credential ID: {cert.credentialId}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(cert)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      aria-label="Edit certification"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation('certification', cert.id, cert.name)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      aria-label="Delete certification"
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
      
      {/* Add/Edit Certification Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {selectedCertification ? "Edit Certification" : "Add Certification"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cert-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Certification Name*
            </label>
            <input
              id="cert-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., AWS Certified Solutions Architect"
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="cert-issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Issuer*
            </label>
            <input
              id="cert-issuer"
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g., Amazon Web Services"
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cert-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Issued Date*
              </label>
              <input
                id="cert-date"
                type="month"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="cert-expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiry Date
              </label>
              <input
                id="cert-expiry"
                type="month"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cert-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Credential ID
            </label>
            <input
              id="cert-id"
              type="text"
              value={formData.credentialId}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              placeholder="e.g., AWS-123456"
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
              {selectedCertification ? 'Update' : 'Add'} Certification
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}