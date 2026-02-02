import type { PriceTable, Budget } from '@/types';
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
    patientName: patient.name,
    tableId: table.id,
    version: type === 'original' ? 1 : type === 'aditivo' ? 2 : 1,
    type,
    status,
    createdAt: new Date(new Date().getTime() - (i * 86400000 * 2)).toISOString().split('T')[0],
    items,
    totalValue,
    totalCost
  };
});
