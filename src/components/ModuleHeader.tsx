import React from 'react';
import { 
  Sliders, 
  Search, 
  Route, 
  FileText, 
  Cpu, 
  Satellite, 
  BarChart3, 
  BookOpen, 
  Compass,
  ArrowRight,
  Database
} from 'lucide-react';
import { TabId } from './Navbar';

interface ModuleHeaderProps {
  category: 'triage' | 'intel' | 'science';
  currentTab: TabId;
  onNavigateTab: (tab: TabId) => void;
  title?: string;
  subtitle?: string;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  category,
  currentTab,
  onNavigateTab,
  title,
  subtitle,
}) => {
  const tabsByCategory = {
    triage: [
      { id: 'priority' as TabId, label: 'Priority Index & Triage', icon: <Sliders className="w-3.5 h-3.5" /> },
      { id: 'community' as TabId, label: 'Community Profiles', icon: <Search className="w-3.5 h-3.5" /> },
      { id: 'access' as TabId, label: 'Facility Access & Detours', icon: <Route className="w-3.5 h-3.5" /> },
    ],
    intel: [
      { id: 'reports' as TabId, label: 'Citizen & Field Reports', icon: <FileText className="w-3.5 h-3.5" /> },
      { id: 'ai' as TabId, label: 'AI Signal Extraction', icon: <Cpu className="w-3.5 h-3.5" /> },
    ],
    science: [
      { id: 'catalogue' as TabId, label: 'EO Data Catalogue (69 Datasets)', icon: <Database className="w-3.5 h-3.5" /> },
      { id: 'satellite' as TabId, label: 'Satellite Earth Observation', icon: <Satellite className="w-3.5 h-3.5" /> },
      { id: 'analytics' as TabId, label: 'Basin Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
      { id: 'methodology' as TabId, label: 'Methodology & Specs', icon: <BookOpen className="w-3.5 h-3.5" /> },
    ],
  };

  const currentTabs = tabsByCategory[category] || [];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-sm sticky top-[57px] z-30 flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {currentTabs.map((t) => {
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onNavigateTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm font-bold shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigateTab('map')}
          className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800 hover:border-cyan-800 transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Switch to Map</span>
        </button>
      </div>
    </div>
  );
};
