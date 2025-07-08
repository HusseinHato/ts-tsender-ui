// components/InputField.tsx
import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  type = 'text',
  large = false,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e);
};

  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {large ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      )}
    </div>
  );
};

export default InputField;