// Types for schedule and check-in/check-out

export type ScheduleShiftType = 'morning' | 'afternoon' | 'night' | '12h' | '24h';
export type ScheduleStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

// Location data for check-in/check-out
export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

// Check-in or Check-out record
export interface CheckInOut {
  id: string;
  type: 'check_in' | 'check_out';
  scheduleEntryId: string;
  professionalId: string;
  professionalName: string;
  patientId: string;
  patientName: string;
  timestamp: Date;
  location?: GeoLocation;
  photoUrl?: string;
  notes?: string;
  registeredBy: string;
}

// Schedule Entry - a single shift/appointment
export interface ScheduleEntry {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  professionalRole: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  shiftType: ScheduleShiftType;
  status: ScheduleStatus;
  notes?: string;
  checkIn?: CheckInOut;
  checkOut?: CheckInOut;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}

// Patient's schedule configuration
export interface PatientScheduleConfig {
  patientId: string;
  defaultShiftDuration: number; // in hours
  requiredRoles: string[];
  weeklyTemplate?: WeeklyScheduleTemplate[];
}

// Template for recurring schedules
export interface WeeklyScheduleTemplate {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  shiftType: ScheduleShiftType;
  startTime: string;
  endTime: string;
  preferredProfessionalId?: string;
}

// Shift type labels for UI
export const shiftTypeLabels: Record<ScheduleShiftType, string> = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  night: 'Noite',
  '12h': 'Plantão 12h',
  '24h': 'Plantão 24h'
};

// Schedule status labels for UI
export const scheduleStatusLabels: Record<ScheduleStatus, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Não Compareceu'
};
