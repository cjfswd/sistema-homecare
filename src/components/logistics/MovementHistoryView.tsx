import {
  Search,
  History,
  Truck,
  ArrowRightLeft,
  MapPin,
  Clock,
  XCircle,
  AlertOctagon,
  MessageSquare,
  FileWarning,
  Check,
  X,
} from 'lucide-react';
import type { Movement, StockLocation } from '@/types';
import { Pagination, usePagination } from '@/components/ui';

interface MovementHistoryViewProps {
  movements: Movement[];
  locations: StockLocation[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onProcessMovement: (movementId: string, action: 'approve' | 'reject') => void;
  onOpenLossModal: (movement: Movement) => void;
}

export function MovementHistoryView({
  movements,
  locations,
  searchTerm,
  onSearchTermChange,
  onProcessMovement,
  onOpenLossModal,
}: MovementHistoryViewProps) {
  const filteredMovements = movements.filter(mov => {
    const term = searchTerm.toLowerCase();
    const fromName = locations.find(l => l.id === mov.fromLocationId)?.name || 'Externo';
    const toName = locations.find(l => l.id === mov.toLocationId)?.name || '';
    const dateStr = new Date(mov.date).toLocaleDateString();
    const itemsStr = mov.items.map(i => i.itemName).join(' ');

    return (
      fromName.toLowerCase().includes(term) ||
      toName.toLowerCase().includes(term) ||
      mov.status.toLowerCase().includes(term) ||
      dateStr.includes(term) ||
      itemsStr.toLowerCase().includes(term)
    );
  });

  const movementsPage = usePagination(filteredMovements, 10);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'lost': return 'Extraviado';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar movimentações (status, locais, itens...)" 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>

      {filteredMovements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><History className="text-slate-400" size={32} /></div>
          <h3 className="text-lg font-medium text-slate-700">Nenhuma movimentação encontrada</h3>
          <p className="text-slate-500">{movements.length === 0 ? "Solicite uma transferência para começar." : "Tente refazer a busca."}</p>
        </div>
      ) : (
        <>
        {movementsPage.paginatedItems.map(mov => (
          <div key={mov.id} className={`p-5 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 md:items-start relative overflow-hidden transition-all ${
            mov.status === 'pending' ? 'bg-amber-50 border-amber-100' : 
            mov.status === 'rejected' ? 'bg-slate-50 border-slate-100 opacity-75' : 
            mov.status === 'lost' ? 'bg-purple-50 border-purple-100' : 'bg-white border-slate-200'
          }`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              mov.status === 'pending' ? 'bg-amber-400' :
              mov.status === 'approved' ? 'bg-emerald-500' :
              mov.status === 'lost' ? 'bg-purple-500' : 'bg-red-400'
            }`} />

            <div className={`p-3 rounded-lg shrink-0 w-fit ${
              mov.status === 'pending' ? 'bg-amber-200/50 text-amber-700' :
              mov.status === 'rejected' ? 'bg-slate-200 text-slate-500' : 
              mov.status === 'lost' ? 'bg-purple-200 text-purple-700' : 'bg-blue-50 text-blue-600'
            }`}>
              {mov.status === 'pending' ? <Clock size={24} /> : 
               mov.status === 'rejected' ? <XCircle size={24} /> : 
               mov.status === 'lost' ? <AlertOctagon size={24} /> : <Truck size={24} />}
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400">{new Date(mov.date).toLocaleDateString()} às {new Date(mov.date).toLocaleTimeString()}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  mov.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  mov.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                  mov.status === 'lost' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                }`}>
                  {getStatusLabel(mov.status)}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-slate-800 font-medium">
                <span className="text-slate-500 flex items-center gap-1"><MapPin size={14} /> {locations.find(l => l.id === mov.fromLocationId)?.name || 'Fornecedor Externo'}</span>
                <ArrowRightLeft size={16} className="text-slate-300 rotate-90 sm:rotate-0" />
                <span className="text-slate-800 flex items-center gap-1"><MapPin size={14} /> {locations.find(l => l.id === mov.toLocationId)?.name}</span>
              </div>

              {mov.observation && (
                <div className="bg-white/60 p-2 rounded border border-slate-100 text-xs text-slate-600 flex gap-2 items-start">
                  <MessageSquare size={14} className="mt-0.5 text-slate-400 shrink-0" />
                  <span className="italic">"{mov.observation}"</span>
                </div>
              )}

              {mov.status === 'lost' && mov.lossObservation && (
                <div className="bg-purple-100/50 p-2 rounded border border-purple-100 text-xs text-purple-800 flex gap-2 items-start mt-1">
                  <FileWarning size={14} className="mt-0.5 shrink-0" />
                  <span className="italic font-medium">Extravio: "{mov.lossObservation}"</span>
                </div>
              )}
            </div>

            <div className="md:w-1/3 bg-white/50 p-3 rounded-lg text-sm border border-slate-100/50">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Itens da Solicitação</p>
              <ul className="space-y-1">
                {mov.items.map((item, idx) => {
                  const lostInfo = mov.itemsLost?.find(lost => lost.itemId === item.itemId);
                  return (
                    <li key={idx} className="flex justify-between text-slate-600 border-b border-slate-200/50 last:border-0 pb-1 last:pb-0">
                      <span>{item.itemName}</span>
                      <div className="text-right">
                        <span className="font-bold block">{item.quantity}</span>
                        {lostInfo && (
                          <span className="text-[10px] text-purple-600 font-bold bg-purple-100 px-1 rounded block mt-0.5">
                            - {lostInfo.quantity} Perdido
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {mov.status === 'pending' && (
              <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-amber-200/50 pt-3 md:pt-0 md:pl-4">
                <button onClick={() => onProcessMovement(mov.id, 'approve')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-sm"><Check size={14} /> Aprovar</button>
                <button onClick={() => onProcessMovement(mov.id, 'reject')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition"><X size={14} /> Rejeitar</button>
              </div>
            )}

            {mov.status === 'approved' && (
              <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                <button 
                   onClick={() => onOpenLossModal(mov)}
                   className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-100 transition"
                   title="Reportar que os itens foram perdidos/extraviados"
                >
                  <AlertOctagon size={14} /> Reportar Extravio
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredMovements.length > 0 && (
          <Pagination
            currentPage={movementsPage.currentPage}
            totalPages={movementsPage.totalPages}
            totalItems={filteredMovements.length}
            itemsPerPage={movementsPage.itemsPerPage}
            onPageChange={movementsPage.handlePageChange}
            onItemsPerPageChange={movementsPage.handleItemsPerPageChange}
          />
        )}
        </>
      )}
    </div>
  );
}
