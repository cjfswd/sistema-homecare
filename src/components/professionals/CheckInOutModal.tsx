import { useState } from 'react';
import { X, MapPin, Camera, FileText, LogIn, LogOut, Save, Loader2 } from 'lucide-react';
import type { CheckInOut, ScheduleEntry } from '@/types';

interface CheckInOutModalProps {
  type: 'check_in' | 'check_out';
  scheduleEntry: ScheduleEntry;
  isOpen: boolean;
  onClose: () => void;
  onSave: (check: Partial<CheckInOut>) => void;
}

export function CheckInOutModal({
  type,
  scheduleEntry,
  isOpen,
  onClose,
  onSave
}: CheckInOutModalProps) {
  const [notes, setNotes] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const isCheckIn = type === 'check_in';

  const handleGetLocation = () => {
    setIsGettingLocation(true);

    // Simulate getting location
    setTimeout(() => {
      setLocation({
        latitude: -23.5505 + (Math.random() * 0.01),
        longitude: -46.6333 + (Math.random() * 0.01),
        address: `${scheduleEntry.patientName} - Local do Atendimento`
      });
      setIsGettingLocation(false);
    }, 1500);
  };

  const handleTakePhoto = () => {
    // Simulate taking a photo
    setPhotoUrl('simulated-photo-url');
  };

  const handleSave = () => {
    const check: Partial<CheckInOut> = {
      type,
      scheduleEntryId: scheduleEntry.id,
      professionalId: scheduleEntry.professionalId,
      professionalName: scheduleEntry.professionalName,
      patientId: scheduleEntry.patientId,
      patientName: scheduleEntry.patientName,
      timestamp: new Date(),
      location: location || undefined,
      photoUrl: photoUrl || undefined,
      notes: notes || undefined,
      registeredBy: scheduleEntry.professionalId
    };

    onSave(check);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${isCheckIn ? 'bg-emerald-50' : 'bg-blue-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCheckIn ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {isCheckIn ? <LogIn size={24} /> : <LogOut size={24} />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Registrar {isCheckIn ? 'Check-in' : 'Check-out'}
                </h2>
                <p className="text-sm text-slate-500">{scheduleEntry.patientName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Schedule Info */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Profissional</span>
                  <p className="font-medium text-slate-800">{scheduleEntry.professionalName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Horário Previsto</span>
                  <p className="font-medium text-slate-800">
                    {isCheckIn ? scheduleEntry.startTime : scheduleEntry.endTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <MapPin size={14} className="inline mr-2" />
                Localização
              </label>

              {location ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">Localização capturada</span>
                  </div>
                  {location.address && (
                    <p className="text-sm text-emerald-600 mt-1">{location.address}</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-50"
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Obtendo localização...
                    </>
                  ) : (
                    <>
                      <MapPin size={18} />
                      Capturar Localização
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <Camera size={14} className="inline mr-2" />
                Foto (Opcional)
              </label>

              {photoUrl ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-700">
                      <Camera size={16} />
                      <span className="text-sm font-medium">Foto capturada</span>
                    </div>
                    <button
                      onClick={() => setPhotoUrl(null)}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleTakePhoto}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition"
                >
                  <Camera size={18} />
                  Tirar Foto
                </button>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <FileText size={14} className="inline mr-2" />
                Observações (Opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações..."
                className="w-full h-20 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 text-white font-bold rounded-lg transition ${
                isCheckIn
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Save size={18} />
              Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
