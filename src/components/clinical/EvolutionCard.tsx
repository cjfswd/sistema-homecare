import { User, ShieldCheck, Calendar, Paperclip, Activity, Thermometer, Droplets, Heart, UserCheck } from 'lucide-react';
import type { Evolution } from '@/types';
import { formatDateTime } from '@/lib/formatters';

interface EvolutionCardProps {
  evolution: Evolution;
}

export function EvolutionCard({ evolution: evo }: EvolutionCardProps) {
  const isDoctor = evo.professionalRole === 'doctor';
  const isAdmin = evo.professionalRole === 'admin';
  const roleColor = isDoctor ? 'bg-blue-100 text-blue-700' : isAdmin ? 'bg-slate-800 text-white' : 'bg-emerald-100 text-emerald-700';
  const isCreatedByOther = evo.creatorId !== evo.professionalId;

  const timeDiff = Math.abs(new Date(evo.createdAt).getTime() - new Date(evo.performedAt).getTime());
  const showDoubleDate = timeDiff > 60000;

  return (
    <div className="relative pl-8 pb-8 border-l-2 border-slate-200 last:border-0 last:pb-0">
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isDoctor ? 'bg-blue-500' : 'bg-emerald-500'}`} />
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleColor}`}>
              {isAdmin ? <ShieldCheck size={20} /> : <User size={20} />}
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{evo.professionalName}</h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-slate-500">
                <span className={`self-start px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${roleColor}`}>
                  {evo.professionalRole}
                </span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                    <Calendar size={12} /> {formatDateTime(new Date(evo.performedAt))}
                </span>
                {showDoubleDate && (
                   <span className="text-slate-400 text-[10px]" title={`Registrado em: ${formatDateTime(new Date(evo.createdAt))}`}>(Reg: {formatDateTime(new Date(evo.createdAt))})</span>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded border capitalize bg-slate-50 text-slate-500 border-slate-100">{evo.type}</span>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-line">{evo.content}</p>
        
        {evo.documents && evo.documents.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
                {evo.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-600">
                        <Paperclip size={14} className="text-slate-400" />
                        <span className="font-medium truncate max-w-[150px]">{doc.name}</span>
                        {doc.size && <span className="text-slate-300 text-[10px]">({doc.size})</span>}
                    </div>
                ))}
            </div>
        )}

        {evo.vitals && Object.keys(evo.vitals).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {evo.vitals.pa_sistolica && (
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-rose-500" />
                <span className="text-sm font-semibold text-slate-700">PA: {evo.vitals.pa_sistolica}x{evo.vitals.pa_diastolica}</span>
              </div>
            )}
            {evo.vitals.temp && (
              <div className="flex items-center gap-2">
                <Thermometer size={14} className="text-amber-500" />
                <span className="text-sm font-semibold text-slate-700">Temp: {evo.vitals.temp}°C</span>
              </div>
            )}
            {evo.vitals.sato2 && (
              <div className="flex items-center gap-2">
                <Droplets size={14} className="text-cyan-500" />
                <span className="text-sm font-semibold text-slate-700">Sat: {evo.vitals.sato2}%</span>
              </div>
            )}
            {evo.vitals.hgt && (
              <div className="flex items-center gap-2">
                <Droplets size={14} className="text-purple-500" />
                <span className="text-sm font-semibold text-slate-700">HGT: {evo.vitals.hgt}</span>
              </div>
            )}
            {evo.vitals.fc && (
              <div className="flex items-center gap-2">
                <Heart size={14} className="text-red-500" />
                <span className="text-sm font-semibold text-slate-700">FC: {evo.vitals.fc}</span>
              </div>
            )}
          </div>
        )}

        {isCreatedByOther && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                <UserCheck size={12} />
                Registered in the system by: <span className="font-semibold text-slate-500">{evo.creatorName}</span>
            </div>
        )}
      </div>
    </div>
  );
};
