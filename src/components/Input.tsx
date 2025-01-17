"use client";
import React from "react";
import { InputProps } from "../types/types";

const Input: React.FC<InputProps> = ({
  id,
  name,
  type,
  label,
  placeholder = "",
  value,
  onChange,
  required = true,
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="w-full border rounded px-4 py-2 text-blue-400 text-sm focus:ring-2 focus:ring-blue-300 outline-none placeholder-blue-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default Input;
