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
  patientName: string;
  tableId: string;
  version: number;
  type: BudgetType;
  status: BudgetStatus;
  createdAt: string;
  items: BudgetLineItem[];
  totalValue: number;
  totalCost: number;
}
