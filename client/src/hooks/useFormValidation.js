import { useState, useCallback } from 'react';

export function useFormValidation(schema) {
  const [errors, setErrors] = useState({});
  
  const validate = useCallback((data) => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  }, [schema]);
  
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);
  
  const setFieldError = useCallback((field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);
  
  return {
    errors,
    validate,
    clearErrors,
    setFieldError
  };
}