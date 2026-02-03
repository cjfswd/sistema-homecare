import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCog,
  Edit2,
  Trash2,
  Plus,
  Save,
  Eye,
  Phone,
  Filter
} from 'lucide-react';
import type { Professional, ProfessionalRole, RecordStatus } from '@/types';
import { MOCK_PROFESSIONALS } from '@/lib/mockData';
import { Button, Modal, StatusBadge, Pagination, usePagination } from '@/components/ui';
import { SearchInput } from '@/components/forms';
import { ProfessionalForm } from '@/components/administrative';
import { roleLabels } from '@/lib/translations';
import { loggingService } from '@/lib/loggingService';

export default function ProfessionalsList() {
  const navigate = useNavigate();

  // Data States
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<ProfessionalRole | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const openModal = (data?: Professional) => {
    if (data) {
      setEditingId(data.id);
      setFormData({ ...data });
    } else {
      setEditingId(null);
      setFormData({ status: 'active', role: 'technician' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  const handleSave = () => {
    const action = editingId ? 'update' : 'create';
    const newProf = { ...formData, id: editingId || `prof-${Date.now()}` };

    setProfessionals(prev => editingId
      ? prev.map(p => p.id === editingId ? newProf : p)
      : [...prev, newProf]
    );

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action,
      entity: 'Professional',
      entityId: newProf.id,
      description: `${editingId ? 'Atualizou' : 'Criou'} profissional: ${newProf.name}`
    });

    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este profissional?')) return;

    const professional = professionals.find(p => p.id === id);
    setProfessionals(professionals.filter(p => p.id !== id));

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'delete',
      entity: 'Professional',
      entityId: id,
      description: `Excluiu profissional: ${professional?.name}`
    });
  };

  const handleViewDetails = (professionalId: string) => {
    navigate(`/profissionais/${professionalId}`);
  };

  // Filters
  const filteredProfessionals = professionals.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.councilNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const professionalsPage = usePagination(filteredProfessionals, 12);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <UserCog className="text-indigo-600" />
              Profissionais
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gerencie a equipe de profissionais de saúde
            </p>
          </div>
          <Button onClick={() => openModal()} icon={Plus}>
            Novo Profissional
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nome ou número de conselho..."
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as ProfessionalRole | 'all')}
              className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">Todas as Categorias</option>
              <option value="doctor">Médico</option>
              <option value="nurse">Enfermeiro</option>
              <option value="technician">Técnico</option>
              <option value="physiotherapist">Fisioterapeuta</option>
              <option value="speechTherapist">Fonoaudiólogo</option>
              <option value="admin">Administrativo</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">Profissional</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Conselho</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {professionalsPage.paginatedItems.map(prof => (
                <tr
                  key={prof.id}
                  className="hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => handleViewDetails(prof.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {prof.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{prof.name}</div>
                        <div className="text-xs text-slate-500">{prof.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-sm text-slate-700">
                      {roleLabels[prof.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">
                    {prof.councilNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone size={14} /> {prof.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={prof.status as RecordStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(prof.id)} icon={Eye} title="Ver Detalhes" />
                      <Button variant="ghost" size="sm" onClick={() => openModal(prof)} icon={Edit2} title="Editar" />
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(prof.id)} icon={Trash2} title="Excluir" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={professionalsPage.currentPage}
          totalPages={professionalsPage.totalPages}
          totalItems={filteredProfessionals.length}
          itemsPerPage={professionalsPage.itemsPerPage}
          onPageChange={professionalsPage.handlePageChange}
          onItemsPerPageChange={professionalsPage.handleItemsPerPageChange}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Editar Profissional' : 'Novo Profissional'}
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSave} icon={Save}>Salvar</Button>
          </>
        }
      >
        <ProfessionalForm formData={formData} onFormChange={handleFormChange} />
      </Modal>
    </div>
  );
}
