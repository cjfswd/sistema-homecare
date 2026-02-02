import { useState, useRef, useEffect } from 'react';
import { X, Search, FileText, Activity, Paperclip, UploadCloud, File, Trash2 } from 'lucide-react';
import type { Evolution, Professional, VitalSigns, AttachedDocument } from '@/types';
import { toLocalISOString } from '@/lib/formatters';
import { VitalSignInput } from './VitalSignInput';
import { Heart, Thermometer, Droplets } from 'lucide-react';

interface EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evolution: Partial<Evolution>) => void;
  currentUserRole: Professional['role'];
  professionals: Professional[];
}

export function EvolutionModal({ isOpen, onClose, onSave, currentUserRole, professionals }: EvolutionModalProps) {
  const [newEvoText, setNewEvoText] = useState('');
  const [newVitals, setNewVitals] = useState<VitalSigns>({});
  const [newEvoType, setNewEvoType] = useState<Evolution['type']>('routine');
  const [newEvoPerformedAt, setNewEvoPerformedAt] = useState<string>(toLocalISOString(new Date()));
  const [newDocuments, setNewDocuments] = useState<AttachedDocument[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [profSearchTerm, setProfSearchTerm] = useState('');
  const [isProfListOpen, setIsProfListOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      const currentUserAsProf = professionals.find(p => p.role === currentUserRole);
      if (currentUserAsProf) {
        setSelectedProfessional(currentUserAsProf);
        setProfSearchTerm(currentUserAsProf.name);
      }
      setNewEvoPerformedAt(toLocalISOString(new Date()));
    }
  }, [isOpen, currentUserRole, professionals]);

  const handleSave = () => {
    onSave({
      professionalId: selectedProfessional?.id,
      professionalName: selectedProfessional?.name,
      professionalRole: selectedProfessional?.role,
      performedAt: new Date(newEvoPerformedAt),
      type: newEvoType,
      content: newEvoText,
      vitals: newVitals,
      documents: newDocuments,
    });
    setNewEvoText('');
    setNewVitals({});
    setNewDocuments([]);
  };

  const addFiles = (files: File[]) => {
      const newDocs = files.map(file => ({
          id: `doc-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }));
      setNewDocuments(prev => [...prev, ...newDocs]);
  };

  const removeDocument = (id: string) => {
    setNewDocuments(newDocuments.filter(d => d.id !== id));
  };
  
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Nova Evolução</h2>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  Registrando como: <span className="font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 capitalize">{currentUserRole}</span>
              </p>
            </div>
            <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
            <div className="relative">
                <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Profissional Responsável</label>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    <input type="text" value={profSearchTerm} onChange={(e) => { setProfSearchTerm(e.target.value); setIsProfListOpen(true); }} onFocus={() => setIsProfListOpen(true)} onBlur={() => setTimeout(() => setIsProfListOpen(false), 200)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" placeholder="Buscar..." />
                    {isProfListOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {professionals.filter(p => p.name.toLowerCase().includes(profSearchTerm.toLowerCase())).map(prof => (
                                <div key={prof.id} onClick={() => { setSelectedProfessional(prof); setProfSearchTerm(prof.name); }} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between">
                                    <span>{prof.name}</span>
                                    <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 rounded-full">{prof.role}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Tipo de Evolução</label>
                  <select value={newEvoType} onChange={(e) => setNewEvoType(e.target.value as any)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm">
                      <option value="routine">Rotina Diária</option>
                      <option value="occurrence">Intercorrência</option>
                      <option value="admission">Admissão</option>
                  </select>
              </div>
              <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Data da Realização</label>
                  <input type="datetime-local" value={newEvoPerformedAt} onChange={(e) => setNewEvoPerformedAt(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono text-sm" />
              </div>
            </div>

            <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Activity size={16} /> Sinais Vitais</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <VitalSignInput icon={Activity} label="PAS" unit="mmHg" value={newVitals.pa_sistolica} onChange={(v) => setNewVitals({...newVitals, pa_sistolica: v})} color="text-rose-500" />
                    <VitalSignInput icon={Activity} label="PAD" unit="mmHg" value={newVitals.pa_diastolica} onChange={(v) => setNewVitals({...newVitals, pa_diastolica: v})} color="text-rose-500" />
                    <VitalSignInput icon={Thermometer} label="Temp" unit="°C" value={newVitals.temp} onChange={(v) => setNewVitals({...newVitals, temp: v})} color="text-amber-500" />
                    <VitalSignInput icon={Droplets} label="SatO2" unit="%" value={newVitals.sato2} onChange={(v) => setNewVitals({...newVitals, sato2: v})} color="text-cyan-500" />
                    <VitalSignInput icon={Heart} label="FC" unit="bpm" value={newVitals.fc} onChange={(v) => setNewVitals({...newVitals, fc: v})} color="text-red-500" />
                    <VitalSignInput icon={Droplets} label="HGT" unit="mg/dL" value={newVitals.hgt} onChange={(v) => setNewVitals({...newVitals, hgt: v})} color="text-purple-500" />
                </div>
            </div>

            <div>
               <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><FileText size={16} /> Descrição</h4>
               <textarea value={newEvoText} onChange={(e) => setNewEvoText(e.target.value)} className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none" placeholder="Descreva o estado do paciente..." />
            </div>
            
            <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><Paperclip size={16} /> Anexos</h4>
                <div 
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadCloud className={`mb-3 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} size={32} />
                    <p className="text-sm text-slate-700 font-medium">
                        <span className="text-blue-600 hover:underline">Clique para enviar</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PDF, Imagens ou Documentos (Max. 10MB)</p>
                    <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                </div>
                {newDocuments.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {newDocuments.map(d => (
                            <div key={d.id} className="text-xs flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded border border-slate-100"><File size={16} className="text-blue-500"/></div>
                                    <div>
                                        <p className="font-medium text-slate-700">{d.name}</p>
                                        <p className="text-slate-400">{d.size || 'N/A'}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeDocument(d.id)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2 text-slate-600 font-medium">Cancelar</button>
            <button onClick={handleSave} disabled={!newEvoText || !selectedProfessional} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">Salvar</button>
        </div>
      </div>
    </div>
  );
}