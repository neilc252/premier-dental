import React, { useState } from 'react';
import { Patient, SOAPNote } from '../../types';
import { SoapNoteGenerator } from '../ClinicalNotes/SoapNoteGenerator';
import { FamilyFileView } from './FamilyFileView';
import { ContinuingCareView } from './ContinuingCareView';
import { OfficeJournalView } from './OfficeJournalView';
import { DocumentCenterView } from './DocumentCenterView';
import { FileText, Users, RefreshCw, BookOpen, FileCheck } from 'lucide-react';

interface PatientChartHubProps {
  patient: Patient;
  onAddSoapNote: (note: SOAPNote) => void;
  onOpenEditPatient?: () => void;
}

export const PatientChartHub: React.FC<PatientChartHubProps> = ({
  patient,
  onAddSoapNote,
  onOpenEditPatient,
}) => {
  const [subTab, setSubTab] = useState<'soap' | 'family' | 'recall' | 'journal' | 'documents'>('soap');

  const tabs = [
    { id: 'soap', label: 'SOAP Notes & AI Dictation', icon: FileText },
    { id: 'family', label: 'Family File & Insurance', icon: Users },
    { id: 'recall', label: 'Continuing Care & Recall', icon: RefreshCw },
    { id: 'journal', label: 'Office Journal & Comms', icon: BookOpen },
    { id: 'documents', label: 'Document Vault & Intake', icon: FileCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Sub-Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = subTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Views */}
      {subTab === 'soap' && (
        <SoapNoteGenerator
          patient={patient}
          onAddSoapNote={onAddSoapNote}
        />
      )}

      {subTab === 'family' && (
        <FamilyFileView patient={patient} onOpenEditPatient={onOpenEditPatient} />
      )}

      {subTab === 'recall' && (
        <ContinuingCareView patient={patient} />
      )}

      {subTab === 'journal' && (
        <OfficeJournalView patient={patient} />
      )}

      {subTab === 'documents' && (
        <DocumentCenterView patient={patient} />
      )}
    </div>
  );
};
