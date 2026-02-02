import { INITIAL_PERMISSIONS, INITIAL_ROLES, INITIAL_USER_ROLES } from './mockData';
import type { Role, Permission, UserRoleAssignment, PermissionAction, PermissionEntity } from '@/types';

const ROLES_KEY = 'homecare_roles';
const ASSIGNMENTS_KEY = 'homecare_user_roles';

class AuthService {
  private roles: Role[] = [];
  private assignments: UserRoleAssignment[] = [];
  private permissions: Permission[] = INITIAL_PERMISSIONS;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedRoles = localStorage.getItem(ROLES_KEY);
    const storedAssignments = localStorage.getItem(ASSIGNMENTS_KEY);

    this.roles = storedRoles ? JSON.parse(storedRoles) : INITIAL_ROLES;
    this.assignments = storedAssignments ? JSON.parse(storedAssignments) : INITIAL_USER_ROLES;

    // Force Admin to have all permissions even if stored in localStorage
    const adminRole = this.roles.find(r => r.id === 'role-admin');
    if (adminRole) {
      adminRole.permissions = Array.from(new Set([...adminRole.permissions, ...INITIAL_PERMISSIONS.map(p => p.id)]));
    }

    if (!storedRoles) this.saveRoles();
    if (!storedAssignments) this.saveAssignments();
  }

  private saveRoles() {
    localStorage.setItem(ROLES_KEY, JSON.stringify(this.roles));
  }

  private saveAssignments() {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(this.assignments));
  }

  public getPermissions(): Permission[] {
    return this.permissions;
  }

  public getRoles(): Role[] {
    return this.roles;
  }

  public updateRole(role: Role) {
    const index = this.roles.findIndex(r => r.id === role.id);
    if (index > -1) {
      this.roles[index] = role;
    } else {
      this.roles.push(role);
    }
    this.saveRoles();
    window.dispatchEvent(new CustomEvent('auth-updated'));
  }

  public deleteRole(roleId: string) {
    this.roles = this.roles.filter(r => r.id !== roleId);
    this.saveRoles();
    window.dispatchEvent(new CustomEvent('auth-updated'));
  }

  public getAssignments(): UserRoleAssignment[] {
    return this.assignments;
  }

  public assignRole(userId: string, roleId: string) {
    const index = this.assignments.findIndex(a => a.userId === userId);
    if (index > -1) {
      this.assignments[index].roleId = roleId;
    } else {
      this.assignments.push({ userId, roleId });
    }
    this.saveAssignments();
    window.dispatchEvent(new CustomEvent('auth-updated'));
  }

  public getUserRole(userId: string): Role | undefined {
    const assignment = this.assignments.find(a => a.userId === userId);
    if (!assignment) return undefined;
    return this.roles.find(r => r.id === assignment.roleId);
  }

  public hasPermission(userId: string, action: PermissionAction, entity: PermissionEntity): boolean {
    const role = this.getUserRole(userId);
    if (!role) return false;

    // Admin has all permissions if it contains 'manage' 'all' or similar, 
    // but here we check against the list of permission IDs assigned to the role.
    const userPermissions = this.permissions.filter(p => role.permissions.includes(p.id));
    
    return userPermissions.some(p => 
      (p.action === 'manage' && p.entity === entity) || 
      (p.action === action && p.entity === entity) ||
      (p.action === 'manage' && (entity as string) === 'all')
    );
  }

  // Helper for current user (mocked as prof-admin for now or from localStorage)
  public getCurrentUserId(): string {
    return 'prof-admin'; // In a real app, this would come from a session/token
  }

  public checkCurrent(action: PermissionAction, entity: PermissionEntity): boolean {
    return this.hasPermission(this.getCurrentUserId(), action, entity);
  }
}

export const authService = new AuthService();
