import type { Permission, Role, UserRoleAssignment, LogEntry } from '@/types';

// =============================================================================
// PERMISSIONS
// =============================================================================

export const INITIAL_PERMISSIONS: Permission[] = [
  // Patients
  { id: 'p1', action: 'view', entity: 'patients' },
  { id: 'p2', action: 'create', entity: 'patients' },
  { id: 'p3', action: 'edit', entity: 'patients' },
  { id: 'p4', action: 'delete', entity: 'patients' },
  // Evolutions
  { id: 'e1', action: 'view', entity: 'evolutions' },
  { id: 'e2', action: 'create', entity: 'evolutions' },
  { id: 'e3', action: 'edit', entity: 'evolutions' },
  { id: 'e4', action: 'delete', entity: 'evolutions' },
  // Prescriptions
  { id: 'pr1', action: 'view', entity: 'prescriptions' },
  { id: 'pr2', action: 'create', entity: 'prescriptions' },
  { id: 'pr3', action: 'edit', entity: 'prescriptions' },
  // Stock
  { id: 's1', action: 'view', entity: 'stock' },
  { id: 's2', action: 'manage', entity: 'stock' },
  // Finances
  { id: 'f1', action: 'view', entity: 'finances' },
  { id: 'f2', action: 'manage', entity: 'finances' },
  // Logs
  { id: 'l1', action: 'view', entity: 'logs' },
  // Services/Tabelas
  { id: 'v1', action: 'view', entity: 'services' },
  { id: 'v2', action: 'manage', entity: 'services' },
  // Roles/Auth
  { id: 'r1', action: 'manage', entity: 'roles' },
];

// =============================================================================
// ROLES
// =============================================================================

export const INITIAL_ROLES: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: INITIAL_PERMISSIONS.map(p => p.id)
  },
  {
    id: 'role-doctor',
    name: 'Médico',
    description: 'Acesso clínico e prescrição',
    permissions: ['p1', 'e1', 'e2', 'pr1', 'pr2', 'pr3', 's1', 'f1']
  },
  {
    id: 'role-nurse',
    name: 'Enfermeiro',
    description: 'Acesso assistencial e evolução',
    permissions: ['p1', 'e1', 'e2', 's1', 'f1']
  },
  {
    id: 'role-technician',
    name: 'Técnico de Enfermagem',
    description: 'Visualização e registro de cuidados',
    permissions: ['p1', 'e1', 's1']
  },
  {
    id: 'role-logistics',
    name: 'Logística',
    description: 'Gestão de estoque e materiais',
    permissions: ['s1', 's2', 'p1']
  },
  {
    id: 'role-financial',
    name: 'Financeiro',
    description: 'Gestão financeira e orçamentos',
    permissions: ['f1', 'f2', 'v1', 'v2', 'p1', 'l1']
  }
];

// =============================================================================
// USER ROLE ASSIGNMENTS
// =============================================================================

export const INITIAL_USER_ROLES: UserRoleAssignment[] = [
  { userId: 'prof-admin', roleId: 'role-admin' },
  // Doctors get doctor role
  ...Array.from({ length: 15 }, (_, i) => ({
    userId: `prof-${(i * 5) + 2}`,
    roleId: 'role-doctor'
  })),
  // Nurses get nurse role
  ...Array.from({ length: 20 }, (_, i) => ({
    userId: `prof-${(i * 3) + 3}`,
    roleId: 'role-nurse'
  })),
  // Some get logistics role
  { userId: 'prof-40', roleId: 'role-logistics' },
  { userId: 'prof-41', roleId: 'role-logistics' },
  // Some get financial role
  { userId: 'prof-50', roleId: 'role-financial' },
  { userId: 'prof-51', roleId: 'role-financial' }
];

// =============================================================================
// LOGS
// =============================================================================

const actions: Array<'create' | 'update' | 'delete' | 'archive' | 'approve' | 'reject' | 'login'> = ['create', 'update', 'delete', 'archive', 'approve', 'reject'];
const entities = ['Evolution', 'Prescription', 'Patient', 'Movement', 'Budget', 'Service'];
const descriptions = [
  'Criou nova evolução',
  'Atualizou dados cadastrais',
  'Aprovou transferência de materiais',
  'Rejeitou solicitação de orçamento',
  'Criou nova prescrição',
  'Arquivou serviço inativo',
  'Editou informações do paciente',
  'Realizou login no sistema'
];

// Generate 300 log entries
export const INITIAL_LOGS: LogEntry[] = Array.from({ length: 300 }, (_, i) => {
  const hoursAgo = i * 0.5; // Spread over last 150 hours (about 6 days)
  const profId = `prof-${(i % 50) + 1}`;

  return {
    id: `log-${i + 1}`,
    timestamp: new Date(new Date().getTime() - (hoursAgo * 3600000)),
    userId: profId,
    userName: `Profissional ${i % 50}`,
    userRole: (['doctor', 'nurse', 'technician', 'admin'] as const)[i % 4],
    action: actions[i % actions.length],
    entity: entities[i % entities.length],
    entityId: i % 3 === 0 ? `entity-${i}` : undefined,
    description: descriptions[i % descriptions.length]
  };
});
