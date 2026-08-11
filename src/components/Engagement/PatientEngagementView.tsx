import React, { useState } from 'react';
import { MessageSquare, Send, Bell, Star, CheckCircle2, Phone, User, Sparkles, Clock, RefreshCw, Calendar, AlertTriangle, Users, ArrowUpRight } from 'lucide-react';
import { Patient } from '../../types';

interface PatientEngagementViewProps {
  patients: Patient[];
  selectedPatient: Patient | null;
}

interface SmsThread {
  id: string;
  patientName: string;
  patientPhone: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: 'practice' | 'patient';
    text: string;
    timestamp: string;
  }[];
}

export const PatientEngagementView: React.FC<PatientEngagementViewProps> = ({
  patients,
  selectedPatient,
}) => {
  const [showHygieneEngine, setShowHygieneEngine] = useState<boolean>(true);
  const [campaignSent, setCampaignSent] = useState<boolean>(false);

  const [threads, setThreads] = useState<SmsThread[]>([
    {
      id: 'thread-1',
      patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'Sarah Jenkins',
      patientPhone: selectedPatient ? selectedPatient.phone : '(555) 234-5678',
      lastMessage: 'I confirmed my appointment for tomorrow at 10 AM. Thanks!',
      timestamp: '10:14 AM',
      unreadCount: 0,
      messages: [
        {
          id: 'm1',
          sender: 'practice',
          text: 'Hi Sarah, this is Premier Dental Suite reminding you of your appointment tomorrow at 10:00 AM. Reply C to confirm or R to reschedule.',
          timestamp: '09:00 AM',
        },
        {
          id: 'm2',
          sender: 'patient',
          text: 'C',
          timestamp: '09:05 AM',
        },
        {
          id: 'm3',
          sender: 'practice',
          text: 'Thank you! Your appointment is confirmed with Dr. Michael Chen, DDS.',
          timestamp: '09:06 AM',
        },
        {
          id: 'm4',
          sender: 'patient',
          text: 'I confirmed my appointment for tomorrow at 10 AM. Thanks!',
          timestamp: '10:14 AM',
        },
      ],
    },
    {
      id: 'thread-2',
      patientName: 'Marcus Vance',
      patientPhone: '(555) 876-5432',
      lastMessage: 'Can I reschedule my prophy to next Friday afternoon?',
      timestamp: 'Yesterday',
      unreadCount: 1,
      messages: [
        {
          id: 'm20',
          sender: 'practice',
          text: 'Hi Marcus, you are due for your 6-month cleaning. Tap here to select a time: https://premierdental.app/book',
          timestamp: 'Yesterday 2:00 PM',
        },
        {
          id: 'm21',
          sender: 'patient',
          text: 'Can I reschedule my prophy to next Friday afternoon?',
          timestamp: 'Yesterday 2:15 PM',
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [replyText, setReplyText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleDispatchHygieneCampaign = () => {
    setCampaignSent(true);
    setToastMsg(`AI Hygiene Retention Campaign dispatched! 28 overdue recall SMS texts sent with 1-click booking links.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'practice' as const,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads(threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: replyText,
          timestamp: 'Just now',
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    }));

    setReplyText('');
    setToastMsg(`SMS dispatched to ${activeThread.patientName} (${activeThread.patientPhone})`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendReviewRequest = () => {
    setToastMsg(`Google Review Request SMS dispatched to ${activeThread.patientName}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">2-WAY SMS GATEWAY ONLINE</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-950 border border-cyan-800 rounded-2xl flex items-center justify-center text-cyan-300">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">2-Way Patient Engagement & SMS Center</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/80 text-cyan-200 text-xs font-semibold border border-cyan-700">
                Automated Reminders & Reviews
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Real-time SMS texting, automated 24h appointment confirmations, and Google review requests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSendReviewRequest}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Star className="w-4 h-4 fill-slate-950" />
            <span>Send Google Review Request</span>
          </button>
        </div>
      </div>

      {/* FEATURE #5: Smart Recall & Automated Hygiene Retention Engine */}
      {showHygieneEngine && (
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-950 rounded-2xl border border-teal-800/80 p-6 text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-teal-900/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-900/80 rounded-2xl border border-teal-700/80 text-teal-300">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Smart Recall & Hygiene Retention Engine</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold border border-teal-500/40">
                    AI Churn Prevention Active
                  </span>
                </div>
                <p className="text-xs text-slate-300/80">
                  Scans patient history for overdue hygiene, unperformed treatment plans, and sends personalized SMS outreach with instant booking links.
                </p>
              </div>
            </div>

            <button
              onClick={handleDispatchHygieneCampaign}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                campaignSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{campaignSent ? 'Hygiene Recall Dispatched (28 Patients) ✓' : 'Dispatch AI Hygiene Campaign'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/90 border border-teal-900/60 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold text-teal-300">
                <span>Overdue Hygiene Recalls</span>
                <Users className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xl font-black font-mono text-white">28 Patients</div>
              <p className="text-[10px] text-slate-400">6+ months since last prophy / perio maintenance</p>
            </div>

            <div className="bg-slate-900/90 border border-teal-900/60 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold text-amber-300">
                <span>Unscheduled Treatment</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black font-mono text-amber-300">$14,250 Pipeline</div>
              <p className="text-[10px] text-slate-400">12 proposed treatment plans pending scheduling</p>
            </div>

            <div className="bg-slate-900/90 border border-teal-900/60 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-300">
                <span>Auto-Booking Conversion</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black font-mono text-emerald-300">41.8% Retention</div>
              <p className="text-[10px] text-slate-400">Patients rebooking via SMS links</p>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column 2-Way Texting Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[580px]">
        
        {/* Threads List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-600" />
              Conversations ({threads.length})
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              SMS Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 pr-1 space-y-1">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                  activeThreadId === thread.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{thread.patientName}</span>
                  <span className={`text-[10px] ${activeThreadId === thread.id ? 'text-slate-400' : 'text-slate-400'}`}>
                    {thread.timestamp}
                  </span>
                </div>
                <p className={`text-[11px] line-clamp-1 ${activeThreadId === thread.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {thread.lastMessage}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Chat Conversation Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center font-bold text-cyan-900 text-xs">
                {activeThread.patientName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{activeThread.patientName}</h4>
                <p className="text-xs text-slate-500">{activeThread.patientPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                2-Way SMS Synced
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {activeThread.messages.map((m) => {
              const isPractice = m.sender === 'practice';
              return (
                <div
                  key={m.id}
                  className={`flex ${isPractice ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-xs space-y-1 ${
                      isPractice
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    <span className={`text-[10px] block text-right font-mono ${isPractice ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendSms} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type SMS reply to patient..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send SMS</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
