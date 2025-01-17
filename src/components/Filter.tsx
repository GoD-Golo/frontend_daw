import { FilterProps } from "@/types/types";
import { JSX } from "react";

export default function Filter({
  id,
  name,
  label,
  options,
  value,
  onChange,
}: FilterProps): JSX.Element {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-600 mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
