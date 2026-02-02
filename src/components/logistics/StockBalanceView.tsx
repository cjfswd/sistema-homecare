import { Search, Filter, Package, AlertTriangle, Archive, CheckCircle2 } from 'lucide-react';
import type { Item, StockLocation } from '@/types';
import { Pagination, usePagination } from '@/components/ui';

interface InventoryItem extends Item {
  totalQty: number;
  breakdown: { locName: string | undefined; qty: number }[];
}

interface StockBalanceViewProps {
  inventory: InventoryItem[];
  locations: StockLocation[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
}

export function StockBalanceView({
  inventory,
  locations,
  searchTerm,
  onSearchTermChange,
  selectedLocation,
  onLocationChange
}: StockBalanceViewProps) {
  const inventoryPage = usePagination(inventory, 20);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome do item..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm" 
            value={searchTerm} 
            onChange={(e) => onSearchTermChange(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2 min-w-[250px]">
          <Filter size={18} className="text-slate-500" />
          <select 
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm" 
            value={selectedLocation} 
            onChange={(e) => onLocationChange(e.target.value)}
          >
            <option value="all">Visão Global (Todos)</option>
            <optgroup label="Empresas">{locations.filter(l => l.type === 'company').map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</optgroup>
            <optgroup label="Pacientes">{locations.filter(l => l.type === 'patient').map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</optgroup>
            <optgroup label="Veículos">{locations.filter(l => l.type === 'vehicle').map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</optgroup>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Unidade</th>
              <th className="px-6 py-4 text-center">Saldo</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventoryPage.paginatedItems.map((item) => {
              const status = item.totalQty <= 0 ? 'critico' : item.totalQty < item.minStock ? 'baixo' : 'ok';
              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">{item.name}</div>
                    {selectedLocation === 'all' && item.breakdown && item.breakdown.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.breakdown.map((b, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{b.locName}: {b.qty}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-500">{item.category}</td>
                  <td className="px-6 py-4 text-slate-500">{item.unit}</td>
                  <td className="px-6 py-4 text-center font-bold text-lg text-slate-700">{item.totalQty}</td>
                  <td className="px-6 py-4">
                    {status === 'critico' && <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100"><AlertTriangle size={12} /> Esgotado</span>}
                    {status === 'baixo' && <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100"><Archive size={12} /> Baixo</span>}
                    {status === 'ok' && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100"><CheckCircle2 size={12} /> Normal</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {inventory.length === 0 && (
          <div className="p-10 text-center text-slate-400"><Package size={48} className="mx-auto mb-3 opacity-20" /><p>Nenhum item encontrado no estoque selecionado.</p></div>
        )}
      </div>

      {inventory.length > 0 && (
        <Pagination
          currentPage={inventoryPage.currentPage}
          totalPages={inventoryPage.totalPages}
          totalItems={inventory.length}
          itemsPerPage={inventoryPage.itemsPerPage}
          onPageChange={inventoryPage.handlePageChange}
          onItemsPerPageChange={inventoryPage.handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
