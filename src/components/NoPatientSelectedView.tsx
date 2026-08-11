import React, { useState } from 'react';
import { 
  UserSearch, 
  UserPlus, 
  Search, 
  ShieldAlert, 
  Calendar, 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  FileText,
  Filter,
  Edit3
} from 'lucide-react';
import { Patient } from '../types';

interface NoPatientSelectedViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onOpenNewPatient: () => void;
  onOpenEditPatient?: (patient: Patient) => void;
}

export const NoPatientSelectedView: React.FC<NoPatientSelectedViewProps> = ({
  patients,
  onSelectPatient,
  onOpenNewPatient,
  onOpenEditPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'alerts' | 'treatment' | 'balance'>('all');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = `${p.firstName} ${p.lastName} ${p.chartNumber} ${p.phone} ${p.insuranceProvider}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTag === 'alerts') return p.medicalAlerts.length > 0;
    if (filterTag === 'treatment') return p.treatmentPlans.length > 0;
    if (filterTag === 'balance') return p.balanceDue > 0;

    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold">
              <UserSearch className="h-3.5 w-3.5 text-cyan-400" />
              <span>Practice Patient Portal Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              No Patient Chart Currently Selected
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Select a patient from your company practice roster below to view or modify their clinical odontogram, 6-site perio chart, SOAP notes, treatment plans, and billing ledger.
            </p>
          </div>

          <button
            onClick={onOpenNewPatient}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Register New Patient</span>
          </button>
        </div>
      </div>

      {/* Directory Search & Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search company patient by Name, Chart # (e.g. P-1002), Phone, or Insurance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterTag('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterTag === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({patients.length})
            </button>
            <button
              onClick={() => setFilterTag('alerts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterTag === 'alerts'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Alerts ({patients.filter((p) => p.medicalAlerts.length > 0).length})
            </button>
            <button
              onClick={() => setFilterTag('treatment')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterTag === 'treatment'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100'
              }`}
            >
              Pending Plans ({patients.filter((p) => p.treatmentPlans.length > 0).length})
            </button>
            <button
              onClick={() => setFilterTag('balance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterTag === 'balance'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              Balances ({patients.filter((p) => p.balanceDue > 0).length})
            </button>
          </div>

        </div>

        {/* Directory Results Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full py-12 text-center space-y-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
              <Users className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-600 font-medium">
                No matching practice patient records found
              </p>
              <p className="text-xs text-slate-400">
                Try clearing your search or add a new patient to the company database.
              </p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white border border-slate-200 hover:border-cyan-400 rounded-xl p-4 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                          {patient.chartNumber}
                        </span>
                        <span className="text-xs text-slate-500">DOB: {patient.dob}</span>
                      </div>
                    </div>

                    <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                    <p className="truncate">
                      <span className="text-slate-400">Phone:</span> {patient.phone}
                    </p>
                    <p className="truncate">
                      <span className="text-slate-400">Insurance:</span> {patient.insuranceProvider} ({patient.policyNumber})
                    </p>
                  </div>

                  {/* Medical Alerts or Balance Highlights */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {patient.medicalAlerts.map((alert, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                      >
                        <ShieldAlert className="h-3 w-3 text-amber-600" />
                        {alert.title}
                      </span>
                    ))}

                    {patient.balanceDue > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        <CreditCard className="h-3 w-3 text-rose-600" />
                        Balance: ${patient.balanceDue.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                  {onOpenEditPatient && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditPatient(patient);
                      }}
                      className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-slate-200"
                      title="Edit patient info & insurance"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-cyan-600" />
                      <span>Edit</span>
                    </button>
                  )}
                  <button
                    onClick={() => onSelectPatient(patient)}
                    className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Open Chart</span>
                    <ChevronRight className="h-3.5 w-3.5 text-cyan-300" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
