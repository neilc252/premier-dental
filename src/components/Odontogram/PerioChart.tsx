import React from 'react';
import { Patient, PerioProbeData } from '../../types';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PerioChartProps {
  patient: Patient;
  onUpdatePerioData: (toothNumber: number, perioData: PerioProbeData) => void;
}

const SAMPLE_TEETH = [2, 3, 4, 5, 12, 13, 14, 15, 18, 19, 20, 21, 28, 29, 30, 31];

export const PerioChart: React.FC<PerioChartProps> = ({
  patient,
  onUpdatePerioData,
}) => {
  const getPerioForTooth = (toothNum: number): PerioProbeData => {
    return (
      patient.perioChart[toothNum] || {
        toothNumber: toothNum,
        facialDepths: [0, 0, 0],
        lingualDepths: [0, 0, 0],
        bleeding: false,
        suppuration: false,
        mobility: 0,
      }
    );
  };

  const handleInitializeNormalBaseline = () => {
    SAMPLE_TEETH.forEach((t) => {
      onUpdatePerioData(t, {
        toothNumber: t,
        facialDepths: [2, 2, 2],
        lingualDepths: [2, 2, 2],
        bleeding: false,
        suppuration: false,
        mobility: 0,
      });
    });
  };

  const handleDepthChange = (
    toothNum: number,
    archType: 'facial' | 'lingual',
    index: number,
    value: number
  ) => {
    const current = getPerioForTooth(toothNum);
    const updatedFacial: [number, number, number] = [...current.facialDepths];
    const updatedLingual: [number, number, number] = [...current.lingualDepths];

    if (archType === 'facial') {
      updatedFacial[index] = value;
    } else {
      updatedLingual[index] = value;
    }

    onUpdatePerioData(toothNum, {
      ...current,
      facialDepths: updatedFacial,
      lingualDepths: updatedLingual,
    });
  };

  const handleToggleBleeding = (toothNum: number) => {
    const current = getPerioForTooth(toothNum);
    onUpdatePerioData(toothNum, {
      ...current,
      bleeding: !current.bleeding,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Periodontal Charting Matrix</span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              6-Point Probing Depth
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor pocket probing depths (mm), Bleeding on Probing (BOP), suppuration, and tooth mobility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <button
            onClick={handleInitializeNormalBaseline}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-semibold transition-all cursor-pointer"
            title="Set all teeth to 2mm healthy probing depth baseline"
          >
            Set 2mm Healthy Baseline
          </button>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span> 1-3mm Normal
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span> 4-5mm Pocket
          </span>
          <span className="flex items-center gap-1 text-rose-700 font-bold">
            <span className="w-3 h-3 rounded bg-rose-200 border border-rose-400"></span> 6mm+ Deep Pocket
          </span>
        </div>
      </div>

      {/* Perio Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-y border-slate-200 font-bold">
              <th className="p-3">Tooth #</th>
              <th className="p-3 text-center">Facial Depths (MB / B / DB)</th>
              <th className="p-3 text-center">Lingual Depths (ML / L / DL)</th>
              <th className="p-3 text-center">BOP (Bleeding)</th>
              <th className="p-3 text-center">Mobility</th>
              <th className="p-3 text-right">Perio Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SAMPLE_TEETH.map((toothNum) => {
              const perio = getPerioForTooth(toothNum);
              const maxDepth = Math.max(...perio.facialDepths, ...perio.lingualDepths);
              const isWarning = maxDepth >= 4 && maxDepth < 6;
              const isSevere = maxDepth >= 6;

              return (
                <tr key={toothNum} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">
                    Tooth #{toothNum}
                  </td>

                  {/* Facial Depths (3 Inputs) */}
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {perio.facialDepths.map((depth, idx) => (
                        <input
                          key={`f-${idx}`}
                          type="number"
                          min="1"
                          max="12"
                          value={depth}
                          onChange={(e) =>
                            handleDepthChange(toothNum, 'facial', idx, parseInt(e.target.value) || 2)
                          }
                          className={`w-9 text-center py-1 rounded-md border font-mono font-bold transition-all text-xs ${
                            depth >= 6
                              ? 'bg-rose-100 text-rose-800 border-rose-300 ring-1 ring-rose-400'
                              : depth >= 4
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Lingual Depths (3 Inputs) */}
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {perio.lingualDepths.map((depth, idx) => (
                        <input
                          key={`l-${idx}`}
                          type="number"
                          min="1"
                          max="12"
                          value={depth}
                          onChange={(e) =>
                            handleDepthChange(toothNum, 'lingual', idx, parseInt(e.target.value) || 2)
                          }
                          className={`w-9 text-center py-1 rounded-md border font-mono font-bold transition-all text-xs ${
                            depth >= 6
                              ? 'bg-rose-100 text-rose-800 border-rose-300 ring-1 ring-rose-400'
                              : depth >= 4
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Bleeding on Probing Checkbox */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleBleeding(toothNum)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        perio.bleeding
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {perio.bleeding ? '🩸 BOP Positive' : 'Normal'}
                    </button>
                  </td>

                  {/* Mobility Score */}
                  <td className="p-3 text-center font-mono font-medium text-slate-700">
                    Class {perio.mobility}
                  </td>

                  {/* Perio Status Indicator */}
                  <td className="p-3 text-right">
                    {isSevere ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 font-bold text-xs">
                        <AlertTriangle className="h-3.5 w-3.5" /> Severe SRP Needed
                      </span>
                    ) : isWarning ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-medium text-xs">
                        <ShieldAlert className="h-3.5 w-3.5" /> Moderate Pocket
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-medium text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Healthy Sulcus
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
