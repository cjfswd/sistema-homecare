import { useState, useEffect } from 'react';
import { X, AlertOctagon, Maximize2, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Movement } from '@/types';

interface LossReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: Movement;
  onConfirm: (lossInfo: { movementId: string; lossObservation: string; itemsLost: { itemId: string; quantity: number }[] }) => void;
}

export function LossReportModal({ isOpen, onClose, movement, onConfirm }: LossReportModalProps) {
  const [lossQuantities, setLossQuantities] = useState<Record<string, number>>({});
  const [lossObs, setLossObs] = useState('');

  useEffect(() => {
    if (movement) {
      const initialLoss: Record<string, number> = {};
      movement.items.forEach(i => initialLoss[i.itemId] = 0);
      setLossQuantities(initialLoss);
    }
  }, [movement]);

  const handleSetAllLost = () => {
    const newLoss: Record<string, number> = {};
    movement.items.forEach(i => newLoss[i.itemId] = i.quantity);
    setLossQuantities(newLoss);
  };

  const handleSetAllReceived = () => {
    const newLoss: Record<string, number> = {};
    movement.items.forEach(i => newLoss[i.itemId] = 0);
    setLossQuantities(newLoss);
  };

  const handleSetItemMaxLoss = (itemId: string, maxQty: number) => {
    setLossQuantities(prev => ({ ...prev, [itemId]: maxQty }));
  };

  const handleSetItemReceived = (itemId: string) => {
    setLossQuantities(prev => ({ ...prev, [itemId]: 0 }));
  };

  const handleConfirm = () => {
    const itemsLost = Object.entries(lossQuantities)
      .map(([itemId, quantity]) => ({ itemId, quantity }))
      .filter(item => item.quantity > 0);

    onConfirm({
      movementId: movement.id,
      lossObservation: lossObs,
      itemsLost,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-purple-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
            <AlertOctagon size={20} />
            Reportar Extravio de Material
          </h2>
          <button onClick={onClose} className="text-purple-800/50 hover:text-purple-800">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="bg-purple-50 p-4 rounded-lg mb-6 text-sm text-purple-800 border border-purple-100 flex flex-col gap-2">
            <p>Indique abaixo a quantidade de itens que <strong>não foram recebidos</strong> no destino. Estes itens serão baixados do estoque.</p>
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={handleSetAllLost}
                className="self-start text-xs bg-purple-200 text-purple-800 px-3 py-1.5 rounded font-bold hover:bg-purple-300 transition flex items-center gap-1"
              >
                <Maximize2 size={12} /> Extraviar Tudo (Perda Total)
              </button>
              <button 
                onClick={handleSetAllReceived}
                className="self-start text-xs bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded font-bold hover:bg-emerald-300 transition flex items-center gap-1"
              >
                <CheckCircle2 size={12} /> Receber Tudo (Sem Perdas)
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-100 pb-2">
              <div className="col-span-5">Item</div>
              <div className="col-span-2 text-center">Enviado</div>
              <div className="col-span-3 text-center text-purple-600">Extraviado</div>
              <div className="col-span-2 text-center text-emerald-600">Recebido</div>
            </div>

            {movement.items.map(item => {
              const lostQty = lossQuantities[item.itemId] || 0;
              const receivedQty = item.quantity - lostQty;
              
              return (
                <div key={item.itemId} className="grid grid-cols-12 gap-2 items-center text-sm">
                  <div className="col-span-5 font-medium text-slate-700 truncate" title={item.itemName}>
                    {item.itemName}
                  </div>
                  <div className="col-span-2 text-center font-bold text-slate-500 bg-slate-50 py-1 rounded">
                    {item.quantity}
                  </div>
                  <div className="col-span-3 flex items-center gap-1">
                    <input 
                      type="number" 
                      min="0" 
                      max={item.quantity}
                      className="w-full text-center py-1 border border-purple-200 rounded text-purple-700 font-bold outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                      value={lostQty}
                      onChange={(e) => {
                        let val = parseInt(e.target.value) || 0;
                        if (val < 0) val = 0;
                        if (val > item.quantity) val = item.quantity;
                        setLossQuantities(prev => ({ ...prev, [item.itemId]: val }));
                      }}
                    />
                     <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => handleSetItemMaxLoss(item.itemId, item.quantity)}
                          className="p-1 text-purple-400 hover:text-purple-700 hover:bg-purple-100 rounded"
                          title="Perda Total deste item"
                        >
                          <Maximize2 size={10} />
                        </button>
                        <button 
                          onClick={() => handleSetItemReceived(item.itemId)}
                          className="p-1 text-emerald-400 hover:text-emerald-700 hover:bg-emerald-100 rounded"
                          title="Recebimento Total deste item"
                        >
                          <CheckCircle2 size={10} />
                        </button>
                     </div>
                  </div>
                  <div className="col-span-2 text-center font-bold text-emerald-700 bg-emerald-50 py-1 rounded border border-emerald-100">
                    {receivedQty}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Observações do Incidente</label>
            <textarea 
              className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-purple-500 text-sm min-h-[80px]"
              placeholder="Descreva o que aconteceu (ex: material danificado no transporte, pacote perdido...)"
              value={lossObs}
              onChange={(e) => setLossObs(e.target.value)}
            />
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancelar</button>
          <button 
            onClick={handleConfirm} 
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-lg shadow-purple-200 flex items-center gap-2"
          >
            <AlertTriangle size={16} /> Confirmar Extravio
          </button>
        </div>
      </div>
    </div>
  );
}
