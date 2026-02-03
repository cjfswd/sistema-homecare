import React from 'react';
import { Input, Select } from '@/components/forms';

export interface NotificationFormProps {
  formData: any;
  onFormChange: (field: string, value: any) => void;
}

const typeOptions = [
  { value: 'info', label: 'Informação' },
  { value: 'success', label: 'Sucesso' },
  { value: 'warning', label: 'Aviso' },
  { value: 'error', label: 'Erro' },
];

const categoryOptions = [
  { value: 'system', label: 'Sistema' },
  { value: 'clinical', label: 'Clínico' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'stock', label: 'Estoque' },
];

export function NotificationForm({ formData, onFormChange }: NotificationFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Título"
        value={formData.title || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('title', e.target.value)}
        placeholder="Título da notificação"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipo"
          options={typeOptions}
          value={formData.type || 'info'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFormChange('type', e.target.value)}
        />
        <Select
          label="Categoria"
          options={categoryOptions}
          value={formData.category || 'system'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFormChange('category', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Mensagem
        </label>
        <textarea
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition h-32 resize-none"
          value={formData.message || ''}
          onChange={(e) => onFormChange('message', e.target.value)}
          placeholder="Digite o conteúdo da notificação..."
        />
      </div>
    </div>
  );
}
