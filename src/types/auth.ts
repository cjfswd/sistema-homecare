export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage';
export type PermissionEntity = 'patients' | 'professionals' | 'services' | 'evolutions' | 'prescriptions' | 'finances' | 'stock' | 'logs' | 'roles';

export interface Permission {
  id: string;
  action: PermissionAction;
  entity: PermissionEntity;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // IDs of permissions
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
}
