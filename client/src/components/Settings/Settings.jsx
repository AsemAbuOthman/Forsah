import React, { useState } from 'react';
import SettingsMenu from './SettingsMenu';
import ProfileSettings from './sections/ProfileSettings';
import EmailNotifications from './sections/EmailNotifications';
import PasswordSettings from './sections/PasswordSettings';
import PaymentSettings from './sections/PaymentSettings';
import AccountSettings from './sections/AccountSettings';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'email':
        return <EmailNotifications />;
      case 'password':
        return <PasswordSettings />;
      case 'payment':
        return <PaymentSettings />;
      case 'account':
        return <AccountSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <SettingsMenu activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
        <div className="md:w-3/4 bg-white rounded-lg shadow-md p-6 animate-fadeIn">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Settings;