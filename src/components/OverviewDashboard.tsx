import React from 'react';
import { 
  Users, 
  DropletOff, 
  Trash2, 
  Building2, 
  AlertOctagon, 
  MapPin, 
  ArrowRight, 
  Satellite, 
  Layers, 
  ShieldAlert, 
  Compass,
  CheckCircle2,
  TrendingUp,
  Activity,
  Globe,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { Community, WaterSource, SanitationFacility, HealthFacility, GlobalDisasterZone } from '../types';
import { GLOBAL_DISASTER_ZONES } from '../data/globalDisasterZones';
import { TabId } from './Navbar';
import { JalrakshaLogo } from './JalrakshaLogo';

interface OverviewDashboardProps {
  communities: Community[];
  waterSources: WaterSource[];
  sanitationFacilities: SanitationFacility[];
  healthFacilities: HealthFacility[];
  onSelectTab: (tab: TabId) => void;
  onSelectCommunity: (comm: Community) => void;
  onStartDemoTour: () => void;
  activeZone?: GlobalDisasterZone;
  onOpenZoneSelector?: () => void;
  onSelectZone?: (zone: GlobalDisasterZone) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  communities,
  waterSources,
  sanitationFacilities,
  healthFacilities,
  onSelectTab,
  onSelectCommunity,
  onStartDemoTour,
  activeZone,
  onOpenZoneSelector,
  onSelectZone,
}) => {
  const totalCommunities = communities.length;
  const totalExposedPop = communities.reduce((acc, c) => acc + c.exposedPopulation, 0);
  const disruptedWater = waterSources.filter((w) => w.status !== 'Operational' && w.status !== 'Standby').length;
  const affectedSanitation = sanitationFacilities.filter((s) => s.status !== 'Operational').length;
  const reducedHealth = healthFacilities.filter((h) => h.accessibilityStatus !== 'ACCESSIBLE').length;
  const criticalCommunities = communities.filter((c) => c.priorityCategory === 'CRITICAL');
  const highCommunities = communities.filter((c) => c.priorityCategory === 'HIGH');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Global Operational Disaster Zone Switcher Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Active Global Disaster AOI:</span>
              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                <span>{activeZone?.flag || '🌐'}</span>
                <span>{activeZone?.name || 'Koshi River Basin'}</span>
                <span className="text-slate-400 font-normal">({activeZone?.country || 'Nepal'})</span>
              </span>
            </div>
            <p className="text-[10px] text-cyan-300/80">
              {activeZone?.floodType || 'Monsoon Riverine Inundation'} • {activeZone?.inundatedAreaSqKm || 184} km² Inundated
            </p>
          </div>
        </div>

        {/* 1-Click Zone Quick Switchers */}
        <div className="flex flex-wrap items-center gap-1.5">
          {GLOBAL_DISASTER_ZONES.map((zone) => {
            const isCurrent = activeZone?.id === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => onSelectZone && onSelectZone(zone)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-200 font-bold shadow-sm'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title={`Switch to ${zone.name} (${zone.country})`}
              >
                <span>{zone.flag}</span>
                <span className="hidden sm:inline">{zone.name.split(' ')[0]}</span>
              </button>
            );
          })}

          {onOpenZoneSelector && (
            <button
              onClick={onOpenZoneSelector}
              className="px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 rounded text-[11px] font-bold flex items-center gap-1 transition-all"
              title="Open Global Zone Selector or enter any custom latitude/longitude on Earth"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Any Location...</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Situation Summary Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 p-6 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                OPERATIONAL DISASTER RESPONSE SYSTEM
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                SATELLITE SYNC ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <JalrakshaLogo size="lg" />
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono">
                  JALRAKSHA
                </h2>
                <p className="text-xs md:text-sm font-semibold text-cyan-400 font-mono">
                  Post-Flood WASH Emergency Decision Support System
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 italic">
              “From Earth Observation to Community-Level Action”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Combines Copernicus Sentinel-1 SAR flood inundation extent, high-resolution optical baselines, OpenStreetMap infrastructure topology, and gridded population exposure to answer: 
              <strong className="text-slate-200"> “Which communities are most affected from a WASH perspective, why are they vulnerable, and where should emergency intervention be prioritized?”</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              id="overview-btn-view-map"
              onClick={() => onSelectTab('map')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs tracking-wider uppercase font-mono shadow-lg shadow-cyan-950 transition-all"
            >
              <Compass className="w-4 h-4" />
              Open Disaster Map
            </button>
            <button
              id="overview-btn-tour"
              onClick={onStartDemoTour}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-semibold text-xs tracking-wider uppercase font-mono transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              Guided Demo Sequence
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Operational Indicator Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Communities Assessed */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Communities Assessed</span>
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-white">{totalCommunities}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Sunsari & Saptari Basin</p>
          </div>
        </div>

        {/* Exposed Population */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Exposed Population</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-amber-300">{totalExposedPop.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">In flood inundation zones</p>
          </div>
        </div>

        {/* Water Sources Disrupted */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Water Sources Disrupted</span>
            <DropletOff className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-red-400">{disruptedWater} <span className="text-xs text-slate-500 font-normal">/ {waterSources.length}</span></div>
            <p className="text-[11px] text-red-400/80 mt-0.5">Submerged / Contaminated</p>
          </div>
        </div>

        {/* Sanitation Facilities Affected */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Sanitation Affected</span>
            <Trash2 className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-orange-400">{affectedSanitation} <span className="text-xs text-slate-500 font-normal">/ {sanitationFacilities.length}</span></div>
            <p className="text-[11px] text-orange-400/80 mt-0.5">Pit overflows & flooded</p>
          </div>
        </div>

        {/* Health Reduced Access */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Health Access Cut</span>
            <Building2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-rose-400">{reducedHealth} <span className="text-xs text-slate-500 font-normal">/ {healthFacilities.length}</span></div>
            <p className="text-[11px] text-rose-400/80 mt-0.5">Limited / Inaccessible</p>
          </div>
        </div>

        {/* Critical Priority Communities */}
        <div className="bg-red-950/40 border border-red-800/80 rounded-lg p-3.5 flex flex-col justify-between shadow-lg shadow-red-950/30">
          <div className="flex items-center justify-between text-red-300">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Critical Priority</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-red-400">{criticalCommunities.length}</div>
            <p className="text-[11px] text-red-300/80 mt-0.5">Immediate intervention</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Situation Briefing & Critical Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Situation Summary & EO Operational Context */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-mono text-sm font-semibold border-b border-slate-800 pb-3">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Situation Summary</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeZone?.situationSummary || 
                "Heavy precipitation and riverine surges across the basin catchment have resulted in widespread inundation across surrounding districts. Conventional assessments often rely solely on water extent, failing to account for subterranean drinking water contamination, sanitation overflow, and network road severances."}
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Earth Observation:</strong> {activeZone?.sensorSpecs || 'Sentinel-1 SAR C-band'} identifies {activeZone?.inundatedAreaSqKm || 184} km² inundated terrain through all-weather cloud penetration.
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>WASH Infrastructure Overlay:</strong> Geospatial intersection with water points and latrines highlights biological contamination hotspots.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Network Routing:</strong> Passable topological road analysis identifies severed culverts where straight-line distance misleads humanitarian teams.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Decision Engine: v4.2 DSS</span>
              <button
                onClick={() => onSelectTab('methodology')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                View Pipeline <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Satellite Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Satellite className="w-4 h-4 text-cyan-400" />
                Active EO Missions
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Operational</span>
            </div>
            <div className="text-xs space-y-2 font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Sentinel-1A SAR (C-Band)</span>
                <span className="text-slate-200">Pass 12h ago (10m)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sentinel-2 MSI Optical</span>
                <span className="text-slate-200">Cloud Cover 64%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Copernicus DEM 30m</span>
                <span className="text-slate-200">HAND Flow Path</span>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('satellite')}
              className="w-full text-center py-1.5 text-xs text-cyan-400 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono transition-colors"
            >
              Open Satellite / EO Module →
            </button>
          </div>
        </div>

        {/* Right: Urgent Priority Ranking & Direct Action Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold font-mono text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                Urgent Humanitarian Action Priority Queue
              </h3>
              <p className="text-xs text-slate-400">
                Ranked by multi-criteria WASH Emergency Priority Index (0–100)
              </p>
            </div>
            <button
              onClick={() => onSelectTab('priority')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              Adjust Weights & Full List →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Community</th>
                  <th className="py-2.5 px-2">District</th>
                  <th className="py-2.5 px-2">Exposed Pop</th>
                  <th className="py-2.5 px-2">Main Water</th>
                  <th className="py-2.5 px-2">Route Access</th>
                  <th className="py-2.5 px-2">Score</th>
                  <th className="py-2.5 px-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {communities.slice(0, 6).map((comm) => {
                  const isCritical = comm.priorityCategory === 'CRITICAL';
                  const isHigh = comm.priorityCategory === 'HIGH';
                  return (
                    <tr 
                      key={comm.id} 
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => {
                        onSelectCommunity(comm);
                        onSelectTab('community');
                      }}
                    >
                      <td className="py-3 px-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${isCritical ? 'bg-red-500 animate-pulse' : isHigh ? 'bg-amber-500' : 'bg-blue-500'}`} />
                          <span className="truncate max-w-[170px]">{comm.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-300">{comm.district}</td>
                      <td className="py-3 px-2 text-amber-300 font-semibold">{comm.exposedPopulation.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                          comm.mainWaterStatus === 'Submerged' || comm.mainWaterStatus === 'Contaminated' 
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : comm.mainWaterStatus === 'Potentially Disrupted'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {comm.mainWaterStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-[11px] ${comm.roadAccessibility === 'SEVERELY DISRUPTED' ? 'text-red-400 font-bold' : comm.roadAccessibility === 'LIMITED' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {comm.roadAccessibility === 'SEVERELY DISRUPTED' ? 'Severely Disrupted' : comm.roadAccessibility === 'LIMITED' ? 'Limited' : 'Passable'}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {comm.alternativeWaterDistanceAccessibleKm} km ({comm.alternativeWaterDistanceStraightKm} km str)
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded font-bold ${isCritical ? 'bg-red-950 text-red-300 border border-red-800' : isHigh ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-cyan-950 text-cyan-300'}`}>
                          {comm.priorityScore}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCommunity(comm);
                            onSelectTab('community');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-700 text-white font-medium text-[11px] transition-colors"
                        >
                          Diagnose
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span><strong>Primary Benchmark Focus:</strong> Prakashpur has 2,850 exposed residents with a 9.4 km detour gap.</span>
            </div>
            <button
              onClick={() => {
                const targetComm = communities.find((c) => c.id === 'comm-1') || communities[0];
                onSelectCommunity(targetComm);
                onSelectTab('community');
              }}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-xs whitespace-nowrap transition-colors"
            >
              Analyze Prakashpur →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
