import { Search, Building2, Truck, User, MapPin, MoreVertical, Plus } from 'lucide-react';
import type { StockLocation } from '@/types';
import { Pagination, usePagination } from '@/components/ui';

interface LocationsViewProps {
  locations: StockLocation[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onAddLocation: () => void;
}

export function LocationsView({
  locations,
  searchTerm,
  onSearchTermChange,
  onAddLocation
}: LocationsViewProps) {
  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const locationsPage = usePagination(filteredLocations, 15);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar locais por nome, endereço ou tipo..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm" 
            value={searchTerm} 
            onChange={(e) => onSearchTermChange(e.target.value)} 
          />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-12"></th>
              <th className="px-6 py-4">Nome do Local</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Endereço</th>
              <th className="px-6 py-4 w-12 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {locationsPage.paginatedItems.map((loc) => (
              <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className={`p-2 rounded-lg w-fit ${
                    loc.type === 'company' ? 'bg-indigo-100 text-indigo-600' :
                    loc.type === 'vehicle' ? 'bg-orange-100 text-orange-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {loc.type === 'company' ? <Building2 size={18} /> :
                     loc.type === 'vehicle' ? <Truck size={18} /> :
                     <User size={18} />}
                  </div>
                </td>
                <td className="px-6 py-4"><div className="font-bold text-slate-700">{loc.name}</div></td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                    loc.type === 'company' ? 'text-indigo-600 bg-indigo-50' :
                    loc.type === 'vehicle' ? 'text-orange-600 bg-orange-50' :
                    'text-emerald-600 bg-emerald-50'
                  }`}>
                    {loc.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {loc.address ?
                    <div className="flex items-center gap-1"><MapPin size={14} className="text-slate-400" />{loc.address}</div> :
                    <span className="italic text-slate-300">Não informado</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-slate-300 hover:text-slate-600 p-1"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLocations.length > 0 && (
        <Pagination
          currentPage={locationsPage.currentPage}
          totalPages={locationsPage.totalPages}
          totalItems={filteredLocations.length}
          itemsPerPage={locationsPage.itemsPerPage}
          onPageChange={locationsPage.handlePageChange}
          onItemsPerPageChange={locationsPage.handleItemsPerPageChange}
        />
      )}
      <div className="flex justify-center">
        <button 
          onClick={onAddLocation} 
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium px-4 py-2 hover:bg-amber-50 rounded-lg transition"
        >
          <Plus size={18} /> Cadastrar Novo Local Manualmente
        </button>
      </div>
    </div>
  );
}
