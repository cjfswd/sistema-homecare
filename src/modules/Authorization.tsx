import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { authService } from '@/lib/authService';
import type { Role, Permission, UserRoleAssignment } from '@/types';
import { Button, Modal, Pagination, usePagination } from '@/components/ui';
import { MOCK_PROFESSIONALS } from '@/lib/mockData';
import { loggingService } from '@/lib/loggingService';

export default function AuthorizationModule() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [assignments, setAssignments] = useState<UserRoleAssignment[]>([]);
  const [permissions] = useState<Permission[]>(authService.getPermissions());
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<Role> | null>(null);
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    const loadData = () => {
      setRoles(authService.getRoles());
      setAssignments(authService.getAssignments());
    };
    loadData();
    window.addEventListener('auth-updated', loadData);
    return () => window.removeEventListener('auth-updated', loadData);
  }, []);

  const handleSaveRole = () => {
    if (!editingRole?.name) return;
    const roleToSave = {
      id: editingRole.id || `role-${Date.now()}`,
      name: editingRole.name,
      description: editingRole.description || '',
      permissions: editingRole.permissions || []
    } as Role;

    authService.updateRole(roleToSave);
    
    loggingService.log({
      userId: authService.getCurrentUserId(),
      userName: 'Administrador',
      userRole: 'admin',
      action: editingRole.id ? 'update' : 'create',
      entity: 'Role',
      entityId: roleToSave.id,
      description: `${editingRole.id ? 'Atualizou' : 'Criou'} papel de acesso: ${roleToSave.name}`
    });

    setIsRoleModalOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (id: string) => {
    if (id === 'role-admin') {
      alert('O papel de Administrador não pode ser excluído.');
      return;
    }
    if (confirm('Deseja excluir este papel de acesso? Usuários vinculados perderão acesso.')) {
      authService.deleteRole(id);
      loggingService.log({
        userId: authService.getCurrentUserId(),
        userName: 'Administrador',
        userRole: 'admin',
        action: 'delete',
        entity: 'Role',
        entityId: id,
        description: `Excluiu papel de acesso: ${id}`
      });
    }
  };

  const handleAssignRole = () => {
    if (!selectedUser || !selectedRole) return;
    authService.assignRole(selectedUser, selectedRole);
    
    const userName = MOCK_PROFESSIONALS.find(p => p.id === selectedUser)?.name;
    const roleName = roles.find(r => r.id === selectedRole)?.name;

    loggingService.log({
      userId: authService.getCurrentUserId(),
      userName: 'Administrador',
      userRole: 'admin',
      action: 'update',
      entity: 'UserRole',
      description: `Atribuiu papel ${roleName} para o usuário ${userName}`
    });

    setIsAssignModalOpen(false);
  };

  const togglePermission = (permId: string) => {
    const currentPerms = editingRole?.permissions || [];
    const newPerms = currentPerms.includes(permId)
      ? currentPerms.filter(id => id !== permId)
      : [...currentPerms, permId];
    setEditingRole({ ...editingRole, permissions: newPerms });
  };

  const professionalsPage = usePagination(MOCK_PROFESSIONALS, 15);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Shield className="text-rose-600" />
              Controle de Acesso (RBAC)
            </h1>
            <p className="text-slate-500 text-sm mt-1">Gestão dinâmica de papéis, permissões e acessos dos usuários.</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('Isso irá resetar todas as permissões para os valores padrão. Deseja continuar?')) {
                  authService.resetPermissions();
                }
              }}
              icon={Shield}
              title="Resetar permissões para valores padrão"
            >
              Resetar Permissões
            </Button>
            <Button variant="ghost" onClick={() => setIsAssignModalOpen(true)} icon={UserPlus}>
              Vincular Usuário
            </Button>
            <Button onClick={() => { setEditingRole({ permissions: [] }); setIsRoleModalOpen(true); }} icon={Plus}>
              Novo Papel
            </Button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* ROLES TABLE */}
        <section>
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Lock size={20} className="text-slate-400" />
            Papéis e Permissões
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map(role => (
              <div key={role.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${role.id === 'role-admin' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                    <ShieldCheck size={24} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingRole(role); setIsRoleModalOpen(true); }} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded">
                      <Edit2 size={16} />
                    </button>
                    {role.id !== 'role-admin' && (
                      <button onClick={() => handleDeleteRole(role.id)} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-lg">{role.name}</h4>
                <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{role.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">{role.permissions.length} Permissões</span>
                  <div className="flex -space-x-2">
                    {assignments.filter(a => a.roleId === role.id).slice(0, 3).map((a, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold" title={a.userId}>
                        {a.userId.substring(5, 7).toUpperCase()}
                      </div>
                    ))}
                    {assignments.filter(a => a.roleId === role.id).length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
                        +{assignments.filter(a => a.roleId === role.id).length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* USER ASSIGNMENTS */}
        <section>
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Users size={20} className="text-slate-400" />
            Usuários Vinculados
          </h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Papel Atribuído</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {professionalsPage.paginatedItems.map(prof => {
                  const assignment = assignments.find(a => a.userId === prof.id);
                  const role = roles.find(r => r.id === assignment?.roleId);

                  return (
                    <tr key={prof.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700">{prof.name}</div>
                        <div className="text-xs text-slate-400">{prof.role}</div>
                      </td>
                      <td className="px-6 py-4">
                        {role ? (
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${role.id === 'role-admin' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>
                            <Shield size={12} /> {role.name}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">Nenhum papel</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`w-2 h-2 rounded-full inline-block mr-2 ${prof.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        <span className="capitalize">{prof.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => { setSelectedUser(prof.id); setSelectedRole(assignment?.roleId || ''); setIsAssignModalOpen(true); }}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
                        >
                          Alterar Papel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={professionalsPage.currentPage}
            totalPages={professionalsPage.totalPages}
            totalItems={MOCK_PROFESSIONALS.length}
            itemsPerPage={professionalsPage.itemsPerPage}
            onPageChange={professionalsPage.handlePageChange}
            onItemsPerPageChange={professionalsPage.handleItemsPerPageChange}
          />
        </section>
      </main>

      {/* ROLE MODAL */}
      <Modal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
        title={editingRole?.id ? 'Editar Papel' : 'Novo Papel'}
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome do Papel</label>
              <input 
                type="text" 
                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500" 
                placeholder="Ex: Supervisor de Enfermagem"
                value={editingRole?.name || ''}
                onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição</label>
              <textarea 
                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500 h-20" 
                placeholder="Descreva as responsabilidades deste papel..."
                value={editingRole?.description || ''}
                onChange={e => setEditingRole({ ...editingRole, description: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Permissões de Acesso</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {['patients', 'professionals', 'services', 'evolutions', 'prescriptions', 'stock', 'finances', 'logs', 'roles', 'notifications'].map(entity => (
                <div key={entity} className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">{entity}</h5>
                  <div className="space-y-1.5">
                    {permissions.filter(p => p.entity === entity).map(perm => (
                      <label key={perm.id} className="flex items-center gap-2 cursor-pointer group">
                        <div 
                          onClick={() => togglePermission(perm.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${editingRole?.permissions?.includes(perm.id) ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-300 group-hover:border-rose-400'}`}
                        >
                          {editingRole?.permissions?.includes(perm.id) && <Check size={10} strokeWidth={4} />}
                        </div>
                        <span className="text-xs text-slate-600 capitalize">{perm.action} {perm.entity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsRoleModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveRole}>Salvar Papel</Button>
          </div>
        </div>
      </Modal>

      {/* ASSIGN MODAL */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Vincular Usuário a Papel"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Usuário</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg outline-none"
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
            >
              <option value="">Selecione um usuário...</option>
              {MOCK_PROFESSIONALS.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Papel de Acesso</label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map(role => (
                <label key={role.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedRole === role.id ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-200' : 'bg-white border-slate-200 hover:border-rose-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="role" className="hidden" checked={selectedRole === role.id} onChange={() => setSelectedRole(role.id)} />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedRole === role.id ? 'border-rose-600' : 'border-slate-300'}`}>
                      {selectedRole === role.id && <div className="w-2 h-2 rounded-full bg-rose-600"></div>}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">{role.name}</div>
                      <div className="text-[10px] text-slate-500">{role.description}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {role.permissions.length} perms
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsAssignModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAssignRole}>Confirmar Atribuição</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
