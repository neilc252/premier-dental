import React, { useState } from 'react';
import { Patient } from '../../types';
import { FileCheck, UploadCloud, FileText, Image, ShieldCheck, CheckCircle2, Download, Eye, Plus, Sparkles } from 'lucide-react';

interface DocumentCenterViewProps {
  patient: Patient;
}

interface StoredDocument {
  id: string;
  title: string;
  category: 'Consent Form' | 'Insurance Card' | 'X-Ray / Imaging' | 'Patient Intake' | 'Lab Script';
  dateUploaded: string;
  fileSize: string;
  status: 'Signed' | 'Verified' | 'Pending Review';
  fileType: 'PDF' | 'PNG' | 'DICOM';
}

export const DocumentCenterView: React.FC<DocumentCenterViewProps> = ({ patient }) => {
  const [documents, setDocuments] = useState<StoredDocument[]>([
    {
      id: 'doc-1',
      title: 'Signed HIPAA & Informed Consent Form 2026',
      category: 'Consent Form',
      dateUploaded: '2026-08-01',
      fileSize: '1.2 MB',
      status: 'Signed',
      fileType: 'PDF',
    },
    {
      id: 'doc-2',
      title: 'Primary Insurance Card Photo (Front & Back)',
      category: 'Insurance Card',
      dateUploaded: '2026-08-01',
      fileSize: '3.4 MB',
      status: 'Verified',
      fileType: 'PNG',
    },
    {
      id: 'doc-3',
      title: 'Digital Medical History & Oral Health Intake',
      category: 'Patient Intake',
      dateUploaded: '2026-08-01',
      fileSize: '850 KB',
      status: 'Signed',
      fileType: 'PDF',
    },
    {
      id: 'doc-4',
      title: 'Full Mouth X-Ray Series (FMX 18 Views)',
      category: 'X-Ray / Imaging',
      dateUploaded: '2025-09-15',
      fileSize: '14.2 MB',
      status: 'Verified',
      fileType: 'DICOM',
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCat, setNewDocCat] = useState<'Consent Form' | 'Insurance Card' | 'X-Ray / Imaging' | 'Patient Intake'>('Consent Form');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    const newDoc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle,
      category: newDocCat,
      dateUploaded: new Date().toISOString().split('T')[0],
      fileSize: '2.1 MB',
      status: 'Verified',
      fileType: 'PDF',
    };

    setDocuments([newDoc, ...documents]);
    setNewDocTitle('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-950 border border-cyan-800 rounded-2xl flex items-center justify-center text-cyan-300">
            <FileCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Paperless Document Center & Digital Intake</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/80 text-cyan-200 text-xs font-semibold border border-cyan-700">
                E-Signatures & HIPAA Vault
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Dentrix-compatible paperless file vault storing signed consent forms, ID/insurance photos, and DICOM imaging attachments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Form / Document</span>
          </button>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold text-xs">
                  {doc.fileType}
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {doc.status}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{doc.category}</span>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">{doc.title}</h4>
              </div>

              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span className="font-medium text-slate-700">{doc.dateUploaded}</span>
                </div>
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="font-mono text-slate-700">{doc.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer">
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
              <button className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-600" />
                Upload Patient Document
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Driver's License Scan 2026"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newDocCat}
                  onChange={(e: any) => setNewDocCat(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                >
                  <option value="Consent Form">Consent Form</option>
                  <option value="Insurance Card">Insurance Card Photo</option>
                  <option value="Patient Intake">Digital Patient Intake</option>
                  <option value="X-Ray / Imaging">X-Ray / DICOM File</option>
                </select>
              </div>

              <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 space-y-2 cursor-pointer hover:bg-slate-100 transition-all">
                <UploadCloud className="w-8 h-8 text-cyan-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Drag & drop files here or click to browse</p>
                <p className="text-[10px] text-slate-400">Supports PDF, PNG, JPG, DICOM up to 50MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Save & Attach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
