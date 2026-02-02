import type { RecordStatus, MovementStatus, PrescriptionStatus, BudgetStatus } from '../../types/common';
import { statusLabels, movementStatusLabels } from '../../lib/translations';

export interface StatusBadgeProps {
  status: RecordStatus | MovementStatus | PrescriptionStatus | BudgetStatus | boolean;
  variant?: 'default' | 'compact';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  // Handle boolean status (active/inactive)
  if (typeof status === 'boolean') {
    return status ? (
      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
        Ativo
      </span>
    ) : (
      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold uppercase">
        Inativo
      </span>
    );
  }

  // Color mapping for different statuses
  const colorMap: Record<string, string> = {
    // RecordStatus
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-500',
    vacation: 'bg-amber-100 text-amber-700',
    discharged: 'bg-blue-100 text-blue-700',
    deceased: 'bg-slate-100 text-slate-500',

    // MovementStatus
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    lost: 'bg-red-100 text-red-700',

    // PrescriptionStatus
    current: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-slate-100 text-slate-500',

    // BudgetStatus
    draft: 'bg-amber-100 text-amber-700',
    // approved: already defined in MovementStatus
    // rejected: already defined in MovementStatus
  };

  // Get label for display
  const getLabel = (status: string): string => {
    if (status in statusLabels) {
      return statusLabels[status as RecordStatus];
    }
    if (status in movementStatusLabels) {
      return movementStatusLabels[status as MovementStatus];
    }
    // Fallback for other statuses
    const labelMap: Record<string, string> = {
      current: 'Vigente',
      archived: 'Histórico',
      draft: 'Rascunho',
      approved: 'Aprovado',
      rejected: 'Rejeitado'
    };
    return labelMap[status] || status;
  };

  const colorClass = colorMap[status] || 'bg-slate-100 text-slate-500';
  const sizeClass = variant === 'compact' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`${colorClass} ${sizeClass} rounded font-bold uppercase`}>
      {getLabel(status)}
    </span>
  );
}
