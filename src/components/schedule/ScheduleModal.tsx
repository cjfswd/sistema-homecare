import { useState, useMemo } from 'react';
import { X, Search, User, Calendar, Clock, FileText, Save } from 'lucide-react';
import type { ScheduleEntry, ScheduleShiftType, Professional, Patient } from '@/types';
import { shiftTypeLabels } from '@/types/schedule';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<ScheduleEntry>) => void;
  professionals: Professional[];
  patients: Patient[];
  initialDate?: string;
  initialPatientId?: string;
  editEntry?: ScheduleEntry;
}

const shiftTimes: Record<ScheduleShiftType, { start: string; end: string }> = {
  morning: { start: '07:00', end: '13:00' },
  afternoon: { start: '13:00', end: '19:00' },
  night: { start: '19:00', end: '07:00' },
  '12h': { start: '07:00', end: '19:00' },
  '24h': { start: '07:00', end: '07:00' }
};

export function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  professionals,
  patients,
  initialDate,
  initialPatientId,
  editEntry
}: ScheduleModalProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(
    editEntry ? professionals.find(p => p.id === editEntry.professionalId) || null : null
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    editEntry
      ? patients.find(p => p.id === editEntry.patientId) || null
      : initialPatientId
        ? patients.find(p => p.id === initialPatientId) || null
        : null
  );
  const [profSearchTerm, setProfSearchTerm] = useState(editEntry?.professionalName || '');
  const [patientSearchTerm, setPatientSearchTerm] = useState(editEntry?.patientName || selectedPatient?.name || '');
  const [isProfListOpen, setIsProfListOpen] = useState(false);
  const [isPatientListOpen, setIsPatientListOpen] = useState(false);

  const [date, setDate] = useState(editEntry?.date || initialDate || new Date().toISOString().split('T')[0]);
  const [shiftType, setShiftType] = useState<ScheduleShiftType>(editEntry?.shiftType || 'morning');
  const [startTime, setStartTime] = useState(editEntry?.startTime || shiftTimes.morning.start);
  const [endTime, setEndTime] = useState(editEntry?.endTime || shiftTimes.morning.end);
  const [notes, setNotes] = useState(editEntry?.notes || '');

  // Filter healthcare professionals
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(p =>
      p.role !== 'admin' &&
      p.status === 'active' &&
      p.name.toLowerCase().includes(profSearchTerm.toLowerCase())
    );
  }, [professionals, profSearchTerm]);

  // Filter active patients
  const filteredPatients = useMemo(() => {
    return patients.filter(p =>
      p.status === 'active' &&
      p.name.toLowerCase().includes(patientSearchTerm.toLowerCase())
    );
  }, [patients, patientSearchTerm]);

  // Update times when shift type changes
  const handleShiftTypeChange = (type: ScheduleShiftType) => {
    setShiftType(type);
    setStartTime(shiftTimes[type].start);
    setEndTime(shiftTimes[type].end);
  };

  const handleSave = () => {
    if (!selectedProfessional || !selectedPatient || !date) return;

    const entry: Partial<ScheduleEntry> = {
      ...(editEntry ? { id: editEntry.id } : {}),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      professionalId: selectedProfessional.id,
      professionalName: selectedProfessional.name,
      professionalRole: selectedProfessional.role,
      date,
      startTime,
      endTime,
      shiftType,
      status: editEntry?.status || 'scheduled',
      notes: notes || undefined,
      createdAt: editEntry?.createdAt || new Date(),
      createdBy: 'prof-admin'
    };

    onSave(entry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {editEntry ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <User size={14} className="inline mr-2" />
                Paciente
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={patientSearchTerm}
                  onChange={(e) => { setPatientSearchTerm(e.target.value); setIsPatientListOpen(true); }}
                  onFocus={() => setIsPatientListOpen(true)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {isPatientListOpen && filteredPatients.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {filteredPatients.slice(0, 10).map(patient => (
                      <div
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPatientSearchTerm(patient.name);
                          setIsPatientListOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer"
                      >
                        <span className="font-medium text-slate-700">{patient.name}</span>
                        <span className="ml-2 text-xs text-slate-400">{patient.cpf}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Professional Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <User size={14} className="inline mr-2" />
                Profissional
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar profissional..."
                  value={profSearchTerm}
                  onChange={(e) => { setProfSearchTerm(e.target.value); setIsProfListOpen(true); }}
                  onFocus={() => setIsProfListOpen(true)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {isProfListOpen && filteredProfessionals.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {filteredProfessionals.slice(0, 10).map(prof => (
                      <div
                        key={prof.id}
                        onClick={() => {
                          setSelectedProfessional(prof);
                          setProfSearchTerm(prof.name);
                          setIsProfListOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex justify-between"
                      >
                        <span className="font-medium text-slate-700">{prof.name}</span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                          {prof.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date and Shift Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Calendar size={14} className="inline mr-2" />
                  Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Clock size={14} className="inline mr-2" />
                  Tipo de Plantão
                </label>
                <select
                  value={shiftType}
                  onChange={(e) => handleShiftTypeChange(e.target.value as ScheduleShiftType)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {Object.entries(shiftTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Início
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Término
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <FileText size={14} className="inline mr-2" />
                Observações (Opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações..."
                className="w-full h-20 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedProfessional || !selectedPatient || !date}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {editEntry ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
