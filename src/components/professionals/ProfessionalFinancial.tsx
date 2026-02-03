import { DollarSign, TrendingDown, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { AccountsPayable, PaymentStatus } from '@/types';

interface ProfessionalFinancialProps {
  professionalName: string;
  payments: AccountsPayable[];
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

export default function ProfessionalFinancial({ professionalName, payments }: ProfessionalFinancialProps) {
  const sortedPayments = [...payments].sort((a, b) =>
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  );

  // Calculate totals
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = payments.reduce((sum, p) => sum + p.remainingAmount, 0);

  // Get current month payments
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthPayments = payments.filter(p => {
    const paymentDate = new Date(p.dueDate);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  });
  const monthTotal = monthPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Informações Financeiras
          </h2>
          <p className="text-sm text-slate-500">
            Pagamentos e salários relacionados a {professionalName}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">Total Acumulado</span>
            </div>
            <p className="text-xl font-bold text-blue-800">
              R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-purple-600" />
              <span className="text-xs font-semibold text-purple-700 uppercase">Mês Atual</span>
            </div>
            <p className="text-xl font-bold text-purple-800">
              R$ {monthTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Payments History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Histórico de Pagamentos</h3>
          <p className="text-sm text-slate-500">{payments.length} pagamento(s) registrado(s)</p>
        </div>

        {sortedPayments.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
            <p>Nenhum pagamento registrado</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedPayments.map(payment => (
              <div key={payment.id} className="p-4 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-800">{payment.description}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400 block text-xs">Valor</span>
                        <span className="font-semibold text-slate-800">
                          R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {payment.paidAmount > 0 && (
                        <div>
                          <span className="text-slate-400 block text-xs">Valor Pago</span>
                          <span className="font-semibold text-green-600">
                            R$ {payment.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}

                      {payment.remainingAmount > 0 && (
                        <div>
                          <span className="text-slate-400 block text-xs">Saldo</span>
                          <span className="font-semibold text-orange-600">
                            R$ {payment.remainingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-400 block text-xs">
                          {payment.paymentDate ? 'Data Pagamento' : 'Vencimento'}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          payment.status === 'vencido' ? 'text-red-600 font-semibold' : 'text-slate-700'
                        }`}>
                          <Calendar size={12} />
                          {new Date(payment.paymentDate || payment.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {payment.paymentMethod && (
                        <div>
                          <span className="text-slate-400 block text-xs">Forma de Pagamento</span>
                          <span className="text-slate-700">
                            {getPaymentMethodLabel(payment.paymentMethod)}
                          </span>
                        </div>
                      )}
                    </div>

                    {payment.notes && (
                      <div className="mt-2 text-xs text-slate-500 italic">
                        {payment.notes}
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
