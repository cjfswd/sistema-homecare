import React from 'react';

interface VitalSignInputProps {
  icon: React.ElementType;
  label: string;
  unit: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  color?: string;
}

export const VitalSignInput = ({ icon: Icon, label, unit, value, onChange, color = "text-slate-500" }: VitalSignInputProps) => (
  <div className="flex flex-col bg-slate-50 p-3 rounded-lg border border-slate-200">
    <div className="flex items-center gap-2 mb-1">
      <Icon size={16} className={color} />
      <span className="text-xs font-semibold text-slate-600 uppercase">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <input
        type="number"
        className="w-full bg-transparent text-xl font-bold text-slate-800 outline-none placeholder:text-slate-300"
        placeholder="--"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
      />
      <span className="text-xs text-slate-400">{unit}</span>
    </div>
  </div>
);
