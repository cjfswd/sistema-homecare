import { useState, useMemo } from 'react';
import {
  User,
  Plus,
  X,
  FileText,
  DollarSign,
  Check,
} from 'lucide-react';
import type { Budget, BudgetLineItem, PriceTable, Service } from '@/types';
import { Modal, Button } from '@/components/ui';
import { Input, Select } from '@/components/forms';
import { MOCK_SERVICES } from '@/lib/mockData';
import { formatCurrency } from '@/lib/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Budget) => void;
  tables: PriceTable[];
}

export function BudgetModal({ isOpen, onClose, onSave, tables }: BudgetModalProps) {
  const [newBudget, setNewBudget] = useState<Partial<Budget>>({
    patientName: '',
    tableId: '',
    items: [],
  });
  
  const handleAddItemToBudget = (serviceId: string) => {
    if (!newBudget.tableId) {
      alert("Selecione uma tabela de preço primeiro.");
      return;
    }

    const table = tables.find(t => t.id === newBudget.tableId);
    const priceInfo = table?.items.find(i => i.serviceId === serviceId);
    const unitPrice = priceInfo?.sellPrice || 0;

    const newItem: BudgetLineItem = {
      id: `item-${Date.now()}`,
      serviceId,
      quantity: 1,
      unitPrice,
      total: unitPrice
    };

    setNewBudget(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const updateBudgetItemQty = (itemId: string, qty: number) => {
    setNewBudget(prev => ({
      ...prev,
      items: prev.items?.map(item => 
        item.id === itemId ? { ...item, quantity: qty, total: qty * item.unitPrice } : item
      )
    }));
  };

  const removeBudgetItem = (itemId: string) => {
    setNewBudget(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== itemId)
    }));
  };

  const totalBudget = useMemo(() => {
    return newBudget.items?.reduce((acc, curr) => acc + curr.total, 0) || 0;
  }, [newBudget.items]);

  const handleSave = () => {
    if (!newBudget.patientName || !newBudget.tableId) return;

    const finalBudget: Budget = {
      id: `orc-${Date.now()}`,
      patientName: newBudget.patientName!,
      tableId: newBudget.tableId!,
      version: 1,
      type: 'original',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      items: newBudget.items || [],
      totalValue: totalBudget,
      totalCost: 0 // Simplified for now
    };

    onSave(finalBudget);
    onClose();
  };

  const handleClose = () => {
    setNewBudget({ patientName: '', tableId: '', items: [] });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo Orçamento (PAD)" size="xl">
      <div className="flex flex-col md:flex-row h-[70vh]">
        {/* Left: Config and Item Selection */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-100">
          <div className="space-y-4 mb-6">
            <Input
              label="Paciente"
              icon={User}
              placeholder="Buscar paciente..."
              value={newBudget.patientName}
              onChange={e => setNewBudget({...newBudget, patientName: e.target.value})}
            />
            <Select
              label="Tabela de Preço"
              value={newBudget.tableId}
              onChange={e => {
                if (newBudget.items && newBudget.items.length > 0) {
                  if (!confirm("Trocar a tabela recalculará ou removerá itens atuais. Continuar?")) return;
                  setNewBudget({...newBudget, tableId: e.target.value, items: []});
                } else {
                  setNewBudget({...newBudget, tableId: e.target.value});
                }
              }}
              options={[{ value: "", label: "Selecione uma tabela..."}, ...tables.map(t => ({ value: t.id, label: t.name }))]}
            />
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Adicionar Serviços</h3>
            <div className="space-y-2">
              {MOCK_SERVICES.map((service: Service) => {
                const table = tables.find(t => t.id === newBudget.tableId);
                const price = table?.items.find(i => i.serviceId === service.id)?.sellPrice;

                return (
                  <button 
                    key={service.id}
                    disabled={!newBudget.tableId}
                    onClick={() => handleAddItemToBudget(service.id)}
                    className="w-full flex justify-between items-center p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition group disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div>
                      <div className="font-medium text-slate-700 group-hover:text-emerald-700">{service.name}</div>
                      <div className="text-xs text-slate-400">{service.category}</div>
                    </div>
                    <div className="text-emerald-600 font-bold">
                      {newBudget.tableId ? (price ? formatCurrency(price) : 'N/A') : '--'}
                      <Plus size={16} className="inline ml-2" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Budget Summary */}
        <div className="w-full md:w-1/2 bg-slate-50 flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <FileText size={20} /> Resumo do PAD
             </h3>
             {(!newBudget.items || newBudget.items.length === 0) ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <DollarSign size={48} className="mb-2 opacity-20" />
                 <p>Nenhum item adicionado.</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {newBudget.items.map(item => {
                   const serviceName = MOCK_SERVICES.find(s => s.id === item.serviceId)?.name;
                   return (
                     <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                       <div className="flex-1">
                         <div className="font-medium text-slate-700 text-sm">{serviceName}</div>
                         <div className="text-xs text-slate-400">{formatCurrency(item.unitPrice)} un.</div>
                       </div>
                       <div className="flex items-center gap-3">
                         <Input 
                           type="number"
                           min="1"
                           className="w-16 p-1 text-center text-sm"
                           value={item.quantity}
                           onChange={e => updateBudgetItemQty(item.id, parseInt(e.target.value) || 0)}
                         />
                         <div className="w-24 text-right font-bold text-emerald-700 text-sm">
                           {formatCurrency(item.total)}
                         </div>
                         <Button variant="ghost" size="sm" onClick={() => removeBudgetItem(item.id)}>
                           <X size={16} />
                         </Button>
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
          <div className="p-6 bg-white border-t border-slate-200">
            <div className="flex justify-between items-end mb-4">
              <span className="text-slate-500 font-medium">Valor Total Estimado</span>
              <span className="text-3xl font-bold text-emerald-700">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={handleClose}>Cancelar</Button>
              <Button 
                variant="success" 
                fullWidth 
                onClick={handleSave} 
                disabled={totalBudget === 0} 
                icon={Check}
              >
                Finalizar Orçamento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
