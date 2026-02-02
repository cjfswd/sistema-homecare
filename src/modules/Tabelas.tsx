import { useState } from 'react';
import {
  FileBadge,
  DollarSign,
  Plus,
  Save,
  ChevronRight,
  Edit2
} from 'lucide-react';
import type { Service, PriceTable } from '@/types';
import { MOCK_SERVICES, INITIAL_PRICE_TABLES } from '@/lib/mockData';
import { Button, Modal, StatusBadge, Pagination, usePagination, type Tab } from '@/components/ui';
import { SearchInput } from '@/components/forms';
import { ServiceForm } from '@/components/administrative';
import { PriceTableEditor } from '@/components/financial';
import { loggingService } from '@/lib/loggingService';

type ActiveTab = 'services' | 'tables';

export default function TabelasModule() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');
  
  // Data States
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [tables, setTables] = useState<PriceTable[]>(INITIAL_PRICE_TABLES);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<PriceTable | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});
  
  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // --- Service Handlers ---
  const openServiceModal = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setFormData({ ...service });
    } else {
      setEditingId(null);
      setFormData({ active: true, category: 'procedure' });
    }
    setIsModalOpen(true);
  };

  const handleSaveService = () => {
    const action = editingId ? 'update' : 'create';
    const newService = { ...formData, id: editingId || `s-${Date.now()}` };
    setServices(prev => editingId ? prev.map(s => s.id === editingId ? newService : s) : [...prev, newService]);

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action,
      entity: 'Service',
      entityId: newService.id,
      description: `${editingId ? 'Atualizou' : 'Criou'} serviço no catálogo: ${newService.name}`
    });

    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  // --- Price Table Handlers ---
  const handleSaveTable = (updatedTable: PriceTable) => {
    if (!updatedTable) return;
    setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
    
    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'update',
      entity: 'PriceTable',
      entityId: updatedTable.id,
      description: `Atualizou preços na tabela: ${updatedTable.name}`
    });

    setSelectedTable(null);
  };
  
  const handleUpdateTablePrice = (serviceId: string, field: 'costPrice' | 'sellPrice', value: number) => {
    if (!selectedTable) return;
    
    const newTable = { ...selectedTable };
    const itemIndex = newTable.items.findIndex(i => i.serviceId === serviceId);

    if (itemIndex > -1) {
      newTable.items[itemIndex] = { ...newTable.items[itemIndex], [field]: value };
    } else {
      newTable.items.push({ serviceId, costPrice: 0, sellPrice: 0, [field]: value });
    }
    setSelectedTable(newTable);
  };

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTables = tables.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination
  const servicesPage = usePagination(filteredServices, 15);
  const tablesPage = usePagination(filteredTables, 10);

  const TABS: Tab[] = [
    { id: 'services', label: 'Catálogo de Serviços', icon: FileBadge },
    { id: 'tables', label: 'Tabelas de Preços', icon: DollarSign },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileBadge className="text-indigo-600" />
              Tabelas & Configurações
            </h1>
            <p className="text-slate-500 text-sm mt-1">Configuração de serviços e precificação estratégica.</p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'services' ? (
              <Button onClick={() => openServiceModal()} icon={Plus}>
                Novo Serviço
              </Button>
            ) : (
              !selectedTable && (
                <Button onClick={() => {}} icon={Plus}>
                  Nova Tabela
                </Button>
              )
            )}
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as ActiveTab); setSearchTerm(''); setSelectedTable(null); }}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                  ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                {Icon && <Icon size={18} />} {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {!selectedTable && (
          <div className="mb-6">
            <SearchInput 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={activeTab === 'services' ? "Buscar serviço por nome ou código..." : "Buscar tabela..."}
            />
          </div>
        )}

        {activeTab === 'services' && (
          <>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
                  <tr>
                    <th className="px-6 py-4 w-24">Código</th>
                    <th className="px-6 py-4">Descrição do Serviço</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4 text-right">Valor Base</th>
                    <th className="px-6 py-4 text-center">Ativo</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {servicesPage.paginatedItems.map(service => (
                    <tr key={service.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">{service.code}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{service.name}</td>
                      <td className="px-6 py-4 capitalize text-slate-600">{service.category}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                        {service.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={service.active} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openServiceModal(service)} icon={Edit2}>Editar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={servicesPage.currentPage}
              totalPages={servicesPage.totalPages}
              totalItems={filteredServices.length}
              itemsPerPage={servicesPage.itemsPerPage}
              onPageChange={servicesPage.handlePageChange}
              onItemsPerPageChange={servicesPage.handleItemsPerPageChange}
            />
          </>
        )}

        {activeTab === 'tables' && !selectedTable && (
          <>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
                  <tr>
                    <th className="px-6 py-4">Nome da Tabela</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4 text-center">Itens Precificados</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tablesPage.paginatedItems.map(table => (
                    <tr key={table.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                            <DollarSign size={18} />
                          </div>
                          <span className="font-semibold text-slate-800">{table.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${table.type === 'particular' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
                          {table.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        {table.items.length} itens
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTable(JSON.parse(JSON.stringify(table)))}>
                          Gerenciar Preços <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={tablesPage.currentPage}
              totalPages={tablesPage.totalPages}
              totalItems={filteredTables.length}
              itemsPerPage={tablesPage.itemsPerPage}
              onPageChange={tablesPage.handlePageChange}
              onItemsPerPageChange={tablesPage.handleItemsPerPageChange}
            />
          </>
        )}

        {activeTab === 'tables' && selectedTable && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Editando: {selectedTable.name}</h2>
                <p className="text-sm text-slate-500">Defina valores de custo e venda para cada serviço.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setSelectedTable(null)}>Cancelar</Button>
                <Button variant="success" onClick={() => handleSaveTable(selectedTable)} icon={Save}>Salvar Alterações</Button>
              </div>
            </div>
            <PriceTableEditor table={selectedTable} onPriceChange={handleUpdateTablePrice} />
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setFormData({}); setEditingId(null); }}
        title={editingId ? 'Editar Serviço' : 'Novo Serviço'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveService} icon={Save}>Salvar Registro</Button>
          </>
        }
      >
        <ServiceForm formData={formData} onFormChange={handleFormChange} />
      </Modal>
    </div>
  );
}
