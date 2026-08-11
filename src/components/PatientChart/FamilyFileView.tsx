import React, { useState } from 'react';
import { Patient } from '../../types';
import { Users, UserPlus, CreditCard, Building2, Phone, Mail, ShieldCheck, Heart, FileCheck, CheckCircle2, Edit3 } from 'lucide-react';

interface FamilyFileViewProps {
  patient: Patient;
  onOpenEditPatient?: () => void;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Self / Primary' | 'Spouse' | 'Child / Dependent' | 'Parent';
  dob: string;
  chartNumber: string;
  status: 'Active' | 'Inactive';
  lastVisit: string;
  balance: number;
}

export const FamilyFileView: React.FC<FamilyFileViewProps> = ({ patient, onOpenEditPatient }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 'fam-1',
      name: `${patient.firstName} ${patient.lastName}`,
      relationship: 'Self / Primary',
      dob: patient.dob,
      chartNumber: patient.chartNumber,
      status: 'Active',
      lastVisit: patient.lastVisit,
      balance: patient.balanceDue,
    },
    {
      id: 'fam-2',
      name: `${patient.firstName === 'Sarah' ? 'Mark' : 'Sarah'} ${patient.lastName}`,
      relationship: 'Spouse',
      dob: '1988-04-12',
      chartNumber: `CH-${Math.floor(8000 + Math.random() * 900)}`,
      status: 'Active',
      lastVisit: '2025-11-20',
      balance: 0,
    },
    {
      id: 'fam-3',
      name: `Ethan ${patient.lastName}`,
      relationship: 'Child / Dependent',
      dob: '2016-08-22',
      chartNumber: `CH-${Math.floor(8000 + Math.random() * 900)}`,
      status: 'Active',
      lastVisit: '2025-10-15',
      balance: 45,
    },
  ]);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState<'Spouse' | 'Child / Dependent' | 'Parent'>('Child / Dependent');
  const [newMemberDob, setNewMemberDob] = useState('2018-05-10');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;

    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newMemberName,
      relationship: newMemberRel,
      dob: newMemberDob,
      chartNumber: `CH-${Math.floor(8000 + Math.random() * 900)}`,
      status: 'Active',
      lastVisit: new Date().toISOString().split('T')[0],
      balance: 0,
    };

    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName('');
    setShowAddMemberModal(false);
  };

  const totalFamilyBalance = familyMembers.reduce((acc, m) => acc + m.balance, 0);

  return (
    <div className="space-y-6">
      {/* Family File Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-950 border border-cyan-800 rounded-2xl flex items-center justify-center text-cyan-300">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{patient.lastName} Family Account File</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/80 text-cyan-200 text-xs font-semibold border border-cyan-700">
                Primary Guarantor: {patient.firstName} {patient.lastName}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Centralized family account tracking, multi-member insurance benefits, and employer records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2 text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Family Total Balance</span>
            <span className={`text-base font-bold ${totalFamilyBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ${totalFamilyBalance.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Link Family Member</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Linked Family Members List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-slate-900 text-base">Linked Family Account Members ({familyMembers.length})</h3>
              </div>
              <span className="text-xs text-slate-500">Shared Billing Account #{patient.chartNumber}-FAM</span>
            </div>

            <div className="divide-y divide-slate-100">
              {familyMembers.map((member) => (
                <div key={member.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-slate-50/50 p-3 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{member.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                          {member.relationship}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Chart #{member.chartNumber}</span>
                        <span>•</span>
                        <span>DOB: {member.dob}</span>
                        <span>•</span>
                        <span>Last Visit: {member.lastVisit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Balance</span>
                      <span className={`text-xs font-bold ${member.balance > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                        ${member.balance.toFixed(2)}
                      </span>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer">
                      Open Chart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Insurance & Employer Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Centralized Family Insurance & Employer</h3>
              </div>
              {onOpenEditPatient && (
                <button
                  onClick={onOpenEditPatient}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Edit Insurance & Patient Info</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Primary Insurance Plan</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active Benefits</span>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{patient.insuranceProvider}</p>
                  <p className="text-xs text-slate-600">Subscriber: {patient.firstName} {patient.lastName}</p>
                  <p className="text-xs text-slate-600">Policy / ID #: <span className="font-mono font-bold text-slate-800">{patient.policyNumber}</span></p>
                  <p className="text-xs text-slate-600">Group #: <span className="font-mono font-bold text-slate-800">{patient.groupNumber}</span></p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Employer Information</span>
                  <Building2 className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">TechCorp Global Inc.</p>
                  <p className="text-xs text-slate-600">Group Plan Tier: Delta PPO Premier Plus</p>
                  <p className="text-xs text-slate-600">Annual Max: $2,500.00 / Remaining: <span className="font-bold text-emerald-700">$1,850.00</span></p>
                  <p className="text-xs text-slate-600">Deductible: $50.00 (Met)</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Family Account Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
            <h3 className="font-bold text-sm text-cyan-300 uppercase tracking-wider">Family Guarantor Details</h3>
            
            <div className="space-y-3 text-xs divide-y divide-slate-800">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Guarantor Name:</span>
                <span className="font-bold text-slate-200">{patient.firstName} {patient.lastName}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Billing Address:</span>
                <span className="font-bold text-slate-200 text-right max-w-[160px]">{patient.address}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-bold text-slate-200">{patient.phone}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-bold text-slate-200">{patient.email}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Statements Preferred:</span>
                <span className="font-bold text-cyan-400">Digital Email & SMS</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Manage Payment Agreement</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Link New Family Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-600" />
                Link Family Member Account
              </h3>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Miller"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={newMemberRel}
                    onChange={(e: any) => setNewMemberRel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child / Dependent">Child / Dependent</option>
                    <option value="Parent">Parent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newMemberDob}
                    onChange={(e) => setNewMemberDob(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-xs text-cyan-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <span>Will automatically link primary insurance benefits and shared family guarantor billing.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Save & Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
