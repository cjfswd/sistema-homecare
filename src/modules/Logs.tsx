import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Clock,
  Database,
  Download,
  Trash2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { loggingService } from '@/lib/loggingService';
import type { LogEntry, LogAction } from '@/types';
import { Pagination, usePagination } from '@/components/ui';
import { formatDateTime } from '@/lib/formatters';

export default function LogsModule() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  useEffect(() => {
    const loadLogs = () => {
      setLogs(loggingService.getLogs());
    };

    loadLogs();

    window.addEventListener('new-log-entry', loadLogs);
    window.addEventListener('logs-cleared', loadLogs);

    return () => {
      window.removeEventListener('new-log-entry', loadLogs);
      window.removeEventListener('logs-cleared', loadLogs);
    };
  }, []);

  const uniqueEntities = useMemo(() => {
    const entities = logs.map(l => l.entity);
    return Array.from(new Set(entities));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesEntity = entityFilter === 'all' || log.entity === entityFilter;

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [logs, searchTerm, actionFilter, entityFilter]);

  const logsPage = usePagination(filteredLogs, 20);

  const getActionStyle = (action: LogAction) => {
    switch (action) {
      case 'create': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'update': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delete': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'archive': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'approve': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'reject': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'login': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActionLabel = (action: LogAction) => {
    switch (action) {
      case 'create': return 'Criação';
      case 'update': return 'Atualização';
      case 'delete': return 'Exclusão';
      case 'archive': return 'Arquivamento';
      case 'approve': return 'Aprovação';
      case 'reject': return 'Rejeição';
      case 'login': return 'Login';
      default: return action;
    }
  };

  const handleClearLogs = () => {
    if (confirm('Tem certeza que deseja limpar todos os logs do sistema? Esta ação não pode ser desfeita.')) {
      loggingService.clearLogs();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="text-slate-700" />
              Audit Logs (Trilha de Auditoria)
            </h1>
            <p className="text-slate-500 text-sm mt-1">Monitoramento de todas as ações realizadas no sistema.</p>
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium">
              <Download size={16} /> Exportar CSV
            </button>
            <button 
              onClick={handleClearLogs}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition text-sm font-medium"
            >
              <Trash2 size={16} /> Limpar Logs
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por descrição, usuário ou ID..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg outline-none focus:ring-2 focus:ring-slate-300 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="bg-slate-100 border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">Todas as Ações</option>
              <option value="create">Criação</option>
              <option value="update">Atualização</option>
              <option value="delete">Exclusão</option>
              <option value="approve">Aprovação</option>
              <option value="reject">Rejeição</option>
              <option value="archive">Arquivamento</option>
              <option value="login">Login</option>
            </select>

            <select 
              className="bg-slate-100 border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option value="all">Todas as Entidades</option>
              {uniqueEntities.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Data/Hora</th>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Ação</th>
                  <th className="px-6 py-4">Entidade</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <Database size={48} className="mx-auto mb-3 opacity-20" />
                      <p>Nenhum registro de auditoria encontrado.</p>
                    </td>
                  </tr>
                ) : (
                  logsPage.paginatedItems.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={14} className="text-slate-400" />
                          {formatDateTime(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-[10px]">
                            {log.userName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-700">{log.userName}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">{log.userRole}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getActionStyle(log.action)}`}>
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {log.entity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700 max-w-md truncate" title={log.description}>
                          {log.description}
                        </div>
                        {log.entityId && (
                          <div className="text-[10px] text-slate-400 mt-0.5">ID: {log.entityId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-300 group-hover:text-slate-600 transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLogs.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={logsPage.currentPage}
              totalPages={logsPage.totalPages}
              totalItems={filteredLogs.length}
              itemsPerPage={logsPage.itemsPerPage}
              onPageChange={logsPage.handlePageChange}
              onItemsPerPageChange={logsPage.handleItemsPerPageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}
