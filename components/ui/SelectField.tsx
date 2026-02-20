
import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: SelectOption[];
  error?: string;
  containerClassName?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, error, containerClassName = 'mb-4', className='', ...props }) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        className={`w-full px-4 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out sm:text-sm bg-white text-gray-800 ${className}`}
        {...props}
      >
        <option value="" disabled>{`-- ${label} নির্বাচন করুন --`}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;