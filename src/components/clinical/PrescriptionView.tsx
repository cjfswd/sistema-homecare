import { useState } from 'react';
import { CheckCircle2, History, Edit3, Archive, RotateCcw, Clock, Pill, Utensils, Heart, UserCheck } from 'lucide-react';
import type { Prescription, Professional, PrescriptionStatus } from '@/types';
import { Pagination, usePagination } from '@/components/ui';
import { formatDateTime } from '@/lib/formatters';

interface PrescriptionViewProps {
  prescriptions: Prescription[];
  currentUserRole: Professional['role'];
  onToggleCheckItem: (prescriptionId: string, itemId: string, time: string) => void;
  onArchive: (prescriptionId: string) => void;
  onUnarchive: (prescriptionId: string) => void;
  onNewPrescription: () => void;
}

export function PrescriptionView({
  prescriptions,
  currentUserRole,
  onToggleCheckItem,
  onArchive,
  onUnarchive,
  onNewPrescription,
}: PrescriptionViewProps) {
  const [filter, setFilter] = useState<PrescriptionStatus>('current');

  const filteredPrescriptions = prescriptions.filter(p => p.status === filter);
  const prescriptionsPage = usePagination(filteredPrescriptions, 5);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('current')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1 ${filter === 'current' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'}`}
          >
            <CheckCircle2 size={14} /> Vigente
          </button>
          <button 
             onClick={() => setFilter('archived')}
             className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1 ${filter === 'archived' ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'}`}
          >
             <History size={14} /> Arquivada
          </button>
        </div>
        {currentUserRole === 'doctor' && (
          <button onClick={onNewPrescription} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-200"><Edit3 size={16} /> Nova Prescrição</button>
        )}
      </div>

      {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
              <History className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-500 font-medium">Nenhum registro de prescrição {filter === 'current' ? 'vigente' : 'arquivada'} encontrado.</p>
          </div>
      ) : (
        <>
        {prescriptionsPage.paginatedItems.map(presc => (
          <div key={presc.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden mb-6 ${presc.status === 'archived' ? 'border-slate-200 opacity-80' : 'border-slate-200'}`}>
              <div className={`px-4 py-3 border-b flex justify-between items-center ${presc.status === 'archived' ? 'bg-slate-100 border-slate-200' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                  <h4 className="font-bold text-slate-700">{presc.status === 'current' ? 'Prescrição Vigente' : 'Prescrição Arquivada'}</h4>
                  <p className="text-xs text-slate-500">Início: {formatDateTime(new Date(presc.startDate))} {presc.endDate && `• Fim: ${formatDateTime(new Date(presc.endDate))}`} • {presc.professionalName}</p>
              </div>
              
              <div className="flex items-center gap-2">
                   {presc.creatorId !== presc.professionalId && (
                       <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 bg-white/50 px-2 py-1 rounded">
                           <UserCheck size={10} />
                           Reg: {presc.creatorName}
                       </div>
                   )}

                   <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${presc.status === 'current' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                      {presc.status === 'current' ? 'Ativa' : 'Encerrada'}
                  </div>
                  
                  {(currentUserRole === 'doctor' || currentUserRole === 'admin') && (
                      presc.status === 'current' ? (
                          <button onClick={() => onArchive(presc.id)} className="p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded transition" title="Arquivar Prescrição">
                              <Archive size={16} />
                          </button>
                      ) : (
                          <button onClick={() => onUnarchive(presc.id)} className="p-1.5 hover:bg-green-100 text-slate-400 hover:text-green-600 rounded transition" title="Reativar Prescrição">
                              <RotateCcw size={16} />
                          </button>
                      )
                  )}
              </div>
              </div>
              <div className="divide-y divide-slate-100">
              {presc.items.map(item => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                      <div className={`mt-1 p-2 rounded-lg ${presc.status === 'archived' ? 'bg-slate-100 text-slate-500' : item.type === 'medication' ? 'bg-blue-100 text-blue-600' : item.type === 'diet' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                      {item.type === 'medication' ? <Pill size={18} /> : item.type === 'diet' ? <Utensils size={18} /> : <Heart size={18} />}
                      </div>
                      <div className="flex-1">
                      <h5 className={`font-bold ${presc.status === 'archived' ? 'text-slate-600' : 'text-slate-800'}`}>{item.name}</h5>
                      <p className="text-sm text-slate-600 mb-3">{item.instruction}</p>
                      {presc.status === 'current' && (
                          <div className="flex flex-wrap gap-2">
                          {item.schedule.map(time => {
                              const isChecked = !!item.checkedAt?.[time];
                              return (
                              <button key={time} onClick={() => onToggleCheckItem(presc.id, item.id, time)} disabled={currentUserRole === 'doctor'} className={`px-3 py-1 rounded-md text-xs font-mono border transition-all flex items-center gap-1.5 ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'}`}>
                                  {isChecked ? <CheckCircle2 size={12} /> : <Clock size={12} />} {time}
                              </button>
                              );
                          })}
                          </div>
                      )}
                      </div>
                      {item.dispensationStatus && (
                          <div className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-500 font-bold uppercase tracking-wider border border-slate-200">
                              {item.dispensationStatus === 'pending' ? 'Aguardando Farmácia' : item.dispensationStatus === 'dispensed' ? 'Dispensado' : 'Indisponível'}
                          </div>
                      )}
                  </div>
                  </div>
              ))}
              </div>
          </div>
        ))}

        {filteredPrescriptions.length > 0 && (
          <Pagination
            currentPage={prescriptionsPage.currentPage}
            totalPages={prescriptionsPage.totalPages}
            totalItems={filteredPrescriptions.length}
            itemsPerPage={prescriptionsPage.itemsPerPage}
            onPageChange={prescriptionsPage.handlePageChange}
            onItemsPerPageChange={prescriptionsPage.handleItemsPerPageChange}
          />
        )}
        </>
      )}
    </div>
  );
}
