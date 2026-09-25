import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Compass, 
  AlertTriangle, 
  Route, 
  Sliders, 
  FileText, 
  Cpu, 
  ShieldCheck,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Community, PriorityWeights } from '../types';
import { TabId } from './Navbar';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabId) => void;
  onSelectCommunity: (comm: Community) => void;
  communities: Community[];
  onWeightsChange: (weights: PriorityWeights) => void;
  onRunAiSample: (text: string, commName: string) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectCommunity,
  communities,
  onWeightsChange,
  onRunAiSample,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const villageA = communities.find((c) => c.name.includes('Prakashpur') || c.id === 'comm-1') || communities[0];

  const steps = [
    {
      step: 1,
      title: "Global Multi-Basin Flood Situation & Operational Baseline",
      tab: 'overview' as TabId,
      actionLabel: "View Operational Dashboard",
      notes: "Extreme hydrometeorological events cause overbank flooding and infrastructure collapse worldwide. JALRAKSHA provides instant situational awareness across global basins—from South Asia to Europe, Africa, and the Americas—monitoring drinking water contamination and disease outbreak risk.",
      execute: () => {
        onNavigateTab('overview');
      },
    },
    {
      step: 2,
      title: "Show Baseline Satellite Flood Extent",
      tab: 'map' as TabId,
      actionLabel: "View Sentinel-1 Radar Extent",
      notes: "Copernicus Sentinel-1 SAR C-band microwave radar penetrates thick monsoon clouds, delineating 184 km² of standing flood inundation. Follows the IWMI Multi-Source EO Catalogue framework (Ghosh, 2026).",
      execute: () => {
        onNavigateTab('map');
      },
    },
    {
      step: 3,
      title: "Highlight Settlements in Inundation Zone",
      tab: 'map' as TabId,
      actionLabel: "Inspect Settlement Overlay",
      notes: "Spatial overlay identifies 16 key rural settlements within the inundation zone, exposing over 24,000 residents to direct flood hazards.",
      execute: () => {
        onNavigateTab('map');
      },
    },
    {
      step: 4,
      title: "Overlay Water Points (Tube Wells & Handpumps)",
      tab: 'map' as TabId,
      actionLabel: "Toggle Water Point Assets",
      notes: "Drinking water infrastructure registry reveals numerous shallow tube wells and deep handpumps submerged beneath turbid surface water, terminating safe water delivery.",
      execute: () => {
        onNavigateTab('map');
      },
    },
    {
      step: 5,
      title: "Show Sanitation Facilities Affected",
      tab: 'map' as TabId,
      actionLabel: "Highlight Flooded Pit Latrines",
      notes: "Unsealed household and community pit latrines are submerged or overflowing, creating acute biological contagion risks of E. coli and Vibrio cholerae.",
      execute: () => {
        onNavigateTab('map');
      },
    },
    {
      step: 6,
      title: "Examine Health Facilities with Reduced Access",
      tab: 'map' as TabId,
      actionLabel: "View Impacted Health Posts",
      notes: "Submerged causeways cut off primary health care posts, preventing patients with acute diarrhea and dehydration from reaching emergency medical staff.",
      execute: () => {
        onNavigateTab('map');
      },
    },
    {
      step: 7,
      title: "Identify Prakashpur as Potential Crisis Zone",
      tab: 'map' as TabId,
      actionLabel: "Pinpoint Prakashpur on Map",
      notes: "Prakashpur (Ward 4, Sunsari) flags a critical vulnerability signature: high flood depth (1.4m), 2,850 exposed residents, submerged main water source, and severed road links.",
      execute: () => {
        onSelectCommunity(villageA);
        onNavigateTab('map');
      },
    },
    {
      step: 8,
      title: "Open Prakashpur Deep Vulnerability Analysis",
      tab: 'community' as TabId,
      actionLabel: "Open Community Diagnostic Card",
      notes: "The explainable decision-support breakdown reveals exactly why Prakashpur is prioritized: critical water loss, contaminated latrines, and excessive travel distance to clean water.",
      execute: () => {
        onSelectCommunity(villageA);
        onNavigateTab('community');
      },
    },
    {
      step: 9,
      title: "The Straight-Line Fallacy: Submerged Road & Detour Gap",
      tab: 'access' as TabId,
      actionLabel: "Examine 9.4 km vs 3.2 km Route Cutoff",
      notes: "Crucial demonstration: Straight-line distance to safe water is only 3.2 km, but floodwaters have destroyed the main box culvert. The actual passable route is 9.4 km (a +6.2 km / 2.9x penalty), making foot haulage impossible.",
      execute: () => {
        onSelectCommunity(villageA);
        onNavigateTab('access');
      },
    },
    {
      step: 10,
      title: "Open WASH Emergency Priority Index Engine",
      tab: 'priority' as TabId,
      actionLabel: "Open Priority Index Matrix",
      notes: "Transparent multi-criteria decision ranking combines normalized factors (flood depth, water status, population, accessibility difficulty, and health access).",
      execute: () => {
        onNavigateTab('priority');
      },
    },
    {
      step: 11,
      title: "Adjust Factor Weights: Prioritize Road Accessibility",
      tab: 'priority' as TabId,
      actionLabel: "Boost Road Isolation Weight to 35%",
      notes: "In response to road washouts, humanitarian logistics teams adjust the Road Accessibility weight slider to 35%, immediately dynamically recalculating scores across all communities.",
      execute: () => {
        onWeightsChange({
          floodExposure: 15,
          washDisruption: 20,
          populationExposure: 15,
          roadAccessibility: 35,
          healthAccessibility: 15,
        });
        onNavigateTab('priority');
      },
    },
    {
      step: 12,
      title: "Review Updated Dynamic Triage Ranking",
      tab: 'priority' as TabId,
      actionLabel: "Review Real-Time Score Updates",
      notes: "The priority matrix instantly promotes severely isolated communities to CRITICAL status, proving transparent, responsive decision support without hidden biases.",
      execute: () => {
        onNavigateTab('priority');
      },
    },
    {
      step: 13,
      title: "Review Citizen Ground Report for Prakashpur",
      tab: 'reports' as TabId,
      actionLabel: "Open Citizen Reports Feed",
      notes: "Ground truth telemetry from field volunteers confirms muddy handpump water and pediatric diarrhea cases, corroborating the satellite-derived disruption model.",
      execute: () => {
        onNavigateTab('reports');
      },
    },
    {
      step: 14,
      title: "Demonstrate AI Structured Information Extraction",
      tab: 'ai' as TabId,
      actionLabel: "Run NLP Extraction Engine",
      notes: "The Gemini AI NLP model parses unstructured dispatch text into standardized entities: submerged tube well, latrine overflow, cholera/AWD threat, and boat convoy recommendation.",
      execute: () => {
        onNavigateTab('ai');
        onRunAiSample(
          "Prakashpur Ward 4 field dispatch: Floodwaters rose to 1.5m over the past 6 hours. Central deep tube well is submerged. Over 2,500 people have no drinking water. Severe diarrhea outbreak emerging. District hospital access cut off at northern culvert.",
          "Prakashpur"
        );
      },
    },
    {
      step: 15,
      title: "Conclude with Targeted Humanitarian Interventions",
      tab: 'community' as TabId,
      actionLabel: "View Actionable Relief Checklist",
      notes: "JALRAKSHA delivers actionable decisions: Deploy 10,000 Aquatabs, 5,000L mobile water bladders, temporary trench latrines, and prioritized Bailey bridge restoration.",
      execute: () => {
        onSelectCommunity(villageA);
        onNavigateTab('community');
      },
    },
  ];

  const currentStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      steps[nextStepNum - 1].execute();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      steps[prevStepNum - 1].execute();
    }
  };

  const handleJump = (stepNum: number) => {
    setCurrentStep(stepNum);
    steps[stepNum - 1].execute();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm font-mono animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-b border-amber-500/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              {currentStep}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  15-Step Hackathon Demo Story
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Step {currentStep} of 15
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Speaker Notes */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Speaker Notes Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Presenter Narrative & Operational Insight:
            </span>
            <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
              "{currentStepData.notes}"
            </p>
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs">
            <span className="text-slate-300">
              Target View: <strong className="text-cyan-400 uppercase">{currentStepData.tab}</strong>
            </span>

            <button
              onClick={currentStepData.execute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{currentStepData.actionLabel}</span>
            </button>
          </div>

          {/* Step Progress Bar & Thumbnails */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Sequence Progress</span>
              <span>{Math.round((currentStep / 15) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Mini Step Quick Selector */}
          <div className="flex flex-wrap gap-1 pt-1 justify-center">
            {steps.map((s) => (
              <button
                key={s.step}
                onClick={() => handleJump(s.step)}
                className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
                  s.step === currentStep 
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-110' 
                    : s.step < currentStep 
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-800' 
                    : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-white'
                }`}
                title={s.title}
              >
                {s.step}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-bold disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Exit Guided Tour
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === 15}
            className="flex items-center gap-1 px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold disabled:opacity-30 transition-colors shadow-md shadow-cyan-950"
          >
            <span>{currentStep === 15 ? 'Completed' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
