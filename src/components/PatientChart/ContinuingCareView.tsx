import React, { useState } from 'react';
import { Patient } from '../../types';
import { Calendar, Clock, CheckCircle2, AlertCircle, Send, RefreshCw, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';

interface ContinuingCareViewProps {
  patient: Patient;
}

interface RecallItem {
  id: string;
  type: 'Adult Prophy (6 Mo)' | 'Perio Maintenance (3 Mo)' | 'Bitewing X-Rays (12 Mo)' | 'Panorex / FMX (36 Mo)' | 'Fluoride Varnish';
  intervalMonths: number;
  lastDate: string;
  dueDate: string;
  provider: string;
  status: 'Scheduled' | 'Due Now' | 'Overdue' | 'Automated Reminder Sent';
}

export const ContinuingCareView: React.FC<ContinuingCareViewProps> = ({ patient }) => {
  const [recalls, setRecalls] = useState<RecallItem[]>([
    {
      id: 'rec-1',
      type: 'Adult Prophy (6 Mo)',
      intervalMonths: 6,
      lastDate: patient.lastVisit || '2025-09-15',
      dueDate: patient.nextRecall || '2026-03-15',
      provider: 'Hyg. Amanda Torres, RDH',
      status: 'Due Now',
    },
    {
      id: 'rec-2',
      type: 'Bitewing X-Rays (12 Mo)',
      intervalMonths: 12,
      lastDate: '2025-03-10',
      dueDate: '2026-03-10',
      provider: 'Dr. Michael Chen, DDS',
      status: 'Due Now',
    },
    {
      id: 'rec-3',
      type: 'Perio Maintenance (3 Mo)',
      intervalMonths: 3,
      lastDate: '2025-11-01',
      dueDate: '2026-02-01',
      provider: 'Hyg. Amanda Torres, RDH',
      status: 'Overdue',
    },
  ]);

  const [sentMessageToast, setSentMessageToast] = useState<string | null>(null);

  const handleSendReminder = (recallId: string, type: string) => {
    setRecalls(recalls.map(r => r.id === recallId ? { ...r, status: 'Automated Reminder Sent' } : r));
    setSentMessageToast(`Automated SMS recall reminder sent to ${patient.phone} for ${type}`);
    setTimeout(() => setSentMessageToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert for SMS send */}
      {sentMessageToast && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{sentMessageToast}</span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">DELIVERED • 2-WAY RECALL</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-950 border border-cyan-800 rounded-2xl flex items-center justify-center text-cyan-300">
            <RefreshCw className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Continuing Care & Automated Patient Recall</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/80 text-cyan-200 text-xs font-semibold border border-cyan-700">
                Preventive Hygiene System
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Automated 3-month and 6-month hygiene recall cycles with 2-way SMS confirmation engine.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSendReminder(recalls[0].id, recalls[0].type)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch All Due Recall Alerts</span>
          </button>
        </div>
      </div>

      {/* Recall Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recalls.map((recall) => {
          const isOverdue = recall.status === 'Overdue';
          const isDue = recall.status === 'Due Now';
          return (
            <div 
              key={recall.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-4 ${
                isOverdue ? 'border-rose-300 bg-rose-50/20' : isDue ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Recall Type</span>
                    <h3 className="font-bold text-slate-900 text-base">{recall.type}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    isOverdue 
                      ? 'bg-rose-100 text-rose-800 border-rose-300' 
                      : isDue 
                      ? 'bg-amber-100 text-amber-800 border-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {recall.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cycle Interval:</span>
                    <span className="font-bold text-slate-800">{recall.intervalMonths} Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Completed:</span>
                    <span className="font-bold text-slate-800">{recall.lastDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Next Target Due:</span>
                    <span className="font-bold text-cyan-700">{recall.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hygiene Provider:</span>
                    <span className="font-bold text-slate-800">{recall.provider}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSendReminder(recall.id, recall.type)}
                  disabled={recall.status === 'Automated Reminder Sent'}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    recall.status === 'Automated Reminder Sent'
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>{recall.status === 'Automated Reminder Sent' ? 'Recall SMS Sent' : 'Send 2-Way Recall Text'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
