import { useState, useMemo } from 'react';
import {
  History,
  Plus,
  Search,
  Calendar,
  User,
  Stethoscope
} from 'lucide-react';

import type { Professional, Evolution, Prescription, PrescriptionItem } from '@/types';
import {
  MOCK_PATIENTS,
  MOCK_PHARMACY,
  MOCK_PROFESSIONALS,
  INITIAL_EVOLUTIONS,
  INITIAL_PRESCRIPTIONS
} from '@/lib/mockData';

import {
  EvolutionCard,
  EvolutionModal,
  PrescriptionView,
  PrescriptionModal
} from '@/components/clinical';
import { Pagination, usePagination } from '@/components/ui';
import { loggingService } from '@/lib/loggingService';

type ActiveTab = 'evolucao' | 'prescricao';

export default function ClinicalEvolutionModule() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('evolucao');
  const [currentUserRole, setCurrentUserRole] = useState<Professional['role']>('doctor');
  
  // Modals
  const [showNewEvolutionModal, setShowNewEvolutionModal] = useState(false);
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false);

  // Data
  const [evolutions, setEvolutions] = useState<Evolution[]>(INITIAL_EVOLUTIONS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [patientFilter, setPatientFilter] = useState<string>('all');
  const [professionalFilter, setProfessionalFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const activePatient = useMemo(() => {
    if (patientFilter === 'all') return MOCK_PATIENTS[0];
    return MOCK_PATIENTS.find(p => p.id === patientFilter) || MOCK_PATIENTS[0];
  }, [patientFilter]);

  const filteredEvolutions = useMemo(() => {
    return evolutions.filter(evo => {
      const matchesSearch = evo.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPatient = patientFilter === 'all' || evo.patientId === patientFilter;
      const matchesProf = professionalFilter === 'all' || evo.professionalId === professionalFilter;

      let matchesDate = true;
      if (startDate) matchesDate = matchesDate && new Date(evo.performedAt) >= new Date(startDate);
      if (endDate) matchesDate = matchesDate && new Date(evo.performedAt) <= new Date(endDate + 'T23:59:59');

      return matchesSearch && matchesPatient && matchesProf && matchesDate;
    });
  }, [evolutions, searchTerm, patientFilter, professionalFilter, startDate, endDate]);

  const evolutionsPage = usePagination(filteredEvolutions, 10);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(presc => {
      const matchesSearch = presc.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPatient = patientFilter === 'all' || (presc as any).patientId === patientFilter;
      const matchesProf = professionalFilter === 'all' || presc.professionalId === professionalFilter;
      
      let matchesDate = true;
      if (startDate) matchesDate = matchesDate && new Date(presc.startDate) >= new Date(startDate);
      if (endDate) matchesDate = matchesDate && new Date(presc.startDate) <= new Date(endDate + 'T23:59:59');

      return (matchesSearch || searchTerm === '') && matchesPatient && matchesProf && matchesDate;
    });
  }, [prescriptions, searchTerm, patientFilter, professionalFilter, startDate, endDate]);

  const handleSaveEvolution = (newEvoData: Partial<Evolution>) => {
    const creatorUser = MOCK_PROFESSIONALS.find(p => p.role === currentUserRole) || MOCK_PROFESSIONALS[0];

    const newEvo: Evolution = {
      id: `evo-${Date.now()}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      professionalId: newEvoData.professionalId!,
      professionalName: newEvoData.professionalName!,
      professionalRole: newEvoData.professionalRole!,
      creatorId: creatorUser.id,
      creatorName: creatorUser.name,
      creatorRole: creatorUser.role,
      createdAt: new Date(),
      performedAt: newEvoData.performedAt!,
      type: newEvoData.type!,
      content: newEvoData.content!,
      vitals: newEvoData.vitals,
      documents: newEvoData.documents!
    };

    setEvolutions([newEvo, ...evolutions]);
    
    loggingService.log({
      userId: creatorUser.id,
      userName: creatorUser.name,
      userRole: creatorUser.role,
      action: 'create',
      entity: 'Evolution',
      entityId: newEvo.id,
      description: `Registrou nova evolução para ${activePatient.name}`
    });

    setShowNewEvolutionModal(false);
  };

  const handleSavePrescription = (newPrescData: { professional: Professional; items: PrescriptionItem[] }) => {
    const creatorUser = MOCK_PROFESSIONALS.find(p => p.role === currentUserRole) || MOCK_PROFESSIONALS[0];

    const newPresc: Prescription = {
      id: `presc-${Date.now()}`,
      professionalId: newPrescData.professional.id,
      professionalName: newPrescData.professional.name,
      professionalRole: newPrescData.professional.role,
      creatorId: creatorUser.id,
      creatorName: creatorUser.name,
      creatorRole: creatorUser.role,
      startDate: new Date(),
      status: 'current',
      items: newPrescData.items
    };
    (newPresc as any).patientId = activePatient.id;
    (newPresc as any).patientName = activePatient.name;

    setPrescriptions([newPresc, ...prescriptions.map(p => ({...p, status: 'archived' as const, endDate: new Date()}))]);
    
    loggingService.log({
      userId: creatorUser.id,
      userName: creatorUser.name,
      userRole: creatorUser.role,
      action: 'create',
      entity: 'Prescription',
      entityId: newPresc.id,
      description: `Criou nova prescrição médica para ${activePatient.name}`
    });

    setShowNewPrescriptionModal(false);
  };

  const toggleCheckItem = (prescId: string, itemId: string, time: string) => {
     const creatorUser = MOCK_PROFESSIONALS.find(p => p.role === currentUserRole) || MOCK_PROFESSIONALS[0];
     let itemName = '';

     setPrescriptions(prev => prev.map(p => p.id === prescId ? {
         ...p, items: p.items.map(i => {
           if (i.id !== itemId) return i;
           itemName = i.name;
           const currentChecked = i.checkedAt || {};
           const newChecked = { ...currentChecked };
           const isChecking = !newChecked[time];
           
           if (newChecked[time]) {
             delete newChecked[time];
           } else {
             newChecked[time] = { time: new Date().toISOString(), userId: creatorUser.id };
           }

           loggingService.log({
             userId: creatorUser.id,
             userName: creatorUser.name,
             userRole: creatorUser.role,
             action: 'update',
             entity: 'PrescriptionItem',
             entityId: itemId,
             description: `${isChecking ? 'Checou' : 'Desmarcou'} item ${itemName} às ${time} na prescrição`
           });

           return { ...i, checkedAt: newChecked };
         })
     } : p));
  };

  const archivePrescription = (id: string) => {
      const creatorUser = MOCK_PROFESSIONALS.find(p => p.role === currentUserRole) || MOCK_PROFESSIONALS[0];
      setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: 'archived', endDate: new Date() } : p));
      
      loggingService.log({
        userId: creatorUser.id,
        userName: creatorUser.name,
        userRole: creatorUser.role,
        action: 'archive',
        entity: 'Prescription',
        entityId: id,
        description: `Arquivou prescrição médica`
      });
  };

  const unarchivePrescription = (id: string) => {
    const creatorUser = MOCK_PROFESSIONALS.find(p => p.role === currentUserRole) || MOCK_PROFESSIONALS[0];
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: 'current', endDate: undefined } : p));

    loggingService.log({
      userId: creatorUser.id,
      userName: creatorUser.name,
      userRole: creatorUser.role,
      action: 'update',
      entity: 'Prescription',
      entityId: id,
      description: `Reativou prescrição médica`
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-0 font-sans text-slate-800">
      <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs flex justify-between items-center flex-wrap gap-2">
        <span>DEV MODE: Papel Atual</span>
        <div className="flex gap-2 flex-wrap">
          {(['doctor', 'nurse', 'technician', 'admin'] as Professional['role'][]).map((r) => (
            <button key={r} onClick={() => setCurrentUserRole(r)} className={`px-2 py-1 rounded capitalize ${currentUserRole === r ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>{r}</button>
          ))}
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <History size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                Evolução Clínica e Prescrições
              </h1>
              <p className="text-slate-500 text-sm">Acompanhamento e registro assistencial multidisciplinar.</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {activeTab === 'evolucao' ? (
              <button 
                onClick={() => setShowNewEvolutionModal(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
              >
                <Plus size={16} /> Nova Evolução
              </button>
            ) : (
              currentUserRole === 'doctor' && (
                <button 
                  onClick={() => setShowNewPrescriptionModal(true)} 
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
                >
                  <Plus size={16} /> Nova Prescrição
                </button>
              )
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
           <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={patientFilter}
                onChange={e => setPatientFilter(e.target.value)}
              >
                <option value="all">Todos os Pacientes</option>
                {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
           </div>
           <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={professionalFilter}
                onChange={e => setProfessionalFilter(e.target.value)}
              >
                <option value="all">Todos os Profissionais</option>
                {MOCK_PROFESSIONALS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
           </div>
           <div className="md:col-span-2 flex gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="date" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="date" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
           </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('evolucao')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
              ${activeTab === 'evolucao' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <History size={18} /> Evolução
          </button>
          <button 
            onClick={() => setActiveTab('prescricao')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
              ${activeTab === 'prescricao' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <History size={18} /> Prescrição
          </button>
        </div>
      </header>

      <main className="p-8 max-w-5xl mx-auto">
        <div className="mb-6 relative">
           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
            type="text" 
            placeholder="Pesquisar no conteúdo das evoluções ou prescrições..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
           />
        </div>

        {activeTab === 'evolucao' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-700 font-bold flex items-center gap-2"><History size={18} /> Histórico ({filteredEvolutions.length})</h3>
            </div>
            <div className="space-y-4">
              {evolutionsPage.paginatedItems.map(evo => (
                <div key={evo.id} className="relative">
                   <EvolutionCard evolution={evo} />
                   <div className="absolute top-4 right-4 flex gap-2">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100 uppercase">
                        Paciente: {evo.patientName}
                      </span>
                   </div>
                </div>
              ))}
              {filteredEvolutions.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                   <History size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-slate-500 font-medium">Nenhuma evolução encontrada para os filtros aplicados.</p>
                </div>
              )}
            </div>

            {filteredEvolutions.length > 0 && (
              <div className="mt-6">
                <Pagination
                  currentPage={evolutionsPage.currentPage}
                  totalPages={evolutionsPage.totalPages}
                  totalItems={filteredEvolutions.length}
                  itemsPerPage={evolutionsPage.itemsPerPage}
                  onPageChange={evolutionsPage.handlePageChange}
                  onItemsPerPageChange={evolutionsPage.handleItemsPerPageChange}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'prescricao' && (
          <PrescriptionView 
            prescriptions={filteredPrescriptions}
            currentUserRole={currentUserRole}
            onToggleCheckItem={toggleCheckItem}
            onArchive={archivePrescription}
            onUnarchive={unarchivePrescription}
            onNewPrescription={() => setShowNewPrescriptionModal(true)}
          />
        )}
      </main>

      {showNewEvolutionModal && (
        <EvolutionModal
          isOpen={showNewEvolutionModal}
          onClose={() => setShowNewEvolutionModal(false)}
          onSave={handleSaveEvolution}
          currentUserRole={currentUserRole}
          professionals={MOCK_PROFESSIONALS}
        />
      )}

      {showNewPrescriptionModal && (
        <PrescriptionModal
          isOpen={showNewPrescriptionModal}
          onClose={() => setShowNewPrescriptionModal(false)}
          onSave={handleSavePrescription}
          currentUserRole={currentUserRole}
          professionals={MOCK_PROFESSIONALS}
          pharmacyItems={MOCK_PHARMACY}
          patient={activePatient}
        />
      )}
    </div>
  );
}