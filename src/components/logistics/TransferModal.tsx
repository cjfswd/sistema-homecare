import { useState, useMemo } from 'react';
import { X, ArrowRightLeft, Plus, MapPin, Box } from 'lucide-react';
import type { StockLocation, Item, StockEntry } from '@/types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: StockLocation[];
  items: Item[];
  stock: StockEntry[];
  onTransferRequest: (transfer: {
    origin: string;
    dest: string;
    obs: string;
    items: { itemId: string; quantity: number }[];
  }) => void;
}

export function TransferModal({ isOpen, onClose, locations, items, stock, onTransferRequest }: TransferModalProps) {
  const [transferOrigin, setTransferOrigin] = useState<string>('loc-1');
  const [transferDest, setTransferDest] = useState<string>('');
  const [transferObs, setTransferObs] = useState<string>('');
  const [transferItems, setTransferItems] = useState<{ itemId: string; quantity: number }[]>([
    { itemId: '', quantity: 1 },
  ]);

  const getQty = (locId: string, itemId: string) => {
    return stock.find(s => s.locationId === locId && s.itemId === itemId)?.quantity || 0;
  };

  const originStockList = useMemo(() => {
    return stock
      .filter(s => s.locationId === transferOrigin && s.quantity > 0)
      .map(s => {
        const item = items.find(i => i.id === s.itemId);
        return { ...s, itemName: item?.name, unit: item?.unit };
      });
  }, [stock, transferOrigin, items]);

  const destStockList = useMemo(() => {
    if (!transferDest) return [];
    return stock
      .filter(s => s.locationId === transferDest && s.quantity > 0)
      .map(s => {
        const item = items.find(i => i.id === s.itemId);
        return { ...s, itemName: item?.name, unit: item?.unit };
      });
  }, [stock, transferDest, items]);

  const handleMoveAll = () => {
    if (originStockList.length === 0) return;
    const allItems = originStockList.map(s => ({ itemId: s.itemId, quantity: s.quantity }));
    setTransferItems(allItems);
  };

  const handleRequest = () => {
    onTransferRequest({
      origin: transferOrigin,
      dest: transferDest,
      obs: transferObs,
      items: transferItems,
    });
    // Reset state locally or expect parent to close and unmount
    setTransferItems([{ itemId: '', quantity: 1 }]);
    setTransferObs('');
    setTransferDest('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-amber-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2"><ArrowRightLeft size={20} /> Solicitar Movimentação</h2>
          <button onClick={onClose} className="text-amber-800/50 hover:text-amber-800"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {/* Seleção Origem/Destino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Origem</label><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500" value={transferOrigin} onChange={e => setTransferOrigin(e.target.value)}>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Destino</label><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500" value={transferDest} onChange={e => setTransferDest(e.target.value)}><option value="">Selecione o destino...</option>{locations.filter(l => l.id !== transferOrigin).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
          </div>
          {/* Visualização de Estoques */}
          {transferOrigin && transferDest && (
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2"><h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Box size={12} /> Na Origem</h4><button onClick={handleMoveAll} className="text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded font-bold transition flex items-center gap-1"><ArrowRightLeft size={10} /> Mover Tudo</button></div>
                  <div className="max-h-[150px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">{originStockList.length > 0 ? originStockList.map(s => <div key={s.itemId} className="flex justify-between items-center text-xs p-1.5 bg-white border border-slate-100 rounded"><span className="truncate max-w-[120px]" title={s.itemName}>{s.itemName}</span><span className="font-mono font-bold text-slate-700">{s.quantity} <span className="text-[9px] text-slate-400 font-normal">{s.unit}</span></span></div>) : <p className="text-xs text-slate-400 italic text-center py-2">Sem itens disponíveis.</p>}</div>
                </div>
                <div className="p-3 bg-slate-100/50">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><MapPin size={12} /> No Destino</h4>
                  <div className="max-h-[150px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">{destStockList.length > 0 ? destStockList.map(s => <div key={s.itemId} className="flex justify-between items-center text-xs p-1.5 bg-white/50 border border-slate-100 rounded text-slate-500"><span className="truncate max-w-[120px]" title={s.itemName}>{s.itemName}</span><span className="font-mono font-bold">{s.quantity} <span className="text-[9px] text-slate-400 font-normal">{s.unit}</span></span></div>) : <p className="text-xs text-slate-400 italic text-center py-2">Vazio.</p>}</div>
                </div>
              </div>
            </div>
          )}
          {/* Lista de Itens */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center mb-2"><label className="text-xs font-bold text-slate-500 uppercase">Itens a transferir</label></div>
            {transferItems.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <select className="flex-1 p-2 border border-slate-300 rounded-lg outline-none text-sm" value={item.itemId} onChange={e => { const newItems = [...transferItems]; newItems[idx].itemId = e.target.value; setTransferItems(newItems); }}><option value="">Selecione um item...</option>{items.map(i => { const currentStock = getQty(transferOrigin, i.id); return <option key={i.id} value={i.id}>{i.name} (Disp: {currentStock})</option>; })}</select>
                <input type="number" min="1" className="w-24 p-2 border border-slate-300 rounded-lg outline-none text-sm" placeholder="Qtd" value={item.quantity} onChange={e => { const newItems = [...transferItems]; newItems[idx].quantity = parseInt(e.target.value) || 0; setTransferItems(newItems); }} />
                {transferItems.length > 1 && <button onClick={() => setTransferItems(transferItems.filter((_, i) => i !== idx))} className="p-2 text-slate-400 hover:text-red-500"><X size={18} /></button>}
              </div>
            ))}
            <button onClick={() => setTransferItems([...transferItems, { itemId: '', quantity: 1 }])} className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1 mt-2"><Plus size={16} /> Adicionar outro item</button>
          </div>
          <div className="mb-2"><label className="text-xs font-bold text-slate-500 uppercase block mb-2">Observações (Opcional)</label><textarea className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-sm min-h-[80px]" placeholder="Ex: Urgente..." value={transferObs} onChange={(e) => setTransferObs(e.target.value)} /></div>
        </div>
        <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancelar</button><button onClick={handleRequest} disabled={!transferDest || transferItems.some(i => !i.itemId)} className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold disabled:opacity-50 shadow-lg shadow-amber-200">Solicitar Aprovação</button></div>
      </div>
    </div>
  );
}
