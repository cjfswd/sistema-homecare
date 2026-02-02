import React from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  title,
  subtitle,
  children,
  headerAction,
  footer,
  variant = 'default',
  padding = 'md'
}: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-slate-200',
    bordered: 'bg-white border-2 border-slate-300',
    elevated: 'bg-white shadow-lg border border-slate-100'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`${variantClasses[variant]} rounded-xl overflow-hidden`}>
      {(title || headerAction) && (
        <div className={`flex justify-between items-start border-b border-slate-100 ${padding !== 'none' ? 'p-6 pb-4' : ''}`}>
          <div>
            {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer && (
        <div className={`border-t border-slate-100 bg-slate-50 ${padding !== 'none' ? 'p-6 pt-4' : ''}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
