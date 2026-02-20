
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  containerClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, error, containerClassName = 'mb-4', className='', ...props }) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out sm:text-sm text-gray-800 placeholder-gray-500 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;