import React, { useState } from 'react';
import { Patient } from '../../types';
import { CDT_CODES } from '../../data/cdtCodes';
import { 
  CreditCard, 
  FileCheck, 
  DollarSign, 
  Printer, 
  CheckCircle2, 
  Download,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface BillingLedgerViewProps {
  patient: Patient;
  onRecordPayment: (amount: number) => void;
}

export const BillingLedgerView: React.FC<BillingLedgerViewProps> = ({
  patient,
  onRecordPayment,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>('50.00');
  const [showAdaClaim, setShowAdaClaim] = useState<boolean>(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(paymentAmount);
    if (!isNaN(val) && val > 0) {
      onRecordPayment(val);
      setPaymentAmount('0.00');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Summary Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-cyan-600" />
            <span>Patient Account Ledger & Billing</span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800">
              CDT Itemized Ledger
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review itemized charges, generate standard ADA Dental Claim forms, and post patient copay payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdaClaim(!showAdaClaim)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <FileCheck className="h-4 w-4 text-cyan-300" />
            <span>{showAdaClaim ? 'Hide ADA Claim Preview' : 'Generate ADA Claim Form'}</span>
          </button>
        </div>
      </div>

      {/* Main Ledger Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ledger Table (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Patient Billing Ledger</h3>
            <span className="text-xs text-slate-500 font-mono">
              Policy #: {patient.policyNumber} ({patient.insuranceProvider})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-y border-slate-200 font-bold">
                  <th className="p-3">Date</th>
                  <th className="p-3">CDT Code</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Fee</th>
                  <th className="p-3 text-right">Ins. Paid</th>
                  <th className="p-3 text-right">Pat. Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patient.treatmentPlans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 text-xs italic bg-slate-50/50">
                      No billed CDT ledger charges recorded for {patient.firstName} {patient.lastName}.
                    </td>
                  </tr>
                ) : (
                  patient.treatmentPlans.map((tp) => (
                    <tr key={tp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono text-slate-500">{tp.dateAdded}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{tp.cdtCode}</td>
                      <td className="p-3 text-slate-700">{tp.description}</td>
                      <td className="p-3 text-right font-mono text-slate-800">${tp.fee.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono text-emerald-600">-${tp.insuranceEst.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ${tp.patientResp.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment & Co-pay posting (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Post Patient Payment
          </h3>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Outstanding Balance</div>
            <div className="text-2xl font-black font-mono text-cyan-300">
              ${patient.balanceDue.toFixed(2)}
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Payment Amount ($):</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Post Receipt & Update Balance</span>
            </button>
          </form>
        </div>

      </div>

      {/* ADA Dental Claim Preview Box */}
      {showAdaClaim && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                ADA Dental Claim Form (J430)
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                BrightSmile Dental Suite • NPI: 1992019280 • Tax ID: 91-0029102
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Print ADA Claim
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono border p-4 rounded-xl bg-slate-50">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Insured Name:</span>
              <strong className="text-slate-900">{patient.firstName} {patient.lastName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Payer / Carrier:</span>
              <strong className="text-slate-900">{patient.insuranceProvider}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Policy #:</span>
              <strong className="text-slate-900">{patient.policyNumber}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Group #:</span>
              <strong className="text-slate-900">{patient.groupNumber}</strong>
            </div>
          </div>

          <div className="text-xs space-y-2">
            <h4 className="font-bold text-slate-900">Billed Services:</h4>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                  <tr>
                    <th className="p-2">Line</th>
                    <th className="p-2">Tooth</th>
                    <th className="p-2">CDT</th>
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {patient.treatmentPlans.map((tp, idx) => (
                    <tr key={tp.id}>
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">#{tp.toothNumber || '—'}</td>
                      <td className="p-2 font-bold">{tp.cdtCode}</td>
                      <td className="p-2">{tp.description}</td>
                      <td className="p-2 text-right">${tp.fee.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
