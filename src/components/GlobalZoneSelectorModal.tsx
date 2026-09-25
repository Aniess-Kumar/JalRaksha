import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Search, 
  X, 
  Check, 
  Compass, 
  Sliders, 
  Sparkles, 
  Navigation, 
  AlertTriangle, 
  Waves, 
  ShieldCheck, 
  ExternalLink,
  PlusCircle,
  Layers
} from 'lucide-react';
import { GlobalDisasterZone } from '../types';
import { 
  GLOBAL_DISASTER_ZONES, 
  GLOBAL_PRESET_LOCATIONS, 
  GlobalPresetLocation,
  generateCustomDisasterZone 
} from '../data/globalDisasterZones';

interface GlobalZoneSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeZoneId: string;
  onSelectZone: (zone: GlobalDisasterZone) => void;
}

export const GlobalZoneSelectorModal: React.FC<GlobalZoneSelectorModalProps> = ({
  isOpen,
  onClose,
  activeZoneId,
  onSelectZone,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('ALL');

  // Custom coordinate input state
  const [customName, setCustomName] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [customLat, setCustomLat] = useState<string>('29.9511');
  const [customLng, setCustomLng] = useState<string>('-90.0715');
  const [customRadius, setCustomRadius] = useState<number>(15);
  const [customSeverity, setCustomSeverity] = useState<'MODERATE' | 'HIGH' | 'CRITICAL'>('CRITICAL');
  const [coordError, setCoordError] = useState<string | null>(null);

  if (!isOpen) return null;

  const continents = ['ALL', 'Asia', 'South America', 'Europe', 'Africa'];

  const filteredZones = GLOBAL_DISASTER_ZONES.filter((z) => {
    const matchesContinent = selectedContinent === 'ALL' || z.continent === selectedContinent;
    const matchesSearch = 
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.floodType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  const handleApplyPreset = (preset: GlobalPresetLocation) => {
    setCustomName(preset.name);
    setCustomCountry(preset.country);
    setCustomLat(preset.lat.toString());
    setCustomLng(preset.lng.toString());
    setActiveTab('custom');
  };

  const handleGenerateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setCoordError(null);

    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setCoordError('Latitude must be a valid number between -90 and 90');
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setCoordError('Longitude must be a valid number between -180 and 180');
      return;
    }

    const name = customName.trim() || `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    const newZone = generateCustomDisasterZone(
      name,
      customCountry.trim() || 'Global Coordinates',
      lat,
      lng,
      customRadius,
      customSeverity
    );

    onSelectZone(newZone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center shadow-inner">
              <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono tracking-tight">
                  Global Flood Disaster Zone Selector
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Universal Global DSS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deploy JALRAKSHA to any flood-affected basin or custom coordinate on Earth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-all ${
                activeTab === 'catalog'
                  ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-900/50 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Calibrated Global Basins ({GLOBAL_DISASTER_ZONES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-all ${
                activeTab === 'custom'
                  ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-900/50 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Define Any Global Coordinate / Basin</span>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Criteria Decision Analysis (MCDA)</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'catalog' ? (
            <div className="space-y-5">
              {/* Search & Continent Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by river, country, or flood type (e.g. Brahmaputra, Spain, DANA, Dam)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Continent Chips */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                  {continents.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedContinent(c)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        selectedContinent === c
                          ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Global Disaster Zones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredZones.map((zone) => {
                  const isSelected = activeZoneId === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => {
                        onSelectZone(zone);
                        onClose();
                      }}
                      className={`group relative p-4 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-950/50 via-slate-900 to-indigo-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      {/* Top status bar */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl" role="img" aria-label={zone.country}>
                            {zone.flag}
                          </span>
                          <div>
                            <h3 className="font-bold text-sm text-white font-mono group-hover:text-cyan-300 transition-colors">
                              {zone.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 font-sans">
                              {zone.country} • {zone.continent}
                            </p>
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1">
                            <Check className="w-3 h-3 text-cyan-400" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800 group-hover:border-slate-700">
                            Select
                          </span>
                        )}
                      </div>

                      {/* Flood Archetype Tag */}
                      <div className="mb-3">
                        <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300/90">
                          {zone.floodType}
                        </span>
                      </div>

                      {/* Summary preview */}
                      <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                        {zone.situationSummary}
                      </p>

                      {/* Specs pills */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 block">Inundation</span>
                          <span className="text-cyan-300 font-bold">{zone.inundatedAreaSqKm} km²</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Settlements</span>
                          <span className="text-slate-200 font-bold">{zone.communities.length} monitored</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Population</span>
                          <span className="text-slate-200 font-bold">{zone.totalPopulation.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Launch Notice for Any Coordinates */}
              <div className="p-4 bg-slate-950/80 border border-dashed border-slate-700 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <strong className="text-slate-200 block font-mono">Need another flood-affected area?</strong>
                    <span className="text-slate-400">
                      Enter any latitude & longitude or choose from 14 global river basins worldwide.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('custom')}
                  className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-mono text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                >
                  Configure Custom Location
                </button>
              </div>
            </div>
          ) : (
            /* Custom Location Form */
            <div className="space-y-6">
              {/* Quick Global Basin Presets */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-2">
                  1-Click Global Basin & Delta Presets:
                </label>
                <div className="flex flex-wrap gap-2">
                  {GLOBAL_PRESET_LOCATIONS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-600 rounded-lg text-xs text-slate-300 font-mono flex items-center gap-1.5 transition-all"
                    >
                      <span>{preset.flag}</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerateCustom} className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Location / River Basin Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Chao Phraya Delta, New Orleans, Rhine Valley..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Country / Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="e.g. Thailand, United States, Germany..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Latitude (-90° to +90°) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      placeholder="e.g. 29.9511"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Longitude (-180° to +180°) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      placeholder="e.g. -90.0715"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-slate-400">
                        Assessment Radius
                      </label>
                      <span className="text-xs font-mono text-cyan-400 font-bold">{customRadius} km</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      step={5}
                      value={customRadius}
                      onChange={(e) => setCustomRadius(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Assumed Inundation Severity
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      {(['MODERATE', 'HIGH', 'CRITICAL'] as const).map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setCustomSeverity(sev)}
                          className={`py-1.5 rounded-lg border transition-all ${
                            customSeverity === sev
                              ? sev === 'CRITICAL'
                                ? 'bg-red-950 border-red-700 text-red-300 font-bold'
                                : sev === 'HIGH'
                                ? 'bg-amber-950 border-amber-700 text-amber-300 font-bold'
                                : 'bg-blue-950 border-blue-700 text-blue-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {coordError && (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{coordError}</span>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-cyan-950 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Deploy Global Assessment AOI</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Global Multi-Source EO & WASH Topology Pipeline Ready</span>
          </div>
          <div className="text-slate-500">
            Copernicus Sentinel-1 Global Constellation + NASA GPM Global Deluge
          </div>
        </div>
      </div>
    </div>
  );
};
