import type { RecordStatus, Address, Contact, ServiceCategory } from './common';

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  diagnosis: string;
  status: RecordStatus;
  address: Address;
  contacts: Contact[];
  allergies?: string[];
}

export interface Service {
  id: string;
  code: string;
  name: string;
  category: ServiceCategory;
  basePrice: number;
  active: boolean;
}
