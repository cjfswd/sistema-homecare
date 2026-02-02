import type { Assessment, ABEMIDCategory, NEADDomain, ABEMIDLevel } from '@/types';
import { MOCK_PATIENTS } from './patients';
import { MOCK_PROFESSIONALS } from './professionals';

// ABEMID Criteria - Instrumento de Avaliação de Elegibilidade e Demandas
export const ABEMID_CATEGORIES: ABEMIDCategory[] = [
  {
    name: 'Procedimentos Especiais',
    criteria: [
      { code: 'PE1', description: 'Ventilação Mecânica Invasiva', level: 'AD3', category: 'Procedimentos Especiais' },
      { code: 'PE2', description: 'Ventilação Mecânica Não Invasiva', level: 'AD2', category: 'Procedimentos Especiais' },
      { code: 'PE3', description: 'Diálise Peritoneal', level: 'AD3', category: 'Procedimentos Especiais' },
      { code: 'PE4', description: 'Nutrição Parenteral', level: 'AD3', category: 'Procedimentos Especiais' },
      { code: 'PE5', description: 'Traqueostomia com Aspiração Frequente', level: 'AD3', category: 'Procedimentos Especiais' },
      { code: 'PE6', description: 'Traqueostomia sem Aspiração Frequente', level: 'AD2', category: 'Procedimentos Especiais' },
    ]
  },
  {
    name: 'Cuidados de Enfermagem',
    criteria: [
      { code: 'CE1', description: 'Curativos Complexos (múltiplos ou extensos)', level: 'AD2', category: 'Cuidados de Enfermagem' },
      { code: 'CE2', description: 'Curativos Simples', level: 'AD1', category: 'Cuidados de Enfermagem' },
      { code: 'CE3', description: 'Sondagem Vesical de Demora', level: 'AD2', category: 'Cuidados de Enfermagem' },
      { code: 'CE4', description: 'Sondagem Nasoenteral', level: 'AD2', category: 'Cuidados de Enfermagem' },
      { code: 'CE5', description: 'Gastrostomia', level: 'AD2', category: 'Cuidados de Enfermagem' },
      { code: 'CE6', description: 'Colostomia/Ileostomia', level: 'AD2', category: 'Cuidados de Enfermagem' },
    ]
  },
  {
    name: 'Terapias e Reabilitação',
    criteria: [
      { code: 'TR1', description: 'Fisioterapia Respiratória Diária', level: 'AD2', category: 'Terapias e Reabilitação' },
      { code: 'TR2', description: 'Fisioterapia Motora', level: 'AD1', category: 'Terapias e Reabilitação' },
      { code: 'TR3', description: 'Fonoaudiologia para Disfagia', level: 'AD2', category: 'Terapias e Reabilitação' },
      { code: 'TR4', description: 'Terapia Ocupacional', level: 'AD1', category: 'Terapias e Reabilitação' },
    ]
  },
  {
    name: 'Medicações',
    criteria: [
      { code: 'ME1', description: 'Medicação Intravenosa Contínua', level: 'AD3', category: 'Medicações' },
      { code: 'ME2', description: 'Medicação Intravenosa Intermitente', level: 'AD2', category: 'Medicações' },
      { code: 'ME3', description: 'Medicação Subcutânea (Insulina)', level: 'AD1', category: 'Medicações' },
      { code: 'ME4', description: 'Oxigenoterapia Contínua', level: 'AD2', category: 'Medicações' },
    ]
  },
  {
    name: 'Condições Clínicas',
    criteria: [
      { code: 'CC1', description: 'Rebaixamento de Consciência', level: 'AD3', category: 'Condições Clínicas' },
      { code: 'CC2', description: 'Dependência Total para AVDs', level: 'AD2', category: 'Condições Clínicas' },
      { code: 'CC3', description: 'Dependência Parcial para AVDs', level: 'AD1', category: 'Condições Clínicas' },
      { code: 'CC4', description: 'Úlceras de Pressão Grau III/IV', level: 'AD2', category: 'Condições Clínicas' },
    ]
  }
];

// NEAD Domains - Necessidade de Enfermeiro por Agudo Domiciliar
export const NEAD_DOMAINS: NEADDomain[] = [
  {
    name: 'Estado Mental e Comunicação',
    questions: [
      { code: 'EMC1', domain: 'Estado Mental e Comunicação', description: 'Nível de Consciência', maxScore: 4 },
      { code: 'EMC2', domain: 'Estado Mental e Comunicação', description: 'Orientação Tempo/Espaço', maxScore: 4 },
      { code: 'EMC3', domain: 'Estado Mental e Comunicação', description: 'Comunicação Verbal', maxScore: 4 },
    ]
  },
  {
    name: 'Mobilidade',
    questions: [
      { code: 'MOB1', domain: 'Mobilidade', description: 'Deambulação', maxScore: 4 },
      { code: 'MOB2', domain: 'Mobilidade', description: 'Transferência Leito/Cadeira', maxScore: 4 },
      { code: 'MOB3', domain: 'Mobilidade', description: 'Controle de Tronco', maxScore: 4 },
    ]
  },
  {
    name: 'Eliminações',
    questions: [
      { code: 'ELI1', domain: 'Eliminações', description: 'Controle Urinário', maxScore: 4 },
      { code: 'ELI2', domain: 'Eliminações', description: 'Controle Intestinal', maxScore: 4 },
    ]
  },
  {
    name: 'Alimentação',
    questions: [
      { code: 'ALI1', domain: 'Alimentação', description: 'Via de Alimentação', maxScore: 4 },
      { code: 'ALI2', domain: 'Alimentação', description: 'Capacidade de Deglutição', maxScore: 4 },
    ]
  },
  {
    name: 'Respiração',
    questions: [
      { code: 'RES1', domain: 'Respiração', description: 'Padrão Respiratório', maxScore: 4 },
      { code: 'RES2', domain: 'Respiração', description: 'Necessidade de Oxigênio', maxScore: 4 },
      { code: 'RES3', domain: 'Respiração', description: 'Tosse e Expectoração', maxScore: 4 },
    ]
  },
  {
    name: 'Integridade Cutânea',
    questions: [
      { code: 'INT1', domain: 'Integridade Cutânea', description: 'Presença de Lesões', maxScore: 4 },
      { code: 'INT2', domain: 'Integridade Cutânea', description: 'Risco de Úlcera de Pressão', maxScore: 4 },
    ]
  },
  {
    name: 'Terapêutica',
    questions: [
      { code: 'TER1', domain: 'Terapêutica', description: 'Complexidade Medicamentosa', maxScore: 4 },
      { code: 'TER2', domain: 'Terapêutica', description: 'Via de Administração', maxScore: 4 },
      { code: 'TER3', domain: 'Terapêutica', description: 'Monitorização Necessária', maxScore: 4 },
    ]
  }
];

// Calculate NEAD total max score
export const NEAD_MAX_SCORE = NEAD_DOMAINS.reduce(
  (total, domain) => total + domain.questions.reduce((sum, q) => sum + q.maxScore, 0),
  0
);

// Determine ABEMID level from selected criteria
export function determineABEMIDLevel(selectedCriteria: string[]): ABEMIDLevel {
  const allCriteria = ABEMID_CATEGORIES.flatMap(cat => cat.criteria);
  const levels = selectedCriteria.map(code => {
    const criterion = allCriteria.find(c => c.code === code);
    return criterion?.level || 'AD1';
  });

  if (levels.includes('AD3')) return 'AD3';
  if (levels.includes('AD2')) return 'AD2';
  return 'AD1';
}

// Generate mock assessments
const assessmentTypes: Array<'ABEMID' | 'NEAD'> = ['ABEMID', 'NEAD'];
const abemidLevels: ABEMIDLevel[] = ['AD1', 'AD2', 'AD3'];

export const MOCK_ASSESSMENTS: Assessment[] = Array.from({ length: 100 }, (_, i) => {
  const patient = MOCK_PATIENTS[i % 50];
  const professional = MOCK_PROFESSIONALS.filter(p => p.role === 'doctor' || p.role === 'nurse')[i % 20];
  const type = assessmentTypes[i % 2];
  const daysAgo = i * 3; // Spread assessments over time
  const performedDate = new Date();
  performedDate.setDate(performedDate.getDate() - daysAgo);

  const assessment: Assessment = {
    id: `assess-${i + 1}`,
    patientId: patient.id,
    patientName: patient.name,
    type,
    performedBy: professional.id,
    performedByName: professional.name,
    performedAt: performedDate,
    createdAt: performedDate,
    answers: [],
    status: 'completed',
    notes: i % 4 === 0 ? 'Paciente colaborativo durante a avaliação. Familiar presente.' : undefined
  };

  if (type === 'ABEMID') {
    // Randomly select some criteria
    const allCriteria = ABEMID_CATEGORIES.flatMap(cat => cat.criteria);
    const selectedCount = (i % 4) + 1;
    const selectedCodes = allCriteria
      .slice((i * 3) % allCriteria.length, ((i * 3) % allCriteria.length) + selectedCount)
      .map(c => c.code);

    assessment.answers = selectedCodes.map(code => ({
      questionCode: code,
      value: true
    }));
    assessment.level = abemidLevels[i % 3];
  } else {
    // NEAD - generate scores for each question
    const allQuestions = NEAD_DOMAINS.flatMap(d => d.questions);
    assessment.answers = allQuestions.map((q, qi) => ({
      questionCode: q.code,
      value: (qi + i) % (q.maxScore + 1)
    }));
    assessment.score = assessment.answers.reduce((sum, a) => sum + (typeof a.value === 'number' ? a.value : 0), 0);
  }

  return assessment;
});
