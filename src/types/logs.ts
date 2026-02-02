import type { ProfessionalRole } from './common';

export type LogAction = 'create' | 'update' | 'delete' | 'archive' | 'approve' | 'reject' | 'login';

export interface LogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: ProfessionalRole;
  action: LogAction;
  entity: string; // e.g., 'Patient', 'Evolution', 'Stock'
  entityId?: string;
  description: string;
  metadata?: any;
}
