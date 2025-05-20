import React, { useState } from 'react';
import { CreditCard, PayPalIcon } from './Icons';
import PaymentForm from './PaymentForm';
import PaypalPayment from './PaypalPayment';
import OrderSummary from './OrderSummary';
import PaymentSuccess from './PaymentSuccess';

// Mock order data - in a real app, this would come from your cart or backend
const orderData = {
  items: [
    { id: 1, name: 'Premium Plan Subscription', price: 49.99, quantity: 1 },
    { id: 2, name: 'One-time Setup Fee', price: 10.00, quantity: 1 },
  ],
  subtotal: 59.99,
  tax: 5.99,
  total: 65.98,
};

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentSubmit = async (details) => {
    setPaymentStatus('processing');
    setPaymentDetails(details);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Checkout</h1>
      
      {paymentStatus === 'success' ? (
        <PaymentSuccess orderData={orderData} paymentDetails={paymentDetails} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
            
            {paymentStatus === 'processing' ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 font-medium">Processing your payment...</p>
              </div>
            ) : (
              <>
                {!paymentMethod ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => handlePaymentMethodSelect('credit-card')}
                      className="w-full flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                      <div className="flex space-x-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handlePaymentMethodSelect('paypal')}
                      className="w-full flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <PayPalIcon className="h-6 w-6 text-blue-800 mr-3" />
                        <span className="font-medium">PayPal</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Fast and secure</span>
                      </div>
                    </button>
                  </div>
                ) : paymentMethod === 'credit-card' ? (
                  <PaymentForm onSubmit={handlePaymentSubmit} onCancel={() => setPaymentMethod(null)} />
                ) : (
                  <PaypalPayment onSubmit={handlePaymentSubmit} onCancel={() => setPaymentMethod(null)} />
                )}
              </>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure. We never store your full card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <OrderSummary orderData={orderData} />
        </div>
      )}
    </div>
  );
};

export default PaymentPage;