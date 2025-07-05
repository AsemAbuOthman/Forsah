import React from 'react';
import { 
  User, Mail, Lock, CreditCard, Settings as SettingsIcon 
} from 'lucide-react';

const SettingsMenu = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'email', label: 'Email & Notifications', icon: <Mail size={18} /> },
    { id: 'password', label: 'Password', icon: <Lock size={18} /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={18} /> },
    { id: 'account', label: 'Account', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={activeSection === item.id ? 'text-blue-500' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsMenu;