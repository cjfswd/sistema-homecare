import type { StockLocationType, MovementStatus, ItemCategory } from './common';

export interface StockLocation {
  id: string;
  name: string;
  type: StockLocationType;
  address?: string;
  linkedEntityId?: string;
}

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  unit: string;
  minStock: number;
}

export interface StockEntry {
  locationId: string;
  itemId: string;
  quantity: number;
}

export interface MovementItem {
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface LostItem {
  itemId: string;
  quantity: number;
}

export interface Movement {
  id: string;
  date: Date;
  fromLocationId: string | null;
  toLocationId: string;
  items: MovementItem[];
  status: MovementStatus;
  user: string;
  observation?: string;
  lossObservation?: string;
  itemsLost?: LostItem[];
}
