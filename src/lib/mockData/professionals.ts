import type { Professional } from '@/types';

const firstNames = ['Roberto', 'Juliana', 'Marcos', 'Ana', 'Carlos', 'Patricia', 'Fernando', 'Mariana', 'Ricardo', 'Camila', 'André', 'Beatriz', 'Rafael', 'Lucia', 'Paulo'];
const lastNames = ['Santos', 'Costa', 'Oliveira', 'Silva', 'Ferreira', 'Rodrigues', 'Almeida', 'Martins', 'Pereira', 'Lima', 'Carvalho', 'Souza', 'Ribeiro', 'Mendes', 'Barros'];

const roles: Array<'doctor' | 'nurse' | 'technician' | 'physiotherapist' | 'speechTherapist' | 'admin'> = [
  'doctor', 'doctor', 'nurse', 'nurse', 'nurse', 'technician', 'technician', 'technician', 'physiotherapist', 'speechTherapist', 'admin'
];

const roleCouncils: Record<string, string> = {
  doctor: 'CRM-SP',
  nurse: 'COREN-SP',
  technician: 'COREN-SP',
  physiotherapist: 'CREFITO-SP',
  speechTherapist: 'CREFONO-SP',
  admin: 'N/A'
};

const roleTitles: Record<string, string> = {
  doctor: 'Dr.',
  nurse: 'Enf.',
  technician: 'Tec.',
  physiotherapist: 'Fisio.',
  speechTherapist: 'Fono.',
  admin: ''
};

const statuses: Array<'active' | 'inactive' | 'vacation'> = ['active', 'active', 'active', 'active', 'vacation', 'inactive'];

// Generate 80 professionals
export const MOCK_PROFESSIONALS: Professional[] = Array.from({ length: 80 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  const role = roles[i % roles.length];
  const title = roleTitles[role];
  const councilPrefix = roleCouncils[role];
  const councilNumber = councilPrefix !== 'N/A' ? `${councilPrefix} ${String((i % 899999) + 100000)}` : 'N/A';

  return {
    id: `prof-${i + 1}`,
    name: `${title} ${firstName} ${lastName}`.trim(),
    role,
    councilNumber,
    status: statuses[i % statuses.length],
    phone: `(11) 9${String((i % 9000) + 1000).padStart(4, '0')}-${String((i % 9000) + 1000).padStart(4, '0')}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${role === 'doctor' ? 'medico' : role === 'admin' ? 'sistema' : role}.com`
  };
});

// Ensure admin exists
MOCK_PROFESSIONALS[0] = {
  id: 'prof-admin',
  name: 'Administrador do Sistema',
  role: 'admin',
  councilNumber: 'N/A',
  status: 'active',
  phone: '(11) 93333-3333',
  email: 'admin@sistema.com'
};
