import React, { useState, useEffect } from 'react';
import { 
  INITIAL_COMMUNITIES, 
  MOCK_WATER_SOURCES, 
  MOCK_SANITATION_FACILITIES, 
  MOCK_HEALTH_FACILITIES, 
  MOCK_ROADS, 
  INITIAL_COMMUNITY_REPORTS 
} from './data/mockData';
import { 
  Community, 
  PriorityWeights, 
  CommunityReport, 
  WaterSource, 
  SanitationFacility, 
  HealthFacility, 
  RoadSegment,
  GlobalDisasterZone
} from './types';
import { KOSHI_DISASTER_ZONE } from './data/globalDisasterZones';
import { DEFAULT_WEIGHTS, recalculateAllCommunities } from './utils/priorityCalculator';
import { Navbar, TabId } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { DisasterMap } from './components/DisasterMap';
import { WashPriority } from './components/WashPriority';
import { CommunityAnalysis } from './components/CommunityAnalysis';
import { FacilityAccess } from './components/FacilityAccess';
import { CommunityReports } from './components/CommunityReports';
import { AiExtraction } from './components/AiExtraction';
import { SatelliteModule } from './components/SatelliteModule';
import { AnalyticsModule } from './components/AnalyticsModule';
import { Methodology } from './components/Methodology';
import { EoCatalogueModule } from './components/EoCatalogueModule';
import { DemoTourModal } from './components/DemoTourModal';
import { GlobalZoneSelectorModal } from './components/GlobalZoneSelectorModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('overview');
  const [priorityWeights, setPriorityWeights] = useState<PriorityWeights>(DEFAULT_WEIGHTS);

  // Active Global Disaster AOI (Default: Koshi Basin, supports Assam, Indus, Brazil, Spain, Libya, and any custom coordinates)
  const [activeZone, setActiveZone] = useState<GlobalDisasterZone>(KOSHI_DISASTER_ZONE);
  const [zoneSelectorOpen, setZoneSelectorOpen] = useState(false);

  const [communities, setCommunities] = useState<Community[]>(() =>
    recalculateAllCommunities(KOSHI_DISASTER_ZONE.communities, DEFAULT_WEIGHTS)
  );
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(() => {
    const comms = recalculateAllCommunities(KOSHI_DISASTER_ZONE.communities, DEFAULT_WEIGHTS);
    return comms[0] || null;
  });

  // Light / Dark Theme State with persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jalraksha_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('jalraksha_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [reports, setReports] = useState<CommunityReport[]>(() => KOSHI_DISASTER_ZONE.reports);
  const [waterSources, setWaterSources] = useState<WaterSource[]>(KOSHI_DISASTER_ZONE.waterSources);
  const [sanitationFacilities, setSanitationFacilities] = useState<SanitationFacility[]>(KOSHI_DISASTER_ZONE.sanitationFacilities);
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>(KOSHI_DISASTER_ZONE.healthFacilities);
  const [roads, setRoads] = useState<RoadSegment[]>(KOSHI_DISASTER_ZONE.roads);

  // Demo tour state
  const [demoTourOpen, setDemoTourOpen] = useState(false);

  // AI prefill state when transferred from reports
  const [aiText, setAiText] = useState<string>('');
  const [aiCommunity, setAiCommunity] = useState<string>('');

  // Switch Global Disaster AOI
  const handleSelectZone = (newZone: GlobalDisasterZone) => {
    setActiveZone(newZone);
    const updated = recalculateAllCommunities(newZone.communities, priorityWeights);
    setCommunities(updated);
    setSelectedCommunity(updated[0] || null);
    setWaterSources(newZone.waterSources);
    setSanitationFacilities(newZone.sanitationFacilities);
    setHealthFacilities(newZone.healthFacilities);
    setRoads(newZone.roads);
    setReports(newZone.reports);
  };

  // Handle dynamic recalculation when weights change
  const handleWeightsChange = (newWeights: PriorityWeights) => {
    setPriorityWeights(newWeights);
    const updated = recalculateAllCommunities(activeZone.communities, newWeights);
    setCommunities(updated);

    // Keep selected community in sync
    if (selectedCommunity) {
      const found = updated.find((c) => c.id === selectedCommunity.id);
      if (found) setSelectedCommunity(found);
    }
  };

  // Handle adding new field report
  const handleAddReport = (newReport: CommunityReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  // Handle report verification
  const handleVerifyReport = (reportId: string, status: 'VERIFIED' | 'SATELLITE MATCHED') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
  };

  // Trigger AI analysis from report
  const handleAnalyzeWithAi = (text: string, commName: string) => {
    setAiText(text);
    setAiCommunity(commName);
    setCurrentTab('ai');
  };

  const criticalCount = communities.filter((c) => c.priorityCategory === 'CRITICAL').length;
  const unverifiedReportsCount = reports.filter((r) => r.status === 'UNVERIFIED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation & Status Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onStartDemoTour={() => setDemoTourOpen(true)}
        criticalCount={criticalCount}
        communities={communities}
        selectedCommunity={selectedCommunity}
        onSelectCommunity={(comm) => setSelectedCommunity(comm)}
        unverifiedReportsCount={unverifiedReportsCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeZone={activeZone}
        onOpenZoneSelector={() => setZoneSelectorOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full">
        {currentTab === 'overview' && (
          <OverviewDashboard
            communities={communities}
            waterSources={waterSources}
            sanitationFacilities={sanitationFacilities}
            healthFacilities={healthFacilities}
            onSelectTab={(tab) => setCurrentTab(tab)}
            onSelectCommunity={(comm) => setSelectedCommunity(comm)}
            onStartDemoTour={() => setDemoTourOpen(true)}
            activeZone={activeZone}
            onOpenZoneSelector={() => setZoneSelectorOpen(true)}
            onSelectZone={handleSelectZone}
          />
        )}

        {currentTab === 'map' && (
          <DisasterMap
            communities={communities}
            waterSources={waterSources}
            sanitationFacilities={sanitationFacilities}
            healthFacilities={healthFacilities}
            roads={roads}
            reports={reports}
            selectedCommunity={selectedCommunity}
            onSelectCommunity={(comm) => {
              setSelectedCommunity(comm);
            }}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            theme={theme}
            activeZone={activeZone}
            floodPolygons={activeZone.floodPolygons}
            onOpenZoneSelector={() => setZoneSelectorOpen(true)}
            onSelectZone={handleSelectZone}
          />
        )}

        {currentTab === 'priority' && (
          <WashPriority
            communities={communities}
            weights={priorityWeights}
            onWeightsChange={handleWeightsChange}
            onSelectCommunity={(comm) => {
              setSelectedCommunity(comm);
              setCurrentTab('community');
            }}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'community' && (
          <CommunityAnalysis
            communities={communities}
            selectedCommunity={selectedCommunity || communities[0]}
            onSelectCommunity={(comm) => setSelectedCommunity(comm)}
            waterSources={waterSources}
            sanitationFacilities={sanitationFacilities}
            healthFacilities={healthFacilities}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'access' && (
          <FacilityAccess
            communities={communities}
            healthFacilities={healthFacilities}
            waterSources={waterSources}
            roads={roads}
            selectedCommunity={selectedCommunity || communities[0]}
            onSelectCommunity={(comm) => setSelectedCommunity(comm)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'reports' && (
          <CommunityReports
            communities={communities}
            reports={reports}
            onAddReport={handleAddReport}
            onVerifyReport={handleVerifyReport}
            onAnalyzeWithAI={handleAnalyzeWithAi}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'ai' && (
          <AiExtraction
            initialText={aiText}
            initialCommunity={aiCommunity}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'satellite' && (
          <SatelliteModule onNavigateTab={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsModule
            communities={communities}
            waterSources={waterSources}
            healthFacilities={healthFacilities}
            sanitationFacilities={sanitationFacilities}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'methodology' && (
          <Methodology onNavigateTab={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'catalogue' && (
          <EoCatalogueModule onNavigateTab={(tab) => setCurrentTab(tab)} />
        )}
      </main>

      {/* 15-Step Guided Live Demo Tour Modal */}
      <DemoTourModal
        isOpen={demoTourOpen}
        onClose={() => setDemoTourOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onSelectCommunity={(comm) => setSelectedCommunity(comm)}
        communities={communities}
        onWeightsChange={handleWeightsChange}
        onRunAiSample={(text, commName) => {
          setAiText(text);
          setAiCommunity(commName);
        }}
      />

      {/* Global Disaster Zone & Custom AOI Coordinates Modal */}
      <GlobalZoneSelectorModal
        isOpen={zoneSelectorOpen}
        onClose={() => setZoneSelectorOpen(false)}
        activeZoneId={activeZone.id}
        onSelectZone={handleSelectZone}
      />
    </div>
  );
}
