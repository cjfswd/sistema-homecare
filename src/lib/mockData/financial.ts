import type { PriceTable, Budget, AccountsReceivable, AccountsPayable, PaymentStatus, PaymentMethod } from '@/types';
import { MOCK_SERVICES } from './services';
import { MOCK_PATIENTS } from './patients';

// =============================================================================
// PRICE TABLES
// =============================================================================

const insuranceNames = ['UNIMED', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Porto Seguro', 'Notre Dame', 'Prevent Senior', 'Golden Cross'];

export const INITIAL_PRICE_TABLES: PriceTable[] = [
  {
    id: 't1',
    name: 'Tabela Particular 2024',
    type: 'particular',
    items: MOCK_SERVICES.filter(s => s.active).slice(0, 20).map(s => ({
      serviceId: s.id,
      costPrice: s.basePrice * 0.4,
      sellPrice: s.basePrice
    }))
  },
  ...insuranceNames.map((insurance, i) => ({
    id: `t${i + 2}`,
    name: `Convênio ${insurance}`,
    type: 'convenio' as const,
    items: MOCK_SERVICES.filter(s => s.active).slice(0, 15).map(s => ({
      serviceId: s.id,
      costPrice: s.basePrice * 0.4,
      sellPrice: s.basePrice * (0.75 + (i * 0.05)) // Different margins per insurance
    }))
  }))
];

// =============================================================================
// BUDGETS
// =============================================================================

const budgetTypes: Array<'original' | 'aditivo' | 'prorrogacao'> = ['original', 'aditivo', 'prorrogacao'];
const budgetStatuses: Array<'draft' | 'approved' | 'rejected'> = ['approved', 'approved', 'approved', 'draft', 'rejected'];

// Generate 100 budgets
export const INITIAL_BUDGETS: Budget[] = Array.from({ length: 100 }, (_, i) => {
  const patient = MOCK_PATIENTS[i % Math.min(40, MOCK_PATIENTS.length)];
  const table = INITIAL_PRICE_TABLES[i % INITIAL_PRICE_TABLES.length];
  const numItems = 2 + (i % 4);
  const type = budgetTypes[i % budgetTypes.length];
  const status = budgetStatuses[i % budgetStatuses.length];

  const items = Array.from({ length: numItems }, (_, j) => {
    const serviceIdx = (i + j) % table.items.length;
    const tableItem = table.items[serviceIdx];
    const quantity = type === 'aditivo' ? 5 + (j * 2) : 30;

    return {
      id: `l-${i}-${j}`,
      serviceId: tableItem.serviceId,
      quantity,
      unitPrice: tableItem.sellPrice,
      total: quantity * tableItem.sellPrice
    };
  });

  const totalValue = items.reduce((sum, item) => sum + item.total, 0);
  const totalCost = items.reduce((sum, item) => {
    const tableItem = table.items.find(ti => ti.serviceId === item.serviceId)!;
    return sum + (item.quantity * tableItem.costPrice);
  }, 0);

  return {
    id: `orc-${1000 + i}`,
    patientId: patient.id,
    patientName: patient.name,
    tableId: table.id,
    version: type === 'original' ? 1 : type === 'aditivo' ? 2 : 1,
    type,
    status,
    createdAt: new Date(new Date().getTime() - (i * 86400000 * 2)).toISOString().split('T')[0],
    validUntil: new Date(new Date().getTime() + (30 * 86400000)).toISOString().split('T')[0],
    items,
    totalValue,
    totalCost,
    notes: status === 'draft' ? 'Aguardando aprovação' : status === 'rejected' ? 'Valores não aprovados pelo convênio' : undefined
  };
});

// =============================================================================
// ACCOUNTS RECEIVABLE (CONTAS A RECEBER)
// =============================================================================

const paymentStatuses: PaymentStatus[] = ['pendente', 'parcialmente_pago', 'pago', 'vencido'];
const paymentMethods: PaymentMethod[] = ['pix', 'cartao_credito', 'boleto', 'transferencia', 'dinheiro'];

export const INITIAL_ACCOUNTS_RECEIVABLE: AccountsReceivable[] = Array.from({ length: 150 }, (_, i) => {
  const patient = MOCK_PATIENTS[i % Math.min(40, MOCK_PATIENTS.length)];
  const budget = INITIAL_BUDGETS[i % INITIAL_BUDGETS.length];
  const amount = 1000 + (i * 150) + Math.random() * 500;
  const status = paymentStatuses[i % paymentStatuses.length];

  let paidAmount = 0;
  if (status === 'pago') {
    paidAmount = amount;
  } else if (status === 'parcialmente_pago') {
    paidAmount = amount * (0.3 + Math.random() * 0.5);
  }

  const remainingAmount = amount - paidAmount;
  const daysOffset = (i % 60) - 30; // Some past due, some future
  const dueDate = new Date(new Date().getTime() + (daysOffset * 86400000));

  const hasInstallment = i % 3 === 0;

  return {
    id: `ar-${2000 + i}`,
    patientId: patient.id,
    patientName: patient.name,
    budgetId: i % 2 === 0 ? budget.id : undefined,
    description: i % 2 === 0 ? `Pagamento ref. Orçamento ${budget.id}` : `Mensalidade ${new Date(dueDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
    amount,
    paidAmount,
    remainingAmount,
    status: status === 'pendente' && daysOffset < 0 ? 'vencido' : status,
    dueDate: dueDate.toISOString().split('T')[0],
    paymentDate: status === 'pago' ? new Date(dueDate.getTime() - (Math.random() * 5 * 86400000)).toISOString().split('T')[0] : undefined,
    paymentMethod: status === 'pago' || status === 'parcialmente_pago' ? paymentMethods[i % paymentMethods.length] : undefined,
    installment: hasInstallment ? {
      current: (i % 12) + 1,
      total: 12
    } : undefined,
    notes: status === 'vencido' ? 'Pagamento em atraso' : undefined,
    createdAt: new Date(dueDate.getTime() - (30 * 86400000)).toISOString().split('T')[0]
  };
});

// =============================================================================
// ACCOUNTS PAYABLE (CONTAS A PAGAR)
// =============================================================================

const supplierNames = [
  'Farmácia São Paulo',
  'Distribuidora Médica Nacional',
  'Hospital das Clínicas',
  'Laboratório Fleury',
  'Oxigênio Saúde Ltda',
  'Aluguel Escritório',
  'Energia Elétrica',
  'Telefonia Claro',
  'Prefeitura Municipal - Impostos',
  'Receita Federal - INSS',
  'Contabilidade Silva & Souza',
  'Limpeza e Higiene Total'
];

const categories: Array<'fornecedor' | 'salario' | 'impostos' | 'aluguel' | 'servicos' | 'outros'> = [
  'fornecedor', 'fornecedor', 'fornecedor', 'servicos', 'fornecedor',
  'aluguel', 'servicos', 'servicos', 'impostos', 'impostos', 'servicos', 'servicos'
];

export const INITIAL_ACCOUNTS_PAYABLE: AccountsPayable[] = Array.from({ length: 100 }, (_, i) => {
  const supplierIndex = i % supplierNames.length;
  const amount = 500 + (i * 100) + Math.random() * 800;
  const status = paymentStatuses[i % paymentStatuses.length];

  let paidAmount = 0;
  if (status === 'pago') {
    paidAmount = amount;
  } else if (status === 'parcialmente_pago') {
    paidAmount = amount * (0.4 + Math.random() * 0.4);
  }

  const remainingAmount = amount - paidAmount;
  const daysOffset = (i % 50) - 20; // Some past due, some future
  const dueDate = new Date(new Date().getTime() + (daysOffset * 86400000));

  const hasInstallment = i % 4 === 0;

  return {
    id: `ap-${3000 + i}`,
    supplierId: `sup-${supplierIndex + 1}`,
    supplierName: supplierNames[supplierIndex],
    category: categories[supplierIndex],
    description: categories[supplierIndex] === 'aluguel'
      ? `Aluguel ${new Date(dueDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
      : categories[supplierIndex] === 'impostos'
      ? `Impostos ${new Date(dueDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
      : `Fatura ${supplierNames[supplierIndex]} - ${new Date(dueDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`,
    amount,
    paidAmount,
    remainingAmount,
    status: status === 'pendente' && daysOffset < 0 ? 'vencido' : status,
    dueDate: dueDate.toISOString().split('T')[0],
    paymentDate: status === 'pago' ? new Date(dueDate.getTime() - (Math.random() * 3 * 86400000)).toISOString().split('T')[0] : undefined,
    paymentMethod: status === 'pago' || status === 'parcialmente_pago' ? paymentMethods[i % paymentMethods.length] : undefined,
    installment: hasInstallment ? {
      current: (i % 6) + 1,
      total: 6
    } : undefined,
    notes: status === 'vencido' ? 'Pagamento atrasado' : undefined,
    createdAt: new Date(dueDate.getTime() - (15 * 86400000)).toISOString().split('T')[0]
  };
});
