import type { StockLocation, Item, StockEntry } from '@/types';
import { MOCK_PATIENTS } from './patients';

// =============================================================================
// COMPANIES
// =============================================================================

export const MOCK_COMPANIES = [
  { id: 'emp-1', name: 'Matriz Central', address: 'Rodovia BR-101, Km 50 - Distrito Industrial' },
  { id: 'emp-2', name: 'Filial Zona Sul', address: 'Av. Copacabana, 1000' },
  { id: 'emp-3', name: 'Centro de Distribuição Norte', address: 'Rua da Logística, 45' },
  { id: 'emp-4', name: 'Farmácia Satélite Leste', address: 'Av. Aricanduva, 2300' },
  { id: 'emp-5', name: 'Almoxarifado Zona Oeste', address: 'Rua Guaicurus, 1500' }
];

// =============================================================================
// STOCK LOCATIONS
// =============================================================================

export const INITIAL_STOCK_LOCATIONS: StockLocation[] = [
  // Company locations
  ...MOCK_COMPANIES.map((company, i) => ({
    id: `loc-emp-${i + 1}`,
    name: `Estoque: ${company.name}`,
    type: 'company' as const,
    address: company.address,
    linkedEntityId: company.id
  })),
  // Patient locations (first 30 active patients)
  ...MOCK_PATIENTS.filter(p => p.status === 'active').slice(0, 30).map((patient, i) => ({
    id: `loc-pac-${i + 1}`,
    name: `Residência: ${patient.name}`,
    type: 'patient' as const,
    address: `${patient.address.street}, ${patient.address.number} - ${patient.address.neighborhood}`,
    linkedEntityId: patient.id
  })),
  // Vehicle locations
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `loc-vei-${i + 1}`,
    name: `Viatura ${String.fromCharCode(65 + i)} (Equipe ${['Alpha', 'Beta', 'Gama', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'][i]})`,
    type: 'vehicle' as const
  }))
];

// =============================================================================
// STOCK ITEMS
// =============================================================================

const medications = [
  'Soro Fisiológico 0,9% 500ml',
  'Dipirona 1g/2ml',
  'Paracetamol 500mg',
  'Omeprazol 20mg',
  'Losartana 50mg',
  'Metformina 850mg',
  'Sinvastatina 20mg',
  'Atenolol 25mg'
];

const supplies = [
  'Luva de Procedimento M',
  'Luva de Procedimento G',
  'Gaze Estéril 7,5x7,5',
  'Atadura Crepe 10cm',
  'Esparadrapo 10cm',
  'Micropore 5cm',
  'Seringa 3ml',
  'Seringa 5ml',
  'Seringa 10ml',
  'Agulha 40x12',
  'Agulha 25x7',
  'Cateter Venoso 22G',
  'Cateter Venoso 24G',
  'Equipo Macrogotas',
  'Equipo Microgotas',
  'Scalp 23G',
  'Scalp 25G',
  'Sonda Vesical 12',
  'Sonda Vesical 14',
  'Sonda Nasogástrica 14'
];

const equipment = [
  'Oxímetro de Pulso',
  'Termômetro Digital',
  'Glicosímetro',
  'Esfigmomanômetro',
  'Estetoscópio',
  'Nebulizador',
  'Aspirador Portátil'
];

export const INITIAL_STOCK_ITEMS: Item[] = [
  ...medications.map((name, i) => ({
    id: `item-med-${i + 1}`,
    name,
    category: 'medication' as const,
    unit: ['frasco', 'ampola', 'comprimido', 'cápsula', 'comprimido', 'comprimido', 'comprimido', 'comprimido'][i % 8],
    minStock: 20 + (i * 10)
  })),
  ...supplies.map((name, i) => ({
    id: `item-sup-${i + 1}`,
    name,
    category: 'supply' as const,
    unit: ['caixa', 'caixa', 'pacote', 'rolo', 'rolo', 'rolo', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade', 'unidade'][i % 20],
    minStock: 5 + (i * 2)
  })),
  ...equipment.map((name, i) => ({
    id: `item-equ-${i + 1}`,
    name,
    category: 'equipment' as const,
    unit: 'unidade',
    minStock: 2 + i
  }))
];

// =============================================================================
// STOCK ENTRIES
// =============================================================================

// Generate stock entries for company locations with good quantities
const companyLocations = INITIAL_STOCK_LOCATIONS.filter(l => l.type === 'company');
const patientLocations = INITIAL_STOCK_LOCATIONS.filter(l => l.type === 'patient');

export const INITIAL_STOCK_ENTRIES: StockEntry[] = [
  // Company locations have most items with good stock
  ...companyLocations.flatMap(location =>
    INITIAL_STOCK_ITEMS.map(item => ({
      locationId: location.id,
      itemId: item.id,
      quantity: Math.floor(item.minStock * (2 + Math.random() * 3))
    }))
  ),
  // Patient locations have some items
  ...patientLocations.flatMap((location, locIdx) =>
    INITIAL_STOCK_ITEMS.filter((_, i) => i % 3 === locIdx % 3).slice(0, 5).map(item => ({
      locationId: location.id,
      itemId: item.id,
      quantity: Math.floor(item.minStock * (0.5 + Math.random()))
    }))
  )
];
