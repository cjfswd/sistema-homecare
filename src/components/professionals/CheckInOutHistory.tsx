import { useState, useMemo } from 'react';
import { Search, Filter, Clock, Calendar, TrendingUp, LogIn, LogOut } from 'lucide-react';
import type { CheckInOut } from '@/types';
import { CheckInOutCard } from './CheckInOutCard';
import { usePagination, Pagination } from '@/components/ui/Pagination';

interface CheckInOutHistoryProps {
  checks: CheckInOut[];
  onSelect?: (check: CheckInOut) => void;
}

export function CheckInOutHistory({ checks, onSelect }: CheckInOutHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'check_in' | 'check_out'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredChecks = useMemo(() => {
    return checks.filter(check => {
      const matchesSearch = check.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || check.type === typeFilter;

      let matchesDate = true;
      const checkDate = new Date(check.timestamp);
      if (dateFrom) {
        matchesDate = matchesDate && checkDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && checkDate <= new Date(dateTo + 'T23:59:59');
      }

      return matchesSearch && matchesType && matchesDate;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [checks, searchTerm, typeFilter, dateFrom, dateTo]);

  const pagination = usePagination(filteredChecks, 10);

  // Calculate statistics
  const stats = useMemo(() => {
    const checkIns = filteredChecks.filter(c => c.type === 'check_in').length;
    const checkOuts = filteredChecks.filter(c => c.type === 'check_out').length;

    // Calculate total hours worked (rough estimate based on check-in/out pairs)
    let totalMinutes = 0;
    const checkInMap = new Map<string, CheckInOut>();

    filteredChecks.forEach(check => {
      if (check.type === 'check_in') {
        checkInMap.set(check.scheduleEntryId, check);
      } else {
        const checkIn = checkInMap.get(check.scheduleEntryId);
        if (checkIn) {
          const diff = new Date(check.timestamp).getTime() - new Date(checkIn.timestamp).getTime();
          totalMinutes += diff / (1000 * 60);
          checkInMap.delete(check.scheduleEntryId);
        }
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    return { checkIns, checkOuts, hours, minutes };
  }, [filteredChecks]);

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <LogIn size={20} />
            </div>
            <div>
              <p className="text-sm text-emerald-600">Check-ins</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.checkIns}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <div>
              <p className="text-sm text-blue-600">Check-outs</p>
              <p className="text-2xl font-bold text-blue-700">{stats.checkOuts}</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm text-indigo-600">Horas Trabalhadas</p>
              <p className="text-2xl font-bold text-indigo-700">{stats.hours}h {stats.minutes}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="check_in">Check-ins</option>
              <option value="check_out">Check-outs</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="De"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Até"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {pagination.paginatedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Clock size={48} className="mb-3 opacity-50" />
          <p className="text-lg font-medium">Nenhum registro encontrado</p>
          <p className="text-sm">Ajuste os filtros ou aguarde novos registros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pagination.paginatedItems.map(check => (
            <CheckInOutCard
              key={check.id}
              check={check}
              onClick={() => onSelect?.(check)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredChecks.length > pagination.itemsPerPage && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={filteredChecks.length}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.handlePageChange}
        />
      )}
    </div>
  );
}
