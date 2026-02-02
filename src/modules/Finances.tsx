import { useState } from 'react';
import { 
  Wallet, 
  Calculator,
  FileText
} from 'lucide-react';

import type { PriceTable, Budget } from '@/types';
import { INITIAL_PRICE_TABLES, INITIAL_BUDGETS } from '@/lib/mockData';

import { Button, type Tab } from '@/components/ui';
import { BudgetModal, BudgetList } from '@/components/financial';
import { loggingService } from '@/lib/loggingService';

export default function FinancesModule() {
  const [activeTab, setActiveTab] = useState<'budgets'>('budgets');
  
  // States
  const [tables] = useState<PriceTable[]>(INITIAL_PRICE_TABLES);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // --- Budget Logic ---
  const handleSaveBudget = (newBudget: Budget) => {
    setBudgets([newBudget, ...budgets]);

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'create',
      entity: 'Budget',
      entityId: newBudget.id,
      description: `Gerou novo orçamento (PAD) para: ${newBudget.patientName}`
    });
  };

  const TABS: Tab[] = [
    { id: 'budgets', label: 'Orçamentos (PAD)', icon: Calculator },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Wallet className="text-emerald-600" />
              Financeiro & Comercial
            </h1>
            <p className="text-slate-500 text-sm mt-1">Geração e gestão de orçamentos assistenciais.</p>
          </div>
          <Button variant="success" onClick={() => setIsBudgetModalOpen(true)} icon={FileText}>
            Novo Orçamento
          </Button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'budgets')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                  ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                {Icon && <Icon size={18} />} {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {activeTab === 'budgets' && (
            <BudgetList budgets={budgets} tables={tables} />
        )}
      </main>

      {isBudgetModalOpen && (
        <BudgetModal 
          isOpen={isBudgetModalOpen} 
          onClose={() => setIsBudgetModalOpen(false)}
          onSave={handleSaveBudget}
          tables={tables}
        />
      )}
    </div>
  );
}