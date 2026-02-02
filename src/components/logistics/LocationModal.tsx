import { useState, useEffect } from 'react';
import { User, Building2, Truck, MapPin } from 'lucide-react';
import type { StockLocationType, Patient } from '@/types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (location: { name: string; type: StockLocationType; address: string; linkedEntityId?: string }) => void;
  patients: Patient[];
  companies: { id: string; name: string; address: string; }[];
}

export function LocationModal({ isOpen, onClose, onAddLocation, patients, companies }: LocationModalProps) {
  const [newLocType, setNewLocType] = useState<StockLocationType>('patient');
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState('');

  useEffect(() => {
    if (newLocType === 'patient' && selectedEntityId) {
      const pac = patients.find(p => p.id === selectedEntityId);
      if (pac) {
        setNewLocName(`Residência: ${pac.name}`);
        setNewLocAddress(`${pac.address.street}, ${pac.address.number}`);
      }
    } else if (newLocType === 'company' && selectedEntityId) {
      const emp = companies.find(e => e.id === selectedEntityId);
      if (emp) {
        setNewLocName(`Estoque: ${emp.name}`);
        setNewLocAddress(emp.address);
      }
    } else if (newLocType === 'vehicle') {
      setNewLocAddress('');
      setSelectedEntityId('');
    }
  }, [selectedEntityId, newLocType, patients, companies]);

  const resetLocationForm = () => {
    setNewLocName('');
    setNewLocAddress('');
    setNewLocType('patient');
    setSelectedEntityId('');
  };

  const handleAdd = () => {
    onAddLocation({
      name: newLocName,
      type: newLocType,
      address: newLocAddress,
      linkedEntityId: selectedEntityId || undefined,
    });
    resetLocationForm();
  };

  const handleClose = () => {
    resetLocationForm();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Cadastrar Novo Local</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Local</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                {id: 'patient', label: 'Paciente', icon: User}, 
                {id: 'company', label: 'Empresa', icon: Building2}, 
                {id: 'vehicle', label: 'Veículo', icon: Truck}
              ] as const).map(item => (
                <button key={item.id} onClick={() => { setNewLocType(item.id); setSelectedEntityId(''); setNewLocName(''); setNewLocAddress(''); }} className={`py-3 px-1 rounded-lg text-sm border flex flex-col items-center gap-1 transition-all ${newLocType === item.id ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}><item.icon size={18} />{item.label}</button>
              ))}
            </div>
          </div>
          {newLocType === 'patient' && <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 space-y-3"><label className="block text-xs font-bold text-emerald-800 uppercase">Selecionar Paciente</label><select className="w-full p-2 bg-white border border-emerald-200 rounded-md text-sm outline-none" value={selectedEntityId} onChange={(e) => setSelectedEntityId(e.target.value)}><option value="">Selecione na lista...</option>{patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>}
          {newLocType === 'company' && <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 space-y-3"><label className="block text-xs font-bold text-indigo-800 uppercase">Selecionar Empresa</label><select className="w-full p-2 bg-white border border-indigo-200 rounded-md text-sm outline-none" value={selectedEntityId} onChange={(e) => setSelectedEntityId(e.target.value)}><option value="">Selecione na lista...</option>{companies.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>}
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nome de Identificação</label><input type="text" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white" placeholder={newLocType === 'vehicle' ? "Ex: Ambulância UTI 02" : "Nome do local"} value={newLocName} onChange={e => setNewLocName(e.target.value)} /></div>
          {newLocType !== 'vehicle' && <div><label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label><div className="relative"><MapPin className="absolute left-3 top-3 text-slate-400" size={16} /><textarea className="w-full pl-9 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px] text-sm" placeholder="Rua, Número, Bairro, Cidade..." value={newLocAddress} onChange={e => setNewLocAddress(e.target.value)} /></div></div>}
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <button onClick={handleClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancelar</button>
          <button onClick={handleAdd} className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 disabled:opacity-50" disabled={!newLocName}>Salvar Local</button>
        </div>
      </div>
    </div>
  );
}
