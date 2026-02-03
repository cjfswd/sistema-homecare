import { useState } from 'react';
import {
  Bell,
  Check,
  Clock,
  Filter,
  Search,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Plus,
  Save
} from 'lucide-react';
import { formatDateTime } from '@/lib/formatters';
import { Pagination, usePagination, Button, Modal } from '@/components/ui';
import { NotificationForm } from '@/components/administrative';
import { loggingService } from '@/lib/loggingService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  category: 'system' | 'clinical' | 'financial' | 'stock';
}

const MOCK_NOTIFICATIONS: Notification[] = Array.from({ length: 50 }, (_, i) => {
  const types: Notification['type'][] = ['info', 'success', 'warning', 'error'];
  const categories: Notification['category'][] = ['system', 'clinical', 'financial', 'stock'];
  
  return {
    id: `notif-${i + 1}`,
    title: `Notificação do Sistema ${i + 1}`,
    message: `Esta é uma mensagem de exemplo para a notificação número ${i + 1}. Detalhes importantes sobre o evento ocorrido.`,
    type: types[i % 4],
    timestamp: new Date(Date.now() - i * 3600000), // Decrement by hour
    read: i > 10,
    category: categories[i % 4]
  };
});

export default function NotificationsModule() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = 
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    const matchesRead = readFilter === 'all' 
      ? true 
      : readFilter === 'read' ? notif.read : !notif.read;

    return matchesSearch && matchesType && matchesRead;
  });

  const pagination = usePagination(filteredNotifications, 10);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const openModal = () => {
    setFormData({ type: 'info', category: 'system' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.title || !formData.message) return;

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      title: formData.title,
      message: formData.message,
      type: formData.type || 'info',
      category: formData.category || 'system',
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'create',
      entity: 'Notification', // Note: This might need to be added to PermissionEntity types if strict typing is enforced there, but for logging it's usually string.
      entityId: newNotification.id,
      description: `Gerou notificação: ${newNotification.title}`
    });

    closeModal();
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-amber-500" size={24} />;
      case 'error': return <XCircle className="text-rose-500" size={24} />;
      case 'success': return <CheckCircle className="text-emerald-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'error': return 'bg-rose-50 border-rose-100';
      case 'success': return 'bg-emerald-50 border-emerald-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Bell className="text-slate-700" />
              Notificações
            </h1>
            <p className="text-slate-500 text-sm mt-1">Gerencie seus alertas e mensagens do sistema.</p>
          </div>
          
          <div className="flex gap-2">
             <Button onClick={openModal} icon={Plus}>
              Nova Notificação
            </Button>
            <button 
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium"
            >
              <Check size={16} /> Marcar todas como lidas
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar nas notificações..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg outline-none focus:ring-2 focus:ring-slate-300 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="bg-slate-100 border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Todos os Tipos</option>
              <option value="info">Informação</option>
              <option value="success">Sucesso</option>
              <option value="warning">Aviso</option>
              <option value="error">Erro</option>
            </select>

            <select 
              className="bg-slate-100 border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="read">Lidas</option>
              <option value="unread">Não Lidas</option>
            </select>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
              <Bell size={48} className="mx-auto mb-3 opacity-20" />
              <p>Nenhuma notificação encontrada.</p>
            </div>
          ) : (
            pagination.paginatedItems.map((notif) => (
              <div 
                key={notif.id} 
                className={`
                  relative bg-white rounded-xl p-5 border transition-all hover:shadow-md
                  ${notif.read ? 'border-slate-200 opacity-75' : 'border-indigo-200 shadow-sm'}
                `}
              >
                {!notif.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full" title="Não lida" />
                )}
                
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeStyles(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold text-lg truncate pr-6 ${notif.read ? 'text-slate-600' : 'text-slate-800'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                        <Clock size={12} />
                        {formatDateTime(notif.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      {notif.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wide">
                        {notif.category}
                      </span>
                      
                      <div className="flex gap-2">
                        {!notif.read && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 hover:bg-indigo-50 rounded transition-colors"
                          >
                            Marcar como lida
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(notif.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={filteredNotifications.length}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={pagination.handlePageChange}
              onItemsPerPageChange={pagination.handleItemsPerPageChange}
            />
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Nova Notificação"
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSave} icon={Save}>Gerar Notificação</Button>
          </>
        }
      >
        <NotificationForm formData={formData} onFormChange={handleFormChange} />
      </Modal>
    </div>
  );
}