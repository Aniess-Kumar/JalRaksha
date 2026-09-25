import React, { useState } from 'react';
import { 
  Route, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  ShieldAlert, 
  Building2, 
  Droplet, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Compass
} from 'lucide-react';
import { Community, HealthFacility, WaterSource, RoadSegment } from '../types';
import { TabId } from './Navbar';
import { ModuleHeader } from './ModuleHeader';

interface FacilityAccessProps {
  communities: Community[];
  healthFacilities: HealthFacility[];
  waterSources: WaterSource[];
  roads: RoadSegment[];
  selectedCommunity: Community;
  onSelectCommunity: (comm: Community) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const FacilityAccess: React.FC<FacilityAccessProps> = ({
  communities,
  healthFacilities,
  waterSources,
  roads,
  selectedCommunity,
  onSelectCommunity,
  onNavigateTab,
}) => {
  const [activeFacilityType, setActiveFacilityType] = useState<'water' | 'health'>('water');

  const comm = selectedCommunity;

  // Calculate detour statistics across all communities
  const communitiesWithDetours = communities.map((c) => {
    const straight = activeFacilityType === 'water' ? c.alternativeWaterDistanceStraightKm : c.healthDistanceStraightKm;
    const accessible = activeFacilityType === 'water' ? c.alternativeWaterDistanceAccessibleKm : c.healthDistanceAccessibleKm;
    const detourGap = Math.round((accessible - straight) * 10) / 10;
    const detourRatio = straight > 0 ? Math.round((accessible / straight) * 10) / 10 : 1;
    const obstacle = activeFacilityType === 'water' ? c.alternativeWaterReason : c.healthAccessObstacle;
    const targetName = activeFacilityType === 'water' ? c.alternativeWaterSource : c.healthFacilityName;

    return {
      community: c,
      targetName,
      straight,
      accessible,
      detourGap,
      detourRatio,
      obstacle,
      isMisleading: detourGap >= 2.5 || detourRatio >= 2.0,
    };
  }).sort((a, b) => b.detourGap - a.detourGap);

  const selectedDetourData = communitiesWithDetours.find((d) => d.community.id === comm.id) || communitiesWithDetours[0];

  return (
    <div className="w-full">
      <ModuleHeader category="triage" currentTab="access" onNavigateTab={onNavigateTab} />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
            <Route className="w-6 h-6 text-cyan-400" />
            Facility Accessibility & Network Disruption Analysis
          </h2>
          <p className="text-xs text-slate-400">
            Accounting for submerged culverts, washed-out bridges, and terrain obstacles that render straight-line distance deceptive
          </p>
        </div>

        {/* Facility Target Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-700 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveFacilityType('water')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeFacilityType === 'water' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Alternative Water Points</span>
          </button>
          <button
            onClick={() => setActiveFacilityType('health')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeFacilityType === 'health' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Emergency Health Posts</span>
          </button>
        </div>
      </div>

      {/* Critical Analytical Callout Banner (Prompt Specification) */}
      <div className="bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 border border-red-800/80 rounded-xl p-5 shadow-2xl space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-white uppercase">
            The “Straight-Line Fallacy” in Post-Flood Disaster Response
          </h3>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Standard GIS euclidean buffering often assumes people can walk or transport water straight to the nearest facility. 
          In active river floodplains, breached embankments and inundation washouts cut direct transit links. 
          As shown below, a community may appear only <strong>3.2 km away</strong> on a map, but the actual passable detour route is <strong>9.4 km</strong> — tripling transport time and making water haulage impossible on foot.
        </p>
      </div>

      {/* Selected Community Active Route Diagnosis Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">Active Focus:</span>
            <select
              value={comm.id}
              onChange={(e) => {
                const found = communities.find((c) => c.id === e.target.value);
                if (found) onSelectCommunity(found);
              }}
              className="bg-slate-950 border border-slate-700 text-white font-bold text-xs rounded px-2.5 py-1"
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Destination:</span>
            <strong className="text-white bg-slate-950 px-2 py-1 rounded border border-slate-800">{selectedDetourData.targetName}</strong>
          </div>
        </div>

        {/* 3 Metric Cards: Straight Line vs Accessible Route vs Detour Gap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Straight-line distance */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Straight-Line Distance</span>
            <div className="text-2xl font-black text-slate-300">
              {selectedDetourData.straight} km
            </div>
            <p className="text-[10px] text-slate-500">Euclidean distance (assumes unobstructed straight flight)</p>
          </div>

          {/* Accessible Road Distance */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Accessible Road Distance</span>
            <div className="text-2xl font-black text-amber-400">
              {selectedDetourData.accessible} km
            </div>
            <p className="text-[10px] text-slate-500">Actual shortest passable road/embankment route</p>
          </div>

          {/* Detour Gap Penalty */}
          <div className={`p-4 rounded-lg border space-y-1 ${
            selectedDetourData.isMisleading 
              ? 'bg-red-950/40 border-red-800 text-red-300' 
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[11px] uppercase tracking-wider block font-bold">
              {selectedDetourData.isMisleading ? 'Severe Detour Penalty' : 'Detour Overhead'}
            </span>
            <div className="text-2xl font-black text-red-400 flex items-center gap-2">
              <span>+{selectedDetourData.detourGap} km</span>
              <span className="text-xs font-normal text-slate-400">({selectedDetourData.detourRatio}x factor)</span>
            </div>
            <p className="text-[10px] text-slate-400">Excess kilometers added by flood obstacles</p>
          </div>
        </div>

        {/* Detailed Obstacle Rationale Box */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Network Obstacle & Cutoff Rationale:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {selectedDetourData.obstacle}
          </p>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Road Status: <strong className="text-red-400">{comm.roadAccessibility}</strong></span>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Inspect Route on Disaster Map <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Comparative Accessibility Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-white text-sm">
              Comparative Access Route Matrix: {activeFacilityType === 'water' ? 'Alternative Safe Water' : 'Emergency Health Posts'}
            </h4>
            <p className="text-slate-400 text-[11px]">
              Sorted by greatest detour penalty (+km) to highlight hidden isolation risks
            </p>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {communitiesWithDetours.filter((d) => d.isMisleading).length} communities severely isolated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Community</th>
                <th className="py-3 px-3">Target Facility</th>
                <th className="py-3 px-3 text-right">Straight-Line</th>
                <th className="py-3 px-3 text-right">Accessible Route</th>
                <th className="py-3 px-3 text-right">Detour Gap</th>
                <th className="py-3 px-3">Primary Obstacle / Severance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {communitiesWithDetours.map((item) => {
                const isSelected = item.community.id === comm.id;
                return (
                  <tr 
                    key={item.community.id}
                    className={`transition-colors ${isSelected ? 'bg-cyan-950/30' : 'hover:bg-slate-800/40'}`}
                  >
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>
                        <span>{item.community.name}</span>
                        <span className="block text-[10px] text-slate-500 font-normal">{item.community.district}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-200">{item.targetName}</td>
                    <td className="py-3 px-3 text-right text-slate-400 font-medium">{item.straight} km</td>
                    <td className="py-3 px-3 text-right text-amber-300 font-bold">{item.accessible} km</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-black ${item.isMisleading ? 'text-red-400' : 'text-slate-300'}`}>
                        +{item.detourGap} km
                      </span>
                      <span className="block text-[10px] text-slate-500 font-normal">({item.detourRatio}x)</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px] max-w-xs truncate" title={item.obstacle}>
                      {item.obstacle}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.isMisleading 
                          ? 'bg-red-950 text-red-300 border border-red-800' 
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.isMisleading ? 'ISOLATED' : 'PASSABLE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectCommunity(item.community)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 text-white font-medium text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};
