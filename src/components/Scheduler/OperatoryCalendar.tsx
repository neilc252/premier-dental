import React, { useState } from 'react';
import { Appointment, Operatory, Patient } from '../../types';
import { OPERATORIES } from '../../data/mockData';
import { CDT_CODES } from '../../data/cdtCodes';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Timer,
  X,
  Play,
  Check
} from 'lucide-react';

interface OperatoryCalendarProps {
  appointments: Appointment[];
  patients: Patient[];
  activePatientId?: string;
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
}

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export const OperatoryCalendar: React.FC<OperatoryCalendarProps> = ({
  appointments,
  patients,
  activePatientId,
  onAddAppointment,
  onUpdateAppointmentStatus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(activePatientId || patients[0]?.id || '');
  const [filterMode, setFilterMode] = useState<'all' | 'selected'>('all');
  const [selectedOpId, setSelectedOpId] = useState(OPERATORIES[0].id);

  // Sync selectedPatientId when activePatientId changes
  React.useEffect(() => {
    if (activePatientId) {
      setSelectedPatientId(activePatientId);
    }
  }, [activePatientId]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedCdtCode, setSelectedCdtCode] = useState('D2392');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId);
    const cdt = CDT_CODES.find((c) => c.code === selectedCdtCode);
    const op = OPERATORIES.find((o) => o.id === selectedOpId);

    if (!patient || !cdt || !op) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      operatoryId: op.id,
      providerName: op.providerAssigned,
      startTime,
      endTime,
      cdtCode: cdt.code,
      procedureTitle: cdt.description,
      status: 'scheduled',
      notes: appointmentNotes,
      isUrgent,
    };

    onAddAppointment(newApt);
    setShowAddModal(false);
    setAppointmentNotes('');
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'in_chair':
        return 'bg-purple-600 text-white shadow-xs animate-pulse';
      case 'checked_in':
        return 'bg-amber-500 text-white';
      case 'confirmed':
        return 'bg-blue-600 text-white';
      case 'completed':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-cyan-600" />
            <span>Operatory Chair Scheduler</span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800">
              Live Chairs
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage operatory chairs, chair times, provider assignments, and real-time patient check-in status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Patient Schedule Filter Toggle */}
          {activePatientId && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Patients
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('selected')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  filterMode === 'selected'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Selected Patient Only
              </button>
            </div>
          )}

          <button
            onClick={() => {
              if (activePatientId) setSelectedPatientId(activePatientId);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 text-cyan-300" />
            <span>Book Chair Appointment</span>
          </button>
        </div>
      </div>

      {/* Operatories Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {OPERATORIES.map((op) => {
          let opAppointments = appointments.filter((a) => a.operatoryId === op.id);
          if (filterMode === 'selected' && activePatientId) {
            opAppointments = opAppointments.filter((a) => a.patientId === activePatientId);
          }

          return (
            <div
              key={op.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden"
            >
              {/* Op Chair Header */}
              <div className="bg-slate-900 text-white p-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-cyan-300">{op.name}</h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    {op.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" />
                  <span>{op.providerAssigned}</span>
                </p>
              </div>

              {/* Appointments List for this Chair */}
              <div className="p-3 flex-1 space-y-3 min-h-[360px] bg-slate-50/50">
                {opAppointments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <Clock className="h-8 w-8 mb-2 stroke-1 text-slate-300" />
                    <p className="text-xs">No appointments scheduled in this operatory chair.</p>
                  </div>
                ) : (
                  opAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className={`p-3.5 rounded-xl border bg-white shadow-2xs transition-all ${
                        apt.status === 'in_chair'
                          ? 'border-purple-300 ring-2 ring-purple-400/50 bg-purple-50/30'
                          : apt.isUrgent
                          ? 'border-rose-300 bg-rose-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Time & Status Row */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-mono text-slate-900 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {apt.startTime} - {apt.endTime}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getStatusBadge(
                            apt.status
                          )}`}
                        >
                          {apt.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Patient Name */}
                      <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                        <span>{apt.patientName}</span>
                        {apt.isUrgent && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                            Urgent
                          </span>
                        )}
                      </div>

                      {/* Procedure Code & Description */}
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-mono">
                        <span className="font-bold text-cyan-700">{apt.cdtCode}</span> - {apt.procedureTitle}
                      </p>

                      {apt.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-100/80 p-1.5 rounded">
                          "{apt.notes}"
                        </p>
                      )}

                      {/* Interactive Status Transition Pipeline */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        {apt.status === 'scheduled' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'confirmed')}
                            className="w-full py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold cursor-pointer"
                          >
                            Mark Confirmed
                          </button>
                        )}

                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'checked_in')}
                            className="w-full py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold cursor-pointer"
                          >
                            Check-In Patient
                          </button>
                        )}

                        {apt.status === 'checked_in' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'in_chair')}
                            className="w-full py-1 rounded bg-purple-600 text-white font-bold hover:bg-purple-500 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" /> Seated In Chair
                          </button>
                        )}

                        {apt.status === 'in_chair' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                            className="w-full py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-500 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="h-3 w-3" /> Complete Visit
                          </button>
                        )}

                        {apt.status === 'completed' && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Billed & Completed
                          </span>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Book Operatory Chair Appointment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Patient:</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.chartNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Operatory Chair:</label>
                <select
                  value={selectedOpId}
                  onChange={(e) => setSelectedOpId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                >
                  {OPERATORIES.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} - {o.providerAssigned}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Start Time:</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={`start-${t}`} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">End Time:</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={`end-${t}`} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Planned CDT Procedure:</label>
                <select
                  value={selectedCdtCode}
                  onChange={(e) => setSelectedCdtCode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono text-slate-800"
                >
                  {CDT_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.description} (${c.defaultFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Chair Notes:</label>
                <input
                  type="text"
                  placeholder="e.g. Needs topical numbing 10 min prior"
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgent-check"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                />
                <label htmlFor="urgent-check" className="text-xs font-semibold text-rose-700">
                  Mark as Emergency / Urgent Appointment
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg shadow-md hover:bg-slate-800"
                >
                  Confirm & Schedule
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
