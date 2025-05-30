import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CreditCard, PayPalIcon } from './Icons';
import PaymentForm from './PaymentForm';
import PaypalPayment from './PaypalPayment';
import OrderSummary from './OrderSummary';
import PaymentSuccess from './PaymentSuccess';
import { storage } from '../../services/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { generatePDF } from './pdfGenerator';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51RNvo0PD2ZfT0veA7BPxByjFh4BdGorb1kDLEX9KSBv7pQcivh7c1JK0VLQfGQwfLwwy5VcgGtYWeL0S04uHqAPj00IeRkq5Sn');

const PaymentPage = () => {
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [stripeError, setStripeError] = useState(null);

  const navigate = useNavigate();
  
  // Extract state from location
  const { userId, projectId, proposalData } = location.state || {};

  console.log('userId : ', userId);
  console.log('projectId : ', projectId);
  console.log('proposalData : ', proposalData);

  // Redirect if state is missing
  useEffect(() => {
    if (!userId || !projectId) {
      toast.error('Missing payment information');
      navigate('/projects');
    }
  }, [userId, projectId, navigate]);

  const [orderData, setOrderData] = useState({
    items: [
      { 
        id: 1, 
        name: proposalData?.projectTitle || 'Service Payment', 
        description: proposalData?.proposalDescription || 'Payment for services rendered',
        price: proposalData?.proposalAmount
        || 0, 
        quantity: 1 
      },
      { 
        id: 2, 
        name: 'Service Fee', 
        price: (0.025 * proposalData?.proposalAmount), 
        quantity: 1 
      }
    ],
    subtotal: (proposalData?.proposalAmount || 0) + (0.025 * proposalData?.proposalAmount),
    tax: 0.025, // 2.5% tax
    total: ((proposalData?.proposalAmount || 0) + 0.025) * 1.025,
    projectId,
    userId,
    createdAt: new Date().toISOString(),
  });

  // Update order data when proposalData changes
  useEffect(() => {
    if (proposalData) {
      setOrderData(prev => ({
        ...prev,
        items: [
          { 
            id: 1, 
            name: proposalData.projectTitle, 
            proposalDescription: proposalData.proposalDescription,
            price: proposalData.proposalAmount, 
            quantity: 1 
          },
          { 
            id: 2, 
            name: 'Service Fee', 
            price: 0.025 , 
            quantity: 1 
          }
        ],
        subtotal: proposalData.proposalAmount + (0.025 ),
        total: (proposalData.proposalAmount + (0.025 )) * 1.025
      }));
    }
  }, [proposalData]);

  useEffect(() => {
    if (paymentMethod === 'credit-card') {
      createPaymentIntent();
    }
  }, [paymentMethod, orderData.total]);

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post('/api/create-payment-intent', {
        amount: Math.round(orderData.total * 100),
        currency: 'usd',
        metadata: { 
          userId, 
          projectId,
          proposalId: proposalData?.proposalId
        }
      });

      if (response.data?.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        throw new Error('Invalid client secret received from server.');
      }

    } catch (err) {
      console.error('Error creating payment intent:', err);
      setStripeError(err.response?.data?.error || 'Failed to initialize payment. Please try again.');
      toast.error('Failed to initialize payment');
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setStripeError(null);
  };

  const generateAndUploadBill = async (paymentDetails) => {
    try {
      const pdfContent = await generatePDF({
        ...orderData,
        paymentDetails,
        paymentDate: new Date().toISOString(),
        proposalData
      });

      const billId = uuidv4();
      const storageRef = ref(storage, `bills/${userId}/${billId}.pdf`);
      await uploadBytes(storageRef, pdfContent);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error generating or uploading bill:', error);
      toast.error('Failed to generate receipt');
      throw error;
    }
  };

  const submitPaymentDetails = async (details) => {
    try {
      const res = await axios.post(`/api/payment/`, {
        userId,
        projectId,
        proposalId: proposalData?.proposalId,
        paymentDetails: details,
        orderData
      });

      if (res.data.success) {
        toast.success('Payment recorded successfully!');
      } else {
        throw new Error(res.data.message || 'Payment recording failed');
      }

    } catch (error) {
      console.error('Failed to record payment:', error);
      toast.error('Failed to record payment');
      throw error;
    }
  };

  const handlePaymentSubmit = async (details) => {
    setPaymentStatus('processing');
    try {
      const billUrl = await generateAndUploadBill({
        ...details,
        method: 'paypal',
      });

      const fullDetails = {
        ...details,
        method: 'paypal',
        billUrl,
        transactionId: details.orderID,
      };

      setPaymentDetails(fullDetails);
      await submitPaymentDetails(fullDetails);
      setPaymentStatus('success');
    } catch (error) {
      console.error('Payment processing failed:', error);
      setPaymentStatus('idle');
      setStripeError('Payment processing failed. Please try again.');
    }
  };

  const handleStripePaymentSuccess = async (paymentResult) => {
    setPaymentStatus('processing');
    try {
      const billUrl = await generateAndUploadBill({
        method: 'credit-card',
        cardLast4: paymentResult.paymentMethod.card.last4,
        transactionId: paymentResult.paymentIntent.id,
      });

      const fullDetails = {
        method: 'credit-card',
        cardLast4: paymentResult.paymentMethod.card.last4,
        transactionId: paymentResult.paymentIntent.id,
        billUrl,
        billingDetails: paymentResult.paymentMethod.billing_details
      };

      setPaymentDetails(fullDetails);
      await submitPaymentDetails(fullDetails);
      setPaymentStatus('success');
    } catch (error) {
      console.error('Payment processing failed:', error);
      setPaymentStatus('idle');
      setStripeError('Payment processing failed. Please try again.');
    }
  };

  if (!userId || !projectId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500">Missing payment information</p>
          <p>Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Checkout</h1>
      
      {paymentStatus === 'success' ? (
        <PaymentSuccess 
          orderData={orderData} 
          paymentDetails={paymentDetails} 
          billUrl={paymentDetails?.billUrl}
          onComplete={() => navigate('/dashboard')}
        />
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
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                          alt="Visa" 
                          className="h-8" 
                          loading="lazy"
                        />
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                          alt="Mastercard" 
                          className="h-8" 
                          loading="lazy"
                        />
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
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm 
                      onSubmit={handleStripePaymentSuccess}
                      onCancel={() => setPaymentMethod(null)}
                      orderTotal={orderData.total}
                    />
                  </Elements>
                ) : (
                  <PayPalScriptProvider options={{
                    "client-id": 'ATcqLOuVAn00dc9WhEM9rOe7AfLx812cYA9nSTzwyGZ1EVTfifGDprLlaSOXxKQMw0NWjKYi0q6sNNlz',
                    currency: "USD",
                    intent: "capture",
                  }}>
                    <PaypalPayment 
                      amount={orderData.total}
                      onSubmit={handlePaymentSubmit}
                      onCancel={() => setPaymentMethod(null)}
                      userId={userId}
                      projectId={projectId}
                    />
                  </PayPalScriptProvider>
                )}
              </>
            )}
            
            {stripeError && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <p className="text-red-600">{stripeError}</p>
                <button
                  onClick={() => setStripeError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Try again
                </button>
              </div>
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