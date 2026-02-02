import { History, X, Search, User, Stethoscope } from 'lucide-react';
import type { Evolution } from '@/types';
import { EvolutionCard } from '@/components/clinical';
import { useState } from 'react';

interface ClinicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityType: 'patient' | 'professional';
  evolutions: Evolution[];
}

export function ClinicalHistoryModal({ 
  isOpen, 
  onClose, 
  entityName, 
  entityType,
  evolutions 
}: ClinicalHistoryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredEvolutions = evolutions.filter(evo => 
    evo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evo.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evo.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${entityType === 'patient' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {entityType === 'patient' ? <User size={24} /> : <Stethoscope size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Histórico de Evoluções
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {entityType === 'patient' ? 'Paciente' : 'Profissional'}: <span className="text-slate-700">{entityName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar no conteúdo das evoluções..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {filteredEvolutions.length === 0 ? (
            <div className="text-center py-12">
              <History className="mx-auto text-slate-300 mb-2" size={48} />
              <p className="text-slate-500 font-medium">Nenhuma evolução encontrada para este critério.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvolutions.map(evo => (
                <div key={evo.id} className="relative">
                   <EvolutionCard evolution={evo} />
                   {entityType === 'professional' && (
                     <div className="absolute top-4 right-4 text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100 uppercase">
                       Paciente: {evo.patientName}
                     </div>
                   )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end bg-white rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
