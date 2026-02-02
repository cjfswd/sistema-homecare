import { useState, useEffect } from 'react';
import { X, Pill, Search, CheckCircle2, Package, Info, AlertTriangle, Ban, Plus } from 'lucide-react';
import type { Professional, PrescriptionItem, PharmacyItem, PrescriptionItemType } from '@/types';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { professional: Professional; items: PrescriptionItem[] }) => void;
  currentUserRole: Professional['role'];
  professionals: Professional[];
  pharmacyItems: PharmacyItem[];
  patient: { allergies?: string[] };
}

export function PrescriptionModal({ 
    isOpen, 
    onClose, 
    onSave, 
    currentUserRole, 
    professionals, 
    pharmacyItems,
    patient,
}: PrescriptionModalProps) {
  const [newPrescItems, setNewPrescItems] = useState<Partial<PrescriptionItem>[]>([
    { type: 'medication', name: '', instruction: '', schedule: [], alerts: [] }
  ]);
  const [prescSearchIndex, setPrescSearchIndex] = useState<number | null>(null); 
  const [selectedPrescProfessional, setSelectedPrescProfessional] = useState<Professional | null>(null);
  const [prescProfSearchTerm, setPrescProfSearchTerm] = useState('');
  const [isPrescProfListOpen, setIsPrescProfListOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentUserAsProf = professionals.find(p => p.role === currentUserRole);
      if (currentUserAsProf) {
        setSelectedPrescProfessional(currentUserAsProf);
        setPrescProfSearchTerm(currentUserAsProf.name);
      }
    }
  }, [isOpen, currentUserRole, professionals]);

  const handleSelectMedication = (index: number, med: PharmacyItem) => {
    const updatedItems = [...newPrescItems];
    const alerts: string[] = [];

    const isAllergic = patient.allergies?.some(alg => 
        med.activeIngredient.toLowerCase().includes(alg.toLowerCase()) || 
        med.tradeName.toLowerCase().includes(alg.toLowerCase())
    );
    if (isAllergic) alerts.push('ALERGIA DETECTADA: Paciente alérgico a este princípio ativo.');

    if (med.stockQuantity === 0) {
        alerts.push('ESTOQUE ZERADO: Item indisponível na farmácia.');
    } else if (med.stockQuantity < med.minStock) {
        alerts.push(`ESTOQUE CRÍTICO: Restam apenas ${med.stockQuantity} ${med.unit}.`);
    }

    const isDuplicate = updatedItems.some((item, i) => i !== index && item.pharmacyId === med.id);
    if (isDuplicate) alerts.push('DUPLICIDADE: Item já inserido nesta prescrição.');

    updatedItems[index] = {
        ...updatedItems[index],
        name: `${med.tradeName} (${med.activeIngredient}) ${med.concentration}`,
        pharmacyId: med.id,
        form: med.form,
        unit: med.unit,
        dispensationStatus: 'pending',
        alerts: alerts
    };

    setNewPrescItems(updatedItems);
    setPrescSearchIndex(null);
  };

  const handleSave = () => {
    const validItems = newPrescItems.filter(i => i.name && i.instruction) as PrescriptionItem[];
    if (validItems.length === 0 || !selectedPrescProfessional) return;

    onSave({ professional: selectedPrescProfessional, items: validItems });
    setNewPrescItems([{ type: 'medication', name: '', instruction: '', schedule: [], alerts: [] }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Pill size={20} className="text-indigo-600"/> Nova Prescrição Médica</h2>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  Criando como: <span className="font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 capitalize">{currentUserRole}</span>
              </p>
          </div>
          <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
           <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-600 uppercase mb-2 block">Médico Responsável (Autor)</label>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    <input type="text" value={prescProfSearchTerm} onChange={(e) => { setPrescProfSearchTerm(e.target.value); setIsPrescProfListOpen(true); }} onFocus={() => setIsPrescProfListOpen(true)} onBlur={() => setTimeout(() => setIsPrescProfListOpen(false), 200)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" placeholder="Buscar médico..." />
                    {isPrescProfListOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {professionals.filter(p => p.name.toLowerCase().includes(prescProfSearchTerm.toLowerCase())).map(prof => (
                                <div key={prof.id} onClick={() => { setSelectedPrescProfessional(prof); setPrescProfSearchTerm(prof.name); }} className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm flex justify-between">
                                    <span>{prof.name}</span>
                                    <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 rounded-full">{prof.role}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

          <div className="space-y-4">
            {newPrescItems.map((item, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm relative group">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">Item {idx + 1}</span>
                    {newPrescItems.length > 1 && <button onClick={() => setNewPrescItems(newPrescItems.filter((_, i) => i !== idx))}><X size={16} className="text-slate-300 hover:text-red-500" /></button>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tipo</label>
                    <select 
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-indigo-500"
                      value={item.type}
                      onChange={e => {
                        const newItems = [...newPrescItems];
                        newItems[idx].type = e.target.value as PrescriptionItemType;
                        if (e.target.value !== 'medication') {
                            newItems[idx].pharmacyId = undefined;
                            newItems[idx].alerts = [];
                        }
                        setNewPrescItems(newItems);
                      }}
                    >
                      <option value="medication">Medicamento</option>
                      <option value="diet">Dieta/Nutrição</option>
                      <option value="care">Cuidado/Procedimento</option>
                    </select>
                  </div>

                  <div className="md:col-span-6 relative">
                     <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">
                         {item.type === 'medication' ? 'Medicamento (Busca na Farmácia)' : 'Descrição do Item'}
                     </label>
                     
                     {item.type === 'medication' || item.type === 'diet' ? (
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-slate-400"><Search size={14} /></div>
                            <input 
                                type="text" 
                                placeholder="Digite nome comercial ou princípio ativo..."
                                className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500 ${item.pharmacyId ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-medium' : 'bg-white border-slate-200'}`}
                                value={item.name}
                                onChange={(e) => {
                                    const updated = [...newPrescItems];
                                    updated[idx].name = e.target.value;
                                    if(!e.target.value) updated[idx].pharmacyId = undefined;
                                    setNewPrescItems(updated);
                                    setPrescSearchIndex(idx);
                                }}
                                onFocus={() => setPrescSearchIndex(idx)}
                            />
                            {item.pharmacyId && <div className="absolute right-3 top-2.5 text-indigo-500"><CheckCircle2 size={16} /></div>}
                            
                            {prescSearchIndex === idx && item.name && !item.pharmacyId && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {pharmacyItems.filter(med => 
                                        med.tradeName.toLowerCase().includes(item.name?.toLowerCase() || '') ||
                                        med.activeIngredient.toLowerCase().includes(item.name?.toLowerCase() || '')
                                    ).map(med => (
                                        <div key={med.id} onClick={() => handleSelectMedication(idx, med)} className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{med.tradeName} <span className="font-normal text-slate-500">({med.activeIngredient})</span></p>
                                                    <p className="text-xs text-slate-500">{med.concentration} • {med.form}</p>
                                                </div>
                                                <div className={`text-xs px-2 py-0.5 rounded font-bold ${med.stockQuantity === 0 ? 'bg-red-100 text-red-600' : med.stockQuantity < med.minStock ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {med.stockQuantity > 0 ? `${med.stockQuantity} ${med.unit}` : 'Sem Estoque'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                     ) : (
                         <input 
                            type="text" 
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                            placeholder="Ex: Mudança de decúbito"
                            value={item.name}
                            onChange={e => {
                                const updated = [...newPrescItems];
                                updated[idx].name = e.target.value;
                                setNewPrescItems(updated);
                            }}
                         />
                     )}
                  </div>

                  <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Qtd. Solicitada</label>
                      <div className="flex items-center">
                          <input 
                            type="number" 
                            className="w-full p-2 border border-slate-200 rounded-l-lg text-sm outline-none focus:border-indigo-500"
                            placeholder="0"
                            value={item.requestedQuantity || ''}
                            onChange={(e) => {
                                const updated = [...newPrescItems];
                                updated[idx].requestedQuantity = Number(e.target.value);
                                setNewPrescItems(updated);
                            }}
                          />
                          <div className="bg-slate-100 border-y border-r border-slate-200 p-2 rounded-r-lg text-xs text-slate-500 font-medium">
                              {item.unit || 'un'}
                          </div>
                      </div>
                  </div>

                  <div className="md:col-span-8">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Posologia / Instruções</label>
                      <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Ex: 1 comprimido via oral a cada 8 horas" value={item.instruction} onChange={e => { const u = [...newPrescItems]; u[idx].instruction = e.target.value; setNewPrescItems(u); }} />
                  </div>
                  <div className="md:col-span-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Horários</label>
                      <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono" placeholder="08:00 16:00 00:00" onChange={e => { const u = [...newPrescItems]; u[idx].schedule = e.target.value.split(' ').filter(t=>t.length===5); setNewPrescItems(u); }} />
                  </div>
                </div>

                {item.alerts && item.alerts.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {item.alerts.map((alert, i) => (
                            <div key={i} className={`text-xs p-2 rounded flex items-center gap-2 font-medium ${alert.includes('ALERGIA') ? 'bg-red-100 text-red-700 border border-red-200' : alert.includes('ESTOQUE ZERADO') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                {alert.includes('ALERGIA') ? <Ban size={14}/> : <AlertTriangle size={14}/>}
                                {alert}
                            </div>
                        ))}
                    </div>
                )}

                {item.pharmacyId && (
                    <div className="mt-2 flex gap-3">
                         <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
                            <Package size={10} />
                            Apresentação: <span className="font-semibold text-slate-600">{item.form}</span>
                         </div>
                         <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded">
                            <Info size={10} />
                            Unidade Padrão: <span className="font-semibold text-slate-600">{item.unit}</span>
                         </div>
                         <div className="flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-50 px-2 py-1 rounded ml-auto">
                            <CheckCircle2 size={10} />
                            Vinculado ao Estoque
                         </div>
                    </div>
                )}
              </div>
            ))}
            
            <button onClick={() => setNewPrescItems([...newPrescItems, { type: 'medication', name: '', instruction: '', schedule: [], alerts: [] }])} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition flex items-center justify-center gap-2"><Plus size={18} /> Adicionar Item</button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl">
           <button onClick={onClose} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancelar</button>
           <button onClick={handleSave} disabled={!selectedPrescProfessional} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed" title={!selectedPrescProfessional ? "Selecione o médico responsável" : ""}>Assinar e Solicitar</button>
        </div>
      </div>
    </div>
  );
}