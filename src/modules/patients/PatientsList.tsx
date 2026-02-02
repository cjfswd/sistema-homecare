import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Edit2,
  Trash2,
  Plus,
  Save,
  Eye
} from 'lucide-react';
import type { Patient, RecordStatus } from '@/types';
import { MOCK_PATIENTS } from '@/lib/mockData';
import { Button, Modal, StatusBadge, Pagination, usePagination } from '@/components/ui';
import { SearchInput } from '@/components/forms';
import { PatientForm } from '@/components/administrative';
import { loggingService } from '@/lib/loggingService';

export default function PatientsList() {
  const navigate = useNavigate();

  // Data States
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const openModal = (data?: Patient) => {
    if (data) {
      setEditingId(data.id);
      setFormData({ ...data });
    } else {
      setEditingId(null);
      setFormData({ status: 'active', address: { state: 'SP' }, contacts: [] });
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
    const newPatient = { ...formData, id: editingId || `pac-${Date.now()}` };

    setPatients(prev => editingId
      ? prev.map(p => p.id === editingId ? newPatient : p)
      : [...prev, newPatient]
    );

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action,
      entity: 'Patient',
      entityId: newPatient.id,
      description: `${editingId ? 'Atualizou' : 'Criou'} paciente: ${newPatient.name}`
    });

    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) return;

    const patient = patients.find(p => p.id === id);
    setPatients(patients.filter(p => p.id !== id));

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'delete',
      entity: 'Patient',
      entityId: id,
      description: `Excluiu paciente: ${patient?.name}`
    });
  };

  const handleViewDetails = (patientId: string) => {
    navigate(`/pacientes/${patientId}`);
  };

  // Filters
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm)
  );

  // Pagination
  const patientsPage = usePagination(filteredPatients, 12);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-indigo-600" />
              Pacientes
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gerencie os pacientes em atendimento domiciliar
            </p>
          </div>
          <Button onClick={() => openModal()} icon={Plus}>
            Novo Paciente
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nome ou CPF..."
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">CPF</th>
                <th className="px-6 py-4">Diagnóstico</th>
                <th className="px-6 py-4">Endereço</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientsPage.paginatedItems.map(patient => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(patient.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {patient.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{patient.name}</div>
                        <div className="text-xs text-slate-500">{patient.contacts[0]?.phone || 'Sem contato'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-600">{patient.cpf}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 line-clamp-2">{patient.diagnosis}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      <div>{patient.address.street}, {patient.address.number}</div>
                      <div className="text-xs text-slate-500">{patient.address.neighborhood} - {patient.address.city}/{patient.address.state}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={patient.status as RecordStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(patient.id)} icon={Eye} title="Ver Detalhes" />
                      <Button variant="ghost" size="sm" onClick={() => openModal(patient)} icon={Edit2} title="Editar" />
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(patient.id)} icon={Trash2} title="Excluir" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={patientsPage.currentPage}
          totalPages={patientsPage.totalPages}
          totalItems={filteredPatients.length}
          itemsPerPage={patientsPage.itemsPerPage}
          onPageChange={patientsPage.handlePageChange}
          onItemsPerPageChange={patientsPage.handleItemsPerPageChange}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Editar Paciente' : 'Novo Paciente'}
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSave} icon={Save}>Salvar</Button>
          </>
        }
      >
        <PatientForm formData={formData} onFormChange={handleFormChange} onAddressChange={handleAddressChange} />
      </Modal>
    </div>
  );
}
