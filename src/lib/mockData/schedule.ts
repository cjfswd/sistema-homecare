import type { ScheduleEntry, CheckInOut, ScheduleShiftType, ScheduleStatus } from '@/types';
import { MOCK_PATIENTS } from './patients';
import { MOCK_PROFESSIONALS } from './professionals';

const shiftTypes: ScheduleShiftType[] = ['morning', 'afternoon', 'night', '12h', '24h'];

// Shift time configurations
const shiftTimes: Record<ScheduleShiftType, { start: string; end: string }> = {
  morning: { start: '07:00', end: '13:00' },
  afternoon: { start: '13:00', end: '19:00' },
  night: { start: '19:00', end: '07:00' },
  '12h': { start: '07:00', end: '19:00' },
  '24h': { start: '07:00', end: '07:00' }
};

// Get only healthcare professionals (not admin)
const healthcareProfessionals = MOCK_PROFESSIONALS.filter(p =>
  p.role !== 'admin' && p.status === 'active'
);

// Get only active patients
const activePatients = MOCK_PATIENTS.filter(p => p.status === 'active').slice(0, 50);

// Generate schedule entries for the past 30 days and next 30 days
export const MOCK_SCHEDULE: ScheduleEntry[] = [];
export const MOCK_CHECK_IN_OUTS: CheckInOut[] = [];

let scheduleId = 1;
let checkId = 1;

// Generate schedule for each active patient
activePatients.forEach((patient, patientIndex) => {
  // Each patient has 2-4 assigned professionals
  const assignedProfessionals = healthcareProfessionals.slice(
    (patientIndex * 3) % healthcareProfessionals.length,
    ((patientIndex * 3) % healthcareProfessionals.length) + 3
  );

  // Generate 60 days of schedule entries (30 past, 30 future)
  for (let dayOffset = -30; dayOffset <= 30; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    // 1-2 shifts per day
    const shiftsPerDay = (patientIndex + dayOffset) % 3 === 0 ? 2 : 1;

    for (let shiftNum = 0; shiftNum < shiftsPerDay; shiftNum++) {
      const professional = assignedProfessionals[(dayOffset + shiftNum) % assignedProfessionals.length];
      if (!professional) continue;

      const shiftType = shiftTypes[((patientIndex + dayOffset + shiftNum) % shiftTypes.length + shiftTypes.length) % shiftTypes.length];
      const times = shiftTimes[shiftType];

      // Determine status based on date
      let status: ScheduleStatus;
      if (dayOffset < -1) {
        // Past entries - mostly completed
        status = (dayOffset + patientIndex) % 10 === 0 ? 'no_show' :
                 (dayOffset + patientIndex) % 15 === 0 ? 'cancelled' : 'completed';
      } else if (dayOffset === 0) {
        status = shiftNum === 0 ? 'in_progress' : 'confirmed';
      } else if (dayOffset === 1) {
        status = 'confirmed';
      } else {
        status = 'scheduled';
      }

      const entry: ScheduleEntry = {
        id: `sched-${scheduleId++}`,
        patientId: patient.id,
        patientName: patient.name,
        professionalId: professional.id,
        professionalName: professional.name,
        professionalRole: professional.role,
        date: dateStr,
        startTime: times.start,
        endTime: times.end,
        shiftType,
        status,
        createdAt: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000), // Created 7 days before
        createdBy: 'prof-admin',
        notes: (scheduleId % 10 === 0) ? 'Paciente requer atenção especial' : undefined
      };

      // Add check-in/check-out for past completed entries and current in_progress
      if (status === 'completed' || status === 'in_progress') {
        const checkInTime = new Date(`${dateStr}T${times.start}:00`);
        // Add some variance to check-in time (-10 to +10 minutes)
        checkInTime.setMinutes(checkInTime.getMinutes() + ((scheduleId % 21) - 10));

        const checkIn: CheckInOut = {
          id: `check-${checkId++}`,
          type: 'check_in',
          scheduleEntryId: entry.id,
          professionalId: professional.id,
          professionalName: professional.name,
          patientId: patient.id,
          patientName: patient.name,
          timestamp: checkInTime,
          registeredBy: professional.id,
          notes: scheduleId % 5 === 0 ? 'Chegada no horário' : undefined,
          location: scheduleId % 3 === 0 ? {
            latitude: -23.5505 + (Math.random() * 0.1),
            longitude: -46.6333 + (Math.random() * 0.1),
            address: patient.address.street + ', ' + patient.address.number
          } : undefined
        };
        entry.checkIn = checkIn;
        MOCK_CHECK_IN_OUTS.push(checkIn);

        // Add check-out for completed entries
        if (status === 'completed') {
          const checkOutTime = new Date(`${dateStr}T${times.end}:00`);
          // Handle overnight shifts
          if (times.end < times.start) {
            checkOutTime.setDate(checkOutTime.getDate() + 1);
          }
          // Add some variance
          checkOutTime.setMinutes(checkOutTime.getMinutes() + ((scheduleId % 31) - 15));

          const checkOut: CheckInOut = {
            id: `check-${checkId++}`,
            type: 'check_out',
            scheduleEntryId: entry.id,
            professionalId: professional.id,
            professionalName: professional.name,
            patientId: patient.id,
            patientName: patient.name,
            timestamp: checkOutTime,
            registeredBy: professional.id,
            location: checkIn.location
          };
          entry.checkOut = checkOut;
          MOCK_CHECK_IN_OUTS.push(checkOut);
        }
      }

      MOCK_SCHEDULE.push(entry);
    }
  }
});

// Helper function to get schedule entries by patient
export function getScheduleByPatient(patientId: string): ScheduleEntry[] {
  return MOCK_SCHEDULE.filter(entry => entry.patientId === patientId);
}

// Helper function to get schedule entries by professional
export function getScheduleByProfessional(professionalId: string): ScheduleEntry[] {
  return MOCK_SCHEDULE.filter(entry => entry.professionalId === professionalId);
}

// Helper function to get check-ins/outs by professional
export function getCheckInOutsByProfessional(professionalId: string): CheckInOut[] {
  return MOCK_CHECK_IN_OUTS.filter(check => check.professionalId === professionalId);
}

// Helper function to get professionals working with a patient
export function getProfessionalsForPatient(patientId: string): string[] {
  const professionalIds = new Set<string>();
  MOCK_SCHEDULE
    .filter(entry => entry.patientId === patientId)
    .forEach(entry => professionalIds.add(entry.professionalId));
  return Array.from(professionalIds);
}

// Helper function to get patients worked by a professional
export function getPatientsForProfessional(professionalId: string): string[] {
  const patientIds = new Set<string>();
  MOCK_SCHEDULE
    .filter(entry => entry.professionalId === professionalId)
    .forEach(entry => patientIds.add(entry.patientId));
  return Array.from(patientIds);
}
