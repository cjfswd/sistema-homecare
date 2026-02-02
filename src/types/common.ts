// Common types for the Homecare System

// Status types (English)
export type RecordStatus = 'active' | 'inactive' | 'vacation' | 'discharged' | 'deceased';
export type MovementStatus = 'completed' | 'pending' | 'approved' | 'rejected' | 'lost';
export type PrescriptionStatus = 'current' | 'archived';
export type BudgetStatus = 'draft' | 'approved' | 'rejected';

// Role types (English)
export type ProfessionalRole = 'doctor' | 'nurse' | 'technician' | 'physiotherapist' | 'speechTherapist' | 'admin';

// Location types
export type StockLocationType = 'company' | 'patient' | 'vehicle';

// Service types
export type ServiceCategory = 'procedure' | 'consultation' | 'shift' | 'rental';

// Item types
export type ItemCategory = 'medication' | 'supply' | 'equipment';
export type PrescriptionItemType = 'medication' | 'diet' | 'care';

// Address interface
export interface Address {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Contact interface
export interface Contact {
  name: string;
  phone: string;
  relation: string;
}

// Professional interface
export interface Professional {
  id: string;
  name: string;
  role: ProfessionalRole;
  councilNumber: string;
  status: RecordStatus;
  phone: string;
  email: string;
}
