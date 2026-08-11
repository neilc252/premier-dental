import React, { useState } from 'react';
import { Lock, Unlock, LogIn, LogOut, KeyRound, UserCheck, ShieldCheck, Stethoscope, Sparkles, Building2 } from 'lucide-react';
import { getStoredUsers } from '../lib/companyStorage';

export interface StaffUser {
  id: string;
  userNumber?: string;
  companyId?: string;
  companyName?: string;
  name: string;
  title: string;
  role: 'SaaS Admin' | 'Practice Owner' | 'Dentist' | 'Hygienist' | 'Read-Only Auditor' | 'Patient';
  avatar: string;
  npiNumber: string;
  isLoggedIn: boolean;
  tierBadge?: string;
}

const PRESET_STAFF: StaffUser[] = [
  {
    id: 'staff-saas',
    userNumber: 'USR-1001',
    companyId: 'CMP-8001',
    companyName: 'Premier SaaS Headquarters',
    name: 'Neil Chambers',
    title: 'Premier SaaS Platform Owner & Global Admin',
    role: 'SaaS Admin',
    avatar: 'NC',
    npiNumber: 'SYS-GLOBAL-01',
    isLoggedIn: false,
    tierBadge: 'Company Admin',
  },
  {
    id: 'staff-1',
    userNumber: 'USR-1002',
    companyId: 'CMP-8002',
    companyName: 'BrightSmile Dental Suite',
    name: 'Dr. Alexander Chen, DDS',
    title: 'Practice Owner (#2 Customer Admin)',
    role: 'Practice Owner',
    avatar: 'AC',
    npiNumber: 'NPI-1840291083',
    isLoggedIn: true,
    tierBadge: 'Practice Owner',
  },
  {
    id: 'staff-2',
    userNumber: 'USR-1003',
    companyId: 'CMP-8002',
    companyName: 'BrightSmile Dental Suite',
    name: 'Dr. Maya Patel, DMD',
    title: 'Associate Endodontist & Clinical Provider',
    role: 'Dentist',
    avatar: 'MP',
    npiNumber: 'NPI-1902840192',
    isLoggedIn: false,
    tierBadge: 'Clinical Write',
  },
  {
    id: 'staff-3',
    userNumber: 'USR-1004',
    companyId: 'CMP-8004',
    companyName: 'Auditors & Trainees Corp',
    name: 'Taylor Vance (Trainee)',
    title: 'Chart Auditor (#3 Read-Only User)',
    role: 'Read-Only Auditor',
    avatar: 'TV',
    npiNumber: 'AUDIT-9021',
    isLoggedIn: false,
    tierBadge: 'Read-Only',
  },
  {
    id: 'staff-4',
    userNumber: 'USR-1005',
    companyId: 'CMP-8002',
    companyName: 'BrightSmile Dental Suite',
    name: 'Evelyn Harper (Patient)',
    title: 'Patient Self-Service Access Portal',
    role: 'Patient',
    avatar: 'EH',
    npiNumber: 'PATIENT-8812',
    isLoggedIn: false,
    tierBadge: 'Patient Portal',
  },
];

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStaff: StaffUser;
  onSelectStaff: (staff: StaffUser) => void;
  onLogout?: () => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  currentStaff,
  onSelectStaff,
  onLogout,
}) => {
  const [pinCode, setPinCode] = useState('');
  const [selectedRoleUser, setSelectedRoleUser] = useState<StaffUser>(currentStaff);
  const [authError, setAuthError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const stored = getStoredUsers();
  const mappedStored: StaffUser[] = stored.map(u => ({
    id: u.id,
    userNumber: u.userNumber,
    companyId: u.companyId,
    companyName: u.companyName,
    name: u.name,
    title: u.title || 'Practice Staff Member',
    role: (u.role as any) || 'Dentist',
    avatar: u.avatar || 'US',
    npiNumber: u.npiNumber || 'NPI-1000',
    isLoggedIn: false,
    tierBadge: u.role === 'Practice Owner' ? 'Practice Owner' : 'Practice Staff',
  }));

  const existingIds = new Set(PRESET_STAFF.map(p => p.id));
  const allStaff = [...mappedStored.filter(s => !existingIds.has(s.id)), ...PRESET_STAFF];

  const handleLogin = (staff: StaffUser) => {
    // Quick demo pin verification (any 4 digit or quick click)
    setSelectedRoleUser(staff);
    setAuthError(false);
    setSuccessMessage(`Authenticated as ${staff.name}`);
    setTimeout(() => {
      onSelectStaff(staff);
      setSuccessMessage('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-md w-full text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                Staff Portal Authentication
              </h3>
              <p className="text-xs text-slate-400">
                Switch provider account or unlock clinical operatory session
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Active Practice & Provider Banner */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/60 via-slate-800 to-slate-800 border-2 border-purple-500/80 rounded-xl space-y-2 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-purple-800/50">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-300 shrink-0" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Active Practice Account</span>
              </div>
              <span className="px-2 py-0.5 bg-purple-900 text-purple-100 border border-purple-500 rounded font-mono text-[10px] font-extrabold">
                {currentStaff.companyId || 'CMP-8002'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-purple-200">
                  {currentStaff.companyName || 'BrightSmile Dental Suite'}
                </h4>
                <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="text-white font-bold">{currentStaff.name}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-cyan-300 text-[11px]">{currentStaff.userNumber || 'USR-1002'}</span>
                </div>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            </div>
          </div>

          {/* Select Provider Account */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Practice Provider Account
            </label>
            <div className="space-y-2">
              {allStaff.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => handleLogin(staff)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    currentStaff.id === staff.id
                      ? 'bg-cyan-950/40 border-cyan-500/80 text-white ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-700 text-cyan-300 font-semibold flex items-center justify-center text-xs border border-slate-600 shrink-0">
                      {staff.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{staff.name}</span>
                        {staff.tierBadge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                            {staff.tierBadge}
                          </span>
                        )}
                      </div>
                      
                      {/* Practice / Company Name Indicator */}
                      <div className="text-[11px] text-purple-300 font-semibold flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3 w-3 text-purple-400 shrink-0" />
                        <span>{staff.companyName || 'BrightSmile Dental Suite'}</span>
                      </div>

                      <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5 font-mono">
                        <span className="text-cyan-300 bg-slate-900/80 px-1 py-0.2 rounded border border-slate-700/60">
                          {staff.userNumber}
                        </span>
                        <span className="text-purple-300 bg-slate-900/80 px-1 py-0.2 rounded border border-slate-700/60">
                          {staff.companyId}
                        </span>
                      </div>
                    </div>
                  </div>
                  {currentStaff.id === staff.id ? (
                    <UserCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                  ) : (
                    <LogIn className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick Security Lock / Log Out Button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Lock className="h-3 w-3 text-slate-400" /> HIPAA Session Active
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  alert('Session locked. Enter provider PIN to unlock.');
                  onClose();
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lock className="h-3 w-3" />
                <span>Lock</span>
              </button>

              {onLogout && (
                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-300" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
