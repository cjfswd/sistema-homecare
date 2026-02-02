import { Copy, FileText, Calendar } from 'lucide-react';
import type { Budget, PriceTable } from '@/types';
import { Table, Button, StatusBadge, Pagination, usePagination, type Column } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface BudgetListProps {
  budgets: Budget[];
  tables: PriceTable[];
}

export function BudgetList({ budgets, tables }: BudgetListProps) {
  const budgetsPage = usePagination(budgets, 15);

  const columns: Column<Budget>[] = [
    {
      key: 'patient',
      header: 'ID / Paciente',
      render: (budget: Budget) => (
        <div>
          <div className="font-bold text-slate-800">{budget.patientName}</div>
          <div className="text-xs text-slate-400 font-mono uppercase">{budget.id}</div>
        </div>
      ),
    },
    {
      key: 'table',
      header: 'Tabela Aplicada',
      render: (budget: Budget) => (
        <span className="text-sm text-slate-600">
          {tables.find(t => t.id === budget.tableId)?.name || 'Tabela Desconhecida'}
        </span>
      ),
    },
    {
      key: 'version',
      header: 'Versão',
      render: (budget: Budget) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border
          ${budget.type === 'original' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-blue-50 text-blue-600 border-blue-100'}
        `}>
          v{budget.version} - {budget.type}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Data',
      render: (budget: Budget) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar size={14} /> {formatDate(new Date(budget.createdAt))}
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Valor Total',
      align: 'right',
      render: (budget: Budget) => (
        <span className="font-bold text-emerald-700">
          {formatCurrency(budget.totalValue)}
        </span>
      ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (budget: Budget) => <StatusBadge status={budget.status} />,
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'center',
      render: () => (
        <div className="flex justify-center gap-2">
          <Button variant="ghost" size="sm" icon={Copy} title="Clonar / Gerar Aditivo" />
          <Button variant="ghost" size="sm" icon={FileText} title="Visualizar Detalhes" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={budgetsPage.paginatedItems}
          columns={columns}
          keyExtractor={(budget) => budget.id}
        />
      </div>

      {budgets.length > 0 && (
        <Pagination
          currentPage={budgetsPage.currentPage}
          totalPages={budgetsPage.totalPages}
          totalItems={budgets.length}
          itemsPerPage={budgetsPage.itemsPerPage}
          onPageChange={budgetsPage.handlePageChange}
          onItemsPerPageChange={budgetsPage.handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
