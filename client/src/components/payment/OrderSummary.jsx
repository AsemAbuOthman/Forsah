import React from 'react';

const OrderSummary = ({ orderData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {orderData.items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div>
              <p className="text-gray-800 font-medium">{item.name}</p>
              <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
            </div>
            <p className="text-gray-800">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-gray-800">${orderData.subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Tax</p>
          <p className="text-gray-800">${orderData.tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-3">
          <p className="text-gray-800 font-semibold">Total</p>
          <p className="text-xl text-blue-600 font-bold">${orderData.total.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-base font-medium text-gray-900 mb-4">Payment Security</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 mb-1" />
            <span className="text-xs text-gray-500">Visa</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 mb-1" />
            <span className="text-xs text-gray-500">Mastercard</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 mb-1" />
            <span className="text-xs text-gray-500">PayPal</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          All transactions are secure and encrypted. Credit card information is never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;