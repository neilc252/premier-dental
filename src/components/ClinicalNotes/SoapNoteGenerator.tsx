import React, { useState } from 'react';
import { Patient, SOAPNote } from '../../types';
import { 
  Sparkles, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  PenTool,
  Loader2
} from 'lucide-react';

interface SoapNoteGeneratorProps {
  patient: Patient;
  onAddSoapNote: (note: SOAPNote) => void;
}

export const SoapNoteGenerator: React.FC<SoapNoteGeneratorProps> = ({
  patient,
  onAddSoapNote,
}) => {
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Clear note draft input fields when switching patient
  React.useEffect(() => {
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
  }, [patient.id]);

  const handleAiGenerateSoap = async () => {
    setIsAiGenerating(true);
    try {
      const activeCondition = patient.conditions[0];
      const res = await fetch('/api/gemini/soap-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: `${patient.firstName} ${patient.lastName}`,
          chiefComplaint: activeCondition?.notes || 'Routine comprehensive oral evaluation',
          clinicalFindings: `Medical Alerts: ${patient.medicalAlerts.map(a => a.title).join(', ') || 'None'}. Probing depths recorded.`,
          teethInvolved: activeCondition ? [`Tooth #${activeCondition.toothNumber}`] : ['Tooth #3'],
          procedureCode: activeCondition?.cdtCode || 'D0120',
        }),
      });

      const data = await res.json();
      if (data.note) {
        // Parse basic markdown text into SOAP fields
        const raw = data.note as string;
        setSubjective(raw.includes('Subjective') ? raw.split('Objective')[0] : raw);
        setObjective(raw.includes('Objective') ? 'O: ' + raw.split('Assessment')[0] : '');
        setAssessment(raw.includes('Assessment') ? 'A: ' + raw.split('Plan')[0] : '');
        setPlan(raw.includes('Plan') ? 'P: ' + raw : '');
      }
    } catch (err) {
      console.error('AI SOAP error:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjective.trim()) return;

    const newNote: SOAPNote = {
      id: `sn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      provider: 'Dr. Michael Chen, DDS',
      subjective,
      objective: objective || 'Objective clinical findings verified.',
      assessment: assessment || 'Assessment complete.',
      plan: plan || 'Treatment plan agreed upon.',
      signed: true,
      aiGenerated: true,
    };

    onAddSoapNote(newNote);
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
  };

  return (
    <div className="space-y-6">
      
      {/* Patient Summary Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-cyan-400 font-bold text-lg flex items-center justify-center font-mono shadow-md">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {patient.firstName} {patient.lastName}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                <span className="font-mono font-semibold text-cyan-700">{patient.chartNumber}</span>
                <span>• DOB: {patient.dob} ({patient.gender})</span>
                <span>• {patient.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-cyan-600" />
              {patient.insuranceProvider}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs">
              Balance: ${patient.balanceDue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Medical Alerts Banner */}
        {patient.medicalAlerts.length > 0 ? (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-800">Critical Medical Alerts:</span>
              <ul className="list-disc pl-4 space-y-0.5">
                {patient.medicalAlerts.map((a) => (
                  <li key={a.id}>
                    <strong className="underline">{a.title}:</strong> {a.notes}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>No critical drug allergies or systemic medical conditions flagged.</span>
          </div>
        )}
      </div>

      {/* SOAP Note Writer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-600" />
              <span>SOAP Clinical Progress Scribe</span>
            </h3>

            <button
              onClick={handleAiGenerateSoap}
              disabled={isAiGenerating}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Drafting Note...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                  <span>AI Assist Draft</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSaveNote} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Subjective (S):</label>
              <textarea
                rows={2}
                placeholder="Patient's chief complaint, symptoms, pain scale, medical history updates..."
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Objective (O):</label>
              <textarea
                rows={2}
                placeholder="Clinical examination, radiographic findings, perio probing depths, cold test response..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Assessment (A):</label>
              <textarea
                rows={2}
                placeholder="Diagnosis, decay classification, periodontal staging..."
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Plan (P):</label>
              <textarea
                rows={2}
                placeholder="Procedures completed today, CDT codes billed, prescriptions, next recall visit..."
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <PenTool className="h-3 w-3 text-cyan-600" />
                <span>Signed as: Dr. Michael Chen, DDS (Timestamped)</span>
              </span>

              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Sign & Commit SOAP Note
              </button>
            </div>
          </form>
        </div>

        {/* Historical SOAP Notes (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Signed Clinical Notes History ({patient.soapNotes.length})
          </h3>

          {patient.soapNotes.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No previous signed SOAP notes on record for this chart.</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {patient.soapNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="font-mono font-bold text-slate-900">{note.date}</span>
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Signed
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                    {note.subjective}
                  </p>
                  
                  {note.objective && (
                    <p className="text-slate-600 italic border-l-2 border-cyan-500 pl-2">
                      {note.objective}
                    </p>
                  )}

                  <div className="text-[10px] text-slate-400 text-right pt-1 font-mono">
                    Provider: {note.provider}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
