import React from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  Users, 
  Database, 
  CreditCard, 
  Sparkles, 
  Calendar, 
  Activity, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Crown, 
  Building2, 
  Eye, 
  UserCheck, 
  KeyRound, 
  FileSpreadsheet, 
  Layers,
  ChevronRight,
  Briefcase,
  Sun,
  Moon
} from 'lucide-react';
import { StaffUser } from '../StaffLoginModal';
import { UserCategory } from '../Admin/UserRolesManagement';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLaunchDemoAsRole: (user: StaffUser) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onLaunchDemoAsRole,
  theme = 'dark',
  onToggleTheme,
}) => {
  const PRESET_DEMO_ROLES: (StaffUser & { category: UserCategory; email: string; desc: string; badge: string; badgeBg: string })[] = [
    {
      id: 'user-prac-1',
      name: 'Dr. Alexander Chen, DDS',
      title: 'BrightSmile Dental Suite',
      role: 'Practice Owner',
      avatar: 'AC',
      npiNumber: 'NPI-1840291083',
      isLoggedIn: true,
      category: 'practice_admin',
      email: 'dr.chen@brightsmiledental.com',
      desc: 'Customer Owner (#2). Full practice management & can grant/revoke staff permissions.',
      badge: '#2 Customer Practice Admin',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    },
    {
      id: 'user-saas-1',
      name: 'Elena Rostova',
      title: 'Premier SaaS Headquarters',
      role: 'SaaS Admin',
      avatar: 'ER',
      npiNumber: 'SYS-GLOBAL-01',
      isLoggedIn: true,
      category: 'company_admin',
      email: 'elena@premierpms.io',
      desc: 'Initial Setup Admin (#1). Global tenant provisioning & Dentrix migration schema config.',
      badge: '#1 SaaS Setup Admin',
      badgeBg: 'bg-purple-950 text-purple-300 border-purple-800',
    },
    {
      id: 'user-read-1',
      name: 'Taylor Vance',
      title: 'External Chart Auditor',
      role: 'Read-Only Auditor',
      avatar: 'TV',
      npiNumber: 'AUDIT-9021',
      isLoggedIn: true,
      category: 'read_only',
      email: 'taylor.vance@auditors.org',
      desc: 'Restricted account (#3). Read-only chart inspection; write actions locked for compliance.',
      badge: '#3 Read-Only User',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      id: 'user-patient-1',
      name: 'Evelyn Harper',
      title: 'Patient Portal Self-Service',
      role: 'Patient',
      avatar: 'EH',
      npiNumber: 'PATIENT-8812',
      isLoggedIn: true,
      category: 'patient_portal',
      email: 'evelyn.harper@gmail.com',
      desc: 'Patient account. View personal treatment plan, appointments & balance.',
      badge: 'Patient Portal',
      badgeBg: 'bg-blue-950 text-blue-300 border-blue-800',
    },
  ];

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Navigation Header */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-50 transition-colors ${
        isLight ? 'border-slate-200 bg-white/90 shadow-xs' : 'border-slate-800/80 bg-slate-900/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <span className={`font-black text-base tracking-tight flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Premier Dental <span className={`font-semibold text-xs px-1.5 py-0.5 rounded border ${
                  isLight ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                }`}>PMS</span>
              </span>
              <p className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Enterprise EHR & Practice Cloud</p>
            </div>
          </div>

          {/* Quick Nav Links & Portal CTA */}
          <div className="flex items-center gap-3">
            {/* Day / Night Mode Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isLight
                    ? 'bg-amber-100/80 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
                }`}
                title={isLight ? 'Switch to Night Mode (Dark)' : 'Switch to Day Mode (Light)'}
              >
                {isLight ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
                    <span>Day Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-slate-300 fill-slate-300" />
                    <span>Night Mode</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onOpenLogin}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5 text-cyan-500" />
              <span>Portal Login</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Register Practice</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/10 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-xs ${
          isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-slate-900 border-slate-800 text-cyan-300'
        }`}>
          <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
          <span>Multi-Tenant Practice Management with Granular Access Control</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          Modern Cloud Dental EHR & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600">Practice Portal</span>
        </h1>

        <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Comprehensive dental platform featuring 3D FDI/Universal odontograms, perio charting, CDT ledger billing, AI clinical scribe, and Dentrix migration pipelines.
        </p>

        {/* Call-to-action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="h-4 w-4" />
            <span>Portal Login</span>
          </button>

          <button
            onClick={onOpenRegister}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-800'
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white'
            }`}
          >
            <Building2 className="h-4 w-4 text-cyan-500" />
            <span>Register Practice Account</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className={`pt-6 flex flex-wrap items-center justify-center gap-6 text-xs ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> HIPAA BAA Compliant
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Database className="h-4 w-4 text-cyan-500" /> Firestore Cloud Database
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="h-4 w-4 text-purple-500" /> 5-Tier Role Access Control
          </span>
        </div>

      </section>

      {/* Role Access Matrix Section */}
      <section className={`border-y py-16 px-4 sm:px-6 lg:px-8 transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
              isLight ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-purple-950/80 border-purple-800 text-purple-300'
            }`}>
              <Users className="h-3.5 w-3.5 text-purple-500" />
              <span>Multi-Tenant Access Control (RBAC)</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Tailored Access Tiers for Every User Type
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Select a role below to launch directly into the live practice portal and experience role-specific permissions in action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRESET_DEMO_ROLES.map((roleUser) => (
              <div
                key={roleUser.id}
                className={`border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all group ${
                  isLight
                    ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80 shadow-xs'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${roleUser.badgeBg}`}>
                      {roleUser.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{roleUser.npiNumber}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full font-bold flex items-center justify-center text-xs border ${
                      isLight
                        ? 'bg-white text-cyan-700 border-slate-300 shadow-xs'
                        : 'bg-slate-800 text-cyan-300 border-slate-700'
                    }`}>
                      {roleUser.avatar}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold transition-colors ${
                        isLight ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'
                      }`}>
                        {roleUser.name}
                      </h3>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{roleUser.title}</p>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed border-t pt-3 ${
                    isLight ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-slate-800/80'
                  }`}>
                    {roleUser.desc}
                  </p>
                </div>

                <button
                  onClick={() => onLaunchDemoAsRole(roleUser)}
                  className={`w-full py-2 font-bold text-xs rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-cyan-50 text-cyan-700 border-cyan-300 shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700/80'
                  }`}
                >
                  <span>Launch Portal as {roleUser.role}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className={`text-2xl sm:text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Built for Clinical Precision & Practice Efficiency
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Everything your dental team needs from front-desk chair scheduling to 3D clinical charting and CDT ledger billing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className={`p-6 border rounded-2xl space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-600' : 'bg-cyan-950 border-cyan-800 text-cyan-400'
            }`}>
              <Activity className="h-5 w-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>3D Odontogram & Perio Charting</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Interactive 32-tooth FDI/Universal charting. Track composite restorations, crowns, root canals, extractions, and 6-site probing depths.
            </p>
          </div>

          <div className={`p-6 border rounded-2xl space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-950 border-emerald-800 text-emerald-400'
            }`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>AI Clinical Scribe & SOAP Notes</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Generate structured Subjective, Objective, Assessment, and Plan notes instantly powered by Gemini AI with NPI digital signature logging.
            </p>
          </div>

          <div className={`p-6 border rounded-2xl space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-purple-950 border-purple-800 text-purple-400'
            }`}>
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>CDT Ledger & Billing Claims</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Automated CDT code search, fee schedules, estimated insurance benefits coverage, copay balance tracking, and electronic claim filing.
            </p>
          </div>

          <div className={`p-6 border rounded-2xl space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-amber-950 border-amber-800 text-amber-400'
            }`}>
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Dentrix Legacy Migration Hub</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Seamlessly import legacy EHR databases from Dentrix G7+, Eaglesoft, or Open Dental with automated schema normalization.
            </p>
          </div>

          <div className={`p-6 border rounded-2xl space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-blue-950 border-blue-800 text-blue-400'
            }`}>
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Multi-Operatory Chair Scheduler</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Manage Op 1 Hygiene, Op 2 Surgical, Op 3 Ortho, and Op 4 Emergency chairs with color-coded procedure blocks and patient selection.
            </p>
          </div>

          <div className={`p-6 border rounded-2xl space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-950 border-indigo-800 text-indigo-400'
            }`}>
              <Lock className="h-5 w-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Firestore Realtime Synchronization</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              All chart modifications, appointments, and new patient profiles synchronize instantly across all operatory computers via Cloud Firestore.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className={`mt-auto border-t py-8 px-4 sm:px-6 lg:px-8 text-xs transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800/80 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-cyan-500" />
            <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Premier Dental PMS</span>
            <span>• Enterprise Practice Management System</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="hover:text-cyan-600 transition-colors">Portal Login</button>
            <button onClick={onOpenRegister} className="hover:text-cyan-600 transition-colors">Register Account</button>
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
