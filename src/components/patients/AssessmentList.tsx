import { useState, useMemo } from 'react';
import { Search, Plus, Filter, ClipboardList } from 'lucide-react';
import type { Assessment, AssessmentType } from '@/types';
import { AssessmentCard } from './AssessmentCard';
import { usePagination, Pagination } from '@/components/ui/Pagination';

interface AssessmentListProps {
  assessments: Assessment[];
  onSelect?: (assessment: Assessment) => void;
  onNew?: (type: AssessmentType) => void;
  showNewButton?: boolean;
}

export function AssessmentList({ assessments, onSelect, onNew, showNewButton = true }: AssessmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssessmentType | 'all'>('all');

  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesSearch = assessment.performedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || assessment.type === typeFilter;
      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
  }, [assessments, searchTerm, typeFilter]);

  const pagination = usePagination(filteredAssessments, 6);

  return (
    <div className="space-y-4">
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por avaliador ou notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AssessmentType | 'all')}
              className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="all">Todos os Tipos</option>
              <option value="ABEMID">ABEMID</option>
              <option value="NEAD">NEAD</option>
            </select>
          </div>

          {showNewButton && onNew && (
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Nova Avaliação</span>
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => onNew('ABEMID')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 text-slate-700 rounded-t-lg"
                >
                  ABEMID
                </button>
                <button
                  onClick={() => onNew('NEAD')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 text-slate-700 rounded-b-lg border-t border-slate-100"
                >
                  NEAD
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de avaliações */}
      {pagination.paginatedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <ClipboardList size={48} className="mb-3 opacity-50" />
          <p className="text-lg font-medium">Nenhuma avaliação encontrada</p>
          <p className="text-sm">Clique em "Nova Avaliação" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pagination.paginatedItems.map(assessment => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              onClick={() => onSelect?.(assessment)}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {filteredAssessments.length > pagination.itemsPerPage && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={filteredAssessments.length}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.handlePageChange}
        />
      )}
    </div>
  );
}
