import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  grouped?: SelectGroup[];
  fullWidth?: boolean;
}

export function Select({
  label,
  error,
  options,
  grouped,
  fullWidth = true,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`
          ${fullWidth ? 'w-full' : ''}
          px-3 py-2.5
          border rounded-lg
          bg-white
          outline-none
          transition
          ${
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-500'
              : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
          }
          ${className}
        `}
        {...props}
      >
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        {grouped &&
          grouped.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
