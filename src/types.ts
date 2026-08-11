export type ToothNumber = number; // 1-32 for Adult, 101-120 mapped to A-T for Pediatric

export type ToothSurface = 'M' | 'D' | 'O' | 'F' | 'L' | 'I' | 'B' | 'P'; // Mesial, Distal, Occlusal, Facial, Lingual, Incisal, Buccal, Palatal

export type ToothConditionType = 
  | 'caries' 
  | 'amalgam' 
  | 'composite' 
  | 'crown' 
  | 'rct' 
  | 'implant' 
  | 'missing' 
  | 'extracted' 
  | 'bridge' 
  | 'sealant' 
  | 'veneer' 
  | 'watch'
  | 'healthy';

export type ConditionStatus = 'existing' | 'proposed' | 'in_progress' | 'completed';

export interface ToothCondition {
  id: string;
  toothNumber: ToothNumber;
  surfaces: ToothSurface[];
  type: ToothConditionType;
  status: ConditionStatus;
  cdtCode?: string;
  notes?: string;
  dateRecorded: string;
}

export interface PerioProbeData {
  toothNumber: ToothNumber;
  facialDepths: [number, number, number]; // MB, B, DB
  lingualDepths: [number, number, number]; // ML, L, DL
  bleeding: boolean;
  suppuration: boolean;
  mobility: 0 | 1 | 2 | 3;
}

export interface CDTCode {
  code: string;
  category: 'Diagnostic' | 'Preventive' | 'Restorative' | 'Endodontics' | 'Periodontics' | 'Prosthodontics' | 'Oral Surgery' | 'Orthodontics';
  description: string;
  defaultFee: number;
  avgInsuranceEst: number;
  durationMin: number;
}

export interface TreatmentPlanItem {
  id: string;
  toothNumber?: ToothNumber;
  surfaces?: ToothSurface[];
  cdtCode: string;
  description: string;
  fee: number;
  insuranceEst: number;
  patientResp: number;
  phase: 1 | 2 | 3;
  status: 'proposed' | 'accepted' | 'scheduled' | 'completed';
  dateAdded: string;
}

export interface MedicalAlert {
  id: string;
  type: 'allergy' | 'medication' | 'condition' | 'premed';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  notes: string;
}

export interface SOAPNote {
  id: string;
  date: string;
  provider: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  aiGenerated?: boolean;
  signed: boolean;
}

export interface CompanyAccount {
  companyId: string; // e.g. "CMP-8002"
  companyName: string; // e.g. "BrightSmile Dental Suite"
  taxIdEin: string; // e.g. "EIN-94-382910"
  facilityNpi: string; // e.g. "NPI-1029482019"
  planTier: 'Enterprise Multi-Practice' | 'Standard Practice' | 'SaaS Headquarters';
  registeredUsersCount: number;
  primaryContactEmail: string;
  primaryContactName?: string;
  primaryContactPhone?: string;
  registrationCode: string; // e.g. "REG-8002" or "SEC-9824" (Provided by SaaS application owner team for registration)
  status: 'Active' | 'Trial' | 'Suspended';
  createdDate: string;
}

export interface Patient {
  id: string;
  userNumber: string; // e.g. "USR-9001"
  companyId: string; // e.g. "CMP-8002"
  chartNumber: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  medicalAlerts: MedicalAlert[];
  conditions: ToothCondition[];
  perioChart: Record<number, PerioProbeData>;
  treatmentPlans: TreatmentPlanItem[];
  soapNotes: SOAPNote[];
  lastVisit: string;
  nextRecall: string;
  balanceDue: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  operatoryId: string;
  providerName: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  cdtCode: string;
  procedureTitle: string;
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_chair' | 'completed' | 'no_show';
  notes?: string;
  isUrgent?: boolean;
}

export interface Operatory {
  id: string;
  name: string;
  type: 'Restorative' | 'Hygiene' | 'Surgical' | 'Specialty';
  providerAssigned: string;
}

export interface DentrixMigrationBatch {
  importId: string;
  sourceSystem: 'Dentrix G7' | 'Dentrix Enterprise' | 'Eaglesoft' | 'Open Dental';
  fileName: string;
  timestamp: string;
  patientRecordsFound: number;
  chartsMapped: number;
  cdtCodesNormalized: number;
  status: 'ready' | 'processing' | 'completed';
  samplePatients: {
    dentrixId: string;
    name: string;
    teethChartedCount: number;
    ledgerBalance: number;
  }[];
}
