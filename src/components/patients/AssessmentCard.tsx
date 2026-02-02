import { FileText, User, Calendar, ClipboardCheck, TrendingUp } from 'lucide-react';
import type { Assessment } from '@/types';
import { formatDateTime } from '@/lib/formatters';

interface AssessmentCardProps {
  assessment: Assessment;
  onClick?: () => void;
}

const levelColors: Record<string, string> = {
  AD1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  AD2: 'bg-amber-100 text-amber-700 border-amber-200',
  AD3: 'bg-rose-100 text-rose-700 border-rose-200'
};

const levelDescriptions: Record<string, string> = {
  AD1: 'Baixa Complexidade',
  AD2: 'Média Complexidade',
  AD3: 'Alta Complexidade'
};

export function AssessmentCard({ assessment, onClick }: AssessmentCardProps) {
  const isABEMID = assessment.type === 'ABEMID';

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-indigo-200' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isABEMID ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{assessment.type}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar size={12} />
              <span>{formatDateTime(new Date(assessment.performedAt))}</span>
            </div>
          </div>
        </div>

        {isABEMID && assessment.level ? (
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${levelColors[assessment.level]}`}>
            {assessment.level}
          </span>
        ) : (
          <div className="text-right">
            <div className="flex items-center gap-1 text-teal-600">
              <TrendingUp size={14} />
              <span className="text-lg font-bold">{assessment.score}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase">Pontos</span>
          </div>
        )}
      </div>

      {isABEMID && assessment.level && (
        <div className="mb-3 px-3 py-2 bg-slate-50 rounded-lg">
          <span className="text-xs text-slate-500">Classificação: </span>
          <span className="text-sm font-medium text-slate-700">{levelDescriptions[assessment.level]}</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
        <User size={14} className="text-slate-400" />
        <span>Avaliado por: <span className="font-medium">{assessment.performedByName}</span></span>
      </div>

      {assessment.notes && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <FileText size={12} className="mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2">{assessment.notes}</p>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
        <span>ID: {assessment.id}</span>
        <span className={`px-2 py-0.5 rounded-full ${assessment.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
          {assessment.status === 'completed' ? 'Concluída' : 'Rascunho'}
        </span>
      </div>
    </div>
  );
}
