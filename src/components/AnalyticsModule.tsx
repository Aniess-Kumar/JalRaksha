import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Droplets, 
  Building2, 
  Route, 
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { Community, WaterSource, HealthFacility, SanitationFacility } from '../types';
import { TabId } from './Navbar';
import { ModuleHeader } from './ModuleHeader';

interface AnalyticsModuleProps {
  communities: Community[];
  waterSources: WaterSource[];
  healthFacilities: HealthFacility[];
  sanitationFacilities: SanitationFacility[];
  onNavigateTab?: (tab: TabId) => void;
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  communities,
  waterSources,
  healthFacilities,
  sanitationFacilities,
  onNavigateTab,
}) => {
  // 1. Population exposed by priority level
  const priorityPop = {
    CRITICAL: communities.filter((c) => c.priorityCategory === 'CRITICAL').reduce((acc, c) => acc + c.exposedPopulation, 0),
    HIGH: communities.filter((c) => c.priorityCategory === 'HIGH').reduce((acc, c) => acc + c.exposedPopulation, 0),
    MODERATE: communities.filter((c) => c.priorityCategory === 'MODERATE').reduce((acc, c) => acc + c.exposedPopulation, 0),
    LOW: communities.filter((c) => c.priorityCategory === 'LOW').reduce((acc, c) => acc + c.exposedPopulation, 0),
  };
  const totalExposedPop = Object.values(priorityPop).reduce((a, b) => a + b, 0);

  // 2. Water sources affected vs functional
  const waterStatusCounts = {
    Submerged: waterSources.filter((w) => w.status === 'Submerged').length,
    Contaminated: waterSources.filter((w) => w.status === 'Contaminated').length,
    Damaged: waterSources.filter((w) => w.status === 'Damaged').length,
    Operational: waterSources.filter((w) => w.status === 'Operational').length,
    Standby: waterSources.filter((w) => w.status === 'Standby').length,
  };

  // 3. Facility accessibility breakdown
  const accessCounts = {
    'SEVERELY DISRUPTED': communities.filter((c) => c.roadAccessibility === 'SEVERELY DISRUPTED').length,
    'LIMITED': communities.filter((c) => c.roadAccessibility === 'LIMITED').length,
    'ACCESSIBLE': communities.filter((c) => c.roadAccessibility === 'ACCESSIBLE').length,
  };

  // 4. Priority Score Histogram Bins
  const scoreBins = [
    { label: '0 - 20', count: communities.filter((c) => c.priorityScore < 20).length, color: 'bg-cyan-600' },
    { label: '20 - 40', count: communities.filter((c) => c.priorityScore >= 20 && c.priorityScore < 40).length, color: 'bg-cyan-500' },
    { label: '40 - 60', count: communities.filter((c) => c.priorityScore >= 40 && c.priorityScore < 60).length, color: 'bg-yellow-500' },
    { label: '60 - 80', count: communities.filter((c) => c.priorityScore >= 60 && c.priorityScore < 80).length, color: 'bg-amber-500' },
    { label: '80 - 100', count: communities.filter((c) => c.priorityScore >= 80).length, color: 'bg-red-600' },
  ];
  const maxBinCount = Math.max(...scoreBins.map((b) => b.count), 1);

  // 5. District Breakdown
  const sunsariComm = communities.filter((c) => c.district === 'Sunsari');
  const saptariComm = communities.filter((c) => c.district === 'Saptari');

  const sunsariPop = sunsariComm.reduce((acc, c) => acc + c.exposedPopulation, 0);
  const saptariPop = saptariComm.reduce((acc, c) => acc + c.exposedPopulation, 0);

  return (
    <div className="w-full">
      {onNavigateTab && <ModuleHeader category="science" currentTab="analytics" onNavigateTab={onNavigateTab} />}
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          Disaster Situation Analytics & Exposure Metrics
        </h2>
        <p className="text-xs text-slate-400">
          Aggregated quantitative assessments across population demographics, infrastructure vulnerabilities, and spatial isolation
        </p>
      </div>

      {/* Top 4 Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Total Exposed Pop</span>
          <div className="text-2xl font-black text-amber-300">{totalExposedPop.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Living in active flood inundation zones</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Critical Population</span>
          <div className="text-2xl font-black text-red-400">{priorityPop.CRITICAL.toLocaleString()}</div>
          <p className="text-[10px] text-red-400/80">Immediate drinking water risk</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Drinking Water Down</span>
          <div className="text-2xl font-black text-cyan-400">
            {waterStatusCounts.Submerged + waterStatusCounts.Contaminated + waterStatusCounts.Damaged}
            <span className="text-xs text-slate-500 font-normal"> / {waterSources.length} assets</span>
          </div>
          <p className="text-[10px] text-slate-500">Submerged, contaminated or broken</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Isolated Settlements</span>
          <div className="text-2xl font-black text-rose-400">
            {accessCounts['SEVERELY DISRUPTED']}
            <span className="text-xs text-slate-500 font-normal"> / {communities.length}</span>
          </div>
          <p className="text-[10px] text-rose-400/80">Require boat / airlift convoy</p>
        </div>
      </div>

      {/* Grid: 4 Analytic Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Chart 1: Population Exposed by Priority Level */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Population Exposed by Priority Category
            </span>
            <span className="text-[10px] text-slate-400">Total: {totalExposedPop.toLocaleString()}</span>
          </div>

          <div className="space-y-3 pt-2">
            {/* Critical */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> CRITICAL
                </span>
                <span className="text-white font-bold">{priorityPop.CRITICAL.toLocaleString()} ({Math.round((priorityPop.CRITICAL / totalExposedPop) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-red-600 h-full rounded-full" style={{ width: `${(priorityPop.CRITICAL / totalExposedPop) * 100}%` }} />
              </div>
            </div>

            {/* High */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> HIGH
                </span>
                <span className="text-white font-bold">{priorityPop.HIGH.toLocaleString()} ({Math.round((priorityPop.HIGH / totalExposedPop) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(priorityPop.HIGH / totalExposedPop) * 100}%` }} />
              </div>
            </div>

            {/* Moderate */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> MODERATE
                </span>
                <span className="text-white font-bold">{priorityPop.MODERATE.toLocaleString()} ({Math.round((priorityPop.MODERATE / totalExposedPop) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${(priorityPop.MODERATE / totalExposedPop) * 100}%` }} />
              </div>
            </div>

            {/* Low */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> LOW
                </span>
                <span className="text-white font-bold">{priorityPop.LOW.toLocaleString()} ({Math.round((priorityPop.LOW / totalExposedPop) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${(priorityPop.LOW / totalExposedPop) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Water Sources Status Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Water Sources Affected vs Functional
            </span>
            <span className="text-[10px] text-slate-400">{waterSources.length} Monitored Points</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg space-y-1">
              <span className="text-[10px] text-red-300 uppercase block">Submerged / Contaminated</span>
              <div className="text-2xl font-black text-red-400">
                {waterStatusCounts.Submerged + waterStatusCounts.Contaminated}
              </div>
              <p className="text-[10px] text-red-400/80">Direct floodwater intrusion into boreholes</p>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-lg space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase block">Fully Operational</span>
              <div className="text-2xl font-black text-emerald-400">
                {waterStatusCounts.Operational}
              </div>
              <p className="text-[10px] text-emerald-400/80">Elevated tanks & protected deep wells</p>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-lg space-y-1">
              <span className="text-[10px] text-amber-300 uppercase block">Mechanically Damaged</span>
              <div className="text-2xl font-black text-amber-400">
                {waterStatusCounts.Damaged}
              </div>
              <p className="text-[10px] text-amber-400/80">Broken riser pipes & electrical motors</p>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-800 rounded-lg space-y-1">
              <span className="text-[10px] text-cyan-300 uppercase block">Emergency Standby</span>
              <div className="text-2xl font-black text-cyan-400">
                {waterStatusCounts.Standby}
              </div>
              <p className="text-[10px] text-cyan-400/80">Municipal tank fill stations available</p>
            </div>
          </div>
        </div>

        {/* Chart 3: Distribution of Priority Scores (Histogram) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Priority Score Frequency Distribution
            </span>
            <span className="text-[10px] text-slate-400">Score Range (0–100)</span>
          </div>

          {/* Vertical Bar Histogram */}
          <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2">
            {scoreBins.map((bin, i) => {
              const heightPct = Math.round((bin.count / maxBinCount) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-white">{bin.count}</span>
                  <div 
                    className={`w-full rounded-t-md transition-all ${bin.color}`}
                    style={{ height: `${Math.max(heightPct, 8)}%` }}
                  />
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{bin.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Road Accessibility Severance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Route className="w-4 h-4 text-red-400" />
              Settlement Accessibility Status
            </span>
            <span className="text-[10px] text-slate-400">{communities.length} Communities</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-red-400 font-bold">Severely Disrupted (Road severed / Inaccessible)</span>
                <span className="text-white font-bold">{accessCounts['SEVERELY DISRUPTED']} settlements ({Math.round((accessCounts['SEVERELY DISRUPTED'] / communities.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(accessCounts['SEVERELY DISRUPTED'] / communities.length) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-400 font-bold">Limited (Submerged causeway / High Clearance)</span>
                <span className="text-white font-bold">{accessCounts['LIMITED']} settlements ({Math.round((accessCounts['LIMITED'] / communities.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(accessCounts['LIMITED'] / communities.length) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-400 font-bold">Passable (Dry embankments)</span>
                <span className="text-white font-bold">{accessCounts['ACCESSIBLE']} settlements ({Math.round((accessCounts['ACCESSIBLE'] / communities.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(accessCounts['ACCESSIBLE'] / communities.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
