import { MapPin, User, Camera, FileText, LogIn, LogOut } from 'lucide-react';
import type { CheckInOut } from '@/types';

interface CheckInOutCardProps {
  check: CheckInOut;
  onClick?: () => void;
}

export function CheckInOutCard({ check, onClick }: CheckInOutCardProps) {
  const isCheckIn = check.type === 'check_in';
  const time = new Date(check.timestamp);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCheckIn ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {isCheckIn ? <LogIn size={20} /> : <LogOut size={20} />}
          </div>
          <div>
            <h4 className="font-bold text-slate-800">
              {isCheckIn ? 'Check-in' : 'Check-out'}
            </h4>
            <span className="text-xs text-slate-500">
              {time.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-lg font-bold ${isCheckIn ? 'text-emerald-600' : 'text-blue-600'}`}>
            {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User size={14} className="text-slate-400" />
          <span>Paciente: <span className="font-medium">{check.patientName}</span></span>
        </div>

        {check.location && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={14} className="text-slate-400" />
            <span className="truncate">{check.location.address || 'Localização registrada'}</span>
          </div>
        )}

        {check.photoUrl && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Camera size={14} className="text-slate-400" />
            <span className="text-indigo-600 hover:underline">Ver foto</span>
          </div>
        )}

        {check.notes && (
          <div className="flex items-start gap-2 text-sm text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <FileText size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="italic">{check.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
        ID: {check.id}
      </div>
    </div>
  );
}
