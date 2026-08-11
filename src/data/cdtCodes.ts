import { CDTCode } from '../types';

export const CDT_CODES: CDTCode[] = [
  // Diagnostic
  { code: 'D0120', category: 'Diagnostic', description: 'Periodic Oral Evaluation - Established Patient', defaultFee: 75, avgInsuranceEst: 75, durationMin: 20 },
  { code: 'D0150', category: 'Diagnostic', description: 'Comprehensive Oral Evaluation - New Patient', defaultFee: 120, avgInsuranceEst: 100, durationMin: 30 },
  { code: 'D0210', category: 'Diagnostic', description: 'Intraoral - Full Mouth Series Radiographs', defaultFee: 180, avgInsuranceEst: 160, durationMin: 20 },
  { code: 'D0274', category: 'Diagnostic', description: 'Bitewings - Four Radiographic Images', defaultFee: 85, avgInsuranceEst: 85, durationMin: 15 },
  
  // Preventive
  { code: 'D1110', category: 'Preventive', description: 'Prophylaxis - Adult (Dental Cleaning)', defaultFee: 110, avgInsuranceEst: 110, durationMin: 45 },
  { code: 'D1206', category: 'Preventive', description: 'Topical Application of Fluoride Varnish', defaultFee: 45, avgInsuranceEst: 35, durationMin: 10 },
  { code: 'D1351', category: 'Preventive', description: 'Dental Sealant - Per Tooth', defaultFee: 60, avgInsuranceEst: 50, durationMin: 15 },

  // Restorative
  { code: 'D2140', category: 'Restorative', description: 'Amalgam - One Surface, Primary or Permanent', defaultFee: 165, avgInsuranceEst: 130, durationMin: 30 },
  { code: 'D2391', category: 'Restorative', description: 'Resin-Based Composite - One Surface, Posterior', defaultFee: 210, avgInsuranceEst: 165, durationMin: 30 },
  { code: 'D2392', category: 'Restorative', description: 'Resin-Based Composite - Two Surfaces, Posterior', defaultFee: 275, avgInsuranceEst: 215, durationMin: 45 },
  { code: 'D2393', category: 'Restorative', description: 'Resin-Based Composite - Three Surfaces, Posterior', defaultFee: 340, avgInsuranceEst: 260, durationMin: 45 },
  { code: 'D2750', category: 'Restorative', description: 'Crown - Porcelain Fused to High Noble Metal', defaultFee: 1250, avgInsuranceEst: 750, durationMin: 60 },
  { code: 'D2950', category: 'Restorative', description: 'Core Buildup, Including Any Pins', defaultFee: 310, avgInsuranceEst: 200, durationMin: 30 },

  // Endodontics
  { code: 'D3310', category: 'Endodontics', description: 'Endodontic Therapy - Anterior Tooth (Root Canal)', defaultFee: 890, avgInsuranceEst: 600, durationMin: 60 },
  { code: 'D3320', category: 'Endodontics', description: 'Endodontic Therapy - Premolar Tooth', defaultFee: 1020, avgInsuranceEst: 700, durationMin: 75 },
  { code: 'D3330', category: 'Endodontics', description: 'Endodontic Therapy - Molar Tooth', defaultFee: 1280, avgInsuranceEst: 850, durationMin: 90 },

  // Periodontics
  { code: 'D4210', category: 'Periodontics', description: 'Gingivectomy or Gingivoplasty - 4+ Teeth Per Quad', defaultFee: 480, avgInsuranceEst: 300, durationMin: 45 },
  { code: 'D4341', category: 'Periodontics', description: 'Periodontal Scaling & Root Planing - 4+ Teeth Quad', defaultFee: 310, avgInsuranceEst: 230, durationMin: 60 },

  // Oral Surgery & Implants
  { code: 'D6010', category: 'Oral Surgery', description: 'Surgical Placement of Implant Body', defaultFee: 2100, avgInsuranceEst: 1000, durationMin: 90 },
  { code: 'D7140', category: 'Oral Surgery', description: 'Extraction, Erupted Tooth or Exposed Root', defaultFee: 220, avgInsuranceEst: 170, durationMin: 30 },
  { code: 'D7210', category: 'Oral Surgery', description: 'Surgical Removal of Erupted Tooth Requiring Bone Removal', defaultFee: 390, avgInsuranceEst: 280, durationMin: 45 },
];
