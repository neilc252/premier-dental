import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Building,
  ShieldCheck, 
  KeyRound, 
  Crown, 
  Briefcase, 
  Eye, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope, 
  Sparkles, 
  FileText,
  AlertCircle,
  Phone,
  Hash,
  Check,
  Key
} from 'lucide-react';
import { StaffUser } from '../StaffLoginModal';
import { UserCategory, DetailedUserAccount } from '../Admin/UserRolesManagement';
import { INITIAL_COMPANIES } from '../../data/mockData';
import { getStoredCompanies, validateCompanyAndCode, getStoredUsers, saveUserToStorage } from '../../lib/companyStorage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface PortalAuthScreenProps {
  onLoginSuccess: (user: StaffUser) => void;
  onCancel?: () => void;
}

export const PortalAuthScreen: React.FC<PortalAuthScreenProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  
  // Sign In Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCompanyId, setRegCompanyId] = useState('');
  const [regSecurityCode, setRegSecurityCode] = useState('');
  const [regCategory, setRegCategory] = useState<UserCategory>('practice_admin');
  const [regNpi, setRegNpi] = useState('');

  // Post-registration confirmation state
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    user: StaffUser;
    companyId: string;
    companyName: string;
    taxIdEin: string;
    facilityNpi: string;
    mainContactName: string;
    mainContactEmail: string;
    mainContactPhone: string;
  } | null>(null);

  // Quick preset accounts for instant login demo
  const PRESET_PORTAL_USERS: (StaffUser & { category: UserCategory; email: string; desc: string })[] = [
    {
      id: 'user-saas-1',
      userNumber: 'USR-1001',
      companyId: 'CMP-8001',
      companyName: 'Premier SaaS Headquarters',
      name: 'Neil Chambers',
      title: 'Premier SaaS Headquarters (Global SaaS Platform Owner)',
      role: 'SaaS Admin',
      avatar: 'NC',
      npiNumber: 'SYS-GLOBAL-01',
      isLoggedIn: true,
      category: 'company_admin',
      email: 'neil.chambers@seismicshift.net',
      desc: 'Full platform provisioning & global multi-tenant company admin over all practices',
    },
    {
      id: 'user-prac-1',
      userNumber: 'USR-1002',
      companyId: 'CMP-8002',
      companyName: 'BrightSmile Dental Suite',
      name: 'Dr. Alexander Chen, DDS',
      title: 'BrightSmile Dental Suite (#2 Customer Practice Admin)',
      role: 'Practice Owner',
      avatar: 'AC',
      npiNumber: 'NPI-1840291083',
      isLoggedIn: true,
      category: 'practice_admin',
      email: 'dr.chen@brightsmiledental.com',
      desc: 'Customer owner. Delegates & revokes staff permissions',
    },
    {
      id: 'user-clin-1',
      userNumber: 'USR-1003',
      companyId: 'CMP-8002',
      companyName: 'BrightSmile Dental Suite',
      name: 'Dr. Maya Patel, DMD',
      title: 'Associate Endodontist & Clinical Provider',
      role: 'Dentist',
      avatar: 'MP',
      npiNumber: 'NPI-1902840192',
      isLoggedIn: true,
      category: 'clinical_provider',
      email: 'dr.patel@brightsmiledental.com',
      desc: 'Full charting, odontogram & SOAP note write rights',
    },
    {
      id: 'user-read-1',
      userNumber: 'USR-1004',
      companyId: 'CMP-8004',
      companyName: 'Auditors & Trainees Corp',
      name: 'Taylor Vance',
      title: 'External Chart Auditor (#3 Read-Only User)',
      role: 'Read-Only Auditor',
      avatar: 'TV',
      npiNumber: 'AUDIT-9021',
      isLoggedIn: true,
      category: 'read_only',
      email: 'taylor.vance@auditors.org',
      desc: 'Restricted inspection mode; write controls locked',
    },
    {
      id: 'user-patient-1',
      userNumber: 'USR-1005',
      companyId: 'CMP-8002',
      companyName: 'BrightSmile Dental Suite',
      name: 'Evelyn Harper',
      title: 'Patient Portal Account',
      role: 'Patient',
      avatar: 'EH',
      npiNumber: 'PATIENT-8812',
      isLoggedIn: true,
      category: 'patient_portal',
      email: 'evelyn.harper@gmail.com',
      desc: 'Self-service treatment plans, balance & appointment view',
    },
  ];

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter an email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    // Check if matches a preset user, registered user, or company contact
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Check preset portal users
      const match = PRESET_PORTAL_USERS.find(u => u.email.toLowerCase() === cleanEmail);
      if (match) {
        onLoginSuccess(match);
        setLoading(false);
        return;
      }

      // 2. SaaS platform owner override
      if (cleanEmail.includes('neil.chambers@seismicshift.net')) {
        const customUser: StaffUser = {
          id: `user-saas-neil`,
          userNumber: 'USR-1001',
          companyId: 'CMP-8001',
          companyName: 'Premier SaaS Headquarters',
          name: 'Neil Chambers',
          title: 'Premier SaaS Platform Owner & Global Admin',
          role: 'SaaS Admin',
          avatar: 'NC',
          npiNumber: 'SYS-GLOBAL-01',
          isLoggedIn: true,
        };
        onLoginSuccess(customUser);
        setLoading(false);
        return;
      }

      // 3. Check stored registered user accounts
      const storedUsers = getStoredUsers();
      const regMatch = storedUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (regMatch) {
        const userObj: StaffUser = {
          id: regMatch.id,
          userNumber: regMatch.userNumber,
          companyId: regMatch.companyId,
          companyName: regMatch.companyName,
          name: regMatch.name,
          title: regMatch.title,
          role: regMatch.role,
          avatar: regMatch.avatar,
          npiNumber: regMatch.npiNumber,
          isLoggedIn: true,
        };
        onLoginSuccess(userObj);
        setLoading(false);
        return;
      }

      // 4. Check stored companies by primary contact email or domain name
      const allCompanies = getStoredCompanies();
      let matchedCompany = allCompanies.find(c => c.primaryContactEmail?.toLowerCase() === cleanEmail);

      if (!matchedCompany) {
        const domainPart = cleanEmail.split('@')[1]?.split('.')[0];
        if (domainPart && domainPart.length >= 3) {
          matchedCompany = allCompanies.find(c => 
            c.companyName.toLowerCase().includes(domainPart) ||
            c.primaryContactEmail?.toLowerCase().includes(domainPart)
          );
        }
      }

      if (matchedCompany) {
        const initials = email.substring(0, 2).toUpperCase();
        const randUserNum = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
        const customUser: StaffUser = {
          id: `user-${Date.now()}`,
          userNumber: randUserNum,
          companyId: matchedCompany.companyId,
          companyName: matchedCompany.companyName,
          name: email.split('@')[0].replace('.', ' '),
          title: `${matchedCompany.companyName} • Practice Owner`,
          role: 'Practice Owner',
          avatar: initials,
          npiNumber: matchedCompany.facilityNpi || 'NPI-CUSTOM-99',
          isLoggedIn: true,
        };
        onLoginSuccess(customUser);
        setLoading(false);
        return;
      }

      // 5. Fallback: Assign the latest non-SaaS company account registered in the system
      const nonSaasCos = allCompanies.filter(c => c.companyId !== 'CMP-8001');
      const fallbackCo = nonSaasCos[nonSaasCos.length - 1] || allCompanies[0];
      const initials = email.substring(0, 2).toUpperCase();
      const randUserNum = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
      const customUser: StaffUser = {
        id: `user-${Date.now()}`,
        userNumber: randUserNum,
        companyId: fallbackCo ? fallbackCo.companyId : 'CMP-8002',
        companyName: fallbackCo ? fallbackCo.companyName : 'Practice Suite',
        name: email.split('@')[0].replace('.', ' '),
        title: `${fallbackCo ? fallbackCo.companyName : 'Practice'} • Registered Practice User`,
        role: 'Practice Owner',
        avatar: initials,
        npiNumber: 'NPI-CUSTOM-99',
        isLoggedIn: true,
      };
      onLoginSuccess(customUser);
      setLoading(false);
    }, 400);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      setErrorMsg('Please provide a name and email.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    // Special override for Premier Dental SaaS Owner account (neil.chambers@seismicshift.net)
    const isPremierSaaSAccount = regEmail.trim().toLowerCase() === 'neil.chambers@seismicshift.net';

    // Validate Company Number & Practice Registration Security Code provided by Application Owner team (unless global SaaS owner)
    if (!isPremierSaaSAccount) {
      const companyCheck = validateCompanyAndCode(regCompanyId, regSecurityCode);
      if (!companyCheck.isValid) {
        setErrorMsg(companyCheck.errorMessage || 'Invalid Practice Registration Credentials.');
        setLoading(false);
        return;
      }
    }

    const userId = `usr-reg-${Date.now()}`;
    const generatedUserNum = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    
    let activeCompanyId = '';
    let practiceNameResolved = '';
    let taxEinResolved = '';
    let npiResolved = '';

    if (isPremierSaaSAccount) {
      activeCompanyId = 'CMP-8001';
      practiceNameResolved = 'Premier SaaS Headquarters';
      taxEinResolved = 'EIN-99-100291';
      npiResolved = 'SYS-GLOBAL-01';
    } else {
      const companyCheck = validateCompanyAndCode(regCompanyId, regSecurityCode);
      const matchedCo = companyCheck.company;
      activeCompanyId = matchedCo ? matchedCo.companyId : regCompanyId.trim().toUpperCase();
      practiceNameResolved = matchedCo ? matchedCo.companyName : `Practice Account (${activeCompanyId})`;
      taxEinResolved = matchedCo ? matchedCo.taxIdEin : `EIN-99-${Math.floor(100000 + Math.random() * 900000)}`;
      npiResolved = matchedCo ? matchedCo.facilityNpi : (regNpi || `NPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    }

    const initials = regName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NC';

    let roleTitle = 'Registered Staff Member';
    let roleType: StaffUser['role'] = 'Dentist';

    if (isPremierSaaSAccount) {
      roleTitle = 'Premier SaaS Platform Owner & Global Admin';
      roleType = 'SaaS Admin';
    } else if (regCategory === 'company_admin') {
      roleTitle = 'SaaS Company Setup Admin (#1)';
      roleType = 'SaaS Admin';
    } else if (regCategory === 'practice_admin') {
      roleTitle = 'Practice Owner & Admin (#2)';
      roleType = 'Practice Owner';
    } else if (regCategory === 'read_only') {
      roleTitle = 'External Chart Auditor (#3 Read-Only)';
      roleType = 'Read-Only Auditor';
    } else if (regCategory === 'patient_portal') {
      roleTitle = 'Patient Self-Service Access';
      roleType = 'Patient';
    }

    const newUserRecord: StaffUser = {
      id: userId,
      userNumber: generatedUserNum,
      companyId: activeCompanyId,
      companyName: practiceNameResolved,
      name: regName,
      title: `${practiceNameResolved} • ${roleTitle}`,
      role: roleType,
      avatar: initials,
      npiNumber: npiResolved,
      isLoggedIn: true,
    };

    // Save user record to local storage & Firestore
    await saveUserToStorage({
      id: userId,
      userNumber: generatedUserNum,
      companyId: activeCompanyId,
      companyName: practiceNameResolved,
      name: regName,
      email: regEmail.trim(),
      title: `${practiceNameResolved} • ${roleTitle}`,
      role: roleType,
      avatar: initials,
      npiNumber: npiResolved,
      isLoggedIn: true,
      phone: regPhone || '',
      taxIdEin: taxEinResolved,
      category: regCategory,
    });

    setLoading(false);
    setRegistrationSuccess({
      user: newUserRecord,
      companyId: activeCompanyId,
      companyName: practiceNameResolved,
      taxIdEin: taxEinResolved,
      facilityNpi: npiResolved,
      mainContactName: regName,
      mainContactEmail: regEmail,
      mainContactPhone: regPhone || 'N/A',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Sidebar Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 space-y-8">
          <div className="space-y-6">
            
            {/* Branding Logo */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
                  Premier Dental PMS
                </h1>
                <p className="text-xs text-cyan-400 font-medium">Enterprise Practice Portal</p>
              </div>
            </div>

            {/* Portal Overview */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white leading-snug">
                Unified Dental EHR & Practice Management Access
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Secure multi-tenant gateway supporting <strong className="text-purple-300">#1 SaaS Setup Admins</strong>, <strong className="text-cyan-300">#2 Customer Practice Owners</strong>, clinical providers, and <strong className="text-amber-300">#3 Read-Only Auditors</strong>.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>CDT Code Ledger & Automated Insurance Billing</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>3D Interactive FDI/Universal Odontogram</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Firestore Realtime Cloud Synchronization</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Granular Custom Permission Allocation</span>
              </div>
            </div>

          </div>

          {/* Compliance Footer */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> HIPAA Compliant
            </span>
            <span className="font-mono">v2.4 Enterprise</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          {/* Top Header Tabs */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setActiveTab('signin'); setErrorMsg(''); }}
                  className={`text-sm font-bold transition-all relative pb-2 cursor-pointer ${
                    activeTab === 'signin'
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In to Portal
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                  className={`text-sm font-bold transition-all relative pb-2 cursor-pointer ${
                    activeTab === 'register'
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register New Account
                </button>
              </div>

              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' && (
              <div className="space-y-6">
                
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        placeholder="e.g. dr.chen@brightsmiledental.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-cyan-500 h-4 w-4 rounded"
                      />
                      <span>Keep Session Active (HIPAA Workstation)</span>
                    </label>
                    <a href="#reset" onClick={(e) => { e.preventDefault(); alert('Password reset link dispatched.'); }} className="text-cyan-400 hover:underline">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <span>Log In to Practice Portal</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Presets Section for Instant Demo Testing */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Quick Demo Role Login Shortcuts
                    </span>
                    <span className="text-[10px] text-slate-500">Click to enter as:</span>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {PRESET_PORTAL_USERS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setEmail(preset.email);
                          onLoginSuccess(preset);
                        }}
                        className="w-full p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-700 text-cyan-300 font-bold flex items-center justify-center text-xs border border-slate-600">
                            {preset.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex flex-wrap items-center gap-1.5">
                              <span>{preset.name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                                {preset.role}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                                {preset.userNumber}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                                {preset.companyId}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: REGISTER NEW ACCOUNT */}
            {activeTab === 'register' && (
              registrationSuccess ? (
                /* POST-REGISTRATION SUCCESS CONFIRMATION VIEW */
                <div className="space-y-5 bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-6 shadow-2xl animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base">Company Account Registered!</h3>
                      <p className="text-xs text-slate-300">Your practice profile and user credentials have been provisioned.</p>
                    </div>
                  </div>

                  {/* Assigned Numbers Highlights */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-950/80 border border-purple-600 rounded-xl space-y-1">
                      <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Assigned Company #</div>
                      <div className="text-lg font-mono font-extrabold text-purple-200">{registrationSuccess.companyId}</div>
                    </div>
                    <div className="p-3 bg-cyan-950/80 border border-cyan-600 rounded-xl space-y-1">
                      <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Assigned User #</div>
                      <div className="text-lg font-mono font-extrabold text-cyan-200">{registrationSuccess.user.userNumber}</div>
                    </div>
                  </div>

                  {/* Account Summary Details */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2 font-sans">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Company Name:</span>
                      <span className="font-bold text-white text-sm">{registrationSuccess.companyName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Main Contact Person:</span>
                      <span className="font-semibold text-slate-200">{registrationSuccess.mainContactName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Contact Phone / Email:</span>
                      <span className="text-slate-300">{registrationSuccess.mainContactPhone} • {registrationSuccess.mainContactEmail}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                      <span className="text-slate-400 font-sans">Federal Tax EIN & NPI:</span>
                      <span className="text-slate-300">{registrationSuccess.taxIdEin} | {registrationSuccess.facilityNpi}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onLoginSuccess(registrationSuccess.user)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Enter Dental Portal as {registrationSuccess.user.userNumber}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {/* Section 1: Main Contact Person */}
                  <div className="space-y-3 pb-3 border-b border-slate-800">
                    <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-cyan-400" />
                      <span>1. Main Contact Person Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Main Contact Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Jordan Hayes, DDS"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Main Contact Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="jordan@practice.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Main Contact Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="(555) 234-5678"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Account Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="At least 8 chars"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Section 2: Practice Credentials & Security Registration Code */}
                  <div className="space-y-3 pb-3 border-b border-slate-800">
                    <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-purple-400" />
                      <span>2. Practice Company Credentials & Security Registration Code</span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Enter the Company Number (#) and Random Security Code issued by your Application Owner team to link your user account to your practice:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Company Number (#) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CMP-8002"
                          value={regCompanyId}
                          onChange={(e) => setRegCompanyId(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-purple-300 font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                          <span>Practice Security Code *</span>
                          <span className="text-[10px] text-amber-400 font-mono font-normal">Random Code</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. REG-8002"
                          value={regSecurityCode}
                          onChange={(e) => setRegSecurityCode(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-amber-300 font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Practice Users MUST enter their Company Number and Practice Security Code issued by Premier Dental SaaS Admins */}
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-purple-300">
                        <Lock className="h-3.5 w-3.5 text-purple-400" />
                        <span>Private Multi-Tenant Practice Security</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-snug">
                        Practice accounts are isolated for privacy. Ask your Premier Dental Administrator for your practice's assigned <strong>Company Number (#)</strong> and <strong>Security Code</strong> to complete registration.
                      </p>
                    </div>

                    {/* Dynamic Real-Time Verification Card */}
                    {(() => {
                      const validation = validateCompanyAndCode(regCompanyId, regSecurityCode);
                      if (validation.isValid && validation.company) {
                        const co = validation.company;
                        return (
                          <div className="p-3 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/80 rounded-xl space-y-1.5 mt-2 shadow-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                Credentials Verified & Linked to Practice
                              </span>
                              <div className="flex items-center gap-1 font-mono text-[10px] font-extrabold">
                                <span className="px-2 py-0.5 bg-emerald-900 text-emerald-200 border border-emerald-600 rounded">
                                  {co.companyId}
                                </span>
                                <span className="px-2 py-0.5 bg-amber-900 text-amber-200 border border-amber-600 rounded">
                                  {co.registrationCode}
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-extrabold text-white">{co.companyName}</div>
                              <div className="text-[11px] text-emerald-300 font-medium">Plan Tier: {co.planTier}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 pt-1 border-t border-emerald-900/60">
                              <div>Tax ID: <span className="text-cyan-300">{co.taxIdEin}</span></div>
                              <div>NPI: <span className="text-cyan-300">{co.facilityNpi}</span></div>
                            </div>
                          </div>
                        );
                      }

                      // Handle Security Code mismatch vs Company Not Found
                      const allCos = getStoredCompanies();
                      const matchedCoOnly = allCos.find(c => c.companyId.toUpperCase() === regCompanyId.trim().toUpperCase());

                      if (matchedCoOnly) {
                        return (
                          <div className="p-3 bg-amber-950/60 border border-amber-600/80 rounded-xl space-y-1 mt-2 text-amber-200 text-xs">
                            <div className="font-bold flex items-center gap-1.5 text-amber-300">
                              <AlertCircle className="h-4 w-4" />
                              Security Code Mismatch for {matchedCoOnly.companyName} ({matchedCoOnly.companyId})
                            </div>
                            <p className="text-[11px] text-amber-200/90 leading-relaxed">
                              Company Number is recognized, but the Security Code <code className="font-mono font-bold text-white bg-amber-900/80 px-1 rounded">{regSecurityCode || 'EMPTY'}</code> does not match this practice. Ask your Application Owner team for your practice's random registration code.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="p-3 bg-red-950/60 border border-red-700/80 rounded-xl space-y-1 mt-2 text-red-200 text-xs">
                          <div className="font-bold flex items-center gap-1.5 text-red-300">
                            <AlertCircle className="h-4 w-4" />
                            Company Number "{regCompanyId || 'CMP-XXXX'}" Not Found
                          </div>
                          <p className="text-[11px] text-red-200/90 leading-relaxed">
                            No practice is registered under this Company Number. Please ask your Application Owner team to provision your company account first in the Administrator Area.
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Role Category Selector */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      3. Select Role Category & Access Rights:
                    </label>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        {
                          cat: 'practice_admin' as UserCategory,
                          title: '#2 Customer Practice Owner / Admin',
                          desc: 'Full practice control; can grant/revoke staff permissions as needed',
                          icon: Building2,
                          badgeColor: 'border-cyan-500 text-cyan-300 bg-cyan-950/40',
                        },
                        {
                          cat: 'company_admin' as UserCategory,
                          title: '#1 SaaS Company Setup Admin',
                          desc: 'Platform setup, Dentrix templates, global SaaS billing',
                          icon: Crown,
                          badgeColor: 'border-purple-500 text-purple-300 bg-purple-950/40',
                        },
                        {
                          cat: 'clinical_provider' as UserCategory,
                          title: 'Clinical Provider (Dentist / Hygienist)',
                          desc: 'Full charting, SOAP note signing & treatment planning',
                          icon: Stethoscope,
                          badgeColor: 'border-emerald-500 text-emerald-300 bg-emerald-950/40',
                        },
                        {
                          cat: 'read_only' as UserCategory,
                          title: '#3 Read-Only User / Auditor',
                          desc: 'Inspect charts & schedules without edit rights',
                          icon: Eye,
                          badgeColor: 'border-amber-500 text-amber-300 bg-amber-950/40',
                        },
                        {
                          cat: 'patient_portal' as UserCategory,
                          title: 'Patient Portal Account',
                          desc: 'Self-service view for personal treatment plans & balance',
                          icon: UserCheck,
                          badgeColor: 'border-blue-500 text-blue-300 bg-blue-950/40',
                        },
                      ].map((item) => (
                        <label
                          key={item.cat}
                          onClick={() => setRegCategory(item.cat)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            regCategory === item.cat
                              ? `${item.badgeColor} ring-1 ring-cyan-500/50`
                              : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name="roleCat"
                            checked={regCategory === item.cat}
                            onChange={() => setRegCategory(item.cat)}
                            className="mt-0.5 accent-cyan-500"
                          />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <item.icon className="h-3.5 w-3.5 text-cyan-400" />
                              <span>{item.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                  >
                    {loading ? (
                      <span>Assigning Company & User Numbers...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Register Company & Issue Account Numbers</span>
                      </>
                    )}
                  </button>

                </form>
              )
            )}

          </div>

          <p className="text-[10px] text-slate-500 text-center border-t border-slate-800/80 pt-3">
            By signing in or registering, you agree to HIPAA Business Associate Agreement (BAA) protocols and 256-bit encrypted data persistence.
          </p>

        </div>

      </div>

    </div>
  );
};
