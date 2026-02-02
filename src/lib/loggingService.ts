import { INITIAL_LOGS } from './mockData';
import type { LogEntry, LogAction, ProfessionalRole } from '@/types';

const LOGS_STORAGE_KEY = 'homecare_system_logs';

class LoggingService {
  private logs: LogEntry[] = [];

  constructor() {
    const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    if (storedLogs) {
      this.logs = JSON.parse(storedLogs).map((l: any) => ({
        ...l,
        timestamp: new Date(l.timestamp)
      }));
    } else {
      this.logs = [...INITIAL_LOGS];
      this.saveToStorage();
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public log(data: {
    userId: string;
    userName: string;
    userRole: ProfessionalRole;
    action: LogAction;
    entity: string;
    entityId?: string;
    description: string;
    metadata?: any;
  }) {
    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...data
    };

    this.logs.unshift(newEntry);
    this.saveToStorage();
    
    // Dispatch custom event so UI can update if needed
    window.dispatchEvent(new CustomEvent('new-log-entry', { detail: newEntry }));
  }

  private saveToStorage() {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.logs));
  }

  public clearLogs() {
    this.logs = [];
    this.saveToStorage();
    window.dispatchEvent(new CustomEvent('logs-cleared'));
  }
}

export const loggingService = new LoggingService();
