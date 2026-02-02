import type { Service } from '@/types';

const serviceNames = {
  consultation: ['Visita Médica', 'Consulta Enfermagem', 'Avaliação Nutricional', 'Consulta Psicológica', 'Avaliação Social'],
  procedure: ['Curativo Simples', 'Curativo Grande Porte', 'Aplicação IM/SC', 'Coleta de Sangue', 'Sondagem Vesical', 'Aspiração VAS', 'Nebulização', 'Troca de Sonda', 'Banho no Leito'],
  shift: ['Plantão Enfermagem 12h', 'Plantão Enfermagem 24h', 'Plantão Técnico 12h', 'Plantão Técnico 24h', 'Plantão Cuidador 12h', 'Plantão Cuidador 24h'],
  rental: ['Locação Cama Hospitalar', 'Locação Concentrador O2', 'Locação Aspirador Portátil', 'Locação Bomba de Infusão', 'Locação Monitor Multiparâmetros']
};

const categories: Array<'consultation' | 'procedure' | 'shift' | 'rental'> = ['consultation', 'procedure', 'shift', 'rental'];

// Generate 60 services
export const MOCK_SERVICES: Service[] = [];

let idCounter = 1;
categories.forEach((category) => {
  const names = serviceNames[category];
  names.forEach((name, idx) => {
    const basePrice =
      category === 'consultation' ? 200 + (idx * 50) :
      category === 'procedure' ? 80 + (idx * 20) :
      category === 'shift' ? 300 + (idx * 100) :
      400 + (idx * 150);

    MOCK_SERVICES.push({
      id: `s${idCounter}`,
      code: `${category.substring(0, 3).toUpperCase()}${String(idCounter).padStart(2, '0')}`,
      name,
      category,
      basePrice,
      active: idx < names.length - 1 || Math.random() > 0.2 // Most services active
    });
    idCounter++;
  });
});
