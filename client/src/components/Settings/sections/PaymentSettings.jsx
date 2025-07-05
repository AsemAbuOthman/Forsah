import React, { useState } from 'react';
import { CreditCard, Trash2, Plus, DollarSign } from 'lucide-react';

const PaymentSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'credit_card', last4: '4242', brand: 'Visa', expMonth: 12, expYear: 2024, isDefault: true },
    { id: 2, type: 'credit_card', last4: '5555', brand: 'Mastercard', expMonth: 9, expYear: 2025, isDefault: false }
  ]);
  
  const [addingNew, setAddingNew] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'JPY', name: 'Japanese Yen' }
  ];

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
    // Here you would typically update the user's currency preference via API
    console.log('Currency changed to:', e.target.value);
  };

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const removePaymentMethod = (id) => {
    // Confirm before removing
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    }
  };

  const addNewPaymentMethod = () => {
    // In a real app, this would open a Stripe or similar payment form
    // For demo purposes, we'll just add a mock payment method
    const newMethod = {
      id: Date.now(),
      type: 'credit_card',
      last4: '1234',
      brand: 'Visa',
      expMonth: 1,
      expYear: 2026,
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setAddingNew(false);
    alert('New payment method added successfully!');
  };

  const getBrandIcon = (brand) => {
    return <CreditCard size={20} />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Payment Methods</h2>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">Your Payment Methods</h3>
          <button 
            onClick={() => setAddingNew(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <Plus size={16} />
            <span>Add New</span>
          </button>
        </div>
        
        {paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div key={method.id} className="border border-gray-200 rounded-md p-4 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-md">
                    {getBrandIcon(method.brand)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {method.brand} •••• {method.last4}
                      {method.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires {method.expMonth}/{method.expYear}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button 
                      onClick={() => setDefaultPaymentMethod(method.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Set as default
                    </button>
                  )}
                  <button 
                    onClick={() => removePaymentMethod(method.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-md p-6 bg-gray-50 text-center">
            <CreditCard size={36} className="mx-auto mb-2 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-700 mb-1">No payment methods yet</h4>
            <p className="text-gray-500 mb-4">Add a payment method to receive payments from clients</p>
            <button 
              onClick={() => setAddingNew(true)}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Plus size={16} />
              <span>Add Payment Method</span>
            </button>
          </div>
        )}
        
        {addingNew && (
          <div className="mt-4 border border-blue-200 rounded-md p-4 bg-blue-50">
            <h4 className="text-md font-medium text-gray-800 mb-3">Add New Payment Method</h4>
            <p className="text-sm text-gray-600 mb-4">
              In a real app, this would integrate with Stripe or another payment processor to securely collect payment details.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={addNewPaymentMethod}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add Payment Method
              </button>
              <button 
                onClick={() => setAddingNew(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Currency Preference</h3>
        <div className="max-w-md bg-white p-4 border border-gray-200 rounded-md">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={20} className="text-gray-500" />
            <label htmlFor="currency" className="text-gray-700 font-medium">
              Select Your Currency
            </label>
          </div>
          <select
            id="currency"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            This is the currency in which you'll receive payments and see rates displayed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;