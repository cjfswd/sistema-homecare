import type { Evolution, Prescription, PharmacyItem } from '@/types';
import { MOCK_PATIENTS } from './patients';
import { MOCK_PROFESSIONALS } from './professionals';

// =============================================================================
// PHARMACY
// =============================================================================

export const MOCK_PHARMACY: PharmacyItem[] = [
  { id: 'med-1', tradeName: 'Novalgina', activeIngredient: 'Dipirona Sódica', concentration: '500mg/ml', form: 'Ampola', unit: 'amp', stockQuantity: 150, minStock: 20, isControlled: false },
  { id: 'med-2', tradeName: 'Plasil', activeIngredient: 'Metoclopramida', concentration: '10mg', form: 'Comprimido', unit: 'cp', stockQuantity: 0, minStock: 50, isControlled: false },
  { id: 'med-3', tradeName: 'Aradois', activeIngredient: 'Losartana Potássica', concentration: '50mg', form: 'Comprimido', unit: 'cp', stockQuantity: 300, minStock: 100, isControlled: false },
  { id: 'med-4', tradeName: 'Atenol', activeIngredient: 'Atenolol', concentration: '25mg', form: 'Comprimido', unit: 'cp', stockQuantity: 45, minStock: 50, isControlled: false },
  { id: 'med-5', tradeName: 'Rocefin', activeIngredient: 'Ceftriaxona', concentration: '1g', form: 'Frasco-Ampola', unit: 'fa', stockQuantity: 12, minStock: 10, isControlled: true },
  { id: 'med-6', tradeName: 'Trophic Basic', activeIngredient: 'Dieta Enteral', concentration: '1.2kcal/ml', form: 'Frasco 1L', unit: 'fr', stockQuantity: 20, minStock: 5, isControlled: false },
  { id: 'med-7', tradeName: 'Omeprazol', activeIngredient: 'Omeprazol', concentration: '20mg', form: 'Cápsula', unit: 'cp', stockQuantity: 180, minStock: 50, isControlled: false },
  { id: 'med-8', tradeName: 'Lasix', activeIngredient: 'Furosemida', concentration: '40mg', form: 'Comprimido', unit: 'cp', stockQuantity: 90, minStock: 30, isControlled: false },
  { id: 'med-9', tradeName: 'Heparina', activeIngredient: 'Heparina', concentration: '5000UI/ml', form: 'Ampola', unit: 'amp', stockQuantity: 35, minStock: 20, isControlled: true },
  { id: 'med-10', tradeName: 'Insulina NPH', activeIngredient: 'Insulina Humana', concentration: '100UI/ml', form: 'Frasco', unit: 'fr', stockQuantity: 15, minStock: 10, isControlled: true }
];

// =============================================================================
// EVOLUTIONS
// =============================================================================

const evolutionContents = [
  'Paciente estável, eupneica em ar ambiente. Mantendo dieta enteral bem tolerada.',
  'Realizado curativo em lesão, aspecto de granulação, sem exsudato. Paciente colaborativo.',
  'Paciente apresentou episódio de êmese após dieta. Medicado conforme prescrição.',
  'Sinais vitais estáveis. Paciente orientado, responsivo aos comandos.',
  'Realizada fisioterapia motora. Boa tolerância ao exercício.',
  'Paciente sonolento mas despertável. Eliminações fisiológicas presentes.',
  'Verificado glicemia capilar: controlada. Aplicada dose de insulina.',
  'Realizada nebulização com broncodilatador. Melhora do padrão respiratório.',
  'Paciente queixou dor abdominal leve. Medicado e evoluiu com melhora.',
  'Mantido curativo compressivo em MID. Sem sinais flogísticos.'
];

const types: Array<'routine' | 'occurrence' | 'admission'> = ['routine', 'routine', 'routine', 'occurrence', 'admission'];

// Generate 200 evolutions
export const INITIAL_EVOLUTIONS: Evolution[] = Array.from({ length: 200 }, (_, i) => {
  const patient = MOCK_PATIENTS[i % Math.min(50, MOCK_PATIENTS.length)];
  const professional = MOCK_PROFESSIONALS[(i % 20) + 1]; // Skip admin
  const creator = i % 10 === 0 ? MOCK_PROFESSIONALS[0] : professional; // Some created by admin
  const daysAgo = Math.floor(i / 10);
  const hoursOffset = (i % 10) * 2;

  return {
    id: `evo-${i + 1}`,
    patientId: patient.id,
    patientName: patient.name,
    professionalId: professional.id,
    professionalName: professional.name,
    professionalRole: professional.role,
    creatorId: creator.id,
    creatorName: creator.name,
    creatorRole: creator.role,
    createdAt: new Date(new Date().getTime() - (daysAgo * 86400000) - (hoursOffset * 3600000)),
    performedAt: new Date(new Date().getTime() - (daysAgo * 86400000) - (hoursOffset * 3600000) - 1800000),
    type: types[i % types.length],
    content: evolutionContents[i % evolutionContents.length],
    vitals: i % 3 === 0 ? {
      pa_sistolica: 110 + (i % 40),
      pa_diastolica: 70 + (i % 20),
      fc: 65 + (i % 30),
      temp: 36 + (i % 2),
      sato2: 94 + (i % 6)
    } : {},
    documents: i % 15 === 0 ? [
      { id: `doc-${i}`, name: `anexo_${i}.jpg`, type: 'image', size: `${1 + (i % 5)}.${i % 10} MB` }
    ] : []
  };
});

// =============================================================================
// PRESCRIPTIONS
// =============================================================================

const medicationInstructions = [
  '1cp VO 1x ao dia',
  '1cp VO 2x ao dia',
  '1cp VO 3x ao dia',
  '1amp IM/IV 12/12h',
  '1amp IM/IV 8/8h',
  '1ml SN 6/6h'
];

const careInstructions = [
  'A cada 2h (Relógio de Mudança)',
  'Observar e anotar',
  'Realizar 2x ao dia',
  'Manter elevado 30-45°'
];

// Generate 50 prescriptions
export const INITIAL_PRESCRIPTIONS: Prescription[] = Array.from({ length: 50 }, (_, i) => {
  const professional = MOCK_PROFESSIONALS[((i % 10) * 2) + 1].role === 'doctor'
    ? MOCK_PROFESSIONALS[((i % 10) * 2) + 1]
    : MOCK_PROFESSIONALS[1];

  const isActive = i < 30; // First 30 are active
  const startDate = new Date(new Date().getTime() - ((isActive ? 0 : 10) + i) * 86400000);

  return {
    id: `presc-${i + 1}`,
    professionalId: professional.id,
    professionalName: professional.name,
    professionalRole: professional.role,
    creatorId: professional.id,
    creatorName: professional.name,
    creatorRole: professional.role,
    startDate,
    endDate: isActive ? undefined : new Date(startDate.getTime() + 7 * 86400000),
    status: isActive ? 'current' : 'archived',
    items: [
      {
        id: `item-${i}-1`,
        type: 'medication',
        name: MOCK_PHARMACY[i % MOCK_PHARMACY.length].tradeName,
        instruction: medicationInstructions[i % medicationInstructions.length],
        schedule: ['08:00'],
        pharmacyId: MOCK_PHARMACY[i % MOCK_PHARMACY.length].id,
        dispensationStatus: 'dispensed'
      },
      ...(i % 3 === 0 ? [{
        id: `item-${i}-2`,
        type: 'care' as const,
        name: 'Mudança de Decúbito',
        instruction: careInstructions[i % careInstructions.length],
        schedule: ['08:00', '10:00', '12:00', '14:00', '16:00']
      }] : [])
    ]
  };
});
