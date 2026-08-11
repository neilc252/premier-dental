import React, { useState, useEffect } from 'react';
import { UserCheck, X, ShieldAlert, CheckCircle2, Trash2, Edit3, Save, FileText } from 'lucide-react';
import { Patient, MedicalAlert } from '../types';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onUpdatePatient: (updatedPatient: Patient) => void;
  onDeletePatient?: (patientId: string) => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onUpdatePatient,
  onDeletePatient,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('1990-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  
  // Quick Medical Alerts
  const [hasPenicillinAllergy, setHasPenicillinAllergy] = useState(false);
  const [requiresPremed, setRequiresPremed] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [hasLatexAllergy, setHasLatexAllergy] = useState(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (patient) {
      setFirstName(patient.firstName || '');
      setLastName(patient.lastName || '');
      setDob(patient.dob || '1990-05-15');
      setGender(patient.gender || 'Female');
      setPhone(patient.phone || '');
      setEmail(patient.email || '');
      setAddress(patient.address || '');
      setInsuranceProvider(patient.insuranceProvider || '');
      setPolicyNumber(patient.policyNumber || '');
      setGroupNumber(patient.groupNumber || '');

      const alertTitles = (patient.medicalAlerts || []).map(a => a.title.toLowerCase());
      setHasPenicillinAllergy(alertTitles.some(t => t.includes('penicillin')));
      setRequiresPremed(alertTitles.some(t => t.includes('premed') || t.includes('prophylaxis')));
      setHasHypertension(alertTitles.some(t => t.includes('hypertension') || t.includes('bp')));
      setHasLatexAllergy(alertTitles.some(t => t.includes('latex')));
      setShowConfirmDelete(false);
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const alerts: MedicalAlert[] = [...(patient.medicalAlerts || []).filter(a => 
      !a.title.toLowerCase().includes('penicillin') &&
      !a.title.toLowerCase().includes('premed') &&
      !a.title.toLowerCase().includes('prophylaxis') &&
      !a.title.toLowerCase().includes('hypertension') &&
      !a.title.toLowerCase().includes('latex')
    )];

    if (hasPenicillinAllergy) {
      alerts.push({
        id: `ma-${Date.now()}-1`,
        type: 'allergy',
        severity: 'critical',
        title: 'Penicillin Allergy',
        notes: 'Severe reaction reported by patient.',
      });
    }
    if (requiresPremed) {
      alerts.push({
        id: `ma-${Date.now()}-2`,
        type: 'premed',
        severity: 'high',
        title: 'Antibiotic Prophylaxis Required',
        notes: 'Amoxicillin 2g 1hr prior to dental procedures.',
      });
    }
    if (hasHypertension) {
      alerts.push({
        id: `ma-${Date.now()}-3`,
        type: 'condition',
        severity: 'moderate',
        title: 'Stage 1 Hypertension',
        notes: 'Monitor BP prior to local anesthetic.',
      });
    }
    if (hasLatexAllergy) {
      alerts.push({
        id: `ma-${Date.now()}-4`,
        type: 'allergy',
        severity: 'high',
        title: 'Latex Sensitivity',
        notes: 'Use non-latex nitrile gloves.',
      });
    }

    const updatedPatientRecord: Patient = {
      ...patient,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob,
      gender,
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      insuranceProvider: insuranceProvider.trim() || 'Self-Pay / Uninsured',
      policyNumber: policyNumber.trim() || 'N/A',
      groupNumber: groupNumber.trim() || 'N/A',
      medicalAlerts: alerts,
    };

    onUpdatePatient(updatedPatientRecord);
    onClose();
  };

  const handleDelete = () => {
    if (onDeletePatient) {
      onDeletePatient(patient.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full text-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Edit Patient Record & Insurance
              </h2>
              <p className="text-xs text-slate-400">
                Chart #{patient.chartNumber} • {patient.firstName} {patient.lastName}
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Biological Sex
                </label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Home Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Insurance Details */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Primary Dental Insurance & Claims Setup
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Policy / Subscriber ID
                </label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Employer Group #
                </label>
                <input
                  type="text"
                  value={groupNumber}
                  onChange={(e) => setGroupNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Quick Medical Alerts */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Medical Alerts & Contraindications
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-xs font-semibold ${
                hasPenicillinAllergy ? 'bg-rose-950/80 border-rose-500 text-rose-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={hasPenicillinAllergy}
                  onChange={(e) => setHasPenicillinAllergy(e.target.checked)}
                  className="hidden"
                />
                <span>Penicillin Allergy</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-xs font-semibold ${
                requiresPremed ? 'bg-amber-950/80 border-amber-500 text-amber-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={requiresPremed}
                  onChange={(e) => setRequiresPremed(e.target.checked)}
                  className="hidden"
                />
                <span>Premed Required</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-xs font-semibold ${
                hasHypertension ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={hasHypertension}
                  onChange={(e) => setHasHypertension(e.target.checked)}
                  className="hidden"
                />
                <span>Hypertension</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-xs font-semibold ${
                hasLatexAllergy ? 'bg-rose-950/80 border-rose-500 text-rose-200' : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={hasLatexAllergy}
                  onChange={(e) => setHasLatexAllergy(e.target.checked)}
                  className="hidden"
                />
                <span>Latex Allergy</span>
              </label>
            </div>
          </div>

          {/* Delete Confirm Warning Box if toggled */}
          {showConfirmDelete && (
            <div className="p-4 rounded-xl bg-rose-950 border border-rose-600 text-rose-200 text-xs space-y-3 animate-fade-in">
              <p className="font-bold">⚠️ Are you sure you want to PERMANENTLY delete this patient record?</p>
              <p className="text-slate-300">
                This will remove Chart #{patient.chartNumber} ({patient.firstName} {patient.lastName}), associated conditions, SOAP notes, and treatment plans.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                >
                  Yes, Confirm Permanent Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {onDeletePatient && !showConfirmDelete ? (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Patient Record</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-900/40 transition-all cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Patient Changes</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
