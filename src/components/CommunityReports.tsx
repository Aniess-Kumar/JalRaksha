import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Satellite, 
  Clock, 
  User, 
  Image, 
  ShieldCheck, 
  UploadCloud, 
  Search,
  Filter,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Community, CommunityReport } from '../types';
import { TabId } from './Navbar';
import { ModuleHeader } from './ModuleHeader';

interface CommunityReportsProps {
  communities: Community[];
  reports: CommunityReport[];
  onAddReport: (report: CommunityReport) => void;
  onVerifyReport: (reportId: string, status: 'VERIFIED' | 'SATELLITE MATCHED') => void;
  onAnalyzeWithAI: (reportText: string, communityName: string) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const CommunityReports: React.FC<CommunityReportsProps> = ({
  communities,
  reports,
  onAddReport,
  onVerifyReport,
  onAnalyzeWithAI,
  onNavigateTab,
}) => {
  const [selectedCommId, setSelectedCommId] = useState<string>(communities[0]?.id || '');
  const [issueType, setIssueType] = useState<CommunityReport['reportType']>('Water Contamination');
  const [urgency, setUrgency] = useState<CommunityReport['urgency']>('CRITICAL');
  const [description, setDescription] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('Nepal Red Cross Field Volunteer');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handlePreFill = (text: string, type: CommunityReport['reportType'], urg: CommunityReport['urgency'], commName: string) => {
    setDescription(text);
    setIssueType(type);
    setUrgency(urg);
    const comm = communities.find((c) => c.name.includes(commName)) || communities[0];
    if (comm) setSelectedCommId(comm.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    const comm = communities.find((c) => c.id === selectedCommId) || communities[0];

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      communityId: comm.id,
      communityName: comm.name,
      reporterRole: reporterName,
      reportType: issueType,
      urgency,
      description,
      timestamp: 'Just now (Oct 06, 2024)',
      status: 'UNVERIFIED',
      coordinates: [
        comm.coordinates[0] + (Math.random() - 0.5) * 0.005,
        comm.coordinates[1] + (Math.random() - 0.5) * 0.005,
      ],
      photoUrl: photoUrl || undefined,
    };

    setTimeout(() => {
      onAddReport(newReport);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 400);
  };

  const filteredReports = reports.filter((r) => {
    if (filterCategory !== 'All' && r.reportType !== filterCategory) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="w-full">
      <ModuleHeader category="intel" currentTab="reports" onNavigateTab={onNavigateTab} />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" />
          Community Citizen Reports & Ground Truth Verification
        </h2>
        <p className="text-xs text-slate-400">
          Integrating localized field observations with satellite radar to validate or challenge spaceborne disruption models
        </p>
      </div>

      {/* Explainer Banner (Prompt Mandate) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs shadow-lg">
        <div className="flex items-start gap-3 text-slate-300">
          <Satellite className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">Why Ground Reports are Critical:</strong> Earth Observation satellites accurately capture wide-area surface standing water, but cannot directly detect subterranean aquifer contamination, damaged pump foot valves, or cracked pit latrines beneath tree canopies. Citizen reports bridge this gap.
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('ai')}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Launch AI Extraction Engine</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Intake Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              Submit Ground Report
            </h3>
            <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              Field Portal
            </span>
          </div>

          {/* Quick Pre-fill Demonstrations */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Demo Scenarios:
            </span>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handlePreFill(
                  "Prakashpur Ward 4: Main deep tube well is submerged under 1.4m of murky floodwater. Handpumps are pumping turbid brownish water with heavy sediment. 12 children showing early signs of acute diarrheal sickness. Immediate Aquatabs and mobile filtration needed.",
                  "Water Contamination",
                  "CRITICAL",
                  "Prakashpur"
                )}
                className="text-left p-2 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              >
                🔴 Tube Well Contamination (Prakashpur)
              </button>

              <button
                type="button"
                onClick={() => handlePreFill(
                  "Gobargadha Island: 4 pit latrines have completely breached into floodwaters. Open defecation is occurring on the high embankment. Strong stench and swarms of flies creating extreme pathogen hazard. Chlorine disinfectant urgently requested.",
                  "Latrine Overflow",
                  "HIGH",
                  "Gobargadha"
                )}
                className="text-left p-2 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              >
                🟠 Latrine Pit Breach (Island Settlement)
              </button>

              <button
                type="button"
                onClick={() => handlePreFill(
                  "Chhitaha link road: Main box culvert 2km south has collapsed into torrent. Water tankers and tractors cannot pass. Walking detour requires crossing waist-deep water channel.",
                  "Road Cutoff",
                  "HIGH",
                  "Chhitaha"
                )}
                className="text-left p-2 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              >
                🟡 Culvert Collapse / Road Cutoff
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Community / Location</label>
              <select
                value={selectedCommId}
                onChange={(e) => setSelectedCommId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-cyan-500"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Issue Category</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-white text-[11px]"
                >
                  <option value="Water Contamination">Drinking Water</option>
                  <option value="Latrine Overflow">Latrine Submerged</option>
                  <option value="Road Cutoff">Road Blocked</option>
                  <option value="Health Emergency">Health Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-white text-[11px]"
                >
                  <option value="CRITICAL">🔴 Critical</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="MODERATE">🟡 Moderate</option>
                  <option value="LOW">🔵 Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Reporter Title / Organization</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Observation Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe ground conditions, number of people affected, specific pump or latrine damage..."
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Photo Evidence Demonstration</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Image URL or upload..."
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 text-[11px] truncate"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Field capture demonstration (geotagged mock asset)</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting Report...' : 'Submit to Triage Queue'}</span>
            </button>

            {submitSuccess && (
              <div className="p-2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Report logged successfully! Triage queue updated.</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Columns: Incoming Reports Feed */}
        <div className="lg:col-span-2 space-y-4 font-mono text-xs">
          {/* Filters Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Incoming Reports ({filteredReports.length})</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300"
              >
                <option value="All">All Categories</option>
                <option value="Water Contamination">Drinking Water</option>
                <option value="Latrine Overflow">Latrine Submerged</option>
                <option value="Road Cutoff">Road Blocked</option>
                <option value="Health Emergency">Health Emergency</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300"
              >
                <option value="All">All Verification Status</option>
                <option value="UNVERIFIED">UNVERIFIED</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="SATELLITE MATCHED">SATELLITE MATCHED</option>
              </select>
            </div>
          </div>

          {/* List of Report Cards */}
          <div className="space-y-3">
            {filteredReports.map((report) => {
              const isSatelliteMatched = report.status === 'SATELLITE MATCHED';
              const isVerified = report.status === 'VERIFIED';
              const isUnverified = report.status === 'UNVERIFIED';

              return (
                <div 
                  key={report.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-colors shadow-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{report.communityName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          report.urgency === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                          report.urgency === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-cyan-950 text-cyan-300'
                        }`}>
                          {report.urgency}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {report.reportType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><User className="w-3 h-3 text-cyan-400" /> {report.reporterRole}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {report.timestamp}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${
                        isSatelliteMatched ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm shadow-cyan-950' :
                        isVerified ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                        'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}>
                        {isSatelliteMatched && <Satellite className="w-3 h-3" />}
                        {isVerified && <CheckCircle2 className="w-3 h-3" />}
                        {isUnverified && <AlertTriangle className="w-3 h-3" />}
                        <span>{report.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content & Photo */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {report.photoUrl && (
                      <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden border border-slate-800 shrink-0 relative group bg-slate-950">
                        <img 
                          src={report.photoUrl} 
                          alt="Disaster field evidence" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-slate-900/80 text-[9px] text-white">Geotagged</span>
                      </div>
                    )}
                    <div className="space-y-2 flex-1">
                      <p className="text-slate-200 leading-relaxed text-xs">
                        "{report.description}"
                      </p>
                      {report.extractedInfo && (
                        <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 space-y-1">
                          <span className="font-semibold text-slate-400 block text-[10px] uppercase">AI Extracted Entities:</span>
                          <div className="flex flex-wrap gap-2 text-[10px]">
                            {report.extractedInfo.waterStatus && <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Water: {report.extractedInfo.waterStatus}</span>}
                            {report.extractedInfo.sanitationIssue && <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Latrine: {report.extractedInfo.sanitationIssue}</span>}
                            {report.extractedInfo.accessStatus && <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Access: {report.extractedInfo.accessStatus}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operational Verification Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-500">Coordinates: {report.coordinates[0].toFixed(4)}°N, {report.coordinates[1].toFixed(4)}°E</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAnalyzeWithAI(report.description, report.communityName || 'Selected Community')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Run AI Extraction</span>
                      </button>

                      {report.status !== 'SATELLITE MATCHED' && (
                        <button
                          onClick={() => onVerifyReport(report.id, 'SATELLITE MATCHED')}
                          className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center gap-1 transition-colors"
                        >
                          <Satellite className="w-3 h-3" />
                          <span>Confirm Satellite Match</span>
                        </button>
                      )}

                      {report.status === 'UNVERIFIED' && (
                        <button
                          onClick={() => onVerifyReport(report.id, 'VERIFIED')}
                          className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Verified</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
