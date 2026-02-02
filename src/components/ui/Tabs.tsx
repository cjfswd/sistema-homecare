import type { LucideIcon } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: number | string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline'
}: TabsProps) {
  const getTabClasses = (tab: Tab) => {
    const isActive = tab.id === activeTab;
    const baseClasses = 'flex items-center gap-2 px-4 py-2 font-medium transition-colors duration-150 cursor-pointer';

    if (variant === 'underline') {
      return `${baseClasses} ${
        isActive
          ? 'text-indigo-600 border-b-2 border-indigo-600'
          : 'text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300'
      }`;
    }

    if (variant === 'pills') {
      return `${baseClasses} rounded-lg ${
        isActive
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`;
    }

    // default variant
    return `${baseClasses} ${
      isActive
        ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
    }`;
  };

  const containerClasses = variant === 'underline'
    ? 'flex border-b border-slate-200'
    : variant === 'pills'
    ? 'flex gap-2 p-1 bg-slate-50 rounded-lg'
    : 'flex bg-slate-50 border-b border-slate-200';

  return (
    <div className={containerClasses}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={getTabClasses(tab)}
          >
            {Icon && <Icon size={18} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
