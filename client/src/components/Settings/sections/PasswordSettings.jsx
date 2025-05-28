import React, { useState, useEffect } from 'react';
import { EyeOff, Eye, Save } from 'lucide-react';
import axios from 'axios';
import { DEFAULT_USER_ID } from '../../../src1/lib/constants';
import { toast } from 'react-hot-toast';

const PasswordSettings = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.password === null) {
      setIsGoogleAccount(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'new' && passwords.confirm) {
      if (value !== passwords.confirm) {
        setErrors(prev => ({ ...prev, confirm: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirm: '' }));
      }
    }

    if (name === 'confirm') {
      if (value !== passwords.new) {
        setErrors(prev => ({ ...prev, confirm: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirm: '' }));
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { current: '', new: '', confirm: '' };

    if (!isGoogleAccount && !passwords.current.trim()) {
      newErrors.current = 'Current password is required';
      valid = false;
    }

    if (!passwords.new.trim()) {
      newErrors.new = 'New password is required';
      valid = false;
    } else if (passwords.new.length < 8) {
      newErrors.new = 'Password must be at least 8 characters';
      valid = false;
    }

    if (!passwords.confirm.trim()) {
      newErrors.confirm = 'Please confirm your new password';
      valid = false;
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const payload = {
        ...passwords,
        current: isGoogleAccount ? null : passwords.current
      };
  
      try {

        const res = await axios.patch(`/api/password/${DEFAULT_USER_ID}`, payload);
        console.log('Password update response:', res.data);
        if (res.data.success) {

          setPasswords({ current: '', new: '', confirm: '' });
          toast.success('Password updated Successfully !', {
            duration: 2000,
            position: 'top-center',
          });
        }else{

          toast.error('Invalied current password plz try again !', {
            duration: 2000,
            position: 'top-center'
          });
        }
      } catch (error) {
        console.error('Password update failed', error);
        toast.error('Failed to update password.', {
            duration: 2000,
            position: 'top-center'
          }
        );
      }
    }
  };
  

  const isFormComplete = (isGoogleAccount || passwords.current) && passwords.new && passwords.confirm;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Update Password</h2>
        {isFormComplete && (
          <button 
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            <span>Save Password</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        {!isGoogleAccount && (
          <div>
            <label htmlFor="current" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="current"
                name="current"
                value={passwords.current}
                onChange={handleChange}
                className={`w-full pl-3 pr-10 py-2 border ${errors.current ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.current && <p className="mt-1 text-sm text-red-500">{errors.current}</p>}
          </div>
        )}

        <div>
          <label htmlFor="new" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="new"
              name="new"
              value={passwords.new}
              onChange={handleChange}
              className={`w-full pl-3 pr-10 py-2 border ${errors.new ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.new && <p className="mt-1 text-sm text-red-500">{errors.new}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.
          </p>
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              id="confirm"
              name="confirm"
              value={passwords.confirm}
              onChange={handleChange}
              className={`w-full pl-3 pr-10 py-2 border ${errors.confirm ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirm && <p className="mt-1 text-sm text-red-500">{errors.confirm}</p>}
        </div>
      </form>
    </div>
  );
};

export default PasswordSettings;
