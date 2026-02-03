import type { BudgetStatus } from './common';

export interface BaseService {
  id: string;
  code: string;
  name: string;
  category: string;
}

export interface PriceTableItem {
  serviceId: string;
  costPrice: number;
  sellPrice: number;
}

export type PriceTableType = 'convenio' | 'particular';

export interface PriceTable {
  id: string;
  name: string;
  type: PriceTableType;
  items: PriceTableItem[];
}

export interface BudgetLineItem {
  id: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type BudgetType = 'original' | 'aditivo' | 'prorrogacao';

export interface Budget {
  id: string;
  patientId: string;
  patientName: string;
  tableId: string;
  version: number;
  type: BudgetType;
  status: BudgetStatus;
  createdAt: string;
  validUntil?: string;
  items: BudgetLineItem[];
  totalValue: number;
  totalCost: number;
  notes?: string;
}

export type PaymentStatus = 'pendente' | 'parcialmente_pago' | 'pago' | 'vencido' | 'cancelado';
export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia';

export interface AccountsReceivable {
  id: string;
  patientId: string;
  patientName: string;
  budgetId?: string;
  description: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: PaymentStatus;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  installment?: {
    current: number;
    total: number;
  };
  notes?: string;
  createdAt: string;
}

export interface AccountsPayable {
  id: string;
  supplierId?: string;
  supplierName: string;
  category: 'fornecedor' | 'salario' | 'impostos' | 'aluguel' | 'servicos' | 'outros';
  description: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: PaymentStatus;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  installment?: {
    current: number;
    total: number;
  };
  notes?: string;
  createdAt: string;
}
