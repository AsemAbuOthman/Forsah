import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

const PortfolioForm = ({ portfolio, onSubmit, onClose }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    technologies: [''],
    ...portfolio
  });
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState(portfolio?.images || []);
  const [isDragging, setIsDragging] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (previews.length === 0) newErrors.images = 'At least one image is required';
    if (!formData.technologies[0]) newErrors.technologies = 'At least one technology is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ ...formData, images: previews });
    } else {
      setErrors(newErrors);
    }
  };

  const handleTechnologyChange = (index, value) => {
    const newTechnologies = [...formData.technologies];
    newTechnologies[index] = value;
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const addTechnology = () => {
    setFormData({
      ...formData,
      technologies: [...formData.technologies, '']
    });
  };

  const removeTechnology = (index) => {
    if (formData.technologies.length > 1) {
      setFormData({
        ...formData,
        technologies: formData.technologies.filter((_, i) => i !== index)
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {portfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              } ${errors.images ? 'border-red-500' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <ImageIcon size={48} className="text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Drag and drop images here, or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Upload size={16} className="mr-2" />
                  Choose Files
                </button>
              </div>
            </div>

            {errors.images && (
              <p className="mt-1 text-sm text-red-500">{errors.images}</p>
            )}

            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies
            </label>
            {formData.technologies.map((tech, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleTechnologyChange(index, e.target.value)}
                  placeholder="Technology name"
                  className="flex-1 px-3 py-2 border rounded-md border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeTechnology(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.technologies.length === 1}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTechnology}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <Plus size={16} className="mr-1" /> Add Technology
            </button>
            {errors.technologies && (
              <p className="mt-1 text-sm text-red-500">{errors.technologies}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              {portfolio ? 'Save Changes' : 'Add Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioForm;