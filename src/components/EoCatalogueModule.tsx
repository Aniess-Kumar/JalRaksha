import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ExternalLink, 
  Layers, 
  Satellite, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Globe2, 
  Radio, 
  Cpu, 
  Sliders, 
  Eye,
  AlertTriangle,
  Building2,
  TreePine,
  Wheat,
  Activity,
  ArrowRight,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TabId } from './Navbar';
import { ModuleHeader } from './ModuleHeader';
import { 
  EO_CATALOGUE_META, 
  THEMATIC_GROUPS, 
  EO_DATASETS, 
  SERVICE_PORTALS 
} from '../data/eoCatalogueData';
import { EoDataset, EoServicePortal, EoImpactDomain, EoAccessStatus } from '../types';

interface EoCatalogueModuleProps {
  onNavigateTab: (tab: TabId) => void;
}

export const EoCatalogueModule: React.FC<EoCatalogueModuleProps> = ({ onNavigateTab }) => {
  const [activeView, setActiveView] = useState<'datasets' | 'portals' | 'multimodal' | 'domains'>('datasets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThematicGroup, setSelectedThematicGroup] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');
  const [onlyIndianSources, setOnlyIndianSources] = useState<boolean>(false);
  const [selectedPortalService, setSelectedPortalService] = useState<string>('all');
  const [selectedDatasetModal, setSelectedDatasetModal] = useState<EoDataset | null>(null);

  // Filtered datasets
  const filteredDatasets = useMemo(() => {
    return EO_DATASETS.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesProvider = item.provider.toLowerCase().includes(q);
        const matchesUse = item.primaryUse.toLowerCase().includes(q);
        const matchesTheme = item.thematicGroup.toLowerCase().includes(q);
        const matchesRelevance = item.relevanceToWASH.toLowerCase().includes(q);
        if (!matchesName && !matchesProvider && !matchesUse && !matchesTheme && !matchesRelevance) {
          return false;
        }
      }

      // Thematic Group
      if (selectedThematicGroup !== 'all' && item.thematicGroup !== selectedThematicGroup) {
        return false;
      }

      // Domain
      if (selectedDomain !== 'all') {
        if (!item.impactDomains.includes(selectedDomain as EoImpactDomain)) {
          return false;
        }
      }

      // Access
      if (selectedAccess !== 'all') {
        if (selectedAccess === 'Open' && !item.access.toLowerCase().includes('open')) {
          return false;
        }
        if (selectedAccess === 'Commercial' && item.access !== 'Commercial') {
          return false;
        }
        if (selectedAccess === 'Restricted' && item.access !== 'Restricted' && item.access !== 'On request') {
          return false;
        }
      }

      // Indian source
      if (onlyIndianSources && !item.isIndianSource) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedThematicGroup, selectedDomain, selectedAccess, onlyIndianSources]);

  // Filtered portals
  const filteredPortals = useMemo(() => {
    return SERVICE_PORTALS.filter((portal) => {
      if (selectedPortalService === 'all') return true;
      return portal.serviceTypes.includes(selectedPortalService as ('I' | 'M' | 'E' | 'A' | 'F'));
    });
  }, [selectedPortalService]);

  return (
    <div className="w-full">
      <ModuleHeader category="science" currentTab="catalogue" onNavigateTab={onNavigateTab} />
      
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans">
        
        {/* Authoritative EO Data Citation Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-cyan-800/60 rounded-2xl p-6 shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Database className="w-64 h-64 text-cyan-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-cyan-950/90 border border-cyan-700/80 rounded-full text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Authoritative Reference Resource
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/90 border border-slate-700 rounded text-slate-300 font-mono text-[11px]">
                IWMI Research Communication (July 2026)
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-mono text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Integrated with JALRAKSHA Engine
              </span>
            </div>

            <h1 className="text-xl md:text-3xl font-black text-white tracking-tight">
              Multi-Source Earth Observation Data Catalogue
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-4xl leading-relaxed">
              <strong>{EO_CATALOGUE_META.author}</strong> ({EO_CATALOGUE_META.institution}, <em>{EO_CATALOGUE_META.correspondence}</em>). 
              A curated, openly documented catalogue of <strong>69 datasets</strong> across <strong>13 thematic groups</strong> and <strong>15 operational Indian disaster portals</strong>, prioritizing <strong>60–70% Indian national sources</strong> (ISRO, NRSC, IMD, CWC, Bhuvan, Bhoonidhi) complemented by open global datasets, reflecting mission status as of July 2026 (including newly released NASA-ISRO <strong>NISAR L- & S-band SAR</strong>).
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 font-mono">
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-center">
                <div className="text-lg md:text-xl font-bold text-cyan-400">69</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Catalogued Datasets</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-center">
                <div className="text-lg md:text-xl font-bold text-emerald-400">13</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Thematic Groups</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-center">
                <div className="text-lg md:text-xl font-bold text-amber-400">60–70%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Indian Sources Target</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-center">
                <div className="text-lg md:text-xl font-bold text-purple-400">15</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Operational Portals</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-center col-span-2 sm:col-span-1">
                <div className="text-lg md:text-xl font-bold text-blue-400">3</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Impact Domains</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveView('datasets')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-medium ${
                activeView === 'datasets'
                  ? 'bg-cyan-600 text-white shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>69 Datasets Explorer ({filteredDatasets.length})</span>
            </button>

            <button
              onClick={() => setActiveView('portals')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-medium ${
                activeView === 'portals'
                  ? 'bg-cyan-600 text-white shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>15 Operational Portals</span>
            </button>

            <button
              onClick={() => setActiveView('multimodal')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-medium ${
                activeView === 'multimodal'
                  ? 'bg-cyan-600 text-white shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Multimodal Fusion Framework</span>
            </button>

            <button
              onClick={() => setActiveView('domains')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-medium ${
                activeView === 'domains'
                  ? 'bg-cyan-600 text-white shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>3 Impact Domains</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('map')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Inspect Layers on GIS Map</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: DATASETS EXPLORER */}
        {activeView === 'datasets' && (
          <div className="space-y-4">
            {/* Search & Filters Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 69 datasets by sensor (NISAR, Sentinel, Cartosat...), provider, resolution, use..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Thematic Group Select */}
                <div className="w-full md:w-64">
                  <select
                    value={selectedThematicGroup}
                    onChange={(e) => setSelectedThematicGroup(e.target.value)}
                    aria-label="Filter by Thematic Group"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="all">All 13 Thematic Themes</option>
                    {THEMATIC_GROUPS.map((tg) => (
                      <option key={tg.id} value={tg.name}>
                        Table {tg.id + 1}: {tg.name} ({tg.datasetCount})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Filter className="w-3 h-3 text-cyan-400" /> Filter:
                  </span>

                  {/* Indian Source toggle */}
                  <button
                    onClick={() => setOnlyIndianSources(!onlyIndianSources)}
                    className={`px-2.5 py-1 rounded border text-[11px] transition-colors flex items-center gap-1 ${
                      onlyIndianSources
                        ? 'bg-amber-950 border-amber-600 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🇮🇳 Indian Sources Only (60-70% target)</span>
                  </button>

                  {/* Domain Filters */}
                  <button
                    onClick={() => setSelectedDomain(selectedDomain === 'infrastructure_wash' ? 'all' : 'infrastructure_wash')}
                    className={`px-2.5 py-1 rounded border text-[11px] transition-colors flex items-center gap-1 ${
                      selectedDomain === 'infrastructure_wash'
                        ? 'bg-cyan-950 border-cyan-600 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-3 h-3 text-cyan-400" />
                    <span>WASH & Infrastructure</span>
                  </button>

                  <button
                    onClick={() => setSelectedDomain(selectedDomain === 'agriculture' ? 'all' : 'agriculture')}
                    className={`px-2.5 py-1 rounded border text-[11px] transition-colors flex items-center gap-1 ${
                      selectedDomain === 'agriculture'
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Wheat className="w-3 h-3 text-emerald-400" />
                    <span>Agriculture</span>
                  </button>

                  <button
                    onClick={() => setSelectedDomain(selectedDomain === 'wildlife' ? 'all' : 'wildlife')}
                    className={`px-2.5 py-1 rounded border text-[11px] transition-colors flex items-center gap-1 ${
                      selectedDomain === 'wildlife'
                        ? 'bg-purple-950 border-purple-600 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <TreePine className="w-3 h-3 text-purple-400" />
                    <span>Wildlife & Wetlands</span>
                  </button>

                  {/* Access Filter */}
                  <select
                    value={selectedAccess}
                    onChange={(e) => setSelectedAccess(e.target.value)}
                    aria-label="Filter by Access Status"
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 focus:outline-none"
                  >
                    <option value="all">Any Access Status</option>
                    <option value="Open">Open / Free Access</option>
                    <option value="Commercial">Commercial / Tasked</option>
                    <option value="Restricted">Restricted / On request</option>
                  </select>
                </div>

                <div className="text-slate-400 text-[11px]">
                  Showing <strong className="text-white">{filteredDatasets.length}</strong> of 69 datasets
                </div>
              </div>
            </div>

            {/* Datasets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDatasets.map((ds) => {
                const isOpen = ds.access.toLowerCase().includes('open');
                const isCommercial = ds.access.toLowerCase().includes('commercial');
                
                return (
                  <div
                    key={ds.id}
                    className="bg-slate-900 border border-slate-800 hover:border-cyan-600/80 rounded-xl p-4 transition-all flex flex-col justify-between space-y-3 group shadow-md hover:shadow-cyan-950/20"
                  >
                    {/* Top Row: Name & Tag */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {ds.name}
                            </span>
                            {ds.isIndianSource && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 rounded font-mono font-semibold" title="Indian National Dataset">
                                🇮🇳 Indian
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {ds.provider}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                            isOpen
                              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                              : isCommercial
                              ? 'bg-purple-950/80 border-purple-800 text-purple-300'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {ds.dataType} · {ds.access}
                        </span>
                      </div>

                      {/* Specs Row */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Resolution</span>
                          <span className="text-slate-200 font-medium">{ds.resolution}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Revisit / Update</span>
                          <span className="text-slate-200 font-medium">{ds.revisit}</span>
                        </div>
                      </div>

                      {/* Primary Use */}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {ds.primaryUse}
                      </p>

                      {/* JALRAKSHA Relevance */}
                      <div className="text-[11px] text-cyan-200/90 bg-cyan-950/40 p-2 rounded border border-cyan-900/60 font-mono">
                        <strong className="text-cyan-400 text-[10px] block uppercase">JALRAKSHA WASH Role:</strong>
                        {ds.relevanceToWASH}
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] font-mono">
                      <span className="text-slate-400 text-[10px]">
                        Table {ds.tableNumber}: {ds.thematicGroup}
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={ds.officialPortal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDatasets.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-2">
                <Database className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No datasets match your filters</h4>
                <p className="text-xs text-slate-400">Try resetting search keywords or changing the thematic category.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedThematicGroup('all');
                    setSelectedDomain('all');
                    setSelectedAccess('all');
                    setOnlyIndianSources(false);
                  }}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: 15 OPERATIONAL SERVICE PORTALS */}
        {activeView === 'portals' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Legend & Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-cyan-400" />
                    Table 15: Indian Disaster-Management & Earth-Observation Service Portals
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Official operational services providing inventory, monitoring, early warning, alert, and forecasting across India.
                  </p>
                </div>

                {/* Service Types Legend */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="text-slate-400">Service Types:</span>
                  <button
                    onClick={() => setSelectedPortalService(selectedPortalService === 'I' ? 'all' : 'I')}
                    className={`px-2 py-0.5 rounded border ${selectedPortalService === 'I' ? 'bg-cyan-600 text-white border-cyan-400 font-bold' : 'bg-slate-950 border-slate-800 text-cyan-300'}`}
                  >
                    I = Inventory / Mapping
                  </button>
                  <button
                    onClick={() => setSelectedPortalService(selectedPortalService === 'M' ? 'all' : 'M')}
                    className={`px-2 py-0.5 rounded border ${selectedPortalService === 'M' ? 'bg-cyan-600 text-white border-cyan-400 font-bold' : 'bg-slate-950 border-slate-800 text-blue-300'}`}
                  >
                    M = Monitoring
                  </button>
                  <button
                    onClick={() => setSelectedPortalService(selectedPortalService === 'E' ? 'all' : 'E')}
                    className={`px-2 py-0.5 rounded border ${selectedPortalService === 'E' ? 'bg-cyan-600 text-white border-cyan-400 font-bold' : 'bg-slate-950 border-slate-800 text-amber-300'}`}
                  >
                    E = Early Warning
                  </button>
                  <button
                    onClick={() => setSelectedPortalService(selectedPortalService === 'A' ? 'all' : 'A')}
                    className={`px-2 py-0.5 rounded border ${selectedPortalService === 'A' ? 'bg-cyan-600 text-white border-cyan-400 font-bold' : 'bg-slate-950 border-slate-800 text-red-300'}`}
                  >
                    A = Alert / Advisory
                  </button>
                  <button
                    onClick={() => setSelectedPortalService(selectedPortalService === 'F' ? 'all' : 'F')}
                    className={`px-2 py-0.5 rounded border ${selectedPortalService === 'F' ? 'bg-cyan-600 text-white border-cyan-400 font-bold' : 'bg-slate-950 border-slate-800 text-purple-300'}`}
                  >
                    F = Forecast
                  </button>
                </div>
              </div>
            </div>

            {/* Portals Table / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPortals.map((portal) => (
                <div
                  key={portal.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{portal.platform}</h4>
                        <span className="text-[11px] text-cyan-400 block">{portal.provider}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-300">
                        {portal.coverage}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Services & Disaster Types:</div>
                      <div className="text-slate-200 font-medium text-xs">{portal.services}</div>
                    </div>

                    {portal.description && (
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        {portal.description}
                      </p>
                    )}

                    {/* Service Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {portal.serviceTypes.map((st) => (
                        <span
                          key={st}
                          className="px-2 py-0.5 bg-cyan-950/70 border border-cyan-800/80 rounded text-[10px] text-cyan-300 font-bold"
                        >
                          {st === 'I' && 'Inventory (I)'}
                          {st === 'M' && 'Monitoring (M)'}
                          {st === 'E' && 'Early Warning (E)'}
                          {st === 'A' && 'Alert/Advisory (A)'}
                          {st === 'F' && 'Forecast (F)'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Official Portal Link</span>
                    <a
                      href={portal.webLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded flex items-center gap-1.5 transition-colors"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: MULTIMODAL FUSION ARCHITECTURE */}
        {activeView === 'multimodal' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 font-mono text-xs">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Multimodal Earth Observation Data Fusion Framework (Section 2 Rationale)
              </h3>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
                As emphasized in the IWMI catalogue paper, <em>"no single Earth Observation sensor can satisfy all flood mapping operational requirements."</em> Optical sensors (Sentinel-2, Resourcesat) are obscured during peak monsoon cloudbursts, while SAR (Sentinel-1, NISAR, EOS-04) can suffer from wind roughening or corner reflection in dense settlements. JALRAKSHA operationalizes the paper's multimodal fusion paradigm:
              </p>
            </div>

            {/* Fusion Diagram Workflow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Layer 1 */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-xs">Layer 1: All-Weather SAR</span>
                  <Radio className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-slate-400 text-[11px] font-sans">
                  <strong>Sentinel-1 + NISAR (L/S band) + EOS-04</strong>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  C-band and L-band radar penetrate heavy monsoon clouds and smoke. Otsu adaptive thresholding segments specular water surfaces into 2D flood polygons.
                </p>
                <div className="text-[10px] text-emerald-400 bg-emerald-950/80 p-1.5 rounded border border-emerald-800">
                  ✓ 100% Cloud Penetration
                </div>
              </div>

              {/* Layer 2 */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-xs">Layer 2: Bare-Earth Elevation</span>
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-slate-400 text-[11px] font-sans">
                  <strong>Copernicus GLO-30 + CartoDEM + FABDEM</strong>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  HAND (Height Above Nearest Drainage) algorithm calculates hydraulic flood depths. Distinguishes shallow sheetflow from deep submergence (&gt;1.0m) over tube well plinths.
                </p>
                <div className="text-[10px] text-amber-400 bg-amber-950/80 p-1.5 rounded border border-amber-800">
                  ✓ Submerged Plinth Detection
                </div>
              </div>

              {/* Layer 3 */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 text-xs">Layer 3: Infrastructure & Pop</span>
                  <Building2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-slate-400 text-[11px] font-sans">
                  <strong>OSM + Google Open Buildings + WorldPop</strong>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  Vector topological overlay maps drinking water taps, latrines, bridges, and culverts. Calculates Dijkstra detour gap where roads are submerged.
                </p>
                <div className="text-[10px] text-purple-400 bg-purple-950/80 p-1.5 rounded border border-purple-800">
                  ✓ Solves Straight-Line Fallacy
                </div>
              </div>

              {/* Layer 4 */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-300 text-xs">Layer 4: Ground Telemetry</span>
                  <Activity className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-slate-400 text-[11px] font-sans">
                  <strong>CWC Gauges + Field Reports + NLP</strong>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  Real-time river danger levels and citizen field dispatches parsed by Gemini AI extract diarrhea outbreaks and verify satellite waterlogged signatures.
                </p>
                <div className="text-[10px] text-red-400 bg-red-950/80 p-1.5 rounded border border-red-800">
                  ✓ Ground-Truth Verification
                </div>
              </div>
            </div>

            {/* Production Pluggability Code Snippet */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-white">Cloud-Native STAC / Bhoonidhi Pipeline Ingestion Endpoint</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Open Geospatial Consortium (OGC) Compliant</span>
              </div>
              <pre className="p-3 bg-slate-900 rounded border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto leading-relaxed">
{`// JALRAKSHA Multi-Source Pipeline Orchestrator (based on Ghosh, 2026)
const INGESTION_TARGETS = {
  sar_primary: 'Copernicus:Sentinel-1-GRD', // All-weather 10m flood mask
  sar_secondary: 'ISRO:NISAR-L-S-Band',      // Deep canopy penetration (Table 2)
  optical_baseline: 'ISRO:Resourcesat-2A',   // Pre-flood agrarian reference (Table 3)
  elevation_model: 'Copernicus:GLO-30-HAND',  // Bare-earth flood depth profile (Table 6)
  hydrology_gauge: 'CWC:Station-Telemetry',   // Real-time danger level verification (Table 13)
  infrastructure: 'OSM:Overpass-WASH-Query',  // amenity=drinking_water + barrier=culvert (Table 11)
  citizen_ground: 'JALRAKSHA:Gemini-NLP-Feed' // Geotagged diarrhea & contamination reports (Table 14)
};`}
              </pre>
            </div>
          </div>
        )}

        {/* VIEW 4: THE 3 IMPACT DOMAINS */}
        {activeView === 'domains' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {EO_CATALOGUE_META.impactDomains.map((dom) => (
              <div
                key={dom.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {dom.id === 'infrastructure_wash' && <Building2 className="w-5 h-5 text-cyan-400" />}
                    {dom.id === 'agriculture' && <Wheat className="w-5 h-5 text-emerald-400" />}
                    {dom.id === 'wildlife' && <TreePine className="w-5 h-5 text-purple-400" />}
                    <h3 className="text-sm font-bold text-white">{dom.name}</h3>
                  </div>

                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {dom.desc}
                  </p>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Key Complementary Sensors:</span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {dom.keySensors.map((sensor) => (
                        <span key={sensor} className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-cyan-300">
                          {sensor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedDomain(dom.id);
                      setActiveView('datasets');
                    }}
                    className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Matching Datasets</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
