import React from 'react';
import { Stethoscope, Search, Zap, ShieldCheck, Sparkles, Building2, Database, UserPlus, KeyRound, UserCheck, Sun, Moon, LogOut, Edit3 } from 'lucide-react';
import { Patient } from '../types';
import { StaffUser } from './StaffLoginModal';

interface HeaderProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAiAssist: () => void;
  onOpenNewPatient: () => void;
  onOpenEditPatient?: (patient?: Patient) => void;
  onOpenStaffLogin: () => void;
  onOpenPortalAuth: () => void;
  onGoHome?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  currentStaff: StaffUser;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  activeView: _activeView,
  setActiveView,
  onOpenAiAssist,
  onOpenNewPatient,
  onOpenEditPatient,
  onOpenStaffLogin,
  onOpenPortalAuth,
  onGoHome,
  theme = 'dark',
  onToggleTheme,
  currentStaff,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.chartNumber} ${p.phone}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={onGoHome}
            className={`flex items-center gap-3 ${onGoHome ? 'cursor-pointer group' : ''}`}
            title={onGoHome ? 'Return to Home Landing Page' : undefined}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent group-hover:text-cyan-300 transition-colors">
                  Premier
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded-full">
                  Dental PMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Practice Management System</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <ShieldCheck className="h-3 w-3" /> HIPAA Ready
                </span>
              </p>
            </div>
          </div>

          {/* Quick Patient Search */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Patient (Name, Chart #, Phone)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-800/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Patient Search Results Dropdown */}
            {showSearchResults && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto"
                onMouseLeave={() => setShowSearchResults(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
                  <span>Patient Records ({filteredPatients.length})</span>
                  {selectedPatient && (
                    <span className="text-[10px] text-cyan-400 font-bold">Active: {selectedPatient.firstName} {selectedPatient.lastName}</span>
                  )}
                </div>
                {filteredPatients.length === 0 ? (
                  <div className="p-4 text-sm text-slate-400 text-center">No matching patient chart found</div>
                ) : (
                  filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => {
                        onSelectPatient(patient);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-800 transition-colors border-b border-slate-800/50 last:border-none cursor-pointer ${
                        selectedPatient?.id === patient.id ? 'bg-cyan-950/50 border-l-4 border-cyan-500' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm text-slate-100 flex items-center gap-2">
                          <span>{patient.firstName} {patient.lastName}</span>
                          {selectedPatient?.id === patient.id && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-cyan-900 text-cyan-300 rounded font-bold">ACTIVE</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-cyan-400">{patient.chartNumber}</span>
                          <span>DOB: {patient.dob}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                          {patient.insuranceProvider}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            
            {/* New Patient Button */}
            <button
              onClick={onOpenNewPatient}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ New Patient</span>
            </button>

            {/* Edit Selected Patient Button */}
            {selectedPatient && onOpenEditPatient && (
              <button
                onClick={() => onOpenEditPatient(selectedPatient)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold transition-all cursor-pointer"
                title="Edit active patient info & insurance"
              >
                <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden lg:inline">Edit Patient</span>
              </button>
            )}

            {/* Dentrix Migration Hub Shortcut */}
            <button
              onClick={() => setActiveView('migration')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-all cursor-pointer"
            >
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-medium hidden md:inline">Dentrix Sync</span>
            </button>

            {/* AI Scribe / Assistant Button */}
            <button
              onClick={onOpenAiAssist}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
              <span>AI Scribe</span>
            </button>

            {/* Day / Night Mode Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                }`}
                title={theme === 'dark' ? 'Switch to Day Mode (Light)' : 'Switch to Night Mode (Dark)'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="hidden sm:inline">Day Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-slate-700 fill-slate-700" />
                    <span className="hidden sm:inline">Night Mode</span>
                  </>
                )}
              </button>
            )}

            {/* Home Landing Page Navigation */}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 font-medium transition-all cursor-pointer"
                title="Return to Product Home Landing Page"
              >
                <span>Tool Home</span>
              </button>
            )}

            {/* Premier Dental Admin Area Button */}
            <button
              onClick={() => setActiveView('user-roles')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/90 hover:bg-purple-900 border border-purple-700/80 text-xs text-purple-200 font-bold shadow-md transition-all cursor-pointer"
              title="Open Admin Area to provision practice companies and view company registration codes"
            >
              <Building2 className="h-3.5 w-3.5 text-purple-300" />
              <span>Admin Area</span>
            </button>

            {/* Portal Login & Register Gateway Button */}
            <button
              onClick={onOpenPortalAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-xs text-indigo-200 font-semibold shadow-md transition-all cursor-pointer"
              title="Open Portal Login & Registration Screen"
            >
              <KeyRound className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Portal Login / Register</span>
            </button>

            {/* Staff Session Badge with User # and Company # */}
            <button
              onClick={onOpenStaffLogin}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-xs text-slate-200 shadow-md transition-all cursor-pointer group"
              title={`Active Practice: ${currentStaff.companyName || 'BrightSmile Dental Suite'} (${currentStaff.companyId || 'CMP-8002'}) • User: ${currentStaff.name} (${currentStaff.userNumber || 'USR-1002'}). Click to switch practice or account.`}
            >
              {/* Practice Name & ID Pill */}
              <div className="flex items-center gap-2 border-r border-slate-700 pr-2.5">
                <Building2 className="h-4 w-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-left hidden sm:block">
                  <div className="text-[9px] font-bold text-purple-300 uppercase tracking-wider leading-none">
                    Active Practice
                  </div>
                  <div className="text-xs font-extrabold text-white leading-tight truncate max-w-[130px] md:max-w-[170px]">
                    {currentStaff.companyName || 'BrightSmile Dental Suite'}
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-purple-950 text-purple-200 border border-purple-700 rounded font-mono text-[10px] font-bold">
                  {currentStaff.companyId || 'CMP-8002'}
                </span>
              </div>

              {/* User Avatar & Number */}
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[11px] shadow-sm shrink-0">
                  {currentStaff.avatar}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-bold text-white leading-none max-w-[100px] truncate">
                    {currentStaff.name.split(',')[0]}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-300 leading-tight mt-0.5">
                    {currentStaff.userNumber || 'USR-1002'}
                  </div>
                </div>
              </div>
            </button>

            {/* Direct Log Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-xs font-bold shadow-md transition-all cursor-pointer"
                title="Log out of current session and return to authentication portal"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-300" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
