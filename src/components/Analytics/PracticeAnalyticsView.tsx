import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, CalendarCheck, Users, Percent, Award, ChevronUp, ChevronDown, Download, Sparkles } from 'lucide-react';

export const PracticeAnalyticsView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'this_month' | 'last_month' | 'year_to_date'>('this_month');

  const kpis = [
    {
      title: 'Gross Production',
      value: timeframe === 'this_month' ? '$142,850.00' : timeframe === 'last_month' ? '$138,400.00' : '$1,120,500.00',
      change: '+12.4%',
      isPositive: true,
      subtext: 'Calculated across 4 active operatories',
    },
    {
      title: 'Net Collections',
      value: timeframe === 'this_month' ? '$136,420.00' : timeframe === 'last_month' ? '$131,200.00' : '$1,085,000.00',
      change: '+9.8%',
      isPositive: true,
      subtext: '95.5% collection ratio vs. production',
    },
    {
      title: 'Case Acceptance Rate',
      value: '78.2%',
      change: '+5.1%',
      isPositive: true,
      subtext: '3-stage treatment plan conversions',
    },
    {
      title: 'Operatory Chair Occupancy',
      value: '88.5%',
      change: '+3.2%',
      isPositive: true,
      subtext: 'Optimal hygiene & restorative utilization',
    },
  ];

  const providerLeaderboard = [
    {
      provider: 'Dr. Michael Chen, DDS',
      role: 'Owner Dentist',
      production: '$78,400.00',
      completedProcedures: 142,
      caseAcceptance: '82%',
    },
    {
      provider: 'Dr. Emily Vance, DMD',
      role: 'Associate Dentist',
      production: '$45,250.00',
      completedProcedures: 98,
      caseAcceptance: '74%',
    },
    {
      provider: 'Hyg. Amanda Torres, RDH',
      role: 'Lead Hygienist',
      production: '$19,200.00',
      completedProcedures: 165,
      caseAcceptance: '91%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-950 border border-purple-800 rounded-2xl flex items-center justify-center text-purple-300">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Practice Analytics & Executive Intelligence</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-900/80 text-purple-200 text-xs font-bold border border-purple-700">
                Live PMS Metrics
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Real-time production, collections, CDT code breakdown, and operatory efficiency tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e: any) => setTimeframe(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-xs focus:outline-hidden"
          >
            <option value="this_month">This Month (August 2026)</option>
            <option value="last_month">Last Month (July 2026)</option>
            <option value="year_to_date">Year To Date (2026)</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Export Analytics Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-0.5 ${
                kpi.isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {kpi.isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
            <p className="text-[11px] text-slate-400 font-medium">{kpi.subtext}</p>
          </div>
        ))}
      </div>

      {/* Provider Performance Leaderboard & Production Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Provider Leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-base">Provider Production & Efficiency Leaderboard</h3>
            </div>
            <span className="text-xs text-slate-500">Live Practice Data</span>
          </div>

          <div className="divide-y divide-slate-100">
            {providerLeaderboard.map((prov, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-slate-50 p-3 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center font-bold text-purple-800 text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{prov.provider}</h4>
                    <p className="text-xs text-slate-500">{prov.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Procedures</span>
                    <span className="text-xs font-bold text-slate-800">{prov.completedProcedures}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Case Accept Rate</span>
                    <span className="text-xs font-bold text-emerald-600">{prov.caseAcceptance}</span>
                  </div>
                  <div className="text-right min-w-[90px]">
                    <span className="text-[10px] text-slate-400 block font-medium">Production</span>
                    <span className="text-sm font-black text-purple-900">{prov.production}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CDT Production Distribution */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
          <h3 className="font-bold text-sm text-purple-300 uppercase tracking-wider">CDT Category Breakdown</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">Restorative (Crowns/Composites)</span>
                <span className="text-purple-300">$64,200 (45%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">Preventive & Hygiene</span>
                <span className="text-cyan-300">$28,500 (20%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">Endodontics & Surgery</span>
                <span className="text-amber-300">$25,800 (18%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">Prosthodontics & Implants</span>
                <span className="text-emerald-300">$24,350 (17%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
