import React from 'react';

const PaymentSuccess = ({ orderData, paymentDetails }) => {
  const orderNumber = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const paymentMethod = paymentDetails?.method === 'paypal' 
    ? 'PayPal' 
    : `Credit Card (****${paymentDetails?.cardNumber?.replace(/\s/g, '').slice(-4)})`;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-600 p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-green-100">Your order has been processed successfully.</p>
      </div>
      
      <div className="p-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm text-gray-600">Order Number:</h3>
            <span className="text-sm font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm text-gray-600">Date:</h3>
            <span className="text-sm font-medium">{currentDate}</span>
          </div>
          <div className="flex justify-between">
            <h3 className="text-sm text-gray-600">Payment Method:</h3>
            <span className="text-sm font-medium">{paymentMethod}</span>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-3 mb-4">
          {orderData.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} (x{item.quantity})
              </span>
              <span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${orderData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${orderData.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-medium pt-2">
            <span className="text-gray-900">Total</span>
            <span className="text-blue-600">${orderData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            A confirmation email has been sent to your email address.
          </p>
          <div className="space-x-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => window.print()}
            >
              Print Receipt
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;