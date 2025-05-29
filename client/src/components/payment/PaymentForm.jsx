import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

const PaymentForm = ({ 
  onSubmit, 
  onCancel, 
  orderTotal,
  clientSecret,
  userId,
  projectId,
  orderData 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            ...billingDetails,
            address: {
              ...billingDetails.address,
              country: billingDetails.address.country.toUpperCase(),
            }
          },
        },
        receipt_email: billingDetails.email,
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        const paymentDetails = {
          method: 'credit-card',
          cardLast4: paymentIntent.payment_method.card.last4,
          transactionId: paymentIntent.id,
          amount: orderTotal,
          billingDetails,
          paymentDate: new Date().toISOString(),
          status: paymentIntent.status,
          userId,
          projectId,
          orderData
        };

        onSubmit(paymentDetails);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  const handleBillingDetailsChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        iconColor: '#666EE8',
      },
      invalid: {
        color: '#9e2146',
        iconColor: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={billingDetails.name}
              onChange={handleBillingDetailsChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="John Smith"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={billingDetails.email}
              onChange={handleBillingDetailsChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={billingDetails.phone}
            onChange={handleBillingDetailsChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="(123) 456-7890"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Details <span className="text-red-500">*</span>
          </label>
          <div className="p-3 border border-gray-300 rounded-md bg-white">
            <CardElement 
              options={cardElementOptions} 
              className="p-2"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            We accept Visa, Mastercard, American Express, and Discover
          </p>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
        
        <div>
          <label htmlFor="address.line1" className="block text-sm font-medium text-gray-700">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address.line1"
            name="address.line1"
            value={billingDetails.address.line1}
            onChange={handleBillingDetailsChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="123 Main St"
          />
        </div>
        
        <div>
          <label htmlFor="address.line2" className="block text-sm font-medium text-gray-700">
            Apt, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            id="address.line2"
            name="address.line2"
            value={billingDetails.address.line2}
            onChange={handleBillingDetailsChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Apt 4B"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={billingDetails.address.city}
              onChange={handleBillingDetailsChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="New York"
            />
          </div>
          
          <div>
            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
              State/Province <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address.state"
              name="address.state"
              value={billingDetails.address.state}
              onChange={handleBillingDetailsChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="NY"
            />
          </div>
          
          <div>
            <label htmlFor="address.postal_code" className="block text-sm font-medium text-gray-700">
              ZIP/Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address.postal_code"
              name="address.postal_code"
              value={billingDetails.address.postal_code}
              onChange={handleBillingDetailsChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="10001"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            id="address.country"
            name="address.country"
            value={billingDetails.address.country}
            onChange={handleBillingDetailsChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : `Pay $${orderTotal.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;