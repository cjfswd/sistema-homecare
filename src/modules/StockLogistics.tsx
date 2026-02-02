import { useState, useMemo } from 'react';
import { 
  Box, 
  ArrowRightLeft, 
  MapPin, 
} from 'lucide-react';

import type { StockLocation, Item, StockEntry, Movement, StockLocationType } from '@/types';
import { 
  MOCK_COMPANIES,
  MOCK_PATIENTS,
  INITIAL_STOCK_ITEMS,
  INITIAL_STOCK_LOCATIONS,
  INITIAL_STOCK_ENTRIES
} from '@/lib/mockData';

import { 
  TransferModal, 
  LossReportModal, 
  LocationModal,
  StockBalanceView,
  MovementHistoryView,
  LocationsView
} from '@/components/logistics';
import { loggingService } from '@/lib/loggingService';

type ActiveTab = 'saldo' | 'transferencia' | 'locais';

export default function StockLogisticsModule() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('saldo');
  
  // Data States
  const [locations, setLocations] = useState<StockLocation[]>(INITIAL_STOCK_LOCATIONS);
  const [items] = useState<Item[]>(INITIAL_STOCK_ITEMS);
  const [stock, setStock] = useState<StockEntry[]>(INITIAL_STOCK_ENTRIES);
  const [movements, setMovements] = useState<Movement[]>([]);

  // UI States
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  const [stockSearchTerm, setStockSearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [movementSearchTerm, setMovementSearchTerm] = useState('');
  
  // Modals
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);

  // Modal Data
  const [selectedMovForLoss, setSelectedMovForLoss] = useState<Movement | null>(null);

  // --- Business Logic ---

  const getQty = (locId: string, itemId: string) => {
    return stock.find(s => s.locationId === locId && s.itemId === itemId)?.quantity || 0;
  };

  const handleRequestTransfer = (transfer: { origin: string; dest: string; obs: string; items: { itemId: string; quantity: number }[] }) => {
    if (!transfer.dest || transfer.items.some(i => !i.itemId || i.quantity <= 0)) return;

    const originName = locations.find(l => l.id === transfer.origin)?.name;
    const destName = locations.find(l => l.id === transfer.dest)?.name;

    const newMovement: Movement = {
      id: `mov-${Date.now()}`,
      date: new Date(),
      fromLocationId: transfer.origin,
      toLocationId: transfer.dest,
      items: transfer.items.map(i => ({ 
        itemId: i.itemId, 
        itemName: items.find(x => x.id === i.itemId)?.name || 'Item', 
        quantity: i.quantity 
      })),
      status: 'pending',
      user: 'Logistics Central',
      observation: transfer.obs,
    };

    setMovements([newMovement, ...movements]);

    loggingService.log({
      userId: 'log-central',
      userName: 'Central de Logística',
      userRole: 'admin',
      action: 'create',
      entity: 'Movement',
      entityId: newMovement.id,
      description: `Solicitou transferência de ${newMovement.items.length} itens: ${originName} -> ${destName}`
    });

    setShowTransferModal(false);
    setActiveTab('transferencia');
  };

  const handleProcessMovement = (movId: string, action: 'approve' | 'reject') => {
    const mov = movements.find(m => m.id === movId);
    if (!mov) return;

    if (action === 'reject') {
      setMovements(prev => prev.map(m => m.id === movId ? { ...m, status: 'rejected' } : m));
      
      loggingService.log({
        userId: 'prof-admin',
        userName: 'Administrador do Sistema',
        userRole: 'admin',
        action: 'reject',
        entity: 'Movement',
        entityId: movId,
        description: `Rejeitou movimentação de estoque: ${movId}`
      });
      return;
    }

    if (!mov.fromLocationId) return;

    const newStock = [...stock];
    mov.items.forEach(item => {
      const originEntryIndex = newStock.findIndex(s => s.locationId === mov.fromLocationId && s.itemId === item.itemId);
      if (originEntryIndex >= 0) {
        newStock[originEntryIndex].quantity -= item.quantity;
      }
      const destEntryIndex = newStock.findIndex(s => s.locationId === mov.toLocationId && s.itemId === item.itemId);
      if (destEntryIndex >= 0) {
        newStock[destEntryIndex].quantity += item.quantity;
      } else {
        newStock.push({ locationId: mov.toLocationId, itemId: item.itemId, quantity: item.quantity });
      }
    });

    setStock(newStock);
    setMovements(prev => prev.map(m => m.id === movId ? { ...m, status: 'approved' } : m));

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'approve',
      entity: 'Movement',
      entityId: movId,
      description: `Aprovou e processou movimentação de estoque: ${movId}`
    });
  };

  const handleOpenLossModal = (mov: Movement) => {
    setSelectedMovForLoss(mov);
    setShowLossModal(true);
  };

  const handleConfirmLoss = (lossInfo: { movementId: string; lossObservation: string; itemsLost: { itemId: string; quantity: number }[] }) => {
    const { movementId, lossObservation, itemsLost } = lossInfo;
    const movement = movements.find(m => m.id === movementId);
    if (!movement) return;
    
    const newStock = [...stock];
    itemsLost.forEach(lostItem => {
      const destEntryIndex = newStock.findIndex(s => s.locationId === movement.toLocationId && s.itemId === lostItem.itemId);
      if (destEntryIndex >= 0) {
        newStock[destEntryIndex].quantity = Math.max(0, newStock[destEntryIndex].quantity - lostItem.quantity);
      }
    });

    setStock(newStock);
    setMovements(prev => prev.map(m => m.id === movementId ? { 
      ...m, 
      status: 'lost',
      lossObservation: lossObservation,
      itemsLost: itemsLost
    } : m));

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'delete',
      entity: 'StockLoss',
      entityId: movementId,
      description: `Reportou extravio de material na movimentação ${movementId}: ${lossObservation}`
    });

    setShowLossModal(false);
    setSelectedMovForLoss(null);
  };

  const handleAddLocation = (location: { name: string; type: StockLocationType; address: string; linkedEntityId?: string }) => {
    if (!location.name) return;
    const newLocation: StockLocation = {
      id: `loc-${Date.now()}`,
      name: location.name,
      type: location.type,
      address: location.address,
      linkedEntityId: location.linkedEntityId
    };
    setLocations([...locations, newLocation]);

    loggingService.log({
      userId: 'prof-admin',
      userName: 'Administrador do Sistema',
      userRole: 'admin',
      action: 'create',
      entity: 'StockLocation',
      entityId: newLocation.id,
      description: `Cadastrou novo local de estoque: ${newLocation.name}`
    });

    setShowNewLocationModal(false);
  };

  const inventoryView = useMemo(() => {
    let viewItems = items.filter(i => i.name.toLowerCase().includes(stockSearchTerm.toLowerCase()));
    return viewItems.map(item => {
      if (selectedLocationFilter !== 'all') {
        const qty = getQty(selectedLocationFilter, item.id);
        return { ...item, totalQty: qty, breakdown: [] };
      } else {
        const total = stock.filter(s => s.itemId === item.id).reduce((acc, curr) => acc + curr.quantity, 0);
        const places = stock.filter(s => s.itemId === item.id && s.quantity > 0)
          .map(s => ({ locName: locations.find(l => l.id === s.locationId)?.name, qty: s.quantity }));
        return { ...item, totalQty: total, breakdown: places };
      }
    });
  }, [stock, selectedLocationFilter, stockSearchTerm, locations, items]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-10">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Box className="text-amber-600" />
              Gestão de Estoque e Logística
            </h1>
            <p className="text-slate-500 text-sm mt-1">Controle de materiais em empresas, pacientes e veículos.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowNewLocationModal(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium">
              <MapPin size={16} /> Novo Local
            </button>
            <button onClick={() => setShowTransferModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium shadow-sm">
              <ArrowRightLeft size={16} /> Solicitar Transferência
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('saldo')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
              ${activeTab === 'saldo' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            Saldo de Estoque
          </button>
          <button 
            onClick={() => setActiveTab('transferencia')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
              ${activeTab === 'transferencia' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            Histórico e Aprovações
            {movements.filter(m => m.status === 'pending').length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">{movements.filter(m => m.status === 'pending').length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('locais')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
              ${activeTab === 'locais' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            Locais Cadastrados
          </button>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'saldo' && (
            <StockBalanceView
              inventory={inventoryView}
              locations={locations}
              searchTerm={stockSearchTerm}
              onSearchTermChange={setStockSearchTerm}
              selectedLocation={selectedLocationFilter}
              onLocationChange={setSelectedLocationFilter}
            />
          )}
          {activeTab === 'transferencia' && (
            <MovementHistoryView
              movements={movements}
              locations={locations}
              searchTerm={movementSearchTerm}
              onSearchTermChange={setMovementSearchTerm}
              onProcessMovement={handleProcessMovement}
              onOpenLossModal={handleOpenLossModal}
            />
          )}
          {activeTab === 'locais' && (
            <LocationsView
              locations={locations}
              searchTerm={locationSearchTerm}
              onSearchTermChange={setLocationSearchTerm}
              onAddLocation={() => setShowNewLocationModal(true)}
            />
          )}
        </div>
      </main>

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        locations={locations}
        items={items}
        stock={stock}
        onTransferRequest={handleRequestTransfer}
      />

      {showLossModal && selectedMovForLoss && (
        <LossReportModal 
          isOpen={showLossModal}
          onClose={() => {
            setShowLossModal(false);
            setSelectedMovForLoss(null);
          }}
          movement={selectedMovForLoss}
          onConfirm={handleConfirmLoss}
        />
      )}

      <LocationModal 
        isOpen={showNewLocationModal}
        onClose={() => setShowNewLocationModal(false)}
        onAddLocation={handleAddLocation}
        patients={MOCK_PATIENTS}
        companies={MOCK_COMPANIES}
      />
    </div>
  );
}