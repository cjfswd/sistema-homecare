import { useState } from 'react';
import { X, User, Calendar, ClipboardCheck, FileText, CheckCircle2 } from 'lucide-react';
import type { Assessment, ABEMIDCategory, NEADDomain } from '@/types';
import { formatDateTime } from '@/lib/formatters';
import { ABEMID_CATEGORIES, NEAD_DOMAINS, NEAD_MAX_SCORE } from '@/lib/mockData';

interface AssessmentModalProps {
  assessment: Assessment;
  isOpen: boolean;
  onClose: () => void;
}

const levelColors: Record<string, string> = {
  AD1: 'bg-emerald-100 text-emerald-700',
  AD2: 'bg-amber-100 text-amber-700',
  AD3: 'bg-rose-100 text-rose-700'
};

const levelDescriptions: Record<string, string> = {
  AD1: 'Atenção Domiciliar Tipo 1 - Baixa Complexidade',
  AD2: 'Atenção Domiciliar Tipo 2 - Média Complexidade',
  AD3: 'Atenção Domiciliar Tipo 3 - Alta Complexidade'
};

export function AssessmentModal({ assessment, isOpen, onClose }: AssessmentModalProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  if (!isOpen) return null;

  const isABEMID = assessment.type === 'ABEMID';
  const selectedCodes = assessment.answers.map(a => a.questionCode);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const getAnswerValue = (code: string): number => {
    const answer = assessment.answers.find(a => a.questionCode === code);
    return typeof answer?.value === 'number' ? answer.value : 0;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${isABEMID ? 'bg-indigo-50' : 'bg-teal-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isABEMID ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                <ClipboardCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Avaliação {assessment.type}
                </h2>
                <p className="text-sm text-slate-500">Paciente: {assessment.patientName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <User size={14} />
                  <span>Avaliador</span>
                </div>
                <p className="font-semibold text-slate-800">{assessment.performedByName}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Calendar size={14} />
                  <span>Data</span>
                </div>
                <p className="font-semibold text-slate-800">{formatDateTime(new Date(assessment.performedAt))}</p>
              </div>

              <div className={`rounded-lg p-4 ${isABEMID ? levelColors[assessment.level || 'AD1'] : 'bg-teal-50'}`}>
                <div className="text-xs mb-1 opacity-75">
                  {isABEMID ? 'Classificação' : 'Pontuação'}
                </div>
                <p className="font-bold text-lg">
                  {isABEMID ? assessment.level : `${assessment.score}/${NEAD_MAX_SCORE}`}
                </p>
              </div>
            </div>

            {/* ABEMID Level Description */}
            {isABEMID && assessment.level && (
              <div className={`mb-6 p-4 rounded-lg border ${levelColors[assessment.level]} border-current/20`}>
                <p className="font-medium">{levelDescriptions[assessment.level]}</p>
              </div>
            )}

            {/* Criteria/Questions */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} />
                {isABEMID ? 'Critérios Selecionados' : 'Respostas por Domínio'}
              </h3>

              {isABEMID ? (
                // ABEMID - Show categories and selected criteria
                <div className="space-y-3">
                  {ABEMID_CATEGORIES.map((category: ABEMIDCategory) => {
                    const selectedInCategory = category.criteria.filter(c => selectedCodes.includes(c.code));
                    if (selectedInCategory.length === 0) return null;

                    return (
                      <div key={category.name} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategory(category.name)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition"
                        >
                          <span className="font-medium text-slate-700">{category.name}</span>
                          <span className="text-sm text-indigo-600 font-bold">
                            {selectedInCategory.length} selecionado(s)
                          </span>
                        </button>

                        {expandedCategories.includes(category.name) && (
                          <div className="p-4 space-y-2">
                            {selectedInCategory.map(criterion => (
                              <div key={criterion.code} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 size={16} className="text-emerald-500" />
                                  <span className="text-sm text-slate-700">{criterion.description}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${levelColors[criterion.level]}`}>
                                  {criterion.level}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                // NEAD - Show domains and scores
                <div className="space-y-3">
                  {NEAD_DOMAINS.map((domain: NEADDomain) => {
                    const domainScore = domain.questions.reduce((sum, q) => sum + getAnswerValue(q.code), 0);
                    const domainMax = domain.questions.reduce((sum, q) => sum + q.maxScore, 0);
                    const percentage = Math.round((domainScore / domainMax) * 100);

                    return (
                      <div key={domain.name} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategory(domain.name)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition"
                        >
                          <span className="font-medium text-slate-700">{domain.name}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-teal-600 font-bold">
                              {domainScore}/{domainMax}
                            </span>
                          </div>
                        </button>

                        {expandedCategories.includes(domain.name) && (
                          <div className="p-4 space-y-3">
                            {domain.questions.map(question => {
                              const value = getAnswerValue(question.code);
                              return (
                                <div key={question.code} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                  <span className="text-sm text-slate-700">{question.description}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      {Array.from({ length: question.maxScore + 1 }).map((_, i) => (
                                        <div
                                          key={i}
                                          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                            i === value
                                              ? 'bg-teal-500 text-white'
                                              : 'bg-slate-100 text-slate-400'
                                          }`}
                                        >
                                          {i}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notes */}
            {assessment.notes && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Observações</h4>
                <p className="text-sm text-slate-600">{assessment.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
