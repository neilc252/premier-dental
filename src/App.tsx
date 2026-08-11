import React, { useState, useEffect } from 'react';
import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS } from './data/mockData';
import { Patient, ToothCondition, PerioProbeData, TreatmentPlanItem, Appointment, SOAPNote } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ToothChart } from './components/Odontogram/ToothChart';
import { PerioChart } from './components/Odontogram/PerioChart';
import { OperatoryCalendar } from './components/Scheduler/OperatoryCalendar';
import { SoapNoteGenerator } from './components/ClinicalNotes/SoapNoteGenerator';
import { TreatmentPlanView } from './components/TreatmentPlan/TreatmentPlanView';
import { BillingLedgerView } from './components/Billing/BillingLedgerView';
import { DentrixMigrationHub } from './components/Migration/DentrixMigrationHub';
import { UserRolesManagement } from './components/Admin/UserRolesManagement';
import { PatientChartHub } from './components/PatientChart/PatientChartHub';
import { PatientEngagementView } from './components/Engagement/PatientEngagementView';
import { PracticeAnalyticsView } from './components/Analytics/PracticeAnalyticsView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { NewPatientModal } from './components/NewPatientModal';
import { EditPatientModal } from './components/EditPatientModal';
import { StaffLoginModal, StaffUser } from './components/StaffLoginModal';
import { PortalAuthScreen } from './components/Auth/PortalAuthScreen';
import { LandingPage } from './components/Home/LandingPage';
import { NoPatientSelectedView } from './components/NoPatientSelectedView';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [activeView, setActiveView] = useState<string>('odontogram');
  const [showAiAssist, setShowAiAssist] = useState<boolean>(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState<boolean>(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState<boolean>(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showStaffLoginModal, setShowStaffLoginModal] = useState<boolean>(false);
  const [showPortalAuth, setShowPortalAuth] = useState<boolean>(false);
  const [hasEnteredPortal, setHasEnteredPortal] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('premier_dental_theme');
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('premier_dental_theme', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Sync with Firestore
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'patients'), (snapshot) => {
        if (!snapshot.empty) {
          const firestorePatients: Patient[] = [];
          snapshot.forEach((docSnap) => {
            firestorePatients.push(docSnap.data() as Patient);
          });
          // Merge with initial patients so default demo charts aren't lost if partial
          setPatients((prev) => {
            const map = new Map<string, Patient>();
            prev.forEach((p) => map.set(p.id, p));
            firestorePatients.forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn('Firestore offline or sync note:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore init note:', e);
    }
  }, []);

  const [currentStaff, setCurrentStaff] = useState<StaffUser>({
    id: 'staff-1',
    userNumber: 'USR-1002',
    companyId: 'CMP-8002',
    companyName: 'BrightSmile Dental Suite',
    name: 'Dr. Alexander Chen, DDS',
    title: 'Lead Cosmetic & Restorative Dentist',
    role: 'Practice Owner',
    avatar: 'AC',
    npiNumber: 'NPI-1840291083',
    isLoggedIn: true,
  });

  const handleLogout = () => {
    setCurrentStaff({
      id: 'logged-out',
      userNumber: 'USR-GUEST',
      companyId: 'CMP-GUEST',
      companyName: 'Not Logged In',
      name: 'Logged Out',
      title: 'Signed Out Session',
      role: 'Guest' as any,
      avatar: 'LO',
      npiNumber: 'SYS-LOGOUT',
      isLoggedIn: false,
    });
    setShowPortalAuth(true);
  };

  // Filter patients by active staff's company ID (Multi-Tenant Isolation)
  const companyPatients = React.useMemo(() => {
    if (!currentStaff || !currentStaff.companyId || currentStaff.companyId === 'CMP-GUEST') {
      return [];
    }
    // Global view for Premier SaaS Admin Headquarters
    if (currentStaff.companyId === 'CMP-8001' || currentStaff.role === 'SaaS Admin') {
      return patients;
    }
    return patients.filter((p) => p.companyId === currentStaff.companyId);
  }, [patients, currentStaff]);

  // Filter appointments for active company
  const companyAppointments = React.useMemo(() => {
    if (currentStaff.companyId === 'CMP-8001' || currentStaff.role === 'SaaS Admin') {
      return appointments;
    }
    const companyPatientIds = new Set(companyPatients.map((p) => p.id));
    return appointments.filter((a) => companyPatientIds.has(a.patientId));
  }, [appointments, companyPatients, currentStaff]);

  // Keep active patient selection in sync with current company roster
  useEffect(() => {
    if (companyPatients.length > 0) {
      if (!companyPatients.some((p) => p.id === selectedPatientId)) {
        setSelectedPatientId(companyPatients[0].id);
      }
    } else {
      setSelectedPatientId('');
    }
  }, [currentStaff.companyId, companyPatients]);

  const activePatient = companyPatients.find((p) => p.id === selectedPatientId) || null;

  // Handler: Add Tooth Condition
  const handleAddCondition = (condition: ToothCondition) => {
    if (!activePatient) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            conditions: [...p.conditions, condition],
          };
        }
        return p;
      })
    );
  };

  // Handler: Remove Condition
  const handleRemoveCondition = (conditionId: string) => {
    if (!activePatient) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            conditions: p.conditions.filter((c) => c.id !== conditionId),
          };
        }
        return p;
      })
    );
  };

  // Handler: Update Perio Data
  const handleUpdatePerioData = (toothNum: number, perioData: PerioProbeData) => {
    if (!activePatient) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            perioChart: {
              ...p.perioChart,
              [toothNum]: perioData,
            },
          };
        }
        return p;
      })
    );
  };

  // Handler: Add Treatment Plan Item
  const handleAddTreatmentItem = (item: TreatmentPlanItem) => {
    if (!activePatient) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            treatmentPlans: [...p.treatmentPlans, item],
          };
        }
        return p;
      })
    );
  };

  // Handler: Add Treatment Plan Item directly from Odontogram
  const handleAddTreatmentPlanFromOdontogram = (cdtCode: string, toothNumber: number, surfaces: any[]) => {
    if (!activePatient) return;
    const newItem: TreatmentPlanItem = {
      id: `tp-${Date.now()}`,
      toothNumber,
      surfaces,
      cdtCode,
      description: `CDT ${cdtCode} Treatment`,
      fee: 210,
      insuranceEst: 160,
      patientResp: 50,
      phase: 1,
      status: 'proposed',
      dateAdded: new Date().toISOString().split('T')[0],
    };
    handleAddTreatmentItem(newItem);
  };

  // Handler: Update Treatment Item Status
  const handleUpdateTreatmentStatus = (itemId: string, status: TreatmentPlanItem['status']) => {
    if (!activePatient) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            treatmentPlans: p.treatmentPlans.map((tp) => (tp.id === itemId ? { ...tp, status } : tp)),
          };
        }
        return p;
      })
    );
  };

  // Handler: Remove Treatment Item
  const handleRemoveTreatmentItem = (itemId: string) => {
    if (!activePatient) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            treatmentPlans: p.treatmentPlans.filter((tp) => tp.id !== itemId),
          };
        }
        return p;
      })
    );
  };

  // Handler: Add SOAP Note
  const handleAddSoapNote = (note: SOAPNote) => {
    if (!activePatient) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            soapNotes: [note, ...p.soapNotes],
          };
        }
        return p;
      })
    );
  };

  // Handler: Record Payment
  const handleRecordPayment = (amount: number) => {
    if (!activePatient) return;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            balanceDue: Math.max(0, p.balanceDue - amount),
          };
        }
        return p;
      })
    );
  };

  // Handler: Add Appointment
  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [appointment, ...prev]);
  };

  // Handler: Update Appointment Status
  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  // Handler: Import Patients from Dentrix Migration
  const handleImportPatients = (newPatients: Patient[]) => {
    setPatients((prev) => [...newPatients, ...prev]);
    if (newPatients.length > 0) {
      setSelectedPatientId(newPatients[0].id);
    }
    // Save to Firestore
    newPatients.forEach((p) => {
      try {
        setDoc(doc(db, 'patients', p.id), p).catch((e) => console.warn('Firestore setDoc note:', e));
      } catch (err) {
        console.warn('Firestore setDoc note:', err);
      }
    });
  };

  // Handler: Add Single New Patient
  const handleAddNewPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
    try {
      setDoc(doc(db, 'patients', newPatient.id), newPatient).catch((e) => console.warn('Firestore setDoc note:', e));
    } catch (err) {
      console.warn('Firestore setDoc note:', err);
    }
  };

  // Handler: Update Existing Patient Record
  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    try {
      setDoc(doc(db, 'patients', updatedPatient.id), updatedPatient).catch((e) => console.warn('Firestore setDoc note:', e));
    } catch (err) {
      console.warn('Firestore setDoc note:', err);
    }
  };

  // Handler: Delete Patient Record
  const handleDeletePatient = (patientId: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    if (selectedPatientId === patientId) {
      setSelectedPatientId('');
    }
  };

  // Handler: Open Edit Patient Modal
  const handleOpenEditPatient = (p?: Patient) => {
    const target = p || activePatient;
    if (target) {
      setEditingPatient(target);
      setShowEditPatientModal(true);
    }
  };

  if (!hasEnteredPortal) {
    if (showPortalAuth) {
      return (
        <PortalAuthScreen
          onLoginSuccess={(staff) => {
            setCurrentStaff(staff);
            setHasEnteredPortal(true);
            setShowPortalAuth(false);
          }}
          onCancel={() => setShowPortalAuth(false)}
        />
      );
    }

    return (
      <LandingPage
        onOpenLogin={() => setShowPortalAuth(true)}
        onOpenRegister={() => setShowPortalAuth(true)}
        onLaunchDemoAsRole={(roleUser) => {
          setCurrentStaff(roleUser);
          setHasEnteredPortal(true);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (showPortalAuth) {
    return (
      <PortalAuthScreen
        onLoginSuccess={(staff) => {
          setCurrentStaff(staff);
          setHasEnteredPortal(true);
          setShowPortalAuth(false);
        }}
        onCancel={() => setShowPortalAuth(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Brand Header */}
      <Header
        patients={companyPatients}
        selectedPatient={activePatient}
        onSelectPatient={(p) => setSelectedPatientId(p.id)}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAiAssist={() => setShowAiAssist(true)}
        onOpenNewPatient={() => setShowNewPatientModal(true)}
        onOpenEditPatient={handleOpenEditPatient}
        onOpenStaffLogin={() => setShowStaffLoginModal(true)}
        onOpenPortalAuth={() => setShowPortalAuth(true)}
        onGoHome={() => setHasEnteredPortal(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentStaff={currentStaff}
        onLogout={handleLogout}
      />

      {/* Navigation Bar */}
      <Navigation
        activeView={activeView}
        setActiveView={setActiveView}
        selectedPatient={activePatient}
        onClearPatient={() => setSelectedPatientId('')}
        onOpenEditPatient={handleOpenEditPatient}
      />

      {/* View Switcher Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeView === 'odontogram' && (
          activePatient ? (
            <div className="space-y-6">
              <ToothChart
                patient={activePatient}
                onAddCondition={handleAddCondition}
                onRemoveCondition={handleRemoveCondition}
                onAddTreatmentPlan={handleAddTreatmentPlanFromOdontogram}
              />
              <PerioChart
                patient={activePatient}
                onUpdatePerioData={handleUpdatePerioData}
              />
            </div>
          ) : (
            <NoPatientSelectedView
              patients={companyPatients}
              onSelectPatient={(p) => setSelectedPatientId(p.id)}
              onOpenNewPatient={() => setShowNewPatientModal(true)}
              onOpenEditPatient={handleOpenEditPatient}
            />
          )
        )}

        {activeView === 'scheduler' && (
          <OperatoryCalendar
            appointments={companyAppointments}
            patients={companyPatients}
            activePatientId={activePatient?.id}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          />
        )}

        {activeView === 'patient-chart' && (
          activePatient ? (
            <PatientChartHub
              patient={activePatient}
              onAddSoapNote={handleAddSoapNote}
              onOpenEditPatient={handleOpenEditPatient}
            />
          ) : (
            <NoPatientSelectedView
              patients={companyPatients}
              onSelectPatient={(p) => setSelectedPatientId(p.id)}
              onOpenNewPatient={() => setShowNewPatientModal(true)}
              onOpenEditPatient={handleOpenEditPatient}
            />
          )
        )}

        {activeView === 'treatment-plan' && (
          activePatient ? (
            <TreatmentPlanView
              patient={activePatient}
              onAddTreatmentItem={handleAddTreatmentItem}
              onUpdateTreatmentStatus={handleUpdateTreatmentStatus}
              onRemoveTreatmentItem={handleRemoveTreatmentItem}
            />
          ) : (
            <NoPatientSelectedView
              patients={companyPatients}
              onSelectPatient={(p) => setSelectedPatientId(p.id)}
              onOpenNewPatient={() => setShowNewPatientModal(true)}
              onOpenEditPatient={handleOpenEditPatient}
            />
          )
        )}

        {activeView === 'billing' && (
          activePatient ? (
            <BillingLedgerView
              patient={activePatient}
              onRecordPayment={handleRecordPayment}
            />
          ) : (
            <NoPatientSelectedView
              patients={companyPatients}
              onSelectPatient={(p) => setSelectedPatientId(p.id)}
              onOpenNewPatient={() => setShowNewPatientModal(true)}
              onOpenEditPatient={handleOpenEditPatient}
            />
          )
        )}

        {activeView === 'engagement' && (
          <PatientEngagementView
            patients={companyPatients}
            selectedPatient={activePatient}
          />
        )}

        {activeView === 'analytics' && (
          <PracticeAnalyticsView />
        )}

        {activeView === 'migration' && (
          <DentrixMigrationHub
            onImportPatients={handleImportPatients}
            currentStaff={currentStaff}
          />
        )}

        {activeView === 'user-roles' && (
          <UserRolesManagement
            currentStaff={currentStaff}
            onSelectStaff={(staff) => setCurrentStaff(staff)}
          />
        )}

      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={showAiAssist}
        onClose={() => setShowAiAssist(false)}
      />

      {/* New Patient Registration Modal */}
      <NewPatientModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        onAddPatient={handleAddNewPatient}
        currentStaff={currentStaff}
      />

      {/* Edit Patient Info & Insurance Modal */}
      <EditPatientModal
        isOpen={showEditPatientModal}
        onClose={() => setShowEditPatientModal(false)}
        patient={editingPatient}
        onUpdatePatient={handleUpdatePatient}
        onDeletePatient={handleDeletePatient}
      />

      {/* Staff Portal / Authentication Modal */}
      <StaffLoginModal
        isOpen={showStaffLoginModal}
        onClose={() => setShowStaffLoginModal(false)}
        currentStaff={currentStaff}
        onSelectStaff={(staff) => setCurrentStaff(staff)}
        onLogout={handleLogout}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-200">Premier</span> • Next-Gen Dental Practice Management System (PMS)
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Dentrix G7 API Compatible</span>
            <span>•</span>
            <span>ADA CDT 2026 Compliant</span>
            <span>•</span>
            <span>HIPAA Encryption</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
