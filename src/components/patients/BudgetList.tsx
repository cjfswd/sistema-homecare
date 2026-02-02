import { useState } from 'react';
import { FileText, Plus, Eye, Calendar, DollarSign } from 'lucide-react';
import type { Budget } from '@/types';
import { Button, StatusBadge } from '@/components/ui';

interface BudgetListProps {
  budgets: Budget[];
  onSelectBudget?: (budget: Budget) => void;
  onNewBudget?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Aprovado';
    case 'draft':
      return 'Rascunho';
    case 'rejected':
      return 'Rejeitado';
    default:
      return status;
  }
};

const getBudgetTypeLabel = (type: string) => {
  switch (type) {
    case 'original':
      return 'Original';
    case 'aditivo':
      return 'Aditivo';
    case 'prorrogacao':
      return 'Prorrogação';
    default:
      return type;
  }
};

export default function BudgetList({ budgets, onSelectBudget, onNewBudget }: BudgetListProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredBudgets = selectedType === 'all'
    ? budgets
    : budgets.filter(b => b.type === selectedType);

  const sortedBudgets = [...filteredBudgets].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalApproved = budgets
    .filter(b => b.status === 'approved')
    .reduce((sum, b) => sum + b.totalValue, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Orçamentos</h2>
            <p className="text-sm text-slate-500">
              {budgets.length} orçamento(s) cadastrado(s)
            </p>
          </div>
          {onNewBudget && (
            <Button onClick={onNewBudget} icon={Plus} size="sm">
              Novo Orçamento
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700 uppercase">Total Aprovado</span>
            </div>
            <p className="text-2xl font-bold text-green-800">
              R$ {totalApproved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">Aprovados</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">
              {budgets.filter(b => b.status === 'approved').length}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700 uppercase">Em Análise</span>
            </div>
            <p className="text-2xl font-bold text-yellow-800">
              {budgets.filter(b => b.status === 'draft').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({budgets.length})
          </button>
          <button
            onClick={() => setSelectedType('original')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedType === 'original'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Original ({budgets.filter(b => b.type === 'original').length})
          </button>
          <button
            onClick={() => setSelectedType('aditivo')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedType === 'aditivo'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Aditivo ({budgets.filter(b => b.type === 'aditivo').length})
          </button>
          <button
            onClick={() => setSelectedType('prorrogacao')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              selectedType === 'prorrogacao'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Prorrogação ({budgets.filter(b => b.type === 'prorrogacao').length})
          </button>
        </div>
      </div>

      {/* Budget List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {sortedBudgets.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p>Nenhum orçamento encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedBudgets.map(budget => (
              <div
                key={budget.id}
                className="p-4 hover:bg-slate-50 transition cursor-pointer"
                onClick={() => onSelectBudget?.(budget)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">
                        {budget.id}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(budget.status)}`}>
                        {getStatusLabel(budget.status)}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                        {getBudgetTypeLabel(budget.type)} - v{budget.version}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400 block text-xs">Valor Total</span>
                        <span className="font-semibold text-green-600">
                          R$ {budget.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Custo Total</span>
                        <span className="font-semibold text-slate-700">
                          R$ {budget.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Data de Criação</span>
                        <span className="text-slate-700 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(budget.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Itens</span>
                        <span className="text-slate-700">
                          {budget.items.length} item(ns)
                        </span>
                      </div>
                    </div>

                    {budget.notes && (
                      <div className="mt-2 text-xs text-slate-500 italic">
                        {budget.notes}
                      </div>
                    )}
                  </div>

                  <button
                    className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBudget?.(budget);
                    }}
                  >
                    <Eye size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
