import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { PayPalIcon } from './Icons';

const PaypalPayment = ({ 
  amount, 
  onSubmit, 
  onCancel,
  userId,
  projectId,
  orderData 
}) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: "USD",
          },
          description: `Payment for project ${projectId}`,
          custom_id: userId,
          invoice_id: `INV-${Date.now()}`,
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING"
      }
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      
      const paymentDetails = {
        method: 'paypal',
        paypalEmail: details.payer.email_address,
        transactionId: details.id,
        amount: amount,
        payerId: details.payer.payer_id,
        paymentDate: new Date().toISOString(),
        status: details.status,
        userId,
        projectId,
        orderData
      };

      onSubmit(paymentDetails);
    } catch (err) {
      console.error('PayPal capture error:', err);
      onError(err);
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    // You might want to pass this error up to the parent component
    if (typeof onCancel === 'function') {
      onCancel({
        error: true,
        message: 'Payment processing failed. Please try again.',
        details: err
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-md bg-blue-50 rounded-lg p-6 text-center">
        <PayPalIcon className="w-12 h-12 text-blue-800 mx-auto mb-4" />
        <p className="text-gray-700 mb-4">
          You'll be redirected to PayPal to complete your payment securely.
        </p>
        
        {isPending ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <PayPalButtons 
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                onCancel={onCancel}
                style={{
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'pay',
                }}
                disabled={!amount}
              />
            </div>
            
            <button
              type="button"
              onClick={() => onCancel()}
              className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
          </>
        )}
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center space-x-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-sm text-gray-500">SECURE PAYMENT</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-4">
          <div className="p-2 bg-gray-100 rounded-md" title="Encrypted transaction">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="p-2 bg-gray-100 rounded-md" title="Verified payment">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="p-2 bg-gray-100 rounded-md" title="24/7 support">
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