import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import PortfolioCard from './PortfolioCard';
import PortfolioModal from './PortfolioModal';
import PortfolioForm from './PortfolioForm';

const PortfolioGallery = ({ initialPortfolios = [] }) => {
  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);

  const handlePortfolioClick = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowPortfolioModal(true);
  };

  const handleCloseModal = () => {
    setShowPortfolioModal(false);
    setSelectedPortfolio(null);
  };

  const handleAddNew = () => {
    setEditingPortfolio(null);
    setShowForm(true);
  };

  const handleEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setShowForm(true);
    setShowPortfolioModal(false);
  };

  const handleDelete = (portfolioId) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
      setShowPortfolioModal(false);
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingPortfolio) {
      setPortfolios(portfolios.map(p => 
        p.id === editingPortfolio.id ? { ...formData, id: p.id } : p
      ));
    } else {
      setPortfolios([...portfolios, { ...formData, id: uuidv4() }]);
    }
    setShowForm(false);
    setEditingPortfolio(null);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Project
        </button>
      </div>

      {portfolios.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first project to showcase your work.</p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portfolios.map((portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              onClick={handlePortfolioClick}
            />
          ))}
        </div>
      )}

      {selectedPortfolio && (
        <PortfolioModal
          isOpen={showPortfolioModal}
          onClose={handleCloseModal}
          portfolio={selectedPortfolio}
          onEdit={() => handleEdit(selectedPortfolio)}
          onDelete={() => handleDelete(selectedPortfolio.id)}
        />
      )}

      {showForm && (
        <PortfolioForm
          portfolio={editingPortfolio}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default PortfolioGallery;