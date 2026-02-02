import type { Patient } from '@/types';

const firstNames = ['Maria', 'João', 'Ana', 'Pedro', 'Francisca', 'José', 'Antônia', 'Carlos', 'Paulo', 'Luzia', 'Rita', 'Fernando', 'Sebastiana', 'Manoel', 'Conceição'];
const lastNames = ['Silva', 'Santos', 'Souza', 'Oliveira', 'Costa', 'Pereira', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins'];
const streets = ['Rua das Flores', 'Av. Brasil', 'Rua Sete de Setembro', 'Av. Paulista', 'Rua do Comércio', 'Av. Central', 'Rua São João', 'Av. Independência', 'Rua XV de Novembro', 'Av. Getúlio Vargas'];
const neighborhoods = ['Centro', 'Jardim Paulista', 'Vila Mariana', 'Mooca', 'Tatuapé', 'Santana', 'Ipiranga', 'Lapa', 'Pinheiros', 'Butantã'];
const diagnoses = [
  'I64 - Acidente Vascular Cerebral',
  'J44 - DPOC',
  'I50 - Insuficiência Cardíaca',
  'E11 - Diabetes Mellitus Tipo 2',
  'N18 - Doença Renal Crônica',
  'G20 - Doença de Parkinson',
  'F03 - Demência não especificada',
  'M81 - Osteoporose',
  'I10 - Hipertensão Arterial',
  'C34 - Neoplasia de Pulmão'
];

const statuses: Array<'active' | 'inactive' | 'vacation' | 'discharged' | 'deceased'> = ['active', 'active', 'active', 'discharged', 'inactive'];

function generateCPF(index: number): string {
  const base = String(index).padStart(9, '0');
  return `${base.substring(0, 3)}.${base.substring(3, 6)}.${base.substring(6, 9)}-${(index % 100).toString().padStart(2, '0')}`;
}

function generateBirthDate(index: number): string {
  const year = 1930 + (index % 60);
  const month = (index % 12) + 1;
  const day = (index % 28) + 1;
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Generate 150 patients for pagination demonstration
export const MOCK_PATIENTS: Patient[] = Array.from({ length: 150 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const middleName = i % 3 === 0 ? ` de ${lastNames[(i + 5) % lastNames.length]}` : '';
  const lastName = lastNames[i % lastNames.length];
  const secondLastName = i % 2 === 0 ? ` ${lastNames[(i + 7) % lastNames.length]}` : '';

  return {
    id: `pac-${i + 1}`,
    name: `${firstName}${middleName} ${lastName}${secondLastName}`,
    cpf: generateCPF(123456789 + i),
    birthDate: generateBirthDate(i),
    diagnosis: diagnoses[i % diagnoses.length],
    status: statuses[i % statuses.length],
    address: {
      zipCode: `${String((i % 90) + 10).padStart(2, '0')}${String((i % 900) + 100).padStart(3, '0')}-${String((i % 900) + 100).padStart(3, '0')}`,
      street: streets[i % streets.length],
      number: String((i % 999) + 1),
      neighborhood: neighborhoods[i % neighborhoods.length],
      city: 'São Paulo',
      state: 'SP'
    },
    contacts: i % 3 === 0 ? [
      {
        name: `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}`,
        phone: `(11) 9${String((i % 9000) + 1000).padStart(4, '0')}-${String((i % 9000) + 1000).padStart(4, '0')}`,
        relation: ['Filho', 'Filha', 'Esposo', 'Esposa', 'Irmão', 'Irmã'][i % 6]
      }
    ] : [],
    allergies: i % 4 === 0 ? ['Dipirona'] : i % 5 === 0 ? ['Penicilina', 'AAS'] : []
  };
});
