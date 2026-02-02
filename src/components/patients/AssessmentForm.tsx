import { useState, useMemo } from 'react';
import { X, Search, User, ClipboardCheck, Save, ChevronDown, ChevronUp } from 'lucide-react';
import type { Assessment, AssessmentType, AssessmentAnswer, Professional, ABEMIDLevel } from '@/types';
import { ABEMID_CATEGORIES, NEAD_DOMAINS, NEAD_MAX_SCORE, determineABEMIDLevel } from '@/lib/mockData';

interface AssessmentFormProps {
  type: AssessmentType;
  patientId: string;
  patientName: string;
  professionals: Professional[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (assessment: Partial<Assessment>) => void;
}

const levelColors: Record<string, string> = {
  AD1: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  AD2: 'bg-amber-100 text-amber-700 border-amber-300',
  AD3: 'bg-rose-100 text-rose-700 border-rose-300'
};

export function AssessmentForm({
  type,
  patientId,
  patientName,
  professionals,
  isOpen,
  onClose,
  onSave
}: AssessmentFormProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [profSearchTerm, setProfSearchTerm] = useState('');
  const [isProfListOpen, setIsProfListOpen] = useState(false);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [notes, setNotes] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const isABEMID = type === 'ABEMID';

  // Filter professionals for search
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(p =>
      (p.role === 'doctor' || p.role === 'nurse') &&
      p.status === 'active' &&
      p.name.toLowerCase().includes(profSearchTerm.toLowerCase())
    );
  }, [professionals, profSearchTerm]);

  // Calculate ABEMID level based on selected criteria
  const abemidLevel: ABEMIDLevel = useMemo(() => {
    if (!isABEMID) return 'AD1';
    const selectedCodes = answers.filter(a => a.value === true).map(a => a.questionCode);
    return determineABEMIDLevel(selectedCodes);
  }, [answers, isABEMID]);

  // Calculate NEAD score
  const neadScore = useMemo(() => {
    if (isABEMID) return 0;
    return answers.reduce((sum, a) => sum + (typeof a.value === 'number' ? a.value : 0), 0);
  }, [answers, isABEMID]);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleABEMIDToggle = (code: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionCode === code);
      if (existing) {
        return prev.filter(a => a.questionCode !== code);
      }
      return [...prev, { questionCode: code, value: true }];
    });
  };

  const handleNEADChange = (code: string, value: number) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionCode !== code);
      return [...filtered, { questionCode: code, value }];
    });
  };

  const isABEMIDSelected = (code: string) => {
    return answers.some(a => a.questionCode === code && a.value === true);
  };

  const getNEADValue = (code: string): number => {
    const answer = answers.find(a => a.questionCode === code);
    return typeof answer?.value === 'number' ? answer.value : 0;
  };

  const handleSave = () => {
    if (!selectedProfessional) return;

    const assessment: Partial<Assessment> = {
      patientId,
      patientName,
      type,
      performedBy: selectedProfessional.id,
      performedByName: selectedProfessional.name,
      performedAt: new Date(),
      answers,
      notes: notes || undefined,
      status: 'completed',
      ...(isABEMID ? { level: abemidLevel } : { score: neadScore })
    };

    onSave(assessment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${isABEMID ? 'bg-indigo-50' : 'bg-teal-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isABEMID ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                <ClipboardCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Nova Avaliação {type}
                </h2>
                <p className="text-sm text-slate-500">Paciente: {patientName}</p>
              </div>
            </div>

            {/* Live score/level */}
            <div className="flex items-center gap-4">
              {isABEMID ? (
                <div className={`px-4 py-2 rounded-lg font-bold ${levelColors[abemidLevel]}`}>
                  Nível: {abemidLevel}
                </div>
              ) : (
                <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-lg">
                  <span className="text-sm">Pontuação: </span>
                  <span className="font-bold text-lg">{neadScore}/{NEAD_MAX_SCORE}</span>
                </div>
              )}
              <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Professional Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <User size={14} className="inline mr-2" />
                Profissional Responsável
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar profissional..."
                  value={profSearchTerm}
                  onChange={(e) => { setProfSearchTerm(e.target.value); setIsProfListOpen(true); }}
                  onFocus={() => setIsProfListOpen(true)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {selectedProfessional && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedProfessional.name}
                  </div>
                )}

                {isProfListOpen && filteredProfessionals.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {filteredProfessionals.map(prof => (
                      <div
                        key={prof.id}
                        onClick={() => {
                          setSelectedProfessional(prof);
                          setProfSearchTerm(prof.name);
                          setIsProfListOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex justify-between items-center"
                      >
                        <span className="font-medium text-slate-700">{prof.name}</span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                          {prof.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assessment Questions */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">
                {isABEMID ? 'Selecione os Critérios Aplicáveis' : 'Avalie Cada Item'}
              </h3>

              {isABEMID ? (
                // ABEMID Form
                <div className="space-y-3">
                  {ABEMID_CATEGORIES.map(category => (
                    <div key={category.name} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.name)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition"
                      >
                        <span className="font-medium text-slate-700">{category.name}</span>
                        {expandedCategories.includes(category.name)
                          ? <ChevronUp size={18} className="text-slate-400" />
                          : <ChevronDown size={18} className="text-slate-400" />
                        }
                      </button>

                      {expandedCategories.includes(category.name) && (
                        <div className="p-4 space-y-2 bg-white">
                          {category.criteria.map(criterion => (
                            <label
                              key={criterion.code}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                                isABEMIDSelected(criterion.code)
                                  ? 'bg-indigo-50 border-2 border-indigo-300'
                                  : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isABEMIDSelected(criterion.code)}
                                  onChange={() => handleABEMIDToggle(criterion.code)}
                                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-slate-700">{criterion.description}</span>
                              </div>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${levelColors[criterion.level]}`}>
                                {criterion.level}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // NEAD Form
                <div className="space-y-3">
                  {NEAD_DOMAINS.map(domain => (
                    <div key={domain.name} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleCategory(domain.name)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition"
                      >
                        <span className="font-medium text-slate-700">{domain.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-teal-600 font-medium">
                            {domain.questions.reduce((sum, q) => sum + getNEADValue(q.code), 0)}/
                            {domain.questions.reduce((sum, q) => sum + q.maxScore, 0)}
                          </span>
                          {expandedCategories.includes(domain.name)
                            ? <ChevronUp size={18} className="text-slate-400" />
                            : <ChevronDown size={18} className="text-slate-400" />
                          }
                        </div>
                      </button>

                      {expandedCategories.includes(domain.name) && (
                        <div className="p-4 space-y-4 bg-white">
                          {domain.questions.map(question => (
                            <div key={question.code} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-700">{question.description}</span>
                                <span className="text-xs text-slate-500">Máx: {question.maxScore}</span>
                              </div>
                              <div className="flex gap-2">
                                {Array.from({ length: question.maxScore + 1 }).map((_, value) => (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleNEADChange(question.code, value)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                                      getNEADValue(question.code) === value
                                        ? 'bg-teal-500 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {value}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Observações (Opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre a avaliação..."
                className="w-full h-24 p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
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
              disabled={!selectedProfessional}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              Salvar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
