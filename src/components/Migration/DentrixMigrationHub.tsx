import React, { useState } from 'react';
import { DentrixMigrationBatch, Patient } from '../../types';
import { INITIAL_MIGRATION_BATCHES } from '../../data/mockData';
import { StaffUser } from '../StaffLoginModal';
import { 
  Database, 
  Upload, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight, 
  FileCode, 
  Sparkles,
  Server,
  Zap
} from 'lucide-react';

interface DentrixMigrationHubProps {
  onImportPatients: (newPatients: Patient[]) => void;
  currentStaff?: StaffUser;
}

export const DentrixMigrationHub: React.FC<DentrixMigrationHubProps> = ({
  onImportPatients,
  currentStaff,
}) => {
  const [batches, setBatches] = useState<DentrixMigrationBatch[]>(INITIAL_MIGRATION_BATCHES);
  const [selectedSystem, setSelectedSystem] = useState<'Dentrix G7' | 'Dentrix Enterprise' | 'Eaglesoft' | 'Open Dental'>('Dentrix G7');
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const handleSimulateMigration = () => {
    setIsMigrating(true);
    setMigrationComplete(false);

    const targetCompanyId = currentStaff?.companyId || 'CMP-8002';
    const targetUserNum = currentStaff?.userNumber || 'USR-7010';

    setTimeout(() => {
      const newImportedPatients: Patient[] = [
        {
          id: `pat-mig-${Date.now()}-1`,
          userNumber: targetUserNum,
          companyId: targetCompanyId,
          chartNumber: 'DX-90014',
          firstName: 'Evelyn',
          lastName: 'Harper',
          dob: '1978-09-12',
          gender: 'Female',
          phone: '(555) 901-2288',
          email: 'evelyn.harper@example.com',
          address: '410 Bellevue Way, Bellevue WA 98004',
          insuranceProvider: 'Delta Dental Premier',
          policyNumber: 'DEL-881920',
          groupNumber: 'GRP-3001',
          medicalAlerts: [
            { id: 'ma-mig-1', type: 'allergy', severity: 'critical', title: 'Sulfa Drugs Allergy', notes: 'Migrated from Dentrix G7 Medical Alerts tab.' },
          ],
          conditions: [
            { id: 'tc-mig-1', toothNumber: 14, surfaces: ['M', 'O'], type: 'caries', status: 'proposed', cdtCode: 'D2392', notes: 'Dentrix Chart Note: MO caries flagged by Dr. Stevens', dateRecorded: '2026-08-01' },
          ],
          perioChart: {},
          treatmentPlans: [
            {
              id: 'tp-mig-1',
              toothNumber: 14,
              surfaces: ['M', 'O'],
              cdtCode: 'D2392',
              description: 'Composite 2 Surfaces Posterior',
              fee: 275,
              insuranceEst: 215,
              patientResp: 60,
              phase: 1,
              status: 'proposed',
              dateAdded: '2026-08-01',
            },
          ],
          soapNotes: [],
          lastVisit: '2026-08-01',
          nextRecall: '2027-02-01',
          balanceDue: 60.00,
        },
        {
          id: `pat-mig-${Date.now()}-2`,
          userNumber: targetUserNum,
          companyId: targetCompanyId,
          chartNumber: 'DX-90015',
          firstName: 'Robert',
          lastName: 'Sterling',
          dob: '1965-02-04',
          gender: 'Male',
          phone: '(555) 304-7711',
          email: 'robert.sterling@example.com',
          address: '1201 3rd Ave, Seattle WA 98101',
          insuranceProvider: 'Premera Blue Cross',
          policyNumber: 'PRE-102930',
          groupNumber: 'GRP-1102',
          medicalAlerts: [],
          conditions: [
            { id: 'tc-mig-2', toothNumber: 19, surfaces: [], type: 'crown', status: 'completed', cdtCode: 'D2750', notes: 'Dentrix Historic Crown placed 2022', dateRecorded: '2022-05-18' },
          ],
          perioChart: {},
          treatmentPlans: [],
          soapNotes: [],
          lastVisit: '2026-06-12',
          nextRecall: '2026-12-12',
          balanceDue: 0.00,
        },
      ];

      onImportPatients(newImportedPatients);

      const newBatch: DentrixMigrationBatch = {
        importId: `mig-${Date.now()}`,
        sourceSystem: selectedSystem,
        fileName: `${selectedSystem.toUpperCase().replace(/\s+/g, '_')}_EXPORT_BATCH_${new Date().getFullYear()}.XML`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        patientRecordsFound: 2,
        chartsMapped: 2,
        cdtCodesNormalized: 8,
        status: 'completed',
        samplePatients: [
          { dentrixId: 'DX-90014', name: 'Evelyn Harper', teethChartedCount: 1, ledgerBalance: 60.00 },
          { dentrixId: 'DX-90015', name: 'Robert Sterling', teethChartedCount: 1, ledgerBalance: 0.00 },
        ],
      };

      setBatches([newBatch, ...batches]);
      setIsMigrating(false);
      setMigrationComplete(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner for Premier Migration */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>Premier Data Engine v4.2</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white">
              Seamless Dentrix & Legacy PMS Data Migration
            </h2>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Powered by Premier's proprietary migration pipeline. Convert legacy Dentrix, Eaglesoft, or Open Dental XML/CSV databases directly into Premier Dental PMS with 100% chart accuracy, tooth condition preservation, and CDT ledger normalization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[200px]">
            <div className="text-2xl font-black font-mono text-emerald-400">1,422</div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">Dentrix Charts Migrated</div>
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Zero Data Loss Guarantee
            </div>
          </div>
        </div>
      </div>

      {/* Migration Action Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Data Importer */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Upload className="h-5 w-5 text-cyan-600" />
            <span>Ingest Legacy Dentrix Backup</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Select Source Dental System:
            </label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value as any)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Dentrix G7">Dentrix G7 (XML / Database Dump)</option>
              <option value="Dentrix Enterprise">Dentrix Enterprise (HL7 / XML)</option>
              <option value="Eaglesoft">Patterson Eaglesoft (.DAT / Export)</option>
              <option value="Open Dental">Open Dental (MySQL / Backup)</option>
            </select>
          </div>

          {/* Drag & Drop Simulation Zone */}
          <div className="border-2 border-dashed border-cyan-300 bg-cyan-50/40 rounded-2xl p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto">
              <FileCode className="h-6 w-6" />
            </div>

            <div>
              <div className="font-bold text-xs text-slate-900">
                Drag & Drop Dentrix Export Files Here
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Supports <code className="font-mono bg-white px-1 border rounded">PATIENT.XML</code>, <code className="font-mono bg-white px-1 border rounded">CHART.CSV</code>, <code className="font-mono bg-white px-1 border rounded">LEDGER.DAT</code>
              </p>
            </div>

            <button
              onClick={handleSimulateMigration}
              disabled={isMigrating}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all disabled:opacity-50"
            >
              {isMigrating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-300" />
                  <span>Processing Data Normalization...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  <span>Execute Premier Import</span>
                </>
              )}
            </button>
          </div>

          {migrationComplete && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Migration successful! 2 test patient charts (Evelyn Harper & Robert Sterling) ingested into active Premier Dental PMS database.
              </span>
            </div>
          )}

        </div>

        {/* Right 7 Cols: Field Mapping Table & Audit History */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">
              Field Mapping & Normalization Rules
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Automated CDT Mapping
            </span>
          </div>

          {/* Mapping Table */}
          <div className="border rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-2.5">Dentrix Legacy Field</th>
                  <th className="p-2.5 text-center">→</th>
                  <th className="p-2.5">Premier Dental Schema</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr>
                  <td className="p-2.5 text-slate-800 font-bold">PatID / ChartNum</td>
                  <td className="p-2.5 text-center text-slate-400">→</td>
                  <td className="p-2.5 text-cyan-700 font-bold">chartNumber</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Mapped</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-800 font-bold">ToothNumStr (1-32)</td>
                  <td className="p-2.5 text-center text-slate-400">→</td>
                  <td className="p-2.5 text-cyan-700 font-bold">toothNumber</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Mapped</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-800 font-bold">SurfaceStr (MODFL)</td>
                  <td className="p-2.5 text-center text-slate-400">→</td>
                  <td className="p-2.5 text-cyan-700 font-bold">surfaces[]</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Mapped</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-800 font-bold">ADA_ProcedureCode</td>
                  <td className="p-2.5 text-center text-slate-400">→</td>
                  <td className="p-2.5 text-cyan-700 font-bold">cdtCode (Normalized)</td>
                  <td className="p-2.5 text-emerald-600 font-bold">Mapped</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Migration Batches History */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              Migration Audit Logs ({batches.length})
            </h4>

            {batches.map((batch) => (
              <div key={batch.importId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Server className="h-4 w-4 text-cyan-600" />
                    <span>{batch.sourceSystem}</span>
                    <span className="font-mono text-slate-400 font-normal">({batch.fileName})</span>
                  </div>

                  <span className="font-mono text-slate-500 text-[11px]">{batch.timestamp}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 font-mono">
                  <span>Patients: {batch.patientRecordsFound}</span>
                  <span>Charts Ingested: {batch.chartsMapped}</span>
                  <span>CDT Codes Mapped: {batch.cdtCodesNormalized}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
