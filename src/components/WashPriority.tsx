import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Info, 
  ArrowUpDown, 
  ExternalLink, 
  CheckCircle, 
  AlertOctagon, 
  Download,
  Filter
} from 'lucide-react';
import { Community, PriorityWeights, PriorityCategory } from '../types';
import { DEFAULT_WEIGHTS, recalculateAllCommunities } from '../utils/priorityCalculator';
import { TabId } from './Navbar';
import { ModuleHeader } from './ModuleHeader';

interface WashPriorityProps {
  communities: Community[];
  weights: PriorityWeights;
  onWeightsChange: (weights: PriorityWeights) => void;
  onSelectCommunity: (comm: Community) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const WashPriority: React.FC<WashPriorityProps> = ({
  communities,
  weights,
  onWeightsChange,
  onSelectCommunity,
  onNavigateTab,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'priorityScore' | 'exposedPopulation' | 'name'>('priorityScore');
  const [sortAsc, setSortAsc] = useState(false);

  // Recalculated communities with current weights
  const scoredCommunities = recalculateAllCommunities(communities, weights);

  const totalWeight =
    weights.floodExposure +
    weights.washDisruption +
    weights.populationExposure +
    weights.roadAccessibility +
    weights.healthAccessibility;

  // Presets
  const applyPreset = (presetWeights: PriorityWeights) => {
    onWeightsChange(presetWeights);
  };

  const handleSliderChange = (key: keyof PriorityWeights, val: number) => {
    onWeightsChange({
      ...weights,
      [key]: val,
    });
  };

  const resetWeights = () => {
    onWeightsChange(DEFAULT_WEIGHTS);
  };

  // Filter & Sort
  const displayedCommunities = scoredCommunities
    .filter((c) => selectedCategoryFilter === 'All' || c.priorityCategory === selectedCategoryFilter)
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'priorityScore') {
        comparison = a.priorityScore - b.priorityScore;
      } else if (sortField === 'exposedPopulation') {
        comparison = a.exposedPopulation - b.exposedPopulation;
      } else {
        comparison = a.name.localeCompare(b.name);
      }
      return sortAsc ? comparison : -comparison;
    });

  const criticalCount = scoredCommunities.filter((c) => c.priorityCategory === 'CRITICAL').length;
  const highCount = scoredCommunities.filter((c) => c.priorityCategory === 'HIGH').length;
  const modCount = scoredCommunities.filter((c) => c.priorityCategory === 'MODERATE').length;
  const lowCount = scoredCommunities.filter((c) => c.priorityCategory === 'LOW').length;

  return (
    <div className="w-full">
      <ModuleHeader category="triage" currentTab="priority" onNavigateTab={onNavigateTab} />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-cyan-400" />
              WASH Emergency Priority Index
            </h2>
            <p className="text-xs text-slate-400">
              Interpretable multi-criteria decision-support ranking for targeted humanitarian relief
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              Effective Total Weight: <strong className="text-cyan-400 font-bold">{totalWeight}%</strong>
            </span>
            <button
              onClick={resetWeights}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
              title="Reset to default baseline weights"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Baseline
            </button>
          </div>
        </div>

        {/* Prototype Transparency Disclaimer (Explicit Prompt Mandate) */}
        <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-xs text-amber-200/90 leading-relaxed font-mono flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Decision Support Prototype Notice:</strong> This Priority Index is a transparent prototype decision-support score designed for rapid operational triage, not an official humanitarian standard. Factor weights are fully customizable below to reflect changing operational constraints (e.g. prioritizing water purification when cholera is suspected, or road access when heavy tankering is required).
          </div>
        </div>
      </div>

      {/* Factor Sliders Control Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <span className="font-mono text-sm font-semibold text-white">
            Configurable Factor Weights
          </span>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="text-slate-400">Operational Presets:</span>
            <button
              onClick={() => applyPreset(DEFAULT_WEIGHTS)}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300"
            >
              Balanced Baseline
            </button>
            <button
              onClick={() => applyPreset({ floodExposure: 15, washDisruption: 45, populationExposure: 15, roadAccessibility: 15, healthAccessibility: 10 })}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300"
            >
              WASH Contamination Heavy
            </button>
            <button
              onClick={() => applyPreset({ floodExposure: 15, washDisruption: 20, populationExposure: 15, roadAccessibility: 35, healthAccessibility: 15 })}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-300"
            >
              Logistics & Isolation
            </button>
            <button
              onClick={() => applyPreset({ floodExposure: 20, washDisruption: 20, populationExposure: 20, roadAccessibility: 20, healthAccessibility: 20 })}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300"
            >
              Equal (20% Each)
            </button>
          </div>
        </div>

        {/* 5 Factor Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
          {/* Flood Exposure */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-medium text-sky-400">Flood Exposure</span>
              <span className="font-bold text-white bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">{weights.floodExposure}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={weights.floodExposure}
              onChange={(e) => handleSliderChange('floodExposure', Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">SAR flood inundation depth & surface water spread</p>
          </div>

          {/* WASH Disruption */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-medium text-cyan-400">WASH Disruption</span>
              <span className="font-bold text-white bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">{weights.washDisruption}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={weights.washDisruption}
              onChange={(e) => handleSliderChange('washDisruption', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Submerged tube wells & fecal sludge latrine breach</p>
          </div>

          {/* Population Exposure */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-medium text-amber-400">Population Exposure</span>
              <span className="font-bold text-white bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">{weights.populationExposure}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={weights.populationExposure}
              onChange={(e) => handleSliderChange('populationExposure', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Absolute count of exposed persons in flood zone</p>
          </div>

          {/* Road Accessibility */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-medium text-red-400">Road Accessibility</span>
              <span className="font-bold text-white bg-red-950 px-1.5 py-0.5 rounded border border-red-800">{weights.roadAccessibility}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={weights.roadAccessibility}
              onChange={(e) => handleSliderChange('roadAccessibility', Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Detour delay due to washed out culverts & bridges</p>
          </div>

          {/* Health Accessibility */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-medium text-rose-400">Health Facility Access</span>
              <span className="font-bold text-white bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">{weights.healthAccessibility}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={weights.healthAccessibility}
              onChange={(e) => handleSliderChange('healthAccessibility', Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Proximity & route status to emergency health posts</p>
          </div>
        </div>

        {/* Transparent Formula Equation */}
        <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong>Formula:</strong> Index = ( {weights.floodExposure}·S_flood + {weights.washDisruption}·S_wash + {weights.populationExposure}·S_pop + {weights.roadAccessibility}·S_access + {weights.healthAccessibility}·S_health ) ÷ {totalWeight}
          </span>
          <span className="text-cyan-400">Dynamic Score updates live upon slider adjustment</span>
        </div>
      </div>

      {/* Category Triage Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <button
          onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'CRITICAL' ? 'All' : 'CRITICAL')}
          className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
            selectedCategoryFilter === 'CRITICAL' 
              ? 'bg-red-950 border-red-500 text-white shadow-lg shadow-red-950/50' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="font-semibold">CRITICAL (≥75)</span>
          </div>
          <span className="text-base font-bold text-red-400">{criticalCount}</span>
        </button>

        <button
          onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'HIGH' ? 'All' : 'HIGH')}
          className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
            selectedCategoryFilter === 'HIGH' 
              ? 'bg-amber-950 border-amber-500 text-white shadow-lg shadow-amber-950/50' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-semibold">HIGH (55-74)</span>
          </div>
          <span className="text-base font-bold text-amber-400">{highCount}</span>
        </button>

        <button
          onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'MODERATE' ? 'All' : 'MODERATE')}
          className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
            selectedCategoryFilter === 'MODERATE' 
              ? 'bg-yellow-950 border-yellow-500 text-white shadow-lg shadow-yellow-950/50' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="font-semibold">MODERATE (35-54)</span>
          </div>
          <span className="text-base font-bold text-yellow-400">{modCount}</span>
        </button>

        <button
          onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'LOW' ? 'All' : 'LOW')}
          className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
            selectedCategoryFilter === 'LOW' 
              ? 'bg-cyan-950 border-cyan-500 text-white shadow-lg shadow-cyan-950/50' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="font-semibold">LOW (&lt;35)</span>
          </div>
          <span className="text-base font-bold text-cyan-400">{lowCount}</span>
        </button>
      </div>

      {/* Main Ranking Table (Matches Requested Format: Community, Population, Flood Exposure, WASH Disruption, Accessibility, Priority Index, Priority Category) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Ranked Communities ({displayedCommunities.length})</span>
            {selectedCategoryFilter !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Filter: {selectedCategoryFilter}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSortField('priorityScore');
                setSortAsc(!sortAsc);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sort by {sortField === 'priorityScore' ? 'Score' : sortField}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-3">Community</th>
                <th className="py-3 px-3">Population</th>
                <th className="py-3 px-3">Flood Exposure</th>
                <th className="py-3 px-3">WASH Disruption</th>
                <th className="py-3 px-3">Accessibility</th>
                <th className="py-3 px-3 text-right">Priority Index</th>
                <th className="py-3 px-3 text-center">Category</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {displayedCommunities.map((comm, index) => {
                const isCritical = comm.priorityCategory === 'CRITICAL';
                const isHigh = comm.priorityCategory === 'HIGH';
                const isMod = comm.priorityCategory === 'MODERATE';

                return (
                  <tr 
                    key={comm.id} 
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-500 font-bold">#{index + 1}</td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <div>
                        <span>{comm.name}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{comm.ward}, {comm.district}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-amber-300 font-bold">{comm.exposedPopulation.toLocaleString()}</span>
                      <span className="block text-[10px] text-slate-500">of {comm.population.toLocaleString()} total</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        comm.floodExposure === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                        comm.floodExposure === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                        comm.floodExposure === 'MODERATE' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {comm.floodExposure} ({comm.floodDepthMeters}m)
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <span className="text-slate-200 font-medium">{comm.mainWaterStatus}</span>
                        <span className="block text-[10px] text-slate-400 truncate max-w-[190px]">{comm.mainWaterSource}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-medium ${
                        comm.roadAccessibility === 'SEVERELY DISRUPTED' ? 'text-red-400 font-bold' :
                        comm.roadAccessibility === 'LIMITED' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {comm.roadAccessibility}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {comm.alternativeWaterDistanceAccessibleKm} km ({comm.alternativeWaterDistanceStraightKm} km direct)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`text-base font-black ${
                        isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : isMod ? 'text-yellow-400' : 'text-cyan-400'
                      }`}>
                        {comm.priorityScore}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
                        isCritical ? 'bg-red-600 text-white' :
                        isHigh ? 'bg-amber-600 text-white' :
                        isMod ? 'bg-yellow-600 text-black' :
                        'bg-cyan-600 text-white'
                      }`}>
                        {comm.priorityCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          onSelectCommunity(comm);
                          onNavigateTab('community');
                        }}
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
