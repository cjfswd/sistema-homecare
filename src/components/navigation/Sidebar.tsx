import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Stethoscope,
  Wallet,
  BarChart3,
  Box,
  X,
  HeartPulse,
  LogOut,
  Activity,
  Shield,
  Users,
  FileBadge
} from 'lucide-react';

import { authService } from '@/lib/authService';
import type { PermissionEntity } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: typeof Home;
  entity?: PermissionEntity;
}

const navItems: NavItem[] = [
  { path: '/home', label: 'Início', icon: Home },
  { path: '/clinical', label: 'Evolução Clínica', icon: Stethoscope, entity: 'evolutions' },
  { path: '/vidas-rh', label: 'Vidas & RH', icon: Users, entity: 'patients' },
  { path: '/finances', label: 'Financeiro', icon: Wallet, entity: 'finances' },
  { path: '/tabelas', label: 'Tabelas & Config', icon: FileBadge, entity: 'services' },
  { path: '/reports', label: 'Relatórios', icon: BarChart3, entity: 'logs' },
  { path: '/stock', label: 'Estoque', icon: Box, entity: 'stock' },
  { path: '/logs', label: 'Logs do Sistema', icon: Activity, entity: 'logs' },
  { path: '/auth', label: 'Controle de Acesso', icon: Shield, entity: 'roles' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const visibleItems = navItems.filter(item => {
    if (!item.entity) return true;
    return authService.checkCurrent('view', item.entity);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] bg-slate-900
          transform transition-transform lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <HeartPulse className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Homecare</h1>
              <p className="text-slate-400 text-xs">Sistema ERP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-150
                  ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between gap-3 px-2 py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Admin</p>
                <p className="text-slate-400 text-xs">Administrador</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="p-2 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
