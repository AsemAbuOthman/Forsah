import React from 'react';
import { PayPalIcon } from './Icons';

const PaypalPayment = ({ onSubmit, onCancel }) => {
  const handlePaypalSubmit = () => {
    onSubmit({
      method: 'paypal',
      paypalEmail: 'user@example.com',
      transactionId: 'PP-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    });
  };
  
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-md bg-blue-50 rounded-lg p-6 text-center">
        <PayPalIcon className="w-12 h-12 text-blue-800 mx-auto mb-4" />
        <p className="text-gray-700 mb-4">
          You'll be redirected to PayPal to complete your payment securely.
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          PayPal handles your payment information with bank-level encryption.
        </p>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={handlePaypalSubmit}
            className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-800 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <PayPalIcon className="w-5 h-5 mr-2" />
            Continue to PayPal
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center space-x-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-sm text-gray-500">SECURE PAYMENT</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-4">
          <div className="p-2 bg-gray-100 rounded-md">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="p-2 bg-gray-100 rounded-md">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="p-2 bg-gray-100 rounded-md">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaypalPayment;