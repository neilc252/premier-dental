import React, { useState } from 'react';
import { Patient, TreatmentPlanItem } from '../../types';
import { CDT_CODES } from '../../data/cdtCodes';
import { 
  ClipboardList, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle, 
  DollarSign, 
  FileCheck,
  Loader2,
  X,
  MessageSquare
} from 'lucide-react';

interface TreatmentPlanViewProps {
  patient: Patient;
  onAddTreatmentItem: (item: TreatmentPlanItem) => void;
  onUpdateTreatmentStatus: (itemId: string, status: TreatmentPlanItem['status']) => void;
  onRemoveTreatmentItem: (itemId: string) => void;
}

export const TreatmentPlanView: React.FC<TreatmentPlanViewProps> = ({
  patient,
  onAddTreatmentItem,
  onUpdateTreatmentStatus,
  onRemoveTreatmentItem,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number>(3);
  const [selectedCdtCode, setSelectedCdtCode] = useState<string>('D2750');
  const [selectedPhase, setSelectedPhase] = useState<1 | 2 | 3>(1);
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  const totalFee = patient.treatmentPlans.reduce((acc, item) => acc + item.fee, 0);
  const totalInsuranceEst = patient.treatmentPlans.reduce((acc, item) => acc + item.insuranceEst, 0);
  const totalPatientResp = patient.treatmentPlans.reduce((acc, item) => acc + item.patientResp, 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const cdt = CDT_CODES.find((c) => c.code === selectedCdtCode);
    if (!cdt) return;

    const newItem: TreatmentPlanItem = {
      id: `tp-${Date.now()}`,
      toothNumber: selectedTooth,
      cdtCode: cdt.code,
      description: cdt.description,
      fee: cdt.defaultFee,
      insuranceEst: cdt.avgInsuranceEst,
      patientResp: Math.max(0, cdt.defaultFee - cdt.avgInsuranceEst),
      phase: selectedPhase,
      status: 'proposed',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    onAddTreatmentItem(newItem);
  };

  const handleGeneratePatientExplanation = async () => {
    setIsExplaining(true);
    setShowExplainModal(true);
    try {
      const res = await fetch('/api/gemini/patient-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentPlanTitle: `Dental Health Plan for ${patient.firstName} ${patient.lastName}`,
          procedures: patient.treatmentPlans.map((p) => ({
            tooth: p.toothNumber,
            code: p.cdtCode,
            desc: p.description,
            cost: `$${p.patientResp}`,
          })),
          estimatedCost: `$${totalPatientResp.toFixed(2)}`,
        }),
      });

      const data = await res.json();
      setAiExplanation(data.explanation || 'No explanation generated.');
    } catch (err) {
      console.error('Patient Explain AI error:', err);
      setAiExplanation('Error generating AI explanation.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Summary Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-cyan-600" />
            <span>Phased Treatment Plan & Fee Estimator</span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800">
              {patient.treatmentPlans.length} Procedure Items
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize proposed care into phased visits, estimate insurance coverage vs out-of-pocket, and generate plain-language patient breakdowns.
          </p>
        </div>

        {/* Financial Summary Pill Box */}
        <div className="flex items-center gap-4 bg-slate-900 text-white p-3.5 rounded-2xl shadow-md border border-slate-800">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Practice Fee</div>
            <div className="text-base font-extrabold font-mono text-white">${totalFee.toFixed(2)}</div>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Ins. Estimate</div>
            <div className="text-base font-extrabold font-mono text-emerald-400">-${totalInsuranceEst.toFixed(2)}</div>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-cyan-300">Patient Co-Pay</div>
            <div className="text-base font-extrabold font-mono text-cyan-300">${totalPatientResp.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Add Treatment Item Form & Plan Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Quick Add Item */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Add Procedure to Plan
          </h3>

          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Tooth Number:</label>
              <input
                type="number"
                min="1"
                max="32"
                value={selectedTooth}
                onChange={(e) => setSelectedTooth(parseInt(e.target.value) || 1)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">CDT Code:</label>
              <select
                value={selectedCdtCode}
                onChange={(e) => setSelectedCdtCode(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono text-slate-800"
              >
                {CDT_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.description} (${c.defaultFee})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Treatment Phase:</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setSelectedPhase(phase as 1 | 2 | 3)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedPhase === phase
                        ? 'bg-slate-900 text-cyan-300 border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Phase {phase}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Phase 1: Immediate/Pain • Phase 2: Restorative • Phase 3: Elective
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="h-4 w-4 text-cyan-300" />
              <span>Add to Treatment Plan</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleGeneratePatientExplanation}
              disabled={patient.treatmentPlans.length === 0}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-cyan-200" />
              <span>AI Plain-English Patient Explainer</span>
            </button>
          </div>
        </div>

        {/* Right 8 Cols: Phased Treatment Plan Items */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Active Treatment Plan Breakdown</h3>
            <span className="text-xs text-slate-500 font-mono">
              Insurance: {patient.insuranceProvider}
            </span>
          </div>

          {patient.treatmentPlans.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No procedure items added to this treatment plan yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-y border-slate-200 font-bold">
                    <th className="p-3">Phase</th>
                    <th className="p-3">Tooth</th>
                    <th className="p-3">CDT Code & Description</th>
                    <th className="p-3 text-right">Fee</th>
                    <th className="p-3 text-right">Ins. Est.</th>
                    <th className="p-3 text-right">Patient Resp</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patient.treatmentPlans.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold font-mono text-cyan-800">
                        P{item.phase}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {item.toothNumber ? `#${item.toothNumber}` : '—'}
                      </td>
                      <td className="p-3">
                        <div className="font-bold font-mono text-slate-900">{item.cdtCode}</div>
                        <div className="text-slate-500 text-[11px]">{item.description}</div>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-800">${item.fee.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono text-emerald-600 font-semibold">
                        -${item.insuranceEst.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ${item.patientResp.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateTreatmentStatus(item.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-md border text-center ${
                            item.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : item.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="proposed">Proposed</option>
                          <option value="accepted">Accepted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onRemoveTreatmentItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* AI Patient Plain-Language Explanation Modal */}
      {showExplainModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-600" />
                <h3 className="font-bold text-base text-slate-900">AI Patient Treatment Explanation</h3>
              </div>
              <button onClick={() => setShowExplainModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {isExplaining ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="h-8 w-8 text-cyan-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-700">
                  Translating dental terminology into plain, patient-friendly explanation...
                </p>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="whitespace-pre-line text-slate-800 font-sans">
                  {aiExplanation}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Close Explanation
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
