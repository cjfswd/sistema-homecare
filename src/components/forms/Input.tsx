import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  hint,
  icon: Icon,
  fullWidth = true,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          className={`
            ${fullWidth ? 'w-full' : ''}
            ${Icon ? 'pl-10' : 'pl-3'}
            pr-3 py-2.5
            border rounded-lg
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
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
      )}
    </div>
  );
}
