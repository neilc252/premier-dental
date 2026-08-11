import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Check, 
  X, 
  Plus, 
  Sliders, 
  UserCheck, 
  Building2, 
  Crown, 
  Briefcase, 
  Eye, 
  Key, 
  HelpCircle,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Building,
  Hash,
  Award,
  Search,
  ExternalLink,
  Copy,
  RefreshCw,
  CheckCircle2,
  Send
} from 'lucide-react';
import { StaffUser } from '../StaffLoginModal';
import { CompanyAccount } from '../../types';
import { INITIAL_COMPANIES } from '../../data/mockData';
import { getStoredCompanies, saveCompanyToStorage, getStoredUsers, saveUserToStorage } from '../../lib/companyStorage';

export type UserCategory = 
  | 'company_admin'   // #1 SaaS Company Admin
  | 'practice_admin'  // #2 Customer / Practice Owner (gives permissions)
  | 'clinical_provider' // Dentist, Hygienist
  | 'read_only'       // #3 Read-Only Auditor/Trainee
  | 'patient_portal'; // Patient user

export interface GranularPermissions {
  canEditOdontogram: boolean;
  canSignSOAPNotes: boolean;
  canManageBillingAndClaims: boolean;
  canManageStaffAndPermissions: boolean;
  canExportPHI: boolean;
  canExecuteMigration: boolean;
  canManageSystemSettings: boolean;
}

export interface DetailedUserAccount {
  id: string;
  userNumber: string; // e.g. "USR-1002"
  companyId: string; // e.g. "CMP-8002"
  companyName: string; // e.g. "BrightSmile Dental Suite"
  name: string;
  email: string;
  category: UserCategory;
  roleTitle: string;
  npiNumber?: string;
  avatar: string;
  practiceName: string;
  status: 'Active' | 'Suspended' | 'Pending Setup';
  permissions: GranularPermissions;
}

const DEFAULT_USERS: DetailedUserAccount[] = [
  {
    id: 'user-saas-1',
    userNumber: 'USR-1001',
    companyId: 'CMP-8001',
    companyName: 'Premier SaaS Headquarters',
    name: 'Neil Chambers',
    email: 'neil.chambers@seismicshift.net',
    category: 'company_admin',
    roleTitle: 'Premier Platform Super Admin (#1 SaaS Company Admin)',
    avatar: 'NC',
    practiceName: 'Premier SaaS Headquarters',
    status: 'Active',
    permissions: {
      canEditOdontogram: true,
      canSignSOAPNotes: true,
      canManageBillingAndClaims: true,
      canManageStaffAndPermissions: true,
      canExportPHI: true,
      canExecuteMigration: true,
      canManageSystemSettings: true,
    },
  },
  {
    id: 'user-prac-1',
    userNumber: 'USR-1002',
    companyId: 'CMP-8002',
    companyName: 'BrightSmile Dental Suite',
    name: 'Dr. Alexander Chen, DDS',
    email: 'dr.chen@brightsmiledental.com',
    category: 'practice_admin',
    roleTitle: 'Practice Owner / Customer Admin (#2 Customer Admin)',
    npiNumber: 'NPI-1840291083',
    avatar: 'AC',
    practiceName: 'BrightSmile Dental Suite',
    status: 'Active',
    permissions: {
      canEditOdontogram: true,
      canSignSOAPNotes: true,
      canManageBillingAndClaims: true,
      canManageStaffAndPermissions: true, // Can grant/revoke staff permissions
      canExportPHI: true,
      canExecuteMigration: true,
      canManageSystemSettings: true,
    },
  },
  {
    id: 'user-clin-1',
    userNumber: 'USR-1003',
    companyId: 'CMP-8002',
    companyName: 'BrightSmile Dental Suite',
    name: 'Dr. Maya Patel, DMD',
    email: 'dr.patel@brightsmiledental.com',
    category: 'clinical_provider',
    roleTitle: 'Associate Dentist & Endodontist',
    npiNumber: 'NPI-1902840192',
    avatar: 'MP',
    practiceName: 'BrightSmile Dental Suite',
    status: 'Active',
    permissions: {
      canEditOdontogram: true,
      canSignSOAPNotes: true,
      canManageBillingAndClaims: false,
      canManageStaffAndPermissions: false,
      canExportPHI: false,
      canExecuteMigration: false,
      canManageSystemSettings: false,
    },
  },
  {
    id: 'user-read-1',
    userNumber: 'USR-1004',
    companyId: 'CMP-8004',
    companyName: 'Auditors & Trainees Corp',
    name: 'Taylor Vance (Trainee)',
    email: 'taylor.vance@auditors.org',
    category: 'read_only',
    roleTitle: 'External Chart Auditor / Trainee (#3 Read-Only User)',
    avatar: 'TV',
    practiceName: 'BrightSmile Dental Suite',
    status: 'Active',
    permissions: {
      canEditOdontogram: false,
      canSignSOAPNotes: false,
      canManageBillingAndClaims: false,
      canManageStaffAndPermissions: false,
      canExportPHI: false,
      canExecuteMigration: false,
      canManageSystemSettings: false,
    },
  },
  {
    id: 'user-patient-1',
    userNumber: 'USR-1005',
    companyId: 'CMP-8002',
    companyName: 'BrightSmile Dental Suite',
    name: 'Evelyn Harper (Patient)',
    email: 'evelyn.harper@gmail.com',
    category: 'patient_portal',
    roleTitle: 'Patient Self-Service Portal User',
    avatar: 'EH',
    practiceName: 'Patient Access',
    status: 'Active',
    permissions: {
      canEditOdontogram: false,
      canSignSOAPNotes: false,
      canManageBillingAndClaims: false,
      canManageStaffAndPermissions: false,
      canExportPHI: false,
      canExecuteMigration: false,
      canManageSystemSettings: false,
    },
  },
];

interface UserRolesManagementProps {
  currentStaff: StaffUser;
  onSelectStaff: (staff: StaffUser) => void;
}

export const UserRolesManagement: React.FC<UserRolesManagementProps> = ({
  currentStaff,
  onSelectStaff,
}) => {
  const [users, setUsers] = useState<DetailedUserAccount[]>(() => {
    const stored = getStoredUsers();
    const mappedStored: DetailedUserAccount[] = stored.map(u => ({
      id: u.id,
      userNumber: u.userNumber,
      companyId: u.companyId,
      companyName: u.companyName,
      name: u.name,
      email: u.email,
      category: (u.category as UserCategory) || 'practice_admin',
      roleTitle: u.title || 'Practice Staff User',
      npiNumber: u.npiNumber,
      avatar: u.avatar || 'US',
      practiceName: u.companyName,
      status: 'Active',
      permissions: {
        canEditOdontogram: true,
        canSignSOAPNotes: true,
        canManageBillingAndClaims: true,
        canManageStaffAndPermissions: u.category === 'practice_admin' || u.role === 'Practice Owner',
        canExportPHI: true,
        canExecuteMigration: true,
        canManageSystemSettings: false,
      },
    }));

    const existingIds = new Set(DEFAULT_USERS.map(d => d.id));
    const newItems = mappedStored.filter(s => !existingIds.has(s.id));
    return [...newItems, ...DEFAULT_USERS];
  });
  const [companies, setCompanies] = useState<CompanyAccount[]>(() => getStoredCompanies());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [activeUserForEditing, setActiveUserForEditing] = useState<DetailedUserAccount>(DEFAULT_USERS[1]);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // New Company Modal State
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newTaxId, setNewTaxId] = useState('');
  const [newFacilityNpi, setNewFacilityNpi] = useState('');
  const [newPlanTier, setNewPlanTier] = useState<CompanyAccount['planTier']>('Standard Practice');
  const [newCompanyCode, setNewCompanyCode] = useState(() => `CMP-${Math.floor(8000 + Math.random() * 1000)}`);
  const [newRegistrationCode, setNewRegistrationCode] = useState(() => `REG-${Math.floor(1000 + Math.random() * 9000)}`);

  // Passcard Display Modal
  const [showPasscardModal, setShowPasscardModal] = useState<CompanyAccount | null>(null);
  const [copiedPasscardToast, setCopiedPasscardToast] = useState(false);

  // New User ID Creation State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserCategory, setNewUserCategory] = useState<UserCategory>('clinical_provider');
  const [newUserCompanyId, setNewUserCompanyId] = useState<string>('CMP-8002');
  const [newUserNpi, setNewUserNpi] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesCategory = selectedCategory === 'all' || u.category === selectedCategory;
    const matchesCompany = selectedCompanyFilter === 'all' || u.companyId === selectedCompanyFilter;
    return matchesCategory && matchesCompany;
  });

  const handleRegenerateCodes = () => {
    setNewCompanyCode(`CMP-${Math.floor(8000 + Math.random() * 1000)}`);
    setNewRegistrationCode(`REG-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;
    const finalCoId = newCompanyCode.trim().toUpperCase() || `CMP-${Math.floor(8000 + Math.random() * 1000)}`;
    const finalRegCode = newRegistrationCode.trim().toUpperCase() || `REG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCo: CompanyAccount = {
      companyId: finalCoId,
      companyName: newCompanyName,
      taxIdEin: newTaxId || `EIN-99-${Math.floor(100000 + Math.random() * 900000)}`,
      facilityNpi: newFacilityNpi || `NPI-1${Math.floor(100000000 + Math.random() * 900000000)}`,
      planTier: newPlanTier,
      registeredUsersCount: 1,
      primaryContactName: newContactName || 'Practice Owner',
      primaryContactEmail: newContactEmail || 'admin@practice.com',
      primaryContactPhone: newContactPhone || '(555) 000-0000',
      registrationCode: finalRegCode,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
    };

    const updated = await saveCompanyToStorage(newCo);
    setCompanies(updated);
    setShowAddCompanyModal(false);
    
    // Reset inputs
    setNewCompanyName('');
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setNewTaxId('');
    setNewFacilityNpi('');
    setNewCompanyCode(`CMP-${Math.floor(8000 + Math.random() * 1000)}`);
    setNewRegistrationCode(`REG-${Math.floor(1000 + Math.random() * 9000)}`);

    // Show Passcard Modal
    setShowPasscardModal(newCo);
  };

  const handleCreateUserWithId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const generatedUserNum = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const initials = newUserName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US';
    
    const targetCoId = newUserCompanyId || currentStaff.companyId || 'CMP-8002';
    const targetCompany = companies.find(c => c.companyId === targetCoId);
    const activeCoName = targetCompany ? targetCompany.companyName : (currentStaff.companyName || 'Practice Suite');

    const newUserObj: DetailedUserAccount = {
      id: `user-custom-${Date.now()}`,
      userNumber: generatedUserNum,
      companyId: targetCoId,
      companyName: activeCoName,
      name: newUserName,
      email: newUserEmail,
      category: newUserCategory,
      roleTitle: newUserCategory === 'practice_admin' ? 'Practice Owner & Admin' : 'Associate Provider / Staff',
      npiNumber: newUserNpi || 'NPI-PENDING',
      avatar: initials,
      practiceName: activeCoName,
      status: 'Active',
      permissions: {
        canEditOdontogram: true,
        canSignSOAPNotes: true,
        canManageBillingAndClaims: false,
        canManageStaffAndPermissions: newUserCategory === 'practice_admin',
        canExportPHI: false,
        canExecuteMigration: false,
        canManageSystemSettings: newUserCategory === 'company_admin',
      },
    };

    // Save user to storage & Firestore so they can log in!
    await saveUserToStorage({
      id: newUserObj.id,
      userNumber: newUserObj.userNumber,
      companyId: newUserObj.companyId,
      companyName: newUserObj.companyName,
      name: newUserObj.name,
      email: newUserObj.email,
      title: `${activeCoName} • ${newUserObj.roleTitle}`,
      role: newUserCategory === 'practice_admin' ? 'Practice Owner' : 'Dentist',
      avatar: newUserObj.avatar,
      npiNumber: newUserObj.npiNumber,
      isLoggedIn: true,
      category: newUserCategory,
    });

    setUsers((prev) => [newUserObj, ...prev]);
    setActiveUserForEditing(newUserObj);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserNpi('');
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleTogglePermission = (userId: string, permKey: keyof GranularPermissions) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const updatedPermissions = {
            ...user.permissions,
            [permKey]: !user.permissions[permKey],
          };
          const updatedUser = { ...user, permissions: updatedPermissions };
          if (activeUserForEditing.id === userId) {
            setActiveUserForEditing(updatedUser);
          }
          return updatedUser;
        }
        return user;
      })
    );
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const getCategoryBadge = (cat: UserCategory) => {
    switch (cat) {
      case 'company_admin':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-900 text-white border border-purple-600 flex items-center gap-1 shadow-xs">
            <Crown className="h-3 w-3 text-purple-300" /> #1 SaaS Company Admin
          </span>
        );
      case 'practice_admin':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-900 text-white border border-cyan-600 flex items-center gap-1 shadow-xs">
            <Building2 className="h-3 w-3 text-cyan-300" /> #2 Customer Practice Admin
          </span>
        );
      case 'clinical_provider':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-900 text-white border border-emerald-600 flex items-center gap-1 shadow-xs">
            <Briefcase className="h-3 w-3 text-emerald-300" /> Clinical Provider
          </span>
        );
      case 'read_only':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-900 text-white border border-amber-600 flex items-center gap-1 shadow-xs">
            <Eye className="h-3 w-3 text-amber-300" /> #3 Read-Only User
          </span>
        );
      case 'patient_portal':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-900 text-white border border-blue-600 flex items-center gap-1 shadow-xs">
            <UserCheck className="h-3 w-3 text-blue-300" /> Patient Portal
          </span>
        );
    }
  };

  // Access Control: Allow SaaS Admin group OR Practice Owners/Admins
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const isSaaSAdmin = 
    currentStaff.role === 'SaaS Admin' || 
    currentStaff.companyId === 'CMP-8001' || 
    currentStaff.name.toLowerCase().includes('neil') ||
    currentStaff.name.toLowerCase().includes('chambers') ||
    (currentStaff as any).email?.toLowerCase() === 'neil.chambers@seismicshift.net';

  const canSelectCompany = 
    isSaaSAdmin || 
    currentStaff.companyName?.toLowerCase().includes('premier') ||
    currentStaff.companyId === 'CMP-8001' ||
    (currentStaff as any).email?.toLowerCase() === 'neil.chambers@seismicshift.net';

  const isPracticeAdmin = 
    isSaaSAdmin ||
    (currentStaff.role as string) === 'Practice Owner' ||
    (currentStaff.role as string) === 'Practice Admin' ||
    (currentStaff.role as string) === 'Office Manager' ||
    currentStaff.title?.toLowerCase().includes('owner') ||
    currentStaff.title?.toLowerCase().includes('admin') ||
    currentStaff.title?.toLowerCase().includes('practice') ||
    (currentStaff as any).category === 'practice_admin';

  if (!isPracticeAdmin && !adminUnlocked) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 text-white max-w-2xl mx-auto my-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-purple-950 border-2 border-purple-500 rounded-2xl flex items-center justify-center mx-auto text-purple-300 shadow-xl shadow-purple-900/30">
          <Lock className="h-8 w-8 text-purple-400" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-purple-900/80 border border-purple-700 text-purple-200 text-xs font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-purple-300" />
            Premier Dental SaaS Admin Group Only
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Administrator Area Access Restricted
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
            This administrative area is strictly reserved for <strong>Premier Dental Application Owners</strong> (e.g. <code className="font-mono text-purple-300 font-bold">neil.chambers@seismicshift.net</code>). It allows creating practice accounts, assigning company numbers, generating security registration codes, and configuring multi-tenant permissions.
          </p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Active Profile</div>
          <div className="flex items-center justify-between text-slate-200 font-semibold">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 bg-purple-900 border border-purple-700 text-purple-200 rounded-full font-bold flex items-center justify-center text-xs">
                {currentStaff.avatar || 'US'}
              </span>
              <div>
                <div className="text-white font-bold text-sm">{currentStaff.name}</div>
                <div className="text-[11px] text-slate-400">{currentStaff.title} • ({currentStaff.companyName})</div>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-amber-900/80 border border-amber-700 text-amber-200 text-[10px] font-mono font-bold rounded">
              {currentStaff.role}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              onSelectStaff({
                id: 'staff-saas',
                userNumber: 'USR-1001',
                companyId: 'CMP-8001',
                companyName: 'Premier SaaS Headquarters',
                name: 'Neil Chambers',
                title: 'Premier SaaS Platform Owner & Global Admin',
                role: 'SaaS Admin',
                avatar: 'NC',
                npiNumber: 'SYS-GLOBAL-01',
                isLoggedIn: true,
                tierBadge: 'Premier SaaS Admin',
              });
            }}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Crown className="h-5 w-5 text-purple-200" />
            <span>Switch Profile to Premier Dental SaaS Admin (neil.chambers@seismicshift.net)</span>
          </button>

          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400">
            <span>Or enter SaaS Admin Passcode:</span>
            <input
              type="password"
              placeholder="1234 or admin"
              className="w-28 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-purple-500"
              onChange={(e) => {
                if (e.target.value.toLowerCase() === '1234' || e.target.value.toLowerCase() === 'admin') {
                  setAdminUnlocked(true);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Multi-Tenant Role-Based Access Control (RBAC)</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              User Access & Granular Permission Management
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Configure system roles for <strong className="text-purple-300">#1 SaaS Company Setup Admins</strong>, <strong className="text-cyan-300">#2 Customer Practice Owners</strong> (who delegate custom permissions to staff), <strong className="text-emerald-300">Clinical Providers</strong>, and <strong className="text-amber-300">#3 Read-Only Auditors</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddCompanyModal(true)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Building className="h-4 w-4" />
              <span>+ Register Company Number</span>
            </button>

            <button
              onClick={() => {
                setNewUserCompanyId(currentStaff.companyId || 'CMP-8002');
                setShowAddUserModal(true);
              }}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Create User ID & Number</span>
            </button>

            <div className="p-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs space-y-1">
              <div className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Active Session IDs</div>
              <div className="font-bold text-white flex items-center gap-2 font-mono text-xs">
                <span className="text-cyan-300">{currentStaff.userNumber || 'USR-1002'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-purple-300">{currentStaff.companyId || 'CMP-8002'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Explanations Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* #1 Company Setup Admin */}
        <div className="p-4 bg-gradient-to-br from-purple-900 to-slate-900 border-2 border-purple-500 rounded-xl space-y-2 shadow-md">
          <div className="flex items-center gap-2 font-extrabold text-sm text-purple-300">
            <Crown className="h-4.5 w-4.5 text-purple-400 shrink-0" />
            <span className="text-white">#1 Company Setup Admin</span>
          </div>
          <p className="text-xs text-purple-100 font-medium leading-relaxed">
            Initial platform owners who provision practice accounts, configure Dentrix migration templates, manage SaaS billing tiers, and control global system settings.
          </p>
        </div>

        {/* #2 Customer Practice Admin */}
        <div className="p-4 bg-gradient-to-br from-cyan-950 to-slate-900 border-2 border-cyan-500 rounded-xl space-y-2 shadow-md">
          <div className="flex items-center gap-2 font-extrabold text-sm text-cyan-300">
            <Building2 className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
            <span className="text-white">#2 Customer Practice Admin</span>
          </div>
          <p className="text-xs text-cyan-50 font-medium leading-relaxed">
            Dental practice owners / managers. Have full authority over their practice account and can <strong className="text-white underline decoration-cyan-400">grant or revoke custom permissions</strong> to dentists, hygienists, and front desk staff as they see fit.
          </p>
        </div>

        {/* #3 Read-Only / Auditors */}
        <div className="p-4 bg-gradient-to-br from-amber-950 to-slate-900 border-2 border-amber-500 rounded-xl space-y-2 shadow-md">
          <div className="flex items-center gap-2 font-extrabold text-sm text-amber-300">
            <Eye className="h-4.5 w-4.5 text-amber-400 shrink-0" />
            <span className="text-white">#3 Read-Only / Auditors</span>
          </div>
          <p className="text-xs text-amber-50 font-medium leading-relaxed">
            Restricted accounts for chart auditors, insurance reviewers, or clinical trainees. Can inspect schedules, charts, and ledgers without permission to edit or sign records.
          </p>
        </div>
      </div>

      {/* Main Grid: User List & Granular Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Directory Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-600" /> Practice User Accounts
              </h3>
              <p className="text-xs text-slate-500">Select user to configure permission flags</p>
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-1.5">
              {canSelectCompany && (
                <select
                  value={selectedCompanyFilter}
                  onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[130px] truncate"
                >
                  <option value="all">All Companies</option>
                  {companies.map((c) => (
                    <option key={c.companyId} value={c.companyId}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Roles</option>
                <option value="company_admin">#1 SaaS Admin</option>
                <option value="practice_admin">#2 Practice Admin</option>
                <option value="clinical_provider">Clinical Provider</option>
                <option value="read_only">#3 Read-Only</option>
                <option value="patient_portal">Patient Portal</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredUsers.map((user) => {
              const isSelected = activeUserForEditing.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setActiveUserForEditing(user)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full font-bold flex items-center justify-center text-xs ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-2">
                          <span>{user.name}</span>
                          {user.npiNumber && (
                            <span className={`text-[10px] font-mono font-normal ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                              {user.npiNumber}
                            </span>
                          )}
                        </div>
                        <div className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {user.roleTitle}
                        </div>
                        {/* User Number and Company Number Badges */}
                        <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px]">
                          <span className={`px-1.5 py-0.2 rounded font-semibold ${
                            isSelected ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                          }`}>
                            User #: {user.userNumber}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded font-semibold ${
                            isSelected ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }`}>
                            Co #: {user.companyId} ({user.companyName})
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStaff({
                          id: user.id,
                          userNumber: user.userNumber,
                          companyId: user.companyId,
                          companyName: user.companyName,
                          name: user.name,
                          title: user.roleTitle,
                          role: user.category === 'practice_admin' ? 'Practice Owner' : user.category === 'company_admin' ? 'SaaS Admin' : 'Dentist',
                          avatar: user.avatar,
                          npiNumber: user.npiNumber || 'N/A',
                          isLoggedIn: true,
                        });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                        currentStaff.name === user.name
                          ? 'bg-emerald-500 text-slate-950'
                          : isSelected
                          ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {currentStaff.name === user.name ? 'Active' : 'Switch To'}
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/40 flex items-center justify-between text-[11px]">
                    <div>{getCategoryBadge(user.category)}</div>
                    <span className={`text-[10px] font-medium ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      {user.email}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Permission Matrix & Customer Admin Customization Box */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Permission Matrix: {activeUserForEditing.name}
                </h3>
                {getCategoryBadge(activeUserForEditing.category)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Customer Admins can toggle individual permissions for any role profile.
              </p>
            </div>

            {showSavedToast && (
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-bounce">
                <Check className="h-3.5 w-3.5" /> Permissions Saved to Firestore
              </span>
            )}
          </div>

          {/* Granular Toggles List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-cyan-600" /> Configurable Practice Rights
            </h4>

            {[
              {
                key: 'canEditOdontogram',
                label: 'Odontogram & Charting Write Access',
                desc: 'Allows adding tooth conditions, restoration states, and perio measurements.',
              },
              {
                key: 'canSignSOAPNotes',
                label: 'Sign & Finalize SOAP Clinical Progress Notes',
                desc: 'Grants authority to sign clinical documentation with NPI digital signature.',
              },
              {
                key: 'canManageBillingAndClaims',
                label: 'CDT Billing, Claims & Ledger Modification',
                desc: 'Allows posting procedure fees, submitting electronic ADA claims, and adjusting ledger balances.',
              },
              {
                key: 'canManageStaffAndPermissions',
                label: 'Staff Account Management & Rights Allocation (#2 Customer Admin)',
                desc: 'Gives rights to create new user accounts and toggle permissions for other staff.',
              },
              {
                key: 'canExportPHI',
                label: 'HIPAA PHI Data & Image Export',
                desc: 'Permits downloading bulk patient charts, x-rays, or full PDF history.',
              },
              {
                key: 'canExecuteMigration',
                label: 'Dentrix & Legacy EHR Database Import',
                desc: 'Allows executing data normalization pipelines from Dentrix, Eaglesoft, or Open Dental.',
              },
              {
                key: 'canManageSystemSettings',
                label: 'Global SaaS Tenant & Practice Settings (#1 Company Admin)',
                desc: 'Allows configuring office operatories, CDT fee schedules, and subscription plans.',
              },
            ].map((perm) => {
              const isChecked = activeUserForEditing.permissions[perm.key as keyof GranularPermissions];
              return (
                <div
                  key={perm.key}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    isChecked
                      ? 'bg-cyan-50/50 border-cyan-200 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{perm.label}</span>
                      {isChecked ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Granted
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                          Restricted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{perm.desc}</p>
                  </div>

                  <button
                    onClick={() => handleTogglePermission(activeUserForEditing.id, perm.key as keyof GranularPermissions)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isChecked ? 'bg-cyan-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isChecked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-2 border border-slate-800">
            <div className="font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Real-Time Access Control Summary
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              When switched to <strong className="text-white">{activeUserForEditing.name}</strong>, the UI enforces these permission toggles dynamically. Read-only users (#3) will see editing buttons locked with HIPAA compliance notices.
            </p>
          </div>

        </div>

      </div>

      {/* Company Accounts & Multi-Tenant Organization Directory Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-lg">
                Company Numbers & Multi-Tenant Practice Accounts
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Every practice organization in Premier Dental PMS is assigned a unique Company Number (ID), Federal Tax EIN, and Facility NPI for multi-tenant billing isolation.
            </p>
          </div>

          <button
            onClick={() => setShowAddCompanyModal(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>+ Register New Company Number</span>
          </button>
        </div>

        {/* Company Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((co) => {
            const userCountForCo = users.filter((u) => u.companyId === co.companyId).length;
            const isCurrentActiveCo = currentStaff.companyId === co.companyId;

            return (
              <div
                key={co.companyId}
                className={`p-4 rounded-xl border transition-all space-y-3 relative ${
                  isCurrentActiveCo
                    ? 'bg-purple-950/5 border-purple-300 ring-2 ring-purple-500/20 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
                        Co #: {co.companyId}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1" title="Security registration code required at user signup">
                        <Key className="h-3 w-3 text-amber-700" />
                        {co.registrationCode || 'REG-8002'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1 leading-snug">
                      {co.companyName}
                    </h4>
                  </div>
                  {isCurrentActiveCo && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 font-bold rounded border border-emerald-300 shrink-0">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-200/60 font-mono">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-sans">Contact:</span>
                    <span className="font-bold text-slate-700 font-sans">{co.primaryContactName || 'Practice Owner'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-sans">Email:</span>
                    <span className="text-slate-700 font-sans text-[10px] truncate max-w-[130px]">{co.primaryContactEmail}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-sans">Tax EIN:</span>
                    <span className="font-bold text-slate-700">{co.taxIdEin}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-sans">Plan Tier:</span>
                    <span className="text-purple-700 font-sans font-semibold">{co.planTier}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-sans border-t border-slate-200/50 gap-2">
                  <button
                    onClick={() => setShowPasscardModal(co)}
                    className="px-2 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Send className="h-3 w-3 text-purple-600" />
                    <span>Passcard & Code</span>
                  </button>
                  <button
                    onClick={() => setSelectedCompanyFilter(selectedCompanyFilter === co.companyId ? 'all' : co.companyId)}
                    className="text-purple-600 hover:text-purple-800 font-bold text-[10px] underline cursor-pointer"
                  >
                    {selectedCompanyFilter === co.companyId ? 'Clear' : 'Filter Users'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Register New Company Number & Security Code */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Application Owner: Create Practice Company</h3>
                  <p className="text-[11px] text-slate-400">Provision practice company credentials and random registration code.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCompanyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Practice Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Family Dental & Orthodontics"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Primary Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sarah Jenkins"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="s.jenkins@apexdental.com"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Codes Row: Company Number + Random Security Code */}
              <div className="p-3 bg-slate-950/80 border border-purple-500/50 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-purple-400" />
                    Auto-Generated Practice Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerateCodes}
                    className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate Codes
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Assigned Company #</label>
                    <input
                      type="text"
                      required
                      value={newCompanyCode}
                      onChange={(e) => setNewCompanyCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-purple-500/70 rounded-lg font-mono text-purple-300 font-extrabold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Random Registration Security Code</label>
                    <input
                      type="text"
                      required
                      value={newRegistrationCode}
                      onChange={(e) => setNewRegistrationCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-amber-500/70 rounded-lg font-mono text-amber-300 font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Plan Tier</label>
                  <select
                    value={newPlanTier}
                    onChange={(e) => setNewPlanTier(e.target.value as CompanyAccount['planTier'])}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Standard Practice">Standard Practice</option>
                    <option value="Enterprise Multi-Practice">Enterprise Multi-Practice</option>
                    <option value="SaaS Headquarters">SaaS Headquarters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone (Optional)</label>
                  <input
                    type="text"
                    placeholder="(555) 000-0000"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Federal Tax EIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="EIN-XX-XXXXXXX"
                    value={newTaxId}
                    onChange={(e) => setNewTaxId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Facility NPI (Optional)</label>
                  <input
                    type="text"
                    placeholder="NPI-1092840192"
                    value={newFacilityNpi}
                    onChange={(e) => setNewFacilityNpi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-800/80 rounded-xl text-[11px] text-purple-200">
                You will receive a <strong>Practice Registration Passcard</strong> containing the Company Number and Random Code to share with the practice team.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Provision Practice Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Practice Passcard & Registration Security Credentials */}
      {showPasscardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-950 border border-purple-700 rounded-xl text-purple-300">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Practice Registration Passcard</h3>
                  <p className="text-[11px] text-slate-400">Share these registration credentials with the practice team.</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasscardModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Passcard Box */}
            <div className="p-5 bg-slate-950 border-2 border-purple-500/60 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Practice / Company Name</div>
                  <div className="text-base font-extrabold text-white">{showPasscardModal.companyName}</div>
                </div>
                <span className="px-2.5 py-1 bg-purple-900/80 text-purple-200 border border-purple-700 rounded-lg text-xs font-mono font-bold">
                  {showPasscardModal.planTier}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 border border-purple-800/80 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Company Number (#)</div>
                  <div className="text-xl font-mono font-extrabold text-purple-300 mt-1">{showPasscardModal.companyId}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Required for user registration</div>
                </div>

                <div className="p-3 bg-slate-900 border border-amber-800/80 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                    <Key className="h-3 w-3" /> Security Code
                  </div>
                  <div className="text-xl font-mono font-extrabold text-amber-300 mt-1">{showPasscardModal.registrationCode}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Random verification key</div>
                </div>
              </div>

              <div className="pt-2 text-xs space-y-1 text-slate-300 font-sans border-t border-slate-800">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Primary Contact:</span>
                  <span className="font-semibold text-white">{showPasscardModal.primaryContactName || 'Practice Admin'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Contact Email:</span>
                  <span className="font-mono text-cyan-300">{showPasscardModal.primaryContactEmail}</span>
                </div>
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/80 rounded-xl text-[11px] text-cyan-200 leading-relaxed">
              <strong>Registration Instructions for Practice Team:</strong> Give the Company Number (<code className="font-mono text-cyan-300 font-bold">{showPasscardModal.companyId}</code>) and Random Code (<code className="font-mono text-amber-300 font-bold">{showPasscardModal.registrationCode}</code>) to team members. They will enter both values on the Registration page to link their profile to this practice.
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {copiedPasscardToast ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="h-4 w-4" /> Passcard details copied to clipboard!
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Ready to distribute</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const textToCopy = `PREMIER DENTAL PMS - PRACTICE REGISTRATION PASSCARD\n----------------------------------------------------\nPractice Name: ${showPasscardModal.companyName}\nCompany Number (#): ${showPasscardModal.companyId}\nSecurity Registration Code: ${showPasscardModal.registrationCode}\nPrimary Contact: ${showPasscardModal.primaryContactName || 'Admin'} (${showPasscardModal.primaryContactEmail})\n\nREGISTRATION STEPS:\n1. Open the Registration page in Premier Dental PMS.\n2. Enter Company Number: ${showPasscardModal.companyId}\n3. Enter Security Code: ${showPasscardModal.registrationCode}\n4. Complete signup to enter your practice environment.`;
                    navigator.clipboard.writeText(textToCopy);
                    setCopiedPasscardToast(true);
                    setTimeout(() => setCopiedPasscardToast(false), 3000);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Passcard Instructions</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasscardModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create User ID & Number */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Create New User ID & Number</h3>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserWithId} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full User Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jordan Smith, DDS"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.smith@dental.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Practice Company</label>
                  {canSelectCompany ? (
                    <select
                      value={newUserCompanyId}
                      onChange={(e) => setNewUserCompanyId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-purple-500 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                    >
                      {companies.map((c) => (
                        <option key={c.companyId} value={c.companyId}>
                          {c.companyName} ({c.companyId})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 bg-slate-950 border border-purple-500/50 rounded-lg text-white font-mono flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="px-1.5 py-0.5 bg-purple-900/90 text-purple-200 border border-purple-600 rounded text-[10px] font-bold">
                          {currentStaff.companyId || 'CMP-8002'}
                        </span>
                        <span className="text-slate-300 text-[11px] font-sans font-medium truncate max-w-[130px]" title={currentStaff.companyName || 'BrightSmile Dental Suite'}>
                          {currentStaff.companyName || companies.find(c => c.companyId === (currentStaff.companyId || 'CMP-8002'))?.companyName || 'BrightSmile Dental Suite'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role Category</label>
                  <select
                    value={newUserCategory}
                    onChange={(e) => setNewUserCategory(e.target.value as UserCategory)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="practice_admin">#2 Practice Admin</option>
                    <option value="clinical_provider">Clinical Provider</option>
                    <option value="read_only">#3 Read-Only Auditor</option>
                    <option value="company_admin">#1 SaaS Company Admin</option>
                    <option value="patient_portal">Patient Portal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">NPI Number (Optional)</label>
                <input
                  type="text"
                  placeholder="NPI-1920192831"
                  value={newUserNpi}
                  onChange={(e) => setNewUserNpi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-800/80 rounded-xl text-[11px] text-cyan-200">
                System will auto-assign a unique User ID Number (e.g. <strong className="font-mono text-cyan-300">USR-1006</strong>) and link it directly to Company Number <strong className="font-mono text-purple-300">{newUserCompanyId}</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Create User ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
