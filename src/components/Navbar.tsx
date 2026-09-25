import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Map as MapIcon, 
  Sliders, 
  Search, 
  Route, 
  FileText, 
  Cpu, 
  Satellite, 
  BarChart3, 
  BookOpen, 
  PlayCircle,
  Zap,
  Command,
  X,
  Menu,
  ChevronDown,
  ChevronRight,
  Compass,
  Sun,
  Moon,
  Database,
  Globe
} from 'lucide-react';
import { Community, GlobalDisasterZone } from '../types';
import { JalrakshaLogo } from './JalrakshaLogo';

export type TabId = 
  | 'overview' 
  | 'map' 
  | 'priority' 
  | 'community' 
  | 'access' 
  | 'reports' 
  | 'ai' 
  | 'satellite' 
  | 'analytics' 
  | 'methodology'
  | 'catalogue';

interface NavbarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onStartDemoTour: () => void;
  criticalCount: number;
  communities?: Community[];
  selectedCommunity?: Community | null;
  onSelectCommunity?: (comm: Community) => void;
  unverifiedReportsCount?: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  activeZone?: GlobalDisasterZone;
  onOpenZoneSelector?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onStartDemoTour,
  criticalCount,
  communities = [],
  selectedCommunity,
  onSelectCommunity,
  unverifiedReportsCount = 0,
  theme = 'dark',
  onToggleTheme,
  activeZone,
  onOpenZoneSelector,
}) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Secondary modules under the "More Tools" dropdown
  const secondaryTabs = [
    {
      group: 'ACCESS & DEEP-DIVE',
      items: [
        { id: 'access' as TabId, label: 'Facility Access & Detours', icon: <Route className="w-3.5 h-3.5" />, desc: 'Real routing vs straight-line severance' },
        { id: 'community' as TabId, label: 'Community Profiles', icon: <Search className="w-3.5 h-3.5" />, desc: 'WASH infrastructure breakdown by village' },
      ]
    },
    {
      group: 'EARTH OBSERVATION & INTEL',
      items: [
        { id: 'catalogue' as TabId, label: 'EO Data Catalogue (IWMI)', icon: <Database className="w-3.5 h-3.5" />, desc: '69 Multi-source datasets & 15 Indian service portals' },
        { id: 'ai' as TabId, label: 'AI Signal Extraction', icon: <Cpu className="w-3.5 h-3.5" />, desc: 'Citizen voice/text NLP urgency extraction' },
        { id: 'satellite' as TabId, label: 'Satellite EO (Sentinel-1)', icon: <Satellite className="w-3.5 h-3.5" />, desc: 'Radar backscatter flood extent telemetry' },
        { id: 'analytics' as TabId, label: 'Basin Analytics', icon: <BarChart3 className="w-3.5 h-3.5" />, desc: 'Correlation matrices & exposure charts' },
        { id: 'methodology' as TabId, label: 'Methodology & Architecture', icon: <BookOpen className="w-3.5 h-3.5" />, desc: 'Technical documentation & scoring formulas' },
      ]
    }
  ];

  const secondaryItemIds = secondaryTabs.flatMap(g => g.items.map(i => i.id));
  const isSecondaryActive = secondaryItemIds.includes(currentTab);
  const activeSecondaryItem = secondaryTabs.flatMap(g => g.items).find(i => i.id === currentTab);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered items for command palette
  const allNavItems = [
    { id: 'overview' as TabId, label: 'Overview Dashboard', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'map' as TabId, label: 'Disaster Map GIS', icon: <MapIcon className="w-3.5 h-3.5" /> },
    { id: 'priority' as TabId, label: 'WASH Priority Triage Index', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'reports' as TabId, label: 'Citizen & Field Incident Reports', icon: <FileText className="w-3.5 h-3.5" /> },
    ...secondaryTabs.flatMap(g => g.items)
  ];

  const filteredNavItems = allNavItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.ruralMunicipality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJumpToEpicenter = () => {
    const prakashpur = communities.find(c => c.id === 'comm-1' || c.name.includes('Prakashpur'));
    if (prakashpur && onSelectCommunity) {
      onSelectCommunity(prakashpur);
    }
    onSelectTab('map');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Unified Single Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            type="button"
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Return to Situation Overview"
          >
            <JalrakshaLogo size="sm" />
            <div>
              <span className="text-base font-black tracking-wider text-white uppercase font-mono group-hover:text-cyan-300 transition-colors">
                JALRAKSHA
              </span>
              <p className="hidden md:block text-[10px] text-slate-400 font-sans">
                Universal Post-Flood WASH Decision Support
              </p>
            </div>
          </button>

          {activeZone && onOpenZoneSelector ? (
            <button
              type="button"
              onClick={onOpenZoneSelector}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/80 hover:border-cyan-400 transition-all cursor-pointer shadow-sm group/btn ml-1"
              title="Change Global Flood Disaster Zone or Set Custom Coordinates"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span>{activeZone.flag}</span>
              <span className="font-bold max-w-[110px] sm:max-w-[160px] truncate">{activeZone.name.split('(')[0].trim()}</span>
              <ChevronDown className="w-3 h-3 text-cyan-400 group-hover/btn:translate-y-0.5 transition-transform shrink-0" />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 ml-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              Global Active
            </span>
          )}
        </div>

        {/* Center: Clean Primary Segmented Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono shadow-inner">
          {/* 1. Overview */}
          <button
            id="nav-tab-overview"
            onClick={() => onSelectTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentTab === 'overview'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950 border border-cyan-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          {/* 2. Disaster Map */}
          <button
            id="nav-tab-map"
            onClick={() => onSelectTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentTab === 'map'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950 border border-cyan-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Disaster Map</span>
          </button>

          {/* 3. WASH Priority */}
          <button
            id="nav-tab-priority"
            onClick={() => onSelectTab('priority')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentTab === 'priority'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950 border border-cyan-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Priority Index</span>
            {criticalCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-600 text-white">
                {criticalCount}
              </span>
            )}
          </button>

          {/* 4. Field Reports */}
          <button
            id="nav-tab-reports"
            onClick={() => onSelectTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentTab === 'reports'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950 border border-cyan-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Field Reports</span>
            {unverifiedReportsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950">
                {unverifiedReportsCount}
              </span>
            )}
          </button>

          {/* 5. More Modules Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                isSecondaryActive
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {isSecondaryActive && activeSecondaryItem ? (
                <>
                  {activeSecondaryItem.icon}
                  <span>{activeSecondaryItem.label.split(' ')[0]}...</span>
                </>
              ) : (
                <span>More Tools</span>
              )}
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {secondaryTabs.map((group) => (
                  <div key={group.group} className="mb-2 last:mb-0">
                    <span className="px-2.5 py-1 text-[10px] text-slate-400 font-bold tracking-wider uppercase block">
                      {group.group}
                    </span>
                    <div className="space-y-1 mt-0.5">
                      {group.items.map((item) => {
                        const isActive = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            id={`nav-dropdown-${item.id}`}
                            onClick={() => {
                              onSelectTab(item.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full flex items-start gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                              isActive
                                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                            }`}
                          >
                            <span className="mt-0.5">{item.icon}</span>
                            <div>
                              <div className="text-xs font-medium leading-none">{item.label}</div>
                              <div className={`text-[10px] mt-0.5 font-sans leading-tight ${isActive ? 'text-cyan-100' : 'text-slate-400'}`}>
                                {item.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Operational Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Jump / Search Trigger */}
          <button
            id="btn-nav-command-palette"
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white text-xs font-mono transition-all shadow-inner"
            title="Search communities and tabs (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-slate-800 border border-slate-700 text-[9px] text-slate-400">⌘K</kbd>
          </button>

          {/* Theme Switcher: Light / Dark Mode */}
          {onToggleTheme && (
            <button
              id="btn-theme-toggle"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white text-xs font-mono transition-all shadow-inner"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle light or dark theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Light</span>
                </>
              )}
            </button>
          )}

          {/* Direct Focus: Epicenter Prakashpur */}
          <button
            id="btn-nav-jump-prakashpur"
            onClick={handleJumpToEpicenter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/90 border border-red-800 hover:bg-red-900 text-red-200 text-xs font-mono font-bold transition-all shadow-sm"
            title="Focus immediately on Prakashpur (Ward 4) Crisis Zone"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="hidden md:inline">Epicenter:</span>
            <span>Prakashpur</span>
          </button>

          {/* 15-Step Guided Demo Tour */}
          <button
            id="btn-demo-tour-launch"
            onClick={onStartDemoTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-950/30 transition-all font-mono"
            title="Launch 15-step Hackathon presentation demo story"
          >
            <PlayCircle className="w-3.5 h-3.5 fill-slate-950 text-amber-200" />
            <span className="hidden sm:inline">15-Step</span> Tour
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile / Small Screen Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 p-4 space-y-3 font-mono text-xs shadow-2xl">
          {/* Mobile Theme & Epicenter Shortcut */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Switch to Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Switch to Light Mode</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => { handleJumpToEpicenter(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-950 border border-red-800 text-red-200 font-bold"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Prakashpur</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onSelectTab('overview'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center gap-2 ${currentTab === 'overview' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-300'}`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => { onSelectTab('map'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center gap-2 ${currentTab === 'map' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-300'}`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Disaster Map</span>
            </button>
            <button
              onClick={() => { onSelectTab('priority'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center justify-between ${currentTab === 'priority' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-300'}`}
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Priority Index</span>
              </span>
              {criticalCount > 0 && <span className="px-1.5 rounded-full text-[9px] bg-red-600 text-white">{criticalCount}</span>}
            </button>
            <button
              onClick={() => { onSelectTab('reports'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg flex items-center justify-between ${currentTab === 'reports' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-300'}`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Field Reports</span>
              </span>
              {unverifiedReportsCount > 0 && <span className="px-1.5 rounded-full text-[9px] bg-amber-500 text-slate-950 font-bold">{unverifiedReportsCount}</span>}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Deep-Dive & Intelligence</span>
            <div className="grid grid-cols-2 gap-1.5">
              {secondaryTabs.flatMap(g => g.items).map(item => (
                <button
                  key={item.id}
                  onClick={() => { onSelectTab(item.id); setMobileMenuOpen(false); }}
                  className={`p-2 rounded-lg flex items-center gap-2 text-left ${currentTab === item.id ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900/70 text-slate-300'}`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Command Palette / Quick Jump Modal */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/50 rounded-xl shadow-2xl overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="flex items-center px-3 py-3 border-b border-slate-800 gap-2 bg-slate-950">
              <Search className="w-4 h-4 text-cyan-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search modules, settlements (e.g. 'Prakashpur', 'Gobargadha', 'Priority')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-sans"
              />
              <button 
                onClick={() => setCommandPaletteOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results list */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-3">
              {/* Modules section */}
              {filteredNavItems.length > 0 && (
                <div>
                  <span className="px-2 text-[10px] text-slate-400 font-bold uppercase">Navigation Modules</span>
                  <div className="mt-1 space-y-1">
                    {filteredNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          setCommandPaletteOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors group text-left"
                      >
                        <span className="flex items-center gap-2.5 font-sans font-medium text-xs">
                          {item.icon}
                          <span>{item.label}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities Quick Jump */}
              {filteredCommunities.length > 0 && (
                <div>
                  <span className="px-2 text-[10px] text-slate-400 font-bold uppercase">Communities / Settlements ({filteredCommunities.length})</span>
                  <div className="mt-1 space-y-1">
                    {filteredCommunities.map((comm) => (
                      <button
                        key={comm.id}
                        onClick={() => {
                          if (onSelectCommunity) onSelectCommunity(comm);
                          onSelectTab('map');
                          setCommandPaletteOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors group text-left"
                      >
                        <div>
                          <div className="flex items-center gap-2 font-sans font-semibold text-xs text-white">
                            <span>{comm.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">({comm.district} - {comm.ward})</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Pop: {comm.exposedPopulation.toLocaleString()} | Flood: {comm.floodDepthMeters}m | Road: {comm.roadAccessibility}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            comm.priorityCategory === 'CRITICAL' ? 'bg-red-600 text-white' :
                            comm.priorityCategory === 'HIGH' ? 'bg-amber-600 text-white' :
                            'bg-cyan-600 text-white'
                          }`}>
                            {comm.priorityScore}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredNavItems.length === 0 && filteredCommunities.length === 0 && (
                <div className="py-8 text-center text-slate-500">
                  No matching modules or communities found for "{searchQuery}"
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>Press <kbd className="px-1 rounded bg-slate-800 text-slate-400">ESC</kbd> to close</span>
              <span>{activeZone ? activeZone.name : 'Global Monitoring'} • {communities.length} Settlements</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
