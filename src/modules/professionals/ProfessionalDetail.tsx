import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Users,
  FileText,
  Clock,
  Edit2,
  Save,
  Phone,
  Mail,
  AlertCircle,
  Award,
  Calendar,
  DollarSign
} from 'lucide-react';
import type { Professional, Evolution, ScheduleEntry, AccountsPayable } from '@/types';
import {
  MOCK_PATIENTS,
  MOCK_PROFESSIONALS,
  INITIAL_EVOLUTIONS,
  MOCK_SCHEDULE,
  INITIAL_ACCOUNTS_PAYABLE,
  getCheckInOutsByProfessional,
  getPatientsForProfessional
} from '@/lib/mockData';
import { Button, StatusBadge } from '@/components/ui';
import { ProfessionalForm } from '@/components/administrative';
import { CheckInOutHistory, ProfessionalFinancial } from '@/components/professionals';
import { EvolutionCard } from '@/components/clinical';
import { ScheduleCalendar } from '@/components/schedule';
import { roleLabels } from '@/lib/translations';
import { loggingService } from '@/lib/loggingService';

interface ProfessionalDetailProps {
  professionalId: string;
}

type TabId = 'cadastro' | 'pacientes' | 'evolucoes' | 'escala' | 'checkins' | 'financeiro';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'cadastro', label: 'Cadastro', icon: User },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'evolucoes', label: 'Evoluções', icon: FileText },
  { id: 'escala', label: 'Escala', icon: Calendar },
  { id: 'checkins', label: 'Check-ins', icon: Clock },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
];

export default function ProfessionalDetail({ professionalId }: ProfessionalDetailProps) {
  const navigate = useNavigate();

  // Find professional
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const professional = professionals.find(p => p.id === professionalId);

  // Data States
  const [evolutions] = useState<Evolution[]>(INITIAL_EVOLUTIONS);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>(MOCK_SCHEDULE);
  const [accountsPayable] = useState<AccountsPayable[]>(INITIAL_ACCOUNTS_PAYABLE);

  // UI States
  const [activeTab, setActiveTab] = useState<TabId>('cadastro');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(professional || {});

  // Filter data for this professional
  const professionalEvolutions = useMemo(() =>
    evolutions.filter(e => e.professionalId === professionalId),
    [evolutions, professionalId]
  );

  const professionalSchedule = useMemo(() =>
    scheduleEntries.filter(e => e.professionalId === professionalId),
    [scheduleEntries, professionalId]
  );

  const checkInOuts = useMemo(() =>
    getCheckInOutsByProfessional(professionalId),
    [professionalId]
  );

  const linkedPatientIds = useMemo(() =>
    getPatientsForProfessional(professionalId),
    [professionalId]
  );

  const linkedPatients = useMemo(() =>
    MOCK_PATIENTS.filter(p => linkedPatientIds.includes(p.id)),
    [linkedPatientIds]
  );

  // Filter payments for this professional (salary and related payments)
  const professionalPayments = useMemo(() =>
    accountsPayable.filter(p =>
      p.category === 'salario' ||
      p.description.toLowerCase().includes(professional?.name.toLowerCase() || '')
    ),
    [accountsPayable, professional?.name]
  );

  if (!professional) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Profissional não encontrado</h2>
          <Button onClick={() => navigate('/profissionais')}>Voltar para Lista</Button>
        </div>
      </div>
    );
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfessional = () => {
    setProfessionals(prev => prev.map(p => p.id === professionalId ? formData : p));

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'update',
      entity: 'Professional',
      entityId: professionalId,
      description: `Atualizou dados do profissional: ${formData.name}`
    });

    setIsEditing(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/profissionais')}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                {professional.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{professional.name}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                    {roleLabels[professional.role]}
                  </span>
                  <StatusBadge status={professional.status} />
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
                  <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData(professional); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfessional} icon={Save}>Salvar</Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} icon={Edit2}>Editar</Button>
              )}
            </div>

            {isEditing ? (
              <ProfessionalForm
                formData={formData}
                onFormChange={handleFormChange}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Informações Profissionais</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400">Nome Completo</span>
                      <p className="font-medium text-slate-800">{professional.name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Categoria</span>
                      <p className="text-slate-800">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-sm font-medium">
                          {roleLabels[professional.role]}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-slate-400" />
                      <div>
                        <span className="text-xs text-slate-400">Número do Conselho</span>
                        <p className="font-mono text-slate-800">{professional.councilNumber}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Status</span>
                      <p className="mt-1">
                        <StatusBadge status={professional.status} />
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Contato</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4">
                      <Phone size={20} className="text-slate-400" />
                      <div>
                        <span className="text-xs text-slate-400">Telefone</span>
                        <p className="font-medium text-slate-800">{professional.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4">
                      <Mail size={20} className="text-slate-400" />
                      <div>
                        <span className="text-xs text-slate-400">E-mail</span>
                        <p className="font-medium text-slate-800">{professional.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Estatísticas</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">{linkedPatients.length}</p>
                        <p className="text-xs text-blue-600">Pacientes</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-600">{professionalEvolutions.length}</p>
                        <p className="text-xs text-emerald-600">Evoluções</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-amber-600">{checkInOuts.filter(c => c.type === 'check_in').length}</p>
                        <p className="text-xs text-amber-600">Check-ins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pacientes Tab */}
        {activeTab === 'pacientes' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-800">
                Pacientes Atendidos ({linkedPatients.length})
              </h2>
              <p className="text-sm text-slate-500">
                Pacientes com atendimentos registrados por este profissional
              </p>
            </div>

            {linkedPatients.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users size={48} className="mx-auto mb-3 opacity-50" />
                <p>Nenhum paciente atendido</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {linkedPatients.map(patient => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/pacientes/${patient.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {patient.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{patient.name}</p>
                        <p className="text-sm text-slate-500">{patient.diagnosis}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={patient.status} />
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
              <h2 className="font-bold text-slate-800">Evoluções Realizadas</h2>
              <p className="text-sm text-slate-500">
                {professionalEvolutions.length} evolução(ões) registrada(s) por este profissional
              </p>
            </div>

            {professionalEvolutions.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <FileText size={48} className="mx-auto mb-3 opacity-50" />
                <p>Nenhuma evolução registrada por este profissional</p>
              </div>
            ) : (
              <div className="space-y-0">
                {professionalEvolutions
                  .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
                  .map(evolution => (
                    <div key={evolution.id} className="relative">
                      <div className="absolute top-0 left-0 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium z-10">
                        {evolution.patientName}
                      </div>
                      <div className="pt-6">
                        <EvolutionCard evolution={evolution} />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Escala Tab */}
        {activeTab === 'escala' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="font-bold text-slate-800">Escala de Trabalho</h2>
              <p className="text-sm text-slate-500">
                {professionalSchedule.length} agendamento(s) para este profissional
              </p>
            </div>

            <ScheduleCalendar
              entries={professionalSchedule}
              professionals={professionals}
              patients={MOCK_PATIENTS}
              onSaveEntry={(entry) => {
                if (entry.id) {
                  setScheduleEntries(prev =>
                    prev.map(e => e.id === entry.id ? { ...e, ...entry } as ScheduleEntry : e)
                  );
                } else {
                  const newEntry: ScheduleEntry = {
                    ...entry,
                    id: `sched-${Date.now()}`,
                    professionalId: professionalId,
                    professionalName: professional?.name || '',
                    professionalRole: professional?.role || '',
                    createdAt: new Date(),
                    createdBy: 'prof-admin'
                  } as ScheduleEntry;
                  setScheduleEntries(prev => [...prev, newEntry]);

                  loggingService.log({
                    userId: 'prof-admin',
                    userName: 'Administrador do Sistema',
                    userRole: 'admin',
                    action: 'create',
                    entity: 'Schedule',
                    entityId: newEntry.id,
                    description: `Criou novo agendamento para ${newEntry.professionalName}`
                  });
                }
              }}
              showNewButton={true}
            />
          </div>
        )}

        {/* Check-ins Tab */}
        {activeTab === 'checkins' && (
          <CheckInOutHistory checks={checkInOuts} />
        )}

        {/* Financeiro Tab */}
        {activeTab === 'financeiro' && (
          <ProfessionalFinancial
            professionalName={professional.name}
            payments={professionalPayments}
          />
        )}
      </main>
    </div>
  );
}
