import React from "react";

interface InputProps {
  type: string;
  id: string;
  required: boolean;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  min?: string;
}

function Input({
  type,
  id,
  required,
  placeholder,
  value,
  onChange,
  disabled,
  min,
}: InputProps) {
  return (
    <input
      type={type}
      name={id}
      id={id}
      required={required}
      placeholder={placeholder}
      value={value}
      min={min}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
    />
  );
}

export default Input;
