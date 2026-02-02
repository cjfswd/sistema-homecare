import { User, Clock, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ScheduleEntry as ScheduleEntryType, ScheduleStatus } from '@/types';
import { shiftTypeLabels, scheduleStatusLabels } from '@/types/schedule';

interface ScheduleEntryProps {
  entry: ScheduleEntryType;
  onClick?: () => void;
  compact?: boolean;
}

const statusColors: Record<ScheduleStatus, string> = {
  scheduled: 'bg-slate-100 text-slate-600 border-slate-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-600 border-red-200',
  no_show: 'bg-rose-100 text-rose-700 border-rose-200'
};

const statusIcons: Record<ScheduleStatus, React.ReactNode> = {
  scheduled: <Clock size={14} />,
  confirmed: <CheckCircle2 size={14} />,
  in_progress: <AlertCircle size={14} />,
  completed: <CheckCircle2 size={14} />,
  cancelled: <XCircle size={14} />,
  no_show: <XCircle size={14} />
};

export function ScheduleEntry({ entry, onClick, compact = false }: ScheduleEntryProps) {
  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`px-2 py-1 rounded text-xs truncate cursor-pointer transition hover:opacity-80 ${statusColors[entry.status]}`}
        title={`${entry.professionalName} - ${entry.startTime} às ${entry.endTime}`}
      >
        <span className="font-medium">{entry.professionalName.split(' ')[0]}</span>
        <span className="ml-1 opacity-75">{entry.startTime}</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-indigo-200' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{entry.professionalName}</h4>
            <span className="text-xs text-slate-500 capitalize">{entry.professionalRole}</span>
          </div>
        </div>

        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[entry.status]}`}>
          {statusIcons[entry.status]}
          {scheduleStatusLabels[entry.status]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock size={14} className="text-slate-400" />
          <span>
            {entry.startTime} - {entry.endTime}
            <span className="ml-2 text-xs text-slate-400">({shiftTypeLabels[entry.shiftType]})</span>
          </span>
        </div>

        {entry.patientName && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={14} className="text-slate-400" />
            <span>{entry.patientName}</span>
          </div>
        )}
      </div>

      {/* Check-in/out status */}
      {(entry.checkIn || entry.checkOut) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex gap-4 text-xs">
          {entry.checkIn && (
            <div className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 size={12} />
              <span>Check-in: {new Date(entry.checkIn.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
          {entry.checkOut && (
            <div className="flex items-center gap-1 text-blue-600">
              <CheckCircle2 size={12} />
              <span>Check-out: {new Date(entry.checkOut.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
      )}

      {entry.notes && (
        <div className="mt-2 text-xs text-slate-500 italic">
          {entry.notes}
        </div>
      )}
    </div>
  );
}
