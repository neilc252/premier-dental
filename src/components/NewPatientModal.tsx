import React, { useState } from 'react';
import { UserPlus, X, ShieldAlert, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Patient, MedicalAlert } from '../types';
import { StaffUser } from './StaffLoginModal';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
  currentStaff?: StaffUser;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
  currentStaff,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('1990-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [phone, setPhone] = useState('(555) 234-5678');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('123 Health Ave, Suite 100');
  const [insuranceProvider, setInsuranceProvider] = useState('Delta Dental Premier');
  const [policyNumber, setPolicyNumber] = useState('DLT-884920');
  const [groupNumber, setGroupNumber] = useState('GRP-4029');
  
  // Quick Medical Alerts checkboxes
  const [hasPenicillinAllergy, setHasPenicillinAllergy] = useState(false);
  const [requiresPremed, setRequiresPremed] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [hasLatexAllergy, setHasLatexAllergy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const chartNum = `DN-${Math.floor(1000 + Math.random() * 9000)}`;

    const alerts: MedicalAlert[] = [];
    if (hasPenicillinAllergy) {
      alerts.push({
        id: `ma-${Date.now()}-1`,
        type: 'allergy',
        severity: 'critical',
        title: 'Penicillin Allergy',
        notes: 'Severe anaphylactic reaction reported by patient.',
      });
    }
    if (requiresPremed) {
      alerts.push({
        id: `ma-${Date.now()}-2`,
        type: 'premed',
        severity: 'high',
        title: 'Antibiotic Prophylaxis Required',
        notes: 'Artificial heart valve. Amoxicillin 2g 1hr prior to dental procedures.',
      });
    }
    if (hasHypertension) {
      alerts.push({
        id: `ma-${Date.now()}-3`,
        type: 'condition',
        severity: 'moderate',
        title: 'Stage 1 Hypertension',
        notes: 'Monitor BP prior to administering epinephrine local anesthetic.',
      });
    }
    if (hasLatexAllergy) {
      alerts.push({
        id: `ma-${Date.now()}-4`,
        type: 'allergy',
        severity: 'high',
        title: 'Latex Sensitivity',
        notes: 'Use non-latex nitrile gloves and rubber dam.',
      });
    }

    const newPatientRecord: Patient = {
      id: `pat-${Date.now()}`,
      userNumber: currentStaff?.userNumber || 'USR-7010',
      companyId: currentStaff?.companyId || 'CMP-8002',
      chartNumber: chartNum,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob,
      gender,
      phone: phone.trim() || '(555) 000-0000',
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      address: address.trim() || '123 Main St, Anytown',
      insuranceProvider: insuranceProvider.trim() || 'Self-Pay / Uninsured',
      policyNumber: policyNumber.trim() || 'N/A',
      groupNumber: groupNumber.trim() || 'N/A',
      medicalAlerts: alerts,
      conditions: [],
      perioChart: {},
      treatmentPlans: [],
      soapNotes: [],
      lastVisit: new Date().toISOString().split('T')[0],
      nextRecall: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      balanceDue: 0,
    };

    onAddPatient(newPatientRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full text-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                New Patient Intake Chart Registration
              </h2>
              <p className="text-xs text-slate-400">
                Create new chart record & auto-generate CDT eligibility ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Section: Demographics */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <FileText className="h-3.5 w-3.5" /> Demographic Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Connor"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Contact Details */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
              Contact & Address
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State, ZIP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Insurance / Payer */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1.5">
              Insurance & Payer Billing
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Payer / Carrier</label>
                <input
                  type="text"
                  placeholder="e.g. MetLife Dental"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subscriber Policy ID</label>
                <input
                  type="text"
                  placeholder="e.g. MET-99381"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Group #</label>
                <input
                  type="text"
                  placeholder="e.g. GRP-1002"
                  value={groupNumber}
                  onChange={(e) => setGroupNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Medical Alerts & Flags */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Initial Medical & Prophylaxis Flags
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 bg-slate-800/80 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={hasPenicillinAllergy}
                  onChange={(e) => setHasPenicillinAllergy(e.target.checked)}
                  className="accent-rose-500 h-4 w-4 rounded"
                />
                <span className="text-slate-200">Penicillin Allergy</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-800/80 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={requiresPremed}
                  onChange={(e) => setRequiresPremed(e.target.checked)}
                  className="accent-amber-500 h-4 w-4 rounded"
                />
                <span className="text-slate-200">Antibiotic Pre-Medication Required</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-800/80 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={hasHypertension}
                  onChange={(e) => setHasHypertension(e.target.checked)}
                  className="accent-cyan-500 h-4 w-4 rounded"
                />
                <span className="text-slate-200">Stage 1 / 2 Hypertension</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-slate-800/80 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={hasLatexAllergy}
                  onChange={(e) => setHasLatexAllergy(e.target.checked)}
                  className="accent-purple-500 h-4 w-4 rounded"
                />
                <span className="text-slate-200">Latex Allergy Sensitivity</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Create Patient Record</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
