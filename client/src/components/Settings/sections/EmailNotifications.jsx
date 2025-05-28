import React, { useState } from 'react';
import { Save } from 'lucide-react';

const EmailNotifications = () => {
  const [notifications, setNotifications] = useState({
    projectMessages: true,
    projectUpdates: true,
    newProjects: true,
    paymentReceipts: true,
    weeklyNewsletter: false,
    marketingEmails: false
  });
  const [isChanged, setIsChanged] = useState(false);



  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
    setIsChanged(true);
  };


  const saveNotificationChanges = () => {
    // Here you would typically update notification preferences via API
    console.log('Saving notification preferences:', notifications);
    setIsChanged(false);
    alert('Notification preferences updated!');
  };

  return (
    <div>

      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Notification Preferences</h2>
          {isChanged && (
            <button 
              onClick={saveNotificationChanges}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              <span>Save Preferences</span>
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Project Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-gray-800">Project Messages</h4>
                <p className="text-sm text-gray-600">Receive notifications when clients send you messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="projectMessages" 
                  checked={notifications.projectMessages} 
                  onChange={handleNotificationChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-gray-800">Project Updates</h4>
                <p className="text-sm text-gray-600">Receive updates about project status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="projectUpdates" 
                  checked={notifications.projectUpdates} 
                  onChange={handleNotificationChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-gray-800">New Projects</h4>
                <p className="text-sm text-gray-600">Get notified about new project opportunities</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="newProjects" 
                  checked={notifications.newProjects} 
                  onChange={handleNotificationChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-700 mb-3 mt-6">Payment & Marketing</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-gray-800">Payment Receipts</h4>
                <p className="text-sm text-gray-600">Receive email receipts for payments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="paymentReceipts" 
                  checked={notifications.paymentReceipts} 
                  onChange={handleNotificationChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-gray-800">Weekly Newsletter</h4>
                <p className="text-sm text-gray-600">Receive our weekly newsletter with freelancing tips</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="weeklyNewsletter" 
                  checked={notifications.weeklyNewsletter} 
                  onChange={handleNotificationChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-gray-800">Marketing Emails</h4>
                <p className="text-sm text-gray-600">Receive special offers and promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="marketingEmails" 
                  checked={notifications.marketingEmails} 
                  onChange={handleNotificationChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;