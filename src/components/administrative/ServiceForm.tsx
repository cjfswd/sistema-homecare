import React from 'react';
import { Input, Select } from '@/components/forms';
import type { Service } from '@/types';

interface ServiceFormProps {
  formData: Partial<Service>;
  onFormChange: (field: string, value: any) => void;
}

const categoryOptions = [
    { value: 'procedure', label: 'Procedimento' },
    { value: 'consultation', label: 'Consulta' },
    { value: 'shift', label: 'Plantão (Hora)' },
    { value: 'rental', label: 'Locação Equipamento' },
];

export function ServiceForm({ formData, onFormChange }: ServiceFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Input
            label="Código"
            value={formData.code || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('code', e.target.value)}
            className="font-mono uppercase"
          />
        </div>
        <div className="col-span-2">
          <Input
            label="Nome do Serviço"
            value={formData.name || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('name', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Categoria"
          options={categoryOptions}
          value={formData.category || 'procedure'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFormChange('category', e.target.value)}
        />
        <Input
          label="Preço Base (R$)"
          type="number"
          value={formData.basePrice || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('basePrice', parseFloat(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="activeService"
          className="w-4 h-4 text-indigo-600 rounded"
          checked={formData.active || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('active', e.target.checked)}
        />
        <label htmlFor="activeService" className="text-sm text-slate-700">
          Serviço Ativo para Venda
        </label>
      </div>
    </div>
  );
}
