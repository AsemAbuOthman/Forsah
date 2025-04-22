import React, { useState } from 'react';
import { Moon, Sun, Trash2, LogOut } from 'lucide-react';

const AccountSettings = () => {
  const [theme, setTheme] = useState('light');
  const [accountType, setAccountType] = useState('freelancer');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // In a real app, you would persist this preference and apply the theme
    console.log('Theme switched to:', newTheme);
  };
  
  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
    // In a real app, you would update this via API
    console.log('Account type changed to:', e.target.value);
  };
  
  const handleDeactivateAccount = () => {
    // In a real app, you would call an API to deactivate the account
    console.log('Account deactivation requested');
    setShowDeactivateModal(false);
    alert('Your account has been deactivated. You can reactivate it at any time by logging in.');
  };
  
  const handleDeleteAccount = () => {
    // In a real app, you would call an API to permanently delete the account
    console.log('Account deletion requested');
    setShowDeleteModal(false);
    alert('Your account has been scheduled for deletion. This action will be completed in 30 days.');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>
      
      <div className="space-y-8">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Theme</p>
              <p className="text-sm text-gray-600">Choose between light and dark mode</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-11' : 'translate-x-1'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon size={16} className="h-full w-full p-1 text-blue-600" />
                ) : (
                  <Sun size={16} className="h-full w-full p-1 text-yellow-500" />
                )}
              </span>
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Account Type</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="freelancer" 
                name="accountType" 
                value="freelancer" 
                checked={accountType === 'freelancer'} 
                onChange={handleAccountTypeChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="freelancer" className="ml-3">
                <span className="block text-sm font-medium text-gray-800">Freelancer</span>
                <span className="block text-xs text-gray-500">Find work and get hired by clients</span>
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="radio" 
                id="client" 
                name="accountType" 
                value="client" 
                checked={accountType === 'client'} 
                onChange={handleAccountTypeChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="client" className="ml-3">
                <span className="block text-sm font-medium text-gray-800">Client</span>
                <span className="block text-xs text-gray-500">Post jobs and hire freelancers</span>
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="radio" 
                id="agency" 
                name="accountType" 
                value="agency" 
                checked={accountType === 'agency'} 
                onChange={handleAccountTypeChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="agency" className="ml-3">
                <span className="block text-sm font-medium text-gray-800">Agency</span>
                <span className="block text-xs text-gray-500">Manage a team of freelancers and client projects</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Account Management</h3>
          <div className="space-y-4">
            <div>
              <button 
                onClick={() => setShowDeactivateModal(true)}
                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                <LogOut size={18} />
                <span>Deactivate Account</span>
              </button>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Temporarily disable your account. You can reactivate it later.
              </p>
            </div>
            
            <div>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 size={18} />
                <span>Delete Account</span>
              </button>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Deactivate Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate your account? You won't be able to receive new projects or messages while your account is deactivated.
            </p>
            <p className="text-gray-600 mb-6">
              You can reactivate your account at any time by logging back in.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeactivateAccount}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-4">
              Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.
            </p>
            <p className="text-gray-600 mb-6">
              All your data, including profile information, project history, and reviews will be permanently removed after a 30-day grace period.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;