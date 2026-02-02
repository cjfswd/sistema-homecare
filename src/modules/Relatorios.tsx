import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Package, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Activity,
  BedDouble,
  LogOut,
  HeartPulse
} from 'lucide-react';

/**
 * ==================================================================================
 * TYPES & MOCKS
 * ==================================================================================
 */

// [RF-REP-04] Censo
interface CensusData {
  category: string;
  count: number;
  trend: number; // + or - relative to last period
  icon: any;
  color: string;
}

// [RF-REP-03] Financeiro
interface PatientMargin {
  id: string;
  name: string;
  budgetTotal: number; // Valor Venda
  actualCost: number; // Custo Real
  margin: number; // %
}

// [RF-REP-01] Escala
interface ShiftCoverage {
  team: string;
  totalShifts: number;
  covered: number;
  open: number;
}

// [RF-REP-02] Estoque
interface StockABC {
  itemId: string;
  name: string;
  consumptionValue: number;
  percentage: number;
  category: 'A' | 'B' | 'C';
}

// --- DADOS MOCADOS ---

const MOCK_CENSUS: CensusData[] = [
  { category: 'Pacientes Ativos', count: 142, trend: 5, icon: Users, color: 'text-blue-600 bg-blue-100' },
  { category: 'Hospitalizados', count: 12, trend: -2, icon: BedDouble, color: 'text-amber-600 bg-amber-100' },
  { category: 'Altas (Mês)', count: 8, trend: 3, icon: LogOut, color: 'text-emerald-600 bg-emerald-100' },
  { category: 'Óbitos (Mês)', count: 2, trend: 0, icon: HeartPulse, color: 'text-slate-600 bg-slate-100' },
];

const MOCK_MARGINS: PatientMargin[] = [
  { id: '1', name: 'Maria de Lourdes Souza', budgetTotal: 15000, actualCost: 6000, margin: 60 },
  { id: '2', name: 'João Batista', budgetTotal: 12000, actualCost: 10500, margin: 12.5 },
  { id: '3', name: 'Ana Pereira', budgetTotal: 25000, actualCost: 11000, margin: 56 },
  { id: '4', name: 'Carlos Oliveira', budgetTotal: 8000, actualCost: 8500, margin: -6.25 }, // Prejuízo
];

const MOCK_SHIFTS: ShiftCoverage[] = [
  { team: 'Equipe Enfermagem (Diurno)', totalShifts: 450, covered: 445, open: 5 },
  { team: 'Equipe Enfermagem (Noturno)', totalShifts: 450, covered: 420, open: 30 },
  { team: 'Fisioterapia', totalShifts: 120, covered: 120, open: 0 },
  { team: 'Fonoaudiologia', totalShifts: 40, covered: 35, open: 5 },
];

const MOCK_ABC: StockABC[] = [
  { itemId: '1', name: 'Dieta Enteral Trophic 1L', consumptionValue: 45000, percentage: 40, category: 'A' },
  { itemId: '2', name: 'Fralda Geriátrica G', consumptionValue: 28000, percentage: 25, category: 'A' },
  { itemId: '3', name: 'Luva de Procedimento', consumptionValue: 15000, percentage: 15, category: 'B' },
  { itemId: '4', name: 'Soro Fisiológico 0.9%', consumptionValue: 8000, percentage: 8, category: 'B' },
  { itemId: '5', name: 'Gaze Estéril', consumptionValue: 5000, percentage: 5, category: 'C' },
];

/**
 * ==================================================================================
 * COMPONENTS
 * ==================================================================================
 */

const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);



export default function ReportsModule() {
  const [activeTab, setActiveTab] = useState<'operacional' | 'financeiro' | 'estoque'>('operacional');

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-purple-600" />
              Relatórios Estratégicos (BI)
            </h1>
            <p className="text-slate-500 text-sm mt-1">Análise de dados para tomada de decisão.</p>
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium">
              <Calendar size={16} /> Últimos 30 dias
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium shadow-sm">
              <Download size={16} /> Exportar PDF
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('operacional')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
              ${activeTab === 'operacional' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <Activity size={18} /> Operacional & Escala
          </button>
          <button 
            onClick={() => setActiveTab('financeiro')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
              ${activeTab === 'financeiro' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <TrendingUp size={18} /> Financeiro & Margem
          </button>
          <button 
            onClick={() => setActiveTab('estoque')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
              ${activeTab === 'estoque' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <Package size={18} /> Estoque (Curva ABC)
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-8 max-w-7xl mx-auto">
        
        {/* =================================================================================
            VIEW: OPERACIONAL [RF-REP-01, RF-REP-04]
           ================================================================================= */}
        {activeTab === 'operacional' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* KPI CARDS (CENSO) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_CENSUS.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${item.trend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {item.trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(item.trend)}%
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">{item.category}</h3>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{item.count}</p>
                </div>
              ))}
            </div>

            {/* COBERTURA DE ESCALA */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Cobertura de Escala (Mês Atual)</h2>
                  <p className="text-sm text-slate-500">Monitoramento de "furos" de escala por equipe.</p>
                </div>
                <div className="bg-slate-100 p-2 rounded-lg">
                  <Filter size={18} className="text-slate-500" />
                </div>
              </div>

              <div className="space-y-6">
                {MOCK_SHIFTS.map((shift, idx) => {
                  const percent = Math.round((shift.covered / shift.totalShifts) * 100);
                  const isCritical = percent < 90;

                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-end mb-1">
                        <div>
                          <span className="font-semibold text-slate-700">{shift.team}</span>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {shift.open} plantões descobertos de {shift.totalShifts}
                          </div>
                        </div>
                        <span className={`font-bold text-lg ${isCritical ? 'text-red-600' : 'text-slate-700'}`}>
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      {isCritical && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
                          <AlertTriangle size={12} /> Atenção: Alto índice de furos nesta equipe.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================================
            VIEW: FINANCEIRO [RF-REP-03]
           ================================================================================= */}
        {activeTab === 'financeiro' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800">Análise de Margem por Paciente (PAD)</h2>
                <p className="text-sm text-slate-500">Comparativo: Valor Orçado (Venda) vs. Custos Executados (Profissionais + Insumos).</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Paciente</th>
                      <th className="px-6 py-4 text-right">Faturamento (Venda)</th>
                      <th className="px-6 py-4 text-right">Custo Real</th>
                      <th className="px-6 py-4 text-right">Lucro Bruto</th>
                      <th className="px-6 py-4 text-right">Margem %</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {MOCK_MARGINS.map((row) => {
                      const profit = row.budgetTotal - row.actualCost;
                      const isNegative = profit < 0;
                      const isLowMargin = row.margin < 20 && !isNegative;

                      return (
                        <tr key={row.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-semibold text-slate-700">{row.name}</td>
                          <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(row.budgetTotal)}</td>
                          <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(row.actualCost)}</td>
                          <td className={`px-6 py-4 text-right font-bold ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
                            {formatCurrency(profit)}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-1">
                               {isNegative ? <ArrowDownRight size={14} className="text-red-500" /> : <ArrowUpRight size={14} className="text-emerald-500" />}
                               <span className={`font-bold ${isNegative ? 'text-red-600' : isLowMargin ? 'text-amber-600' : 'text-emerald-600'}`}>
                                 {row.margin.toFixed(2)}%
                               </span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {isNegative ? (
                              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Prejuízo</span>
                            ) : isLowMargin ? (
                              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">Atenção</span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Saudável</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================================
            VIEW: ESTOQUE [RF-REP-02]
           ================================================================================= */}
        {activeTab === 'estoque' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tabela ABC */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Curva ABC de Insumos</h2>
                    <p className="text-sm text-slate-500">Itens que representam 80% do custo de estoque.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div> Classe A
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div> Classe B
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {MOCK_ABC.map((item, idx) => {
                    const barColor = item.category === 'A' ? 'bg-purple-600' : item.category === 'B' ? 'bg-blue-500' : 'bg-slate-400';
                    const textColor = item.category === 'A' ? 'text-purple-700 bg-purple-50' : item.category === 'B' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 bg-slate-100';

                    return (
                      <div key={idx} className="relative pt-1">
                         <div className="flex justify-between items-center mb-1">
                           <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${textColor}`}>
                                {item.category}
                              </span>
                              <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                           </div>
                           <div className="text-right">
                             <div className="text-sm font-bold text-slate-800">{formatCurrency(item.consumptionValue)}</div>
                             <div className="text-xs text-slate-400">{item.percentage}% do total</div>
                           </div>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-2">
                           <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${item.percentage * 2}%` }}></div>
                         </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Resumo Estoque */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                 <div className="p-4 bg-purple-50 rounded-full mb-4">
                   <Package size={40} className="text-purple-600" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800">Valor Total em Estoque</h3>
                 <p className="text-4xl font-bold text-purple-700 mt-2 mb-1">R$ 142.500</p>
                 <p className="text-sm text-slate-500">Distribuídos em 3 unidades</p>
                 
                 <div className="w-full mt-8 border-t border-slate-100 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Sugestão de Compra</h4>
                    <button className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition shadow-lg">
                      Gerar Pedido de Reposição
                    </button>
                 </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}