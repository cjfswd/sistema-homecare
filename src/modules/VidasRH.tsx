import { useState } from 'react';
import {
  Users,
  Stethoscope,
  Building2,
  Edit2,
  Trash2,
  Plus,
  Save,
  Phone,
  History
} from 'lucide-react';
import type { Patient, Professional, RecordStatus, Evolution } from '@/types';
import { MOCK_PATIENTS, MOCK_PROFESSIONALS, INITIAL_EVOLUTIONS } from '@/lib/mockData';
import { Button, Modal, StatusBadge, Pagination, usePagination, type Tab } from '@/components/ui';
import { SearchInput } from '@/components/forms';
import { PatientForm, ProfessionalForm, ClinicalHistoryModal } from '@/components/administrative';
import { roleLabels } from '@/lib/translations';
import { loggingService } from '@/lib/loggingService';

type ActiveTab = 'patients' | 'professionals';

export default function VidasRHModule() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('patients');
  
  // Data States
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [evolutions] = useState<Evolution[]>(INITIAL_EVOLUTIONS);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // History Modal States
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyEntity, setHistoryEntity] = useState<{ name: string; type: 'patient' | 'professional'; id: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});
  
  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };
  
  // --- Generic Handlers ---

  const openModal = (data?: any) => {
    if (data) {
      setEditingId(data.id);
      setFormData({ ...data });
    } else {
      setEditingId(null);
      // Reset form based on tab
      if (activeTab === 'patients') setFormData({ status: 'active', address: { state: 'SP' }, contacts: [] });
      if (activeTab === 'professionals') setFormData({ status: 'active', role: 'technician' });
    }
    setIsModalOpen(true);
  };

  const openHistoryModal = (entity: Patient | Professional, type: 'patient' | 'professional') => {
    setHistoryEntity({ name: entity.name, type, id: entity.id });
    setIsHistoryModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  const handleSave = () => {
    const action = editingId ? 'update' : 'create';

    if (activeTab === 'patients') {
      const newPatient = { ...formData, id: editingId || `p-${Date.now()}` };
      setPatients(prev => editingId ? prev.map(p => p.id === editingId ? newPatient : p) : [...prev, newPatient]);
      
      loggingService.log({
        userId: 'prof-admin',
        userName: 'Administrador do Sistema',
        userRole: 'admin',
        action,
        entity: 'Patient',
        entityId: newPatient.id,
        description: `${editingId ? 'Atualizou' : 'Criou'} paciente: ${newPatient.name}`
      });
    } else if (activeTab === 'professionals') {
      const newProf = { ...formData, id: editingId || `pr-${Date.now()}` };
      setProfessionals(prev => editingId ? prev.map(p => p.id === editingId ? newProf : p) : [...prev, newProf]);

      loggingService.log({
        userId: 'prof-admin',
        userName: 'Administrador do Sistema',
        userRole: 'admin',
        action,
        entity: 'Professional',
        entityId: newProf.id,
        description: `${editingId ? 'Atualizou' : 'Criou'} profissional: ${newProf.name}`
      });
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this record?')) return;
    
    let description = '';
    let entity = '';

    if (activeTab === 'patients') {
      const p = patients.find(x => x.id === id);
      description = `Excluiu paciente: ${p?.name}`;
      entity = 'Patient';
      setPatients(patients.filter(p => p.id !== id));
    } else if (activeTab === 'professionals') {
      const p = professionals.find(x => x.id === id);
      description = `Excluiu profissional: ${p?.name}`;
      entity = 'Professional';
      setProfessionals(professionals.filter(p => p.id !== id));
    }

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'delete',
      entity,
      entityId: id,
      description
    });
  };
  
  // --- Filters ---
  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.cpf.includes(searchTerm));
  const filteredProfessionals = professionals.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- Pagination ---
  const patientsPage = usePagination(filteredPatients, 12);
  const professionalsPage = usePagination(filteredProfessionals, 10);

  const filteredEvolutions = historyEntity 
    ? evolutions.filter(evo => 
        historyEntity.type === 'patient' 
          ? evo.patientId === historyEntity.id 
          : evo.professionalId === historyEntity.id
      )
    : [];
  
  const TABS: Tab[] = [
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'professionals', label: 'Profissionais', icon: Stethoscope },
  ];
  
  const getModalTitle = () => {
    const action = editingId ? 'Editar' : 'Novo';
    const entity = activeTab === 'patients' ? 'Paciente' : 'Profissional';
    return `${action} ${entity}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="text-indigo-600" />
              Vidas & RH
            </h1>
            <p className="text-slate-500 text-sm mt-1">Gestão de pacientes e corpo clínico profissional.</p>
          </div>
          <Button onClick={() => openModal()} icon={Plus}>
            {`Novo ${activeTab === 'patients' ? 'Paciente' : 'Profissional'}`}
          </Button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as ActiveTab); setSearchTerm(''); }}
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
        <div className="mb-6">
          <SearchInput 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={
              activeTab === 'patients' ? "Buscar por nome ou CPF..." : "Buscar por nome ou conselho..."
            }
          />
        </div>

        {activeTab === 'patients' && (
          <>
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
                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
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
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openHistoryModal(patient, 'patient')} icon={History} title="Ver Evoluções" />
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
          </>
        )}

        {activeTab === 'professionals' && (
          <>
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
                    <tr key={prof.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{prof.name}</div>
                        <div className="text-xs text-slate-500">{prof.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {roleLabels[prof.role]}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{prof.councilNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-1">
                        <Phone size={14} /> {prof.phone}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={prof.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openHistoryModal(prof, 'professional')} icon={History} title="Ver Evoluções" />
                            <Button variant="ghost" size="sm" onClick={() => openModal(prof)} icon={Edit2} />
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(prof.id)} icon={Trash2} />
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
          </>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={getModalTitle()}
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSave} icon={Save}>Salvar Registro</Button>
          </>
        }
      >
        {activeTab === 'patients' && <PatientForm formData={formData} onFormChange={handleFormChange} onAddressChange={handleAddressChange} />}
        {activeTab === 'professionals' && <ProfessionalForm formData={formData} onFormChange={handleFormChange} />}
      </Modal>

      {isHistoryModalOpen && historyEntity && (
        <ClinicalHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          entityName={historyEntity.name}
          entityType={historyEntity.type}
          evolutions={filteredEvolutions}
        />
      )}
    </div>
  );
}
