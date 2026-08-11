import React from 'react';
import { 
  Activity, 
  Calendar, 
  UserCheck, 
  ClipboardList, 
  CreditCard, 
  Database,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Edit3
} from 'lucide-react';
import { Patient } from '../types';

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
  selectedPatient: Patient | null;
  onClearPatient?: () => void;
  onOpenEditPatient?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  setActiveView,
  selectedPatient,
  onClearPatient,
  onOpenEditPatient,
}) => {
  const navItems = [
    {
      id: 'odontogram',
      label: 'Odontogram & Charting',
      shortLabel: 'Tooth Chart',
      icon: Activity,
      badge: selectedPatient ? `${selectedPatient.conditions.length} Notes` : null,
    },
    {
      id: 'scheduler',
      label: 'Operatory Calendar',
      shortLabel: 'Scheduler',
      icon: Calendar,
      badge: '4 Chairs',
    },
    {
      id: 'patient-chart',
      label: 'Patient Chart & Family File',
      shortLabel: 'Patient Chart',
      icon: UserCheck,
      badge: selectedPatient?.medicalAlerts.length ? `${selectedPatient.medicalAlerts.length} Alerts` : null,
      badgeColor: selectedPatient?.medicalAlerts.length ? 'bg-amber-100 text-amber-800' : undefined,
    },
    {
      id: 'treatment-plan',
      label: 'Treatment Planner',
      shortLabel: 'Treatment Plan',
      icon: ClipboardList,
      badge: selectedPatient ? `${selectedPatient.treatmentPlans.length} Items` : null,
    },
    {
      id: 'billing',
      label: 'Ledgers & Claims',
      shortLabel: 'Billing',
      icon: CreditCard,
      badge: selectedPatient?.balanceDue ? `$${selectedPatient.balanceDue.toFixed(0)}` : null,
      badgeColor: selectedPatient?.balanceDue ? 'bg-rose-100 text-rose-700 font-bold' : undefined,
    },
    {
      id: 'engagement',
      label: 'SMS & Patient Engagement',
      shortLabel: 'SMS Comms',
      icon: MessageSquare,
      badge: '2-Way Text',
      badgeColor: 'bg-cyan-100 text-cyan-800 font-semibold',
    },
    {
      id: 'analytics',
      label: 'Practice Analytics & KPIs',
      shortLabel: 'Analytics',
      icon: BarChart3,
      badge: 'BI Metrics',
      badgeColor: 'bg-purple-100 text-purple-800 font-semibold',
    },
    {
      id: 'migration',
      label: 'Dentrix Sync & Migration',
      shortLabel: 'Dentrix Sync',
      icon: Database,
      badge: 'Migration',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-semibold',
    },
    {
      id: 'user-roles',
      label: 'Admin & Companies',
      shortLabel: 'Admin Area',
      icon: ShieldCheck,
      badge: 'Admin',
      badgeColor: 'bg-purple-900 text-purple-100 font-extrabold border border-purple-700',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Selected Patient Banner if active, or empty indicator if none */}
        {selectedPatient ? (
          <div className="py-2 px-3 my-2 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between text-xs shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-sm text-cyan-300">
                  Active Chart: {selectedPatient.firstName} {selectedPatient.lastName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-800">
                {selectedPatient.chartNumber}
              </span>
              <span className="text-slate-400 hidden md:inline">
                Ins: {selectedPatient.insuranceProvider} ({selectedPatient.policyNumber})
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 sm:mt-0">
              {selectedPatient.medicalAlerts.length > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-800 text-amber-300 px-2.5 py-0.5 rounded-lg font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Alert: {selectedPatient.medicalAlerts[0].title}</span>
                </div>
              )}

              {onOpenEditPatient && (
                <button
                  onClick={onOpenEditPatient}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 font-bold text-[11px] transition-all cursor-pointer shadow-xs"
                  title="Edit patient demographics, insurance & medical alerts"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit Info & Insurance</span>
                </button>
              )}

              {onClearPatient && (
                <button
                  onClick={onClearPatient}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-slate-300 font-bold text-[11px] transition-all cursor-pointer"
                  title="Close active patient chart"
                >
                  Close Chart
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-2 px-3 my-2 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>No Patient Chart Selected — Select a patient from top search bar or directory below to open chart</span>
            </div>
          </div>
        )}

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center justify-between space-x-1 overflow-x-auto py-1.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>

                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
};
