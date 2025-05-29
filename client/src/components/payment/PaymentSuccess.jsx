import React from 'react';
import { saveAs } from 'file-saver';

const PaymentSuccess = ({ orderData, paymentDetails, billUrl }) => {
  // Generate order number from timestamp
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
  
  // Format date and time
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Determine payment method display
  const getPaymentMethod = () => {
    if (!paymentDetails?.method) return 'Unknown';
    
    switch(paymentDetails.method) {
      case 'paypal':
        return `PayPal (${paymentDetails.paypalEmail || ''})`;
      case 'credit-card':
        return `Credit Card (•••• ${paymentDetails.cardLast4 || '****'})`;
      default:
        return paymentDetails.method;
    }
  };

  // Format transaction ID for display
  const formatTransactionId = (id) => {
    if (!id) return '';
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`;
  };

  // Download bill PDF
  const handleDownloadBill = () => {
    if (billUrl) {
      saveAs(billUrl, `invoice-${orderNumber}.pdf`);
    } else {
      window.print();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-600 p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-green-100">Your order #{orderNumber} has been processed successfully.</p>
      </div>
      
      <div className="p-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm text-gray-600">Order Number:</h3>
            <span className="text-sm font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm text-gray-600">Date & Time:</h3>
            <span className="text-sm font-medium">{currentDate}</span>
          </div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm text-gray-600">Payment Method:</h3>
            <span className="text-sm font-medium">{getPaymentMethod()}</span>
          </div>
          {paymentDetails?.transactionId && (
            <div className="flex justify-between">
              <h3 className="text-sm text-gray-600">Transaction ID:</h3>
              <span className="text-sm font-medium" title={paymentDetails.transactionId}>
                {formatTransactionId(paymentDetails.transactionId)}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-3 mb-4">
          {orderData.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} {item.quantity > 1 && `(×${item.quantity})`}
              </span>
              <span className="text-gray-900 font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${orderData.subtotal.toFixed(2)}</span>
          </div>
          {orderData.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({orderData.tax * 100}%)</span>
              <span className="text-gray-900">
                ${(orderData.subtotal * orderData.tax).toFixed(2)}
              </span>
            </div>
          )}
          {orderData.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">
                -${orderData.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-base font-medium pt-2">
            <span className="text-gray-900">Total Amount Paid</span>
            <span className="text-blue-600">${orderData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            {paymentDetails?.billingDetails?.email 
              ? `A confirmation has been sent to ${paymentDetails.billingDetails.email}`
              : 'A confirmation email has been sent to your email address.'
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {billUrl && (
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleDownloadBill}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Invoice
              </button>
            )}
            <button
              type="button"
              className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => window.print()}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
            <button
              type="button"
              className="inline-flex justify-center items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => window.location.href = '/dashboard_page'}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;