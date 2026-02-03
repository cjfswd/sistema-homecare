import { useState } from 'react';
import { CalendarDays, List, Plus } from 'lucide-react';
import type { ScheduleEntry, Professional, Patient } from '@/types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { ScheduleModal } from './ScheduleModal';

interface ScheduleCalendarProps {
  entries: ScheduleEntry[];
  professionals: Professional[];
  patients: Patient[];
  onEntryClick?: (entry: ScheduleEntry) => void;
  onSaveEntry?: (entry: Partial<ScheduleEntry>) => void;
  patientId?: string;
  showNewButton?: boolean;
}

type ViewMode = 'month' | 'week';

export function ScheduleCalendar({
  entries,
  professionals,
  patients,
  onEntryClick,
  onSaveEntry,
  patientId,
  showNewButton = true
}: ScheduleCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [editEntry, setEditEntry] = useState<ScheduleEntry | undefined>();

  const handleEntryClick = (entry: ScheduleEntry) => {
    if (onEntryClick) {
      onEntryClick(entry);
    } else {
      setEditEntry(entry);
      setIsModalOpen(true);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setEditEntry(undefined);
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setEditEntry(undefined);
    setIsModalOpen(true);
  };

  const handleSaveEntry = (entry: Partial<ScheduleEntry>) => {
    if (onSaveEntry) {
      onSaveEntry(entry);
    }
    setIsModalOpen(false);
    setEditEntry(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('month')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === 'month'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CalendarDays size={16} />
            Mês
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === 'week'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List size={16} />
            Semana
          </button>
        </div>

        {showNewButton && onSaveEntry && (
          <button
            onClick={handleNewClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Novo Agendamento</span>
          </button>
        )}
      </div>

      {/* Calendar View */}
      {viewMode === 'month' ? (
        <MonthView
          entries={entries}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onEntryClick={handleEntryClick}
          onDayClick={onSaveEntry ? handleDayClick : undefined}
        />
      ) : (
        <WeekView
          entries={entries}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onEntryClick={handleEntryClick}
        />
      )}

      {/* Schedule Modal */}
      {isModalOpen && onSaveEntry && (
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditEntry(undefined); }}
          onSave={handleSaveEntry}
          professionals={professionals}
          patients={patients}
          initialDate={selectedDate}
          initialPatientId={patientId}
          editEntry={editEntry}
        />
      )}
    </div>
  );
}
