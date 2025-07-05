import React from 'react';

const OrderSummary = ({ orderData, paymentMethod, onCheckout, isProcessing }) => {
  // Calculate tax amount if tax is a rate (percentage)
  const taxAmount = typeof orderData.tax === 'number' && orderData.tax <= 1 
    ? orderData.subtotal * orderData.tax 
    : orderData.tax;

  // Calculate total if not provided
  const calculatedTotal = orderData.total || (orderData.subtotal + taxAmount - (orderData.discount || 0));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
        {orderData.items.map((item) => (
          <div key={item.id} className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{item.name}</p>
              {item.description && (
                <p className="text-gray-500 text-xs mt-1">{item.description}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right ml-4">
              <p className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-gray-400 text-xs line-through">
                  ${(item.originalPrice * item.quantity).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-gray-800">${orderData.subtotal.toFixed(2)}</p>
        </div>

        {orderData.discount > 0 && (
          <div className="flex justify-between">
            <p className="text-gray-600">Discount</p>
            <p className="text-green-600">-${orderData.discount.toFixed(2)}</p>
          </div>
        )}

        <div className="flex justify-between">
          <p className="text-gray-600">
            Tax{typeof orderData.tax === 'number' && orderData.tax <= 1 ? ` (${(orderData.tax * 100).toFixed(1)}%)` : ''}
          </p>
          <p className="text-gray-800">${taxAmount.toFixed(2)}</p>
        </div>

        {orderData.shipping > 0 && (
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping</p>
            <p className="text-gray-800">${orderData.shipping.toFixed(2)}</p>
          </div>
        )}

        <div className="flex justify-between border-t border-gray-200 pt-3">
          <p className="text-gray-800 font-semibold">Total</p>
          <p className="text-xl text-blue-600 font-bold">${calculatedTotal.toFixed(2)}</p>
        </div>
      </div>
      
      {onCheckout && (
        <button
          onClick={onCheckout}
          disabled={isProcessing || !paymentMethod}
          className={`mt-6 w-full rounded-md py-3 px-4 text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
            isProcessing 
              ? 'bg-blue-400 cursor-not-allowed' 
              : paymentMethod 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${calculatedTotal.toFixed(2)}`
          )}
        </button>
      )}
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-base font-medium text-gray-900 mb-4">Payment Security</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                 alt="Visa" 
                 className="h-6 mb-1"
                 loading="lazy" />
            <span className="text-xs text-gray-500">Visa</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                 alt="Mastercard" 
                 className="h-6 mb-1"
                 loading="lazy" />
            <span className="text-xs text-gray-500">Mastercard</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                  alt="PayPal" 
                  className="h-6 mb-1"
                  loading="lazy" />
            <span className="text-xs text-gray-500">PayPal</span>
          </div>
        </div>
        <div className="flex items-start">
          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-xs text-gray-500">
            All transactions are secured with 256-bit SSL encryption. Your payment information is processed securely and never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;