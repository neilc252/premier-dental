import React, { useState } from 'react';
import { 
  ToothNumber, 
  ToothSurface, 
  ToothConditionType, 
  ToothCondition, 
  Patient,
  ConditionStatus
} from '../../types';
import { CDT_CODES } from '../../data/cdtCodes';
import { Plus, Check, Trash2, AlertCircle, Sparkles, Shield, Info } from 'lucide-react';

interface ToothChartProps {
  patient: Patient;
  onAddCondition: (condition: ToothCondition) => void;
  onRemoveCondition: (conditionId: string) => void;
  onAddTreatmentPlan: (cdtCode: string, toothNumber: number, surfaces: ToothSurface[]) => void;
}

// Tooth numbering metadata
const UPPER_ARCH: ToothNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const LOWER_ARCH: ToothNumber[] = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

const TOOTH_NAMES: Record<number, string> = {
  1: 'Maxillary Right 3rd Molar',
  2: 'Maxillary Right 2nd Molar',
  3: 'Maxillary Right 1st Molar',
  4: 'Maxillary Right 2nd Premolar',
  5: 'Maxillary Right 1st Premolar',
  6: 'Maxillary Right Canine',
  7: 'Maxillary Right Lateral Incisor',
  8: 'Maxillary Right Central Incisor',
  9: 'Maxillary Left Central Incisor',
  10: 'Maxillary Left Lateral Incisor',
  11: 'Maxillary Left Canine',
  12: 'Maxillary Left 1st Premolar',
  13: 'Maxillary Left 2nd Premolar',
  14: 'Maxillary Left 1st Molar',
  15: 'Maxillary Left 2nd Molar',
  16: 'Maxillary Left 3rd Molar',
  17: 'Mandibular Left 3rd Molar',
  18: 'Mandibular Left 2nd Molar',
  19: 'Mandibular Left 1st Molar',
  20: 'Mandibular Left 2nd Premolar',
  21: 'Mandibular Left 1st Premolar',
  22: 'Mandibular Left Canine',
  23: 'Mandibular Left Lateral Incisor',
  24: 'Mandibular Left Central Incisor',
  25: 'Mandibular Right Central Incisor',
  26: 'Mandibular Right Lateral Incisor',
  27: 'Mandibular Right Canine',
  28: 'Mandibular Right 1st Premolar',
  29: 'Mandibular Right 2nd Premolar',
  30: 'Mandibular Right 1st Molar',
  31: 'Mandibular Right 2nd Molar',
  32: 'Mandibular Right 3rd Molar',
};

export const ToothChart: React.FC<ToothChartProps> = ({
  patient,
  onAddCondition,
  onRemoveCondition,
  onAddTreatmentPlan,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<ToothNumber | null>(3);
  const [selectedSurfaces, setSelectedSurfaces] = useState<ToothSurface[]>(['O']);
  const [selectedConditionType, setSelectedConditionType] = useState<ToothConditionType>('caries');
  const [conditionStatus, setConditionStatus] = useState<ConditionStatus>('proposed');
  const [notes, setNotes] = useState<string>('');
  const [selectedCdtCode, setSelectedCdtCode] = useState<string>('D2391');

  // Surface Toggle Helper
  const toggleSurface = (surf: ToothSurface) => {
    if (selectedSurfaces.includes(surf)) {
      setSelectedSurfaces(selectedSurfaces.filter((s) => s !== surf));
    } else {
      setSelectedSurfaces([...selectedSurfaces, surf]);
    }
  };

  // Get conditions for a tooth
  const getToothConditions = (toothNum: ToothNumber) => {
    return patient.conditions.filter((c) => c.toothNumber === toothNum);
  };

  // Check condition flags for styling
  const isToothMissing = (toothNum: ToothNumber) => {
    return getToothConditions(toothNum).some((c) => c.type === 'missing' || c.type === 'extracted');
  };

  const isToothCrown = (toothNum: ToothNumber) => {
    return getToothConditions(toothNum).some((c) => c.type === 'crown');
  };

  const isToothImplant = (toothNum: ToothNumber) => {
    return getToothConditions(toothNum).some((c) => c.type === 'implant');
  };

  const isToothRct = (toothNum: ToothNumber) => {
    return getToothConditions(toothNum).some((c) => c.type === 'rct');
  };

  const handleApplyCondition = () => {
    if (!selectedTooth) return;

    const newCond: ToothCondition = {
      id: `cond-${Date.now()}`,
      toothNumber: selectedTooth,
      surfaces: selectedSurfaces,
      type: selectedConditionType,
      status: conditionStatus,
      cdtCode: selectedCdtCode,
      notes: notes || `${selectedConditionType} on Tooth #${selectedTooth}`,
      dateRecorded: new Date().toISOString().split('T')[0],
    };

    onAddCondition(newCond);

    // If proposed or in-progress, optionally auto-add to treatment plan
    if (conditionStatus === 'proposed' || conditionStatus === 'in_progress') {
      onAddTreatmentPlan(selectedCdtCode, selectedTooth, selectedSurfaces);
    }

    setNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Graphical Odontogram & Clinical Charting</span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800">
                Adult 32-Tooth Chart
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any tooth or tooth surface to inspect existing conditions, record findings, or queue CDT procedure plans.
            </p>
          </div>

          {/* Quick Condition Legend */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Caries / Decay
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Existing Crown
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Composite / Restoration
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Amalgam
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-700">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Root Canal / Implant
            </div>
          </div>
        </div>
      </div>

      {/* Main Charting Grid & Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Graphic Odontogram Arches */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-8">
          
          {/* Maxillary (Upper Arch) */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Maxillary Arch (Upper Teeth #1 - #16)
              </span>
              <span className="text-xs text-slate-400">Right → Left</span>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-16 min-w-[620px] sm:min-w-0 gap-1.5 sm:gap-2 justify-items-center">
              {UPPER_ARCH.map((toothNum) => {
                const isSelected = selectedTooth === toothNum;
                const conds = getToothConditions(toothNum);
                const missing = isToothMissing(toothNum);
                const crown = isToothCrown(toothNum);
                const implant = isToothImplant(toothNum);
                const rct = isToothRct(toothNum);

                return (
                  <button
                    key={toothNum}
                    onClick={() => setSelectedTooth(toothNum)}
                    className={`relative w-full aspect-[1/2] max-w-[48px] rounded-xl border p-1 flex flex-col items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/80 shadow-md ring-2 ring-cyan-400 ring-offset-1'
                        : missing
                        ? 'border-dashed border-slate-300 bg-slate-100/60 opacity-60'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
                    }`}
                  >
                    {/* Tooth Number */}
                    <span className="text-[11px] font-bold font-mono text-slate-700">
                      #{toothNum}
                    </span>

                    {/* Tooth SVG Graphic Representation */}
                    <div className="relative w-8 h-10 flex items-center justify-center my-1">
                      {/* Root canal line indicator */}
                      {rct && (
                        <div className="absolute inset-x-1/2 top-0 bottom-4 w-1 bg-purple-500 rounded-full z-10 animate-pulse"></div>
                      )}

                      {/* Implant screw representation */}
                      {implant && (
                        <div className="absolute inset-x-2 bottom-1 h-5 bg-gradient-to-b from-slate-400 to-slate-700 rounded border border-slate-300 z-10 flex flex-col justify-around py-0.5 px-0.5">
                          <div className="h-0.5 bg-slate-200"></div>
                          <div className="h-0.5 bg-slate-200"></div>
                          <div className="h-0.5 bg-slate-200"></div>
                        </div>
                      )}

                      {/* Crown outline representation */}
                      {crown && (
                        <div className="absolute inset-0 rounded-lg border-2 border-amber-500 bg-amber-50/40 z-10"></div>
                      )}

                      {/* Missing Cross */}
                      {missing && (
                        <div className="absolute inset-0 flex items-center justify-center text-rose-500/80 font-bold text-lg z-20">
                          ✕
                        </div>
                      )}

                      {/* 5-Surface Graphical Diagram (Occlusal center + F, L, M, D) */}
                      <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow-xs">
                        {/* Facial (Top) */}
                        <path
                          d="M 5,5 L 35,5 L 28,12 L 12,12 Z"
                          fill={conds.some(c => c.surfaces.includes('F') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('F') && c.type === 'composite') ? '#3b82f6' : '#f8fafc'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                        {/* Lingual (Bottom) */}
                        <path
                          d="M 12,28 L 28,28 L 35,35 L 5,35 Z"
                          fill={conds.some(c => c.surfaces.includes('L') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('L') && c.type === 'composite') ? '#3b82f6' : '#f8fafc'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                        {/* Mesial (Left) */}
                        <path
                          d="M 5,5 L 12,12 L 12,28 L 5,35 Z"
                          fill={conds.some(c => c.surfaces.includes('M') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('M') && c.type === 'composite') ? '#3b82f6' : '#f8fafc'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                        {/* Distal (Right) */}
                        <path
                          d="M 35,5 L 28,12 L 28,28 L 35,35 Z"
                          fill={conds.some(c => c.surfaces.includes('D') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('D') && c.type === 'composite') ? '#3b82f6' : '#f8fafc'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                        {/* Occlusal / Incisal (Center) */}
                        <rect
                          x="12"
                          y="12"
                          width="16"
                          height="16"
                          fill={conds.some(c => c.surfaces.includes('O') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('O') && c.type === 'composite') ? '#3b82f6' : conds.some(c => c.surfaces.includes('O') && c.type === 'amalgam') ? '#475569' : '#ffffff'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>

                    {/* Condition Badge Dot */}
                    {conds.length > 0 && (
                      <div className="flex gap-0.5">
                        {conds.map((c) => (
                          <span
                            key={c.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.type === 'caries'
                                ? 'bg-rose-500'
                                : c.type === 'crown'
                                ? 'bg-amber-500'
                                : c.type === 'composite'
                                ? 'bg-blue-500'
                                : 'bg-slate-500'
                            }`}
                          ></span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
              </div>
            </div>
          </div>

          {/* Mandibular (Lower Arch) */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mandibular Arch (Lower Teeth #17 - #32)
              </span>
              <span className="text-xs text-slate-400">Left → Right</span>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-16 min-w-[620px] sm:min-w-0 gap-1.5 sm:gap-2 justify-items-center">
              {LOWER_ARCH.map((toothNum) => {
                const isSelected = selectedTooth === toothNum;
                const conds = getToothConditions(toothNum);
                const missing = isToothMissing(toothNum);
                const crown = isToothCrown(toothNum);
                const implant = isToothImplant(toothNum);
                const rct = isToothRct(toothNum);

                return (
                  <button
                    key={toothNum}
                    onClick={() => setSelectedTooth(toothNum)}
                    className={`relative w-full aspect-[1/2] max-w-[48px] rounded-xl border p-1 flex flex-col items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/80 shadow-md ring-2 ring-cyan-400 ring-offset-1'
                        : missing
                        ? 'border-dashed border-slate-300 bg-slate-100/60 opacity-60'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
                    }`}
                  >
                    {/* Tooth Number */}
                    <span className="text-[11px] font-bold font-mono text-slate-700">
                      #{toothNum}
                    </span>

                    {/* Tooth Graphic */}
                    <div className="relative w-8 h-10 flex items-center justify-center my-1">
                      {rct && (
                        <div className="absolute inset-x-1/2 top-4 bottom-0 w-1 bg-purple-500 rounded-full z-10 animate-pulse"></div>
                      )}

                      {implant && (
                        <div className="absolute inset-x-2 top-1 h-5 bg-gradient-to-b from-slate-400 to-slate-700 rounded border border-slate-300 z-10 flex flex-col justify-around py-0.5 px-0.5">
                          <div className="h-0.5 bg-slate-200"></div>
                          <div className="h-0.5 bg-slate-200"></div>
                          <div className="h-0.5 bg-slate-200"></div>
                        </div>
                      )}

                      {crown && (
                        <div className="absolute inset-0 rounded-lg border-2 border-amber-500 bg-amber-50/40 z-10"></div>
                      )}

                      {missing && (
                        <div className="absolute inset-0 flex items-center justify-center text-rose-500/80 font-bold text-lg z-20">
                          ✕
                        </div>
                      )}

                      <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow-xs">
                        <path
                          d="M 5,5 L 35,5 L 28,12 L 12,12 Z"
                          fill={conds.some(c => c.surfaces.includes('F') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('F') && c.type === 'composite') ? '#3b82f6' : '#f8fafc'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                        <path
                          d="M 12,28 L 28,28 L 35,35 L 5,35 Z"
                          fill={conds.some(c => c.surfaces.includes('L') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('L') && c.type === 'composite') ? '#3b82f6' : '#f8fafc'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                        <path
                          d="M 5,5 L 12,12 L 12,28 L 5,35 Z"
                          fill={conds.some(c => c.surfaces.includes('M') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('M') && c.type === 'composite') ? '#3b82f6' : '#f8fafc'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                        <path
                          d="M 35,5 L 28,12 L 28,28 L 35,35 Z"
                          fill={conds.some(c => c.surfaces.includes('D') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('D') && c.type === 'composite') ? '#3b82f6' : '#f8fafc'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                        <rect
                          x="12"
                          y="12"
                          width="16"
                          height="16"
                          fill={conds.some(c => c.surfaces.includes('O') && c.type === 'caries') ? '#ef4444' : conds.some(c => c.surfaces.includes('O') && c.type === 'composite') ? '#3b82f6' : conds.some(c => c.surfaces.includes('O') && c.type === 'amalgam') ? '#475569' : '#ffffff'}
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>

                    {conds.length > 0 && (
                      <div className="flex gap-0.5">
                        {conds.map((c) => (
                          <span
                            key={c.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.type === 'caries'
                                ? 'bg-rose-500'
                                : c.type === 'crown'
                                ? 'bg-amber-500'
                                : c.type === 'composite'
                                ? 'bg-blue-500'
                                : 'bg-slate-500'
                            }`}
                          ></span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
              </div>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Active Tooth Clinical Charting Drawer */}
        <div className="lg:col-span-4 space-y-4">
          
          {selectedTooth ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
              
              {/* Tooth Header Info */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                    Selected Tooth
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-mono">
                    Tooth #{selectedTooth}
                  </h3>
                  <p className="text-xs text-slate-500">{TOOTH_NAMES[selectedTooth]}</p>
                </div>

                <div className="h-10 w-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center font-bold text-cyan-700 font-mono">
                  #{selectedTooth}
                </div>
              </div>

              {/* Surface Selection Buttons */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">
                  Select Surfaces (Click to toggle):
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['M', 'O', 'D', 'F', 'L'] as ToothSurface[]).map((surf) => {
                    const isSelected = selectedSurfaces.includes(surf);
                    return (
                      <button
                        key={surf}
                        onClick={() => toggleSurface(surf)}
                        className={`py-2 text-xs font-bold font-mono rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-cyan-300 border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {surf}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  M: Mesial, O: Occlusal, D: Distal, F: Facial, L: Lingual
                </p>
              </div>

              {/* Condition Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">
                  Clinical Condition / Finding:
                </label>
                <select
                  value={selectedConditionType}
                  onChange={(e) => setSelectedConditionType(e.target.value as ToothConditionType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="caries">🚨 Caries / Active Decay</option>
                  <option value="composite">🦷 Composite Resin Restoration</option>
                  <option value="amalgam">🩶 Amalgam Restoration</option>
                  <option value="crown">👑 Full Crown / Cap</option>
                  <option value="rct">⚡ Root Canal Therapy (RCT)</option>
                  <option value="implant">🔩 Surgical Implant</option>
                  <option value="missing">✕ Missing / Extracted Tooth</option>
                  <option value="watch">👁️ Watch / Incipient Lesion</option>
                </select>
              </div>

              {/* CDT Code Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">
                  Attach CDT Procedure Code:
                </label>
                <select
                  value={selectedCdtCode}
                  onChange={(e) => setSelectedCdtCode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {CDT_CODES.map((code) => (
                    <option key={code.code} value={code.code}>
                      {code.code} - {code.description} (${code.defaultFee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status & Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Status:</label>
                  <select
                    value={conditionStatus}
                    onChange={(e) => setConditionStatus(e.target.value as ConditionStatus)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                  >
                    <option value="proposed">Proposed Plan</option>
                    <option value="in_progress">In Progress</option>
                    <option value="existing">Existing / Historical</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Clinical Note:</label>
                  <input
                    type="text"
                    placeholder="e.g. Deep distal pit"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleApplyCondition}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Save Finding & Queue CDT Plan</span>
              </button>

              {/* Existing Findings List for this tooth */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 mb-2">
                  Active Findings on Tooth #{selectedTooth}:
                </div>

                {getToothConditions(selectedTooth).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No previous findings or restorations recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {getToothConditions(selectedTooth).map((cond) => (
                      <div
                        key={cond.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <span className="capitalize">{cond.type}</span>
                            {cond.surfaces.length > 0 && (
                              <span className="px-1.5 py-0.2 font-mono text-[10px] bg-slate-200 rounded text-slate-700">
                                {cond.surfaces.join('')}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {cond.cdtCode} • {cond.notes}
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveCondition(cond.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="Delete Finding"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-sm">
              Select any tooth on the Odontogram chart to view or add clinical findings.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
