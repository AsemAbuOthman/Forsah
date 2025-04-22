import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  disabled = false,
  fullWidth = false,
  type = 'button',
  startIcon,
  endIcon,
  ...props 
}, ref) => {
  
  const variants = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 
              dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400`,
    secondary: `bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 
                dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-400`,
    danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 
             dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400`,
    success: `bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 
              dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-400`,
    text: `bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500 
           dark:text-blue-400 dark:hover:bg-gray-800 dark:focus:ring-blue-400`,
    outline: `bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 
              dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-400`
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled ? 
    'opacity-50 cursor-not-allowed pointer-events-none' : 
    'transform active:scale-95 transition-transform duration-75';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        ${disabledClasses}
        ${widthClass}
        rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-colors duration-200 inline-flex items-center justify-center
        ${className}
      `}
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;