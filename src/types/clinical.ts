import type { ProfessionalRole, PrescriptionItemType, PrescriptionStatus } from './common';

export interface AttachedDocument {
  id: string;
  name: string;
  type: string;
  url?: string;
  size?: string;
}

export interface VitalSigns {
  pa_sistolica?: number;
  pa_diastolica?: number;
  temp?: number;
  fc?: number; // Heart Rate
  fr?: number; // Respiratory Rate
  sato2?: number;
  hgt?: number; // Glucose
  dor?: number; // Pain (0-10)
}

export type EvolutionType = 'routine' | 'occurrence' | 'admission';

export interface Evolution {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  professionalRole: ProfessionalRole;
  creatorId: string;
  creatorName: string;
  creatorRole: ProfessionalRole;
  createdAt: Date;
  performedAt: Date;
  content: string;
  vitals?: VitalSigns;
  type: EvolutionType;
  documents: AttachedDocument[];
}

export interface PharmacyItem {
  id: string;
  tradeName: string;
  activeIngredient: string;
  concentration: string;
  form: string;
  unit: string;
  stockQuantity: number;
  minStock: number;
  isControlled: boolean;
}

export interface PrescriptionItem {
  id: string;
  type: PrescriptionItemType;
  name: string;
  instruction: string;
  schedule: string[];
  pharmacyId?: string;
  requestedQuantity?: number;
  dispensationStatus?: 'pending' | 'dispensed' | 'partial' | 'unavailable';
  form?: string;
  unit?: string;
  lotNumber?: string;
  expirationDate?: Date;
  alerts?: string[];
  checkedAt?: Record<string, { time: string; userId: string }>;
}

export interface Prescription {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalRole: ProfessionalRole;
  creatorId: string;
  creatorName: string;
  creatorRole: ProfessionalRole;
  startDate: Date;
  endDate?: Date;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
}