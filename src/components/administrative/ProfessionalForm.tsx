import React from 'react';
import { Input, Select } from '@/components/forms';
import { roleLabels } from '@/lib/translations';
import type { Professional, ProfessionalRole } from '@/types';

interface ProfessionalFormProps {
  formData: Partial<Professional>;
  onFormChange: (field: string, value: any) => void;
}

const roleOptions = Object.entries(roleLabels).map(([value, label]) => ({
  value: value as ProfessionalRole,
  label,
}));

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'vacation', label: 'Férias' },
];

export function ProfessionalForm({ formData, onFormChange }: ProfessionalFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Nome Completo"
        value={formData.name || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('name', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Categoria"
          options={roleOptions}
          value={formData.role || 'technician'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFormChange('role', e.target.value)}
        />
        <Input
          label="Nº Conselho"
          placeholder="Ex: COREN-SP 123456"
          value={formData.councilNumber || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('councilNumber', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('email', e.target.value)}
        />
        <Input
          label="Telefone"
          value={formData.phone || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('phone', e.target.value)}
        />
      </div>
      <Select
        label="Status"
        options={statusOptions}
        value={formData.status || 'active'}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFormChange('status', e.target.value)}
      />
    </div>
  );
}
