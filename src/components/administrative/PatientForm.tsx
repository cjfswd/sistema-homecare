import React from 'react';
import { Input } from '@/components/forms';
import { MapPin } from 'lucide-react';
import type { Patient } from '@/types';

interface PatientFormProps {
  formData: Partial<Patient>;
  onFormChange: (field: string, value: any) => void;
  onAddressChange: (field: string, value: string) => void;
}

export function PatientForm({ formData, onFormChange, onAddressChange }: PatientFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Nome Completo"
            value={formData.name || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('name', e.target.value)}
          />
        </div>
        <Input
          label="CPF"
          value={formData.cpf || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('cpf', e.target.value)}
          placeholder="000.000.000-00"
        />
        <Input
          label="Data de Nascimento"
          type="date"
          value={formData.birthDate || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('birthDate', e.target.value)}
        />
        <div className="md:col-span-2">
          <Input
            label="Diagnóstico Principal (CID)"
            value={formData.diagnosis || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormChange('diagnosis', e.target.value)}
            placeholder="Ex: I64 - Acidente Vascular Cerebral"
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1">
            <MapPin size={14} /> Endereço
          </h4>
        </div>
        <Input
          label="CEP"
          value={formData.address?.zipCode || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAddressChange('zipCode', e.target.value)}
        />
        <div className="md:col-span-2">
          <Input
            label="Logradouro"
            value={formData.address?.street || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAddressChange('street', e.target.value)}
          />
        </div>
        <Input
          label="Número"
          value={formData.address?.number || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAddressChange('number', e.target.value)}
        />
        <Input
          label="Cidade"
          value={formData.address?.city || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAddressChange('city', e.target.value)}
        />
      </div>
    </div>
  );
}
