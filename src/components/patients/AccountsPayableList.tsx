import { useState } from 'react';
import { TrendingDown, Plus, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, Tag } from 'lucide-react';
import type { AccountsPayable, PaymentStatus } from '@/types';
import { Button } from '@/components/ui';

interface AccountsPayableListProps {
  accounts: AccountsPayable[];
  onNewAccount?: () => void;
  onSelectAccount?: (account: AccountsPayable) => void;
}

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case 'pago':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'parcialmente_pago':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'vencido':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cancelado':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getStatusLabel = (status: PaymentStatus) => {
  switch (status) {
    case 'pago':
      return 'Pago';
    case 'parcialmente_pago':
      return 'Parcialmente Pago';
    case 'pendente':
      return 'Pendente';
    case 'vencido':
      return 'Vencido';
    case 'cancelado':
      return 'Cancelado';
    default:
      return status;
  }
};

const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case 'pago':
      return <CheckCircle size={14} />;
    case 'vencido':
      return <AlertCircle size={14} />;
    default:
      return <Clock size={14} />;
  }
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    fornecedor: 'Fornecedor',
    salario: 'Salário',
    impostos: 'Impostos',
    aluguel: 'Aluguel',
    servicos: 'Serviços',
    outros: 'Outros'
  };
  return labels[category] || category;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    fornecedor: 'bg-blue-100 text-blue-800',
    salario: 'bg-purple-100 text-purple-800',
    impostos: 'bg-orange-100 text-orange-800',
    aluguel: 'bg-cyan-100 text-cyan-800',
    servicos: 'bg-teal-100 text-teal-800',
    outros: 'bg-slate-100 text-slate-800'
  };
  return colors[category] || 'bg-slate-100 text-slate-800';
};

const getPaymentMethodLabel = (method?: string) => {
  if (!method) return '-';
  const labels: Record<string, string> = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
    boleto: 'Boleto',
    transferencia: 'Transferência'
  };
  return labels[method] || method;
};

export default function AccountsPayableList({ accounts, onNewAccount, onSelectAccount }: AccountsPayableListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  let filteredAccounts = accounts;

  if (selectedStatus !== 'all') {
    filteredAccounts = filteredAccounts.filter(a => a.status === selectedStatus);
  }

  if (selectedCategory !== 'all') {
    filteredAccounts = filteredAccounts.filter(a => a.category === selectedCategory);
  }

  const sortedAccounts = [...filteredAccounts].sort((a, b) =>
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  );

  // Calculate totals
  const totalPayable = accounts.reduce((sum, a) => sum + a.amount, 0);
  const totalPaid = accounts.reduce((sum, a) => sum + a.paidAmount, 0);
  const totalPending = accounts.reduce((sum, a) => sum + a.remainingAmount, 0);
  const totalOverdue = accounts
    .filter(a => a.status === 'vencido')
    .reduce((sum, a) => sum + a.remainingAmount, 0);

  // Get unique categories
  const categories = Array.from(new Set(accounts.map(a => a.category)));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <TrendingDown size={20} className="text-red-600" />
              Contas a Pagar
            </h2>
            <p className="text-sm text-slate-500">
              {accounts.length} conta(s) cadastrada(s)
            </p>
          </div>
          {onNewAccount && (
            <Button onClick={onNewAccount} icon={Plus} size="sm">
              Nova Conta
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-red-600" />
              <span className="text-xs font-semibold text-red-700 uppercase">Total a Pagar</span>
            </div>
            <p className="text-xl font-bold text-red-800">
              R$ {totalPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700 uppercase">Total Pago</span>
            </div>
            <p className="text-xl font-bold text-green-800">
              R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700 uppercase">Pendente</span>
            </div>
            <p className="text-xl font-bold text-yellow-800">
              R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-xs font-semibold text-red-700 uppercase">Vencido</span>
            </div>
            <p className="text-xl font-bold text-red-800">
              R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Filtrar por Status</label>
          <div className="flex flex-wrap gap-2">
            {['all', 'pendente', 'vencido', 'parcialmente_pago', 'pago'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  selectedStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'Todos' : getStatusLabel(status as PaymentStatus)} (
                {status === 'all' ? accounts.length : accounts.filter(a => a.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Filtrar por Categoria</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({accounts.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {getCategoryLabel(category)} ({accounts.filter(a => a.category === category).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {sortedAccounts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <TrendingDown size={48} className="mx-auto mb-3 opacity-50" />
            <p>Nenhuma conta a pagar encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedAccounts.map(account => (
              <div
                key={account.id}
                className="p-4 hover:bg-slate-50 transition cursor-pointer"
                onClick={() => onSelectAccount?.(account)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">
                        {account.supplierName}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border flex items-center gap-1 ${getStatusColor(account.status)}`}>
                        {getStatusIcon(account.status)}
                        {getStatusLabel(account.status)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${getCategoryColor(account.category)}`}>
                        <Tag size={12} />
                        {getCategoryLabel(account.category)}
                      </span>
                      {account.installment && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                          {account.installment.current}/{account.installment.total}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mb-2">{account.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400 block text-xs">Valor Total</span>
                        <span className="font-semibold text-slate-800">
                          R$ {account.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {account.paidAmount > 0 && (
                        <div>
                          <span className="text-slate-400 block text-xs">Valor Pago</span>
                          <span className="font-semibold text-green-600">
                            R$ {account.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}

                      {account.remainingAmount > 0 && (
                        <div>
                          <span className="text-slate-400 block text-xs">Saldo</span>
                          <span className="font-semibold text-orange-600">
                            R$ {account.remainingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-400 block text-xs">Vencimento</span>
                        <span className={`flex items-center gap-1 ${
                          account.status === 'vencido' ? 'text-red-600 font-semibold' : 'text-slate-700'
                        }`}>
                          <Calendar size={12} />
                          {new Date(account.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {account.paymentMethod && (
                        <div>
                          <span className="text-slate-400 block text-xs">Forma de Pagamento</span>
                          <span className="text-slate-700">
                            {getPaymentMethodLabel(account.paymentMethod)}
                          </span>
                        </div>
                      )}
                    </div>

                    {account.notes && (
                      <div className="mt-2 text-xs text-slate-500 italic">
                        {account.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
