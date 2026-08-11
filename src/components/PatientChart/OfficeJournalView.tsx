import React, { useState } from 'react';
import { Patient } from '../../types';
import { BookOpen, PhoneCall, MessageSquare, AlertCircle, PlusCircle, User, Clock, FileText, Send, CheckCircle2 } from 'lucide-react';

interface OfficeJournalViewProps {
  patient: Patient;
}

interface JournalEntry {
  id: string;
  timestamp: string;
  staffName: string;
  type: 'Phone Call' | 'SMS Sent' | 'Missed Call' | 'Staff Note' | 'Billing Note' | 'Medical Inquiry';
  content: string;
}

export const OfficeJournalView: React.FC<OfficeJournalViewProps> = ({ patient }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: 'j-1',
      timestamp: '2026-08-10 14:15',
      staffName: 'Dr. Michael Chen, DDS',
      type: 'Phone Call',
      content: 'Called patient regarding post-op sensitivity on Tooth #3 composite restoration. Patient reports mild cold discomfort, advised warm salt water rinse and ibuprofen.',
    },
    {
      id: 'j-2',
      timestamp: '2026-08-08 09:30',
      staffName: 'Automated PMS Engine',
      type: 'SMS Sent',
      content: 'Sent automated appointment confirmation text for upcoming hygiene visit on 2026-08-15 at 10:00 AM. Patient replied: "C" (Confirmed).',
    },
    {
      id: 'j-3',
      timestamp: '2026-07-28 11:20',
      staffName: 'Sarah Miller (Front Desk)',
      type: 'Billing Note',
      content: 'Verified insurance pre-authorization with Delta Dental. Crown on Tooth #14 approved at 50% co-pay ($625.00 patient portion).',
    },
  ]);

  const [newEntryType, setNewEntryType] = useState<'Phone Call' | 'SMS Sent' | 'Staff Note' | 'Billing Note'>('Phone Call');
  const [newEntryContent, setNewEntryContent] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryContent.trim()) return;

    const newJournal: JournalEntry = {
      id: `j-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      staffName: 'Active Operator',
      type: newEntryType,
      content: newEntryContent,
    };

    setEntries([newJournal, ...entries]);
    setNewEntryContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-950 border border-cyan-800 rounded-2xl flex items-center justify-center text-cyan-300">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Office Journal & Communication Log</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/80 text-cyan-200 text-xs font-semibold border border-cyan-700">
                Chronological Audit Trail
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Dentrix-style office journal tracking all patient phone calls, missed visits, staff notes, and automated SMS logs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Add Journal Entry Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <PlusCircle className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-slate-900 text-base">New Journal Entry</h3>
          </div>

          <form onSubmit={handleAddEntry} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Entry Category</label>
              <select
                value={newEntryType}
                onChange={(e: any) => setNewEntryType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              >
                <option value="Phone Call">Phone Call / Conversation</option>
                <option value="Staff Note">Internal Staff Memo</option>
                <option value="Billing Note">Billing / Insurance Note</option>
                <option value="SMS Sent">SMS / Email Communication</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Journal Note Details</label>
              <textarea
                rows={4}
                required
                placeholder="Log details regarding patient call, missed appointment, or staff discussion..."
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Record Journal Entry</span>
            </button>
          </form>
        </div>

        {/* Chronological Journal Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-600" />
              Journal History ({entries.length} Entries)
            </h3>
            <span className="text-xs text-slate-500">Sorted Newest First</span>
          </div>

          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-slate-100/60 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-cyan-300 text-[11px] font-bold">
                      {entry.type}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">{entry.staffName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{entry.timestamp}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
