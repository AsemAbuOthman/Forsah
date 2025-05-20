import React, { useState } from 'react';

const PaymentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      if (name === 'cardNumber') {
        const formatted = value
          .replace(/\s/g, '')
          .substring(0, 16)
          .replace(/(\d{4})/g, '$1 ')
          .trim();
        setFormData({ ...formData, [name]: formatted });
      } 
      else if (name === 'expiryDate') {
        const formatted = value
          .replace(/\s/g, '')
          .replace(/\//g, '')
          .substring(0, 4)
          .replace(/(\d{2})(?=\d)/, '$1/');
        setFormData({ ...formData, [name]: formatted });
      }
      else if (name === 'cvv') {
        const formatted = value.replace(/\D/g, '').substring(0, 4);
        setFormData({ ...formData, [name]: formatted });
      }
      else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Valid 16-digit card number is required';
    }
    
    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = 'Valid expiry date required (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (
        parseInt(month) < 1 || 
        parseInt(month) > 12 ||
        (parseInt(year) < currentYear || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth))
      ) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Valid CVV required (3-4 digits)';
    }
    
    if (!formData.billingAddress.address.trim()) {
      newErrors['billingAddress.address'] = 'Address is required';
    }
    
    if (!formData.billingAddress.city.trim()) {
      newErrors['billingAddress.city'] = 'City is required';
    }
    
    if (!formData.billingAddress.state.trim()) {
      newErrors['billingAddress.state'] = 'State is required';
    }
    
    if (!formData.billingAddress.zipCode.trim()) {
      newErrors['billingAddress.zipCode'] = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Card Information</h3>
        
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
            Cardholder Name
          </label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.cardName ? 'border-red-300' : 'border-gray-300'
            } shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="John Smith"
          />
          {errors.cardName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.cardNumber ? 'border-red-300' : 'border-gray-300'
            } shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="1234 5678 9012 3456"
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.expiryDate ? 'border-red-300' : 'border-gray-300'
              } shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="MM/YY"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.cvv ? 'border-red-300' : 'border-gray-300'
              } shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="123"
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="billingAddress.address"
            value={formData.billingAddress.address}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors['billingAddress.address'] ? 'border-red-300' : 'border-gray-300'
            } shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="123 Main St"
          />
          {errors['billingAddress.address'] && (
            <p className="mt-1 text-sm text-red-600">{errors['billingAddress.address']}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="billingAddress.city"
              value={formData.billingAddress.city}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors['billingAddress.city'] ? 'border-red-300' : 'border-gray-300'
              } shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="New York"
            />
            {errors['billingAddress.city'] && (
              <p className="mt-1 text-sm text-red-600">{errors['billingAddress.city']}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              name="billingAddress.state"
              value={formData.billingAddress.state}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors['billingAddress.state'] ? 'border-red-300' : 'border-gray-300'
              } shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="NY"
            />
            {errors['billingAddress.state'] && (
              <p className="mt-1 text-sm text-red-600">{errors['billingAddress.state']}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="billingAddress.zipCode"
              value={formData.billingAddress.zipCode}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors['billingAddress.zipCode'] ? 'border-red-300' : 'border-gray-300'
              } shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="10001"
            />
            {errors['billingAddress.zipCode'] && (
              <p className="mt-1 text-sm text-red-600">{errors['billingAddress.zipCode']}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              name="billingAddress.country"
              value={formData.billingAddress.country}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Pay Now
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;