import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Users,
  Wallet,
  BarChart3,
  Box,
  ArrowRight,
  FileBadge,
  Activity,
  Shield
} from 'lucide-react';

interface ModuleCard {
  path: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

const modules: ModuleCard[] = [
  {
    path: '/clinical',
    title: 'Evolução Clínica',
    description: 'Acompanhamento de pacientes, prescrições médicas e sinais vitais',
    icon: Stethoscope,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    path: '/vidas-rh',
    title: 'Vidas & RH',
    description: 'Gestão completa de pacientes e corpo clínico profissional',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  {
    path: '/finances',
    title: 'Financeiro',
    description: 'Geração e gestão de orçamentos assistenciais (PAD)',
    icon: Wallet,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    path: '/tabelas',
    title: 'Tabelas & Config',
    description: 'Catálogo de serviços e tabelas de preços estratégicas',
    icon: FileBadge,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  {
    path: '/reports',
    title: 'Relatórios',
    description: 'Indicadores gerenciais, censo operacional e análises de BI',
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    path: '/stock',
    title: 'Estoque e Logística',
    description: 'Controle de inventário multi-localização e movimentações',
    icon: Box,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    path: '/logs',
    title: 'Logs do Sistema',
    description: 'Trilha de auditoria completa de todas as ações no sistema',
    icon: Activity,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
  {
    path: '/auth',
    title: 'Controle de Acesso',
    description: 'Gestão dinâmica de papéis e permissões (RBAC)',
    icon: Shield,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-full p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          Bem-vindo ao Sistema de Homecare
        </h1>
        <p className="text-lg text-slate-600">
          Visão geral do sistema e acesso aos módulos.
        </p>
      </header>

      {/* Quick Stats at the Top */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-sm font-medium mb-1 uppercase tracking-wider">Pacientes Ativos</p>
          <p className="text-3xl font-bold text-slate-800">142</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-sm font-medium mb-1 uppercase tracking-wider">Profissionais</p>
          <p className="text-3xl font-bold text-slate-800">87</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-sm font-medium mb-1 uppercase tracking-wider">Atendimentos (Mês)</p>
          <p className="text-3xl font-bold text-slate-800">1.234</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-sm font-medium mb-1 uppercase tracking-wider">Taxa de Ocupação</p>
          <p className="text-3xl font-bold text-emerald-600">94%</p>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.path}
              to={module.path}
              className={`
                group relative
                ${module.bgColor} ${module.borderColor}
                border-2 rounded-xl p-6
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-200
              `}
            >
              {/* Icon */}
              <div className={`${module.color} mb-4`}>
                <Icon size={48} strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {module.title}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {module.description}
              </p>

              {/* Arrow Icon */}
              <div className={`flex items-center gap-2 ${module.color} font-medium text-sm`}>
                <span>Acessar módulo</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
