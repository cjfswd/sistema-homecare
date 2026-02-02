import {
  TrendingUp,
  ArrowDownRight,
} from 'lucide-react';

import type { PriceTable, Service } from '@/types';
import { Input } from '@/components/forms';
import { Pagination, usePagination } from '@/components/ui';
import { MOCK_SERVICES } from '@/lib/mockData';
import { calculateMargin } from '@/lib/formatters';

interface PriceTableEditorProps {
  table: PriceTable;
  onPriceChange: (serviceId: string, field: 'costPrice' | 'sellPrice', value: number) => void;
}

export function PriceTableEditor({ table, onPriceChange }: PriceTableEditorProps) {
  const servicesPage = usePagination(MOCK_SERVICES, 15);

  const getServicePriceInfo = (table: PriceTable, serviceId: string) => {
    return table.items.find(i => i.serviceId === serviceId) || { costPrice: 0, sellPrice: 0 };
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium text-sm border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Serviço</th>
            <th className="px-6 py-4">Categoria</th>
            <th className="px-6 py-4 w-40">Custo (R$)</th>
            <th className="px-6 py-4 w-40">Venda (R$)</th>
            <th className="px-6 py-4 w-32">Margem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {servicesPage.paginatedItems.map((service: Service) => {
            const priceInfo = getServicePriceInfo(table, service.id);
            const margin = calculateMargin(priceInfo.costPrice, priceInfo.sellPrice);
            const isNegative = margin < 0;
            const isLow = margin < 20 && margin >= 0;

            return (
              <tr key={service.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-700">
                  {service.name}
                  <div className="text-xs text-slate-400 font-mono">{service.code}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{service.category}</td>
                <td className="px-6 py-4">
                    <Input
                      type="number"
                      className="text-sm"
                      value={priceInfo.costPrice || ''}
                      onChange={(e) => onPriceChange(service.id, 'costPrice', parseFloat(e.target.value))}
                    />
                </td>
                <td className="px-6 py-4">
                    <Input
                      type="number"
                      className="text-sm font-semibold text-emerald-700"
                      value={priceInfo.sellPrice || ''}
                      onChange={(e) => onPriceChange(service.id, 'sellPrice', parseFloat(e.target.value))}
                    />
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-1 font-bold text-sm
                    ${isNegative ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}
                  `}>
                    {margin.toFixed(1)}%
                    {isNegative ? <ArrowDownRight size={14} /> : <TrendingUp size={14} />}
                  </div>
                  {isNegative && <div className="text-[10px] text-red-500">Prejuízo!</div>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      <Pagination
        currentPage={servicesPage.currentPage}
        totalPages={servicesPage.totalPages}
        totalItems={MOCK_SERVICES.length}
        itemsPerPage={servicesPage.itemsPerPage}
        onPageChange={servicesPage.handlePageChange}
        onItemsPerPageChange={servicesPage.handleItemsPerPageChange}
      />
    </div>
  );
}
