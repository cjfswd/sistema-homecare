import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  ClipboardCheck,
  Calendar,
  Users,
  FileText,
  Edit2,
  Save,
  MapPin,
  Phone,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import type { Patient, Assessment, ScheduleEntry, Evolution, AssessmentType, Budget, AccountsReceivable, AccountsPayable } from '@/types';
import {
  MOCK_PATIENTS,
  MOCK_PROFESSIONALS,
  MOCK_ASSESSMENTS,
  MOCK_SCHEDULE,
  INITIAL_EVOLUTIONS,
  INITIAL_BUDGETS,
  INITIAL_ACCOUNTS_RECEIVABLE,
  INITIAL_ACCOUNTS_PAYABLE,
  getScheduleByPatient,
  getProfessionalsForPatient
} from '@/lib/mockData';
import { Button, StatusBadge } from '@/components/ui';
import { PatientForm } from '@/components/administrative';
import { AssessmentList, AssessmentModal, AssessmentForm, BudgetList, AccountsReceivableList, AccountsPayableList } from '@/components/patients';
import { ScheduleCalendar } from '@/components/schedule';
import { EvolutionCard } from '@/components/clinical';
import { loggingService } from '@/lib/loggingService';

interface PatientDetailProps {
  patientId: string;
}

type TabId = 'cadastro' | 'avaliacoes' | 'escala' | 'profissionais' | 'evolucoes' | 'financeiro';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'cadastro', label: 'Cadastro', icon: User },
  { id: 'avaliacoes', label: 'Avaliações', icon: ClipboardCheck },
  { id: 'escala', label: 'Escala', icon: Calendar },
  { id: 'profissionais', label: 'Profissionais', icon: Users },
  { id: 'evolucoes', label: 'Evoluções', icon: FileText },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
];

export default function PatientDetail({ patientId }: PatientDetailProps) {
  const navigate = useNavigate();

  // Find patient
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const patient = patients.find(p => p.id === patientId);

  // Data States
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [_scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>(MOCK_SCHEDULE);
  const [evolutions] = useState<Evolution[]>(INITIAL_EVOLUTIONS);
  const [budgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [accountsReceivable] = useState<AccountsReceivable[]>(INITIAL_ACCOUNTS_RECEIVABLE);
  const [accountsPayable] = useState<AccountsPayable[]>(INITIAL_ACCOUNTS_PAYABLE);

  // UI States
  const [activeTab, setActiveTab] = useState<TabId>('cadastro');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(patient || {});

  // Assessment States
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  const [newAssessmentType, setNewAssessmentType] = useState<AssessmentType>('ABEMID');

  // Filter data for this patient
  const patientAssessments = useMemo(() =>
    assessments.filter(a => a.patientId === patientId),
    [assessments, patientId]
  );

  const patientSchedule = useMemo(() =>
    getScheduleByPatient(patientId),
    [patientId]
  );

  const patientEvolutions = useMemo(() =>
    evolutions.filter(e => e.patientId === patientId),
    [evolutions, patientId]
  );

  const patientBudgets = useMemo(() =>
    budgets.filter(b => b.patientId === patientId),
    [budgets, patientId]
  );

  const patientAccountsReceivable = useMemo(() =>
    accountsReceivable.filter(a => a.patientId === patientId),
    [accountsReceivable, patientId]
  );

  // Note: Accounts Payable are not directly linked to patients
  // But we show them in the financial overview for context

  const linkedProfessionalIds = useMemo(() =>
    getProfessionalsForPatient(patientId),
    [patientId]
  );

  const linkedProfessionals = useMemo(() =>
    MOCK_PROFESSIONALS.filter(p => linkedProfessionalIds.includes(p.id)),
    [linkedProfessionalIds]
  );

  if (!patient) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Paciente não encontrado</h2>
          <Button onClick={() => navigate('/pacientes')}>Voltar para Lista</Button>
        </div>
      </div>
    );
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const handleSavePatient = () => {
    setPatients(prev => prev.map(p => p.id === patientId ? formData : p));

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'update',
      entity: 'Patient',
      entityId: patientId,
      description: `Atualizou dados do paciente: ${formData.name}`
    });

    setIsEditing(false);
  };

  const handleSelectAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsAssessmentModalOpen(true);
  };

  const handleNewAssessment = (type: AssessmentType) => {
    setNewAssessmentType(type);
    setIsNewAssessmentOpen(true);
  };

  const handleSaveAssessment = (newAssessment: Partial<Assessment>) => {
    const assessment: Assessment = {
      ...newAssessment,
      id: `assess-${Date.now()}`,
      createdAt: new Date(),
    } as Assessment;

    setAssessments(prev => [assessment, ...prev]);

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'create',
      entity: 'Assessment',
      entityId: assessment.id,
      description: `Criou avaliação ${assessment.type} para paciente: ${patient.name}`
    });

    setIsNewAssessmentOpen(false);
  };

  const handleSaveScheduleEntry = (entry: Partial<ScheduleEntry>) => {
    if (entry.id) {
      setScheduleEntries(prev => prev.map(e => e.id === entry.id ? { ...e, ...entry } as ScheduleEntry : e));
    } else {
      const newEntry: ScheduleEntry = {
        ...entry,
        id: `sched-${Date.now()}`,
      } as ScheduleEntry;
      setScheduleEntries(prev => [...prev, newEntry]);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/pacientes')}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                {patient.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{patient.name}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{patient.cpf}</span>
                  <StatusBadge status={patient.status} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                  ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto">
        {/* Cadastro Tab */}
        {activeTab === 'cadastro' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Dados Cadastrais</h2>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData(patient); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSavePatient} icon={Save}>Salvar</Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} icon={Edit2}>Editar</Button>
              )}
            </div>

            {isEditing ? (
              <PatientForm
                formData={formData}
                onFormChange={handleFormChange}
                onAddressChange={handleAddressChange}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Informações Pessoais</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-400">Nome Completo</span>
                      <p className="font-medium text-slate-800">{patient.name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">CPF</span>
                      <p className="font-mono text-slate-800">{patient.cpf}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Data de Nascimento</span>
                      <p className="text-slate-800">{patient.birthDate}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Diagnóstico Principal</span>
                      <p className="text-slate-800">{patient.diagnosis}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <MapPin size={14} /> Endereço
                  </h3>
                  <div className="space-y-2">
                    <p className="text-slate-800">
                      {patient.address.street}, {patient.address.number}
                    </p>
                    <p className="text-slate-600">
                      {patient.address.neighborhood}
                    </p>
                    <p className="text-slate-600">
                      {patient.address.city} - {patient.address.state}
                    </p>
                    <p className="text-slate-500 font-mono text-sm">
                      CEP: {patient.address.zipCode}
                    </p>
                  </div>

                  {patient.contacts && patient.contacts.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <Phone size={14} /> Contatos
                      </h3>
                      <div className="space-y-2">
                        {patient.contacts.map((contact, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-lg p-3">
                            <p className="font-medium text-slate-800">{contact.name}</p>
                            <p className="text-sm text-slate-600">{contact.phone}</p>
                            <p className="text-xs text-slate-400">{contact.relation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient.allergies && patient.allergies.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500" /> Alergias
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Avaliações Tab */}
        {activeTab === 'avaliacoes' && (
          <div>
            <AssessmentList
              assessments={patientAssessments}
              onSelect={handleSelectAssessment}
              onNew={handleNewAssessment}
            />

            {selectedAssessment && (
              <AssessmentModal
                assessment={selectedAssessment}
                isOpen={isAssessmentModalOpen}
                onClose={() => { setIsAssessmentModalOpen(false); setSelectedAssessment(null); }}
              />
            )}

            <AssessmentForm
              type={newAssessmentType}
              patientId={patientId}
              patientName={patient.name}
              professionals={MOCK_PROFESSIONALS}
              isOpen={isNewAssessmentOpen}
              onClose={() => setIsNewAssessmentOpen(false)}
              onSave={handleSaveAssessment}
            />
          </div>
        )}

        {/* Escala Tab */}
        {activeTab === 'escala' && (
          <ScheduleCalendar
            entries={patientSchedule}
            professionals={MOCK_PROFESSIONALS}
            patients={MOCK_PATIENTS}
            patientId={patientId}
            onSaveEntry={handleSaveScheduleEntry}
          />
        )}

        {/* Profissionais Tab */}
        {activeTab === 'profissionais' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-800">
                Profissionais Vinculados ({linkedProfessionals.length})
              </h2>
              <p className="text-sm text-slate-500">
                Profissionais que já atenderam ou têm agendamentos com este paciente
              </p>
            </div>

            {linkedProfessionals.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users size={48} className="mx-auto mb-3 opacity-50" />
                <p>Nenhum profissional vinculado</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {linkedProfessionals.map(prof => (
                  <div
                    key={prof.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/profissionais/${prof.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {prof.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{prof.name}</p>
                        <p className="text-sm text-slate-500">{prof.councilNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 capitalize bg-slate-100 px-2 py-1 rounded">
                        {prof.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Evoluções Tab */}
        {activeTab === 'evolucoes' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="font-bold text-slate-800">Histórico de Evoluções</h2>
              <p className="text-sm text-slate-500">
                {patientEvolutions.length} evolução(ões) registrada(s)
              </p>
            </div>

            {patientEvolutions.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <FileText size={48} className="mx-auto mb-3 opacity-50" />
                <p>Nenhuma evolução registrada para este paciente</p>
              </div>
            ) : (
              <div className="space-y-0">
                {patientEvolutions
                  .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
                  .map(evolution => (
                    <EvolutionCard key={evolution.id} evolution={evolution} />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Financeiro Tab */}
        {activeTab === 'financeiro' && (
          <div className="space-y-6">
            {/* Orçamentos */}
            <BudgetList
              budgets={patientBudgets}
              onSelectBudget={(budget) => console.log('Budget selected:', budget)}
              onNewBudget={() => console.log('New budget')}
            />

            {/* Contas a Receber */}
            <AccountsReceivableList
              accounts={patientAccountsReceivable}
              onSelectAccount={(account) => console.log('Account selected:', account)}
              onNewAccount={() => console.log('New account receivable')}
            />

            {/* Contas a Pagar - General Overview */}
            <AccountsPayableList
              accounts={accountsPayable}
              onSelectAccount={(account) => console.log('Account payable selected:', account)}
              onNewAccount={() => console.log('New account payable')}
            />
          </div>
        )}
      </main>
    </div>
  );
}
