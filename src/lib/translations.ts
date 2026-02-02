// Translation utilities for Portuguese/English migration
import type { RecordStatus, ProfessionalRole, MovementStatus } from '../types/common';

// Status translations (PT → EN)
const statusMap: Record<string, RecordStatus> = {
  'ativo': 'active',
  'inativo': 'inactive',
  'ferias': 'vacation',
  'alta': 'discharged',
  'obito': 'deceased'
};

const reverseStatusMap: Record<RecordStatus, string> = {
  'active': 'ativo',
  'inactive': 'inativo',
  'vacation': 'ferias',
  'discharged': 'alta',
  'deceased': 'obito'
};

// Role translations (PT → EN)
const roleMap: Record<string, ProfessionalRole> = {
  'medico': 'doctor',
  'enfermeiro': 'nurse',
  'tecnico': 'technician',
  'fisio': 'physiotherapist',
  'fono': 'speechTherapist',
  'admin': 'admin'
};

const reverseRoleMap: Record<ProfessionalRole, string> = {
  'doctor': 'medico',
  'nurse': 'enfermeiro',
  'technician': 'tecnico',
  'physiotherapist': 'fisio',
  'speechTherapist': 'fono',
  'admin': 'admin'
};

// Movement status translations (PT → EN)
const movementStatusMap: Record<string, MovementStatus> = {
  'concluido': 'completed',
  'pendente': 'pending',
  'aprovado': 'approved',
  'rejeitado': 'rejected',
  'extraviado': 'lost'
};

// Helper functions
export function translateStatus(portugueseStatus: string): RecordStatus {
  return statusMap[portugueseStatus] || 'active';
}

export function translateStatusToPortuguese(englishStatus: RecordStatus): string {
  return reverseStatusMap[englishStatus] || 'ativo';
}

export function translateRole(portugueseRole: string): ProfessionalRole {
  return roleMap[portugueseRole] || 'admin';
}

export function translateRoleToPortuguese(englishRole: ProfessionalRole): string {
  return reverseRoleMap[englishRole] || 'admin';
}

export function translateMovementStatus(portugueseStatus: string): MovementStatus {
  return movementStatusMap[portugueseStatus] || 'pending';
}

// Display labels in Portuguese (for UI) - internal values are in English
export const statusLabels: Record<RecordStatus, string> = {
  'active': 'Ativo',
  'inactive': 'Inativo',
  'vacation': 'Férias',
  'discharged': 'Alta',
  'deceased': 'Óbito'
};

export const roleLabels: Record<ProfessionalRole, string> = {
  'doctor': 'Médico',
  'nurse': 'Enfermeiro',
  'technician': 'Técnico',
  'physiotherapist': 'Fisioterapeuta',
  'speechTherapist': 'Fonoaudiólogo',
  'admin': 'Admin'
};

export const movementStatusLabels: Record<MovementStatus, string> = {
  'completed': 'Concluído',
  'pending': 'Pendente',
  'approved': 'Aprovado',
  'rejected': 'Rejeitado',
  'lost': 'Extraviado'
};
