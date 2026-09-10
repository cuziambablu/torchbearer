import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Play,
  Pause,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Layers,
  Sparkles,
  ShieldCheck,
  Globe,
  Sliders,
  Terminal,
  Activity,
  ArrowRight,
  Filter,
  Check,
  X
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { VERIFIED_OPPORTUNITY_SOURCES, OPPORTUNITY_CATEGORIES } from '../../services/opportunityAgent/sources';

export default function OpportunityAgentPage() {
  const {
    isAgentRunning,
    agentProgress,
    agentLogs,
    agentStats,
    schedulerStatus,
    reviewQueue,
    runAgentNow,
    startAgentScheduler,
    stopAgentScheduler
  } = useOpportunities();

  const { addToast } = useToast();

  const [scanConfig, setScanConfig] = useState({
    minVerificationScore: 75,
    autoPublishThreshold: 80,
    maxOpportunitiesPerScan: 50,
    autoPublish: true,
    intervalHours: 6
  });

  const [logFilter, setLogFilter] = useState('all'); // 'all' | 'success' | 'warn' | 'error'

  const handleRunAgent = async () => {
    try {
      addToast('Opportunity Agent initiated. Executing 11-stage discovery & verification pipeline...', 'info');
      const res = await runAgentNow(scanConfig);
      addToast(`Agent run complete! Discovered: ${res.stats.discovered}, Published: ${res.stats.published}, Sent to Review: ${res.stats.needsReview}`, 'success');
    } catch (err) {
      addToast(`Agent execution error: ${err.message}`, 'error');
    }
  };

  const handleToggleScheduler = () => {
    if (schedulerStatus.isScheduled) {
      stopAgentScheduler();
      addToast('Automated background schedule stopped.', 'info');
    } else {
      startAgentScheduler(scanConfig.intervalHours, false);
      addToast(`Automated background schedule started (Every ${scanConfig.intervalHours} hours).`, 'success');
    }
  };

  const filteredLogs = (agentLogs || []).filter((l) => {
    if (logFilter === 'all') return true;
    return l.level === logFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* 1. Header & Primary Run Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Autonomous Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Opportunity Discovery & Ingestion Agent</span>
            {isAgentRunning && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Stage: {agentProgress.stage} ({agentProgress.percent}%)</span>
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            11-Stage automated pipeline: Search, Fetch, Extract, Normalize, Multi-Factor Verify, Deduplicate, Quality Score, and Auto-Publish.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/review-queue"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Human Review Queue</span>
            {reviewQueue.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                {reviewQueue.length}
              </span>
            )}
          </Link>

          <Button
            variant="primary"
            size="md"
            loading={isAgentRunning}
            onClick={handleRunAgent}
            className="shadow-lg shadow-brand-600/30 font-bold px-5"
          >
            <Play className="w-4 h-4 mr-1.5 fill-current" />
            <span>{isAgentRunning ? 'Agent Processing...' : 'Run Agent Now'}</span>
          </Button>
        </div>
      </div>

      {/* AI Model Engine Banner */}
      <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-900 to-indigo-950/40 border border-brand-500/20 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-2">
              <span>Active Model: <code className="px-2 py-0.5 rounded bg-brand-900/50 text-brand-300 font-mono text-[11px]">z-ai/glm-5.3-free</code></span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
                Connected
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Gateway: <span className="font-mono text-slate-300">https://api.tokenrouter.com/v1</span> • Autonomous Opportunity Enrichment & Smart Categorization
            </div>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Automated Catalog Updates & Student Match Guidance
        </div>
      </div>

      {/* 2. Top Metric KPI Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discovered</div>
          <div className="text-2xl font-black text-white mt-1">{agentStats.discovered}</div>
          <div className="text-[10px] text-slate-500 mt-1">Authentic sources</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Extracted</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{agentStats.extracted}</div>
          <div className="text-[10px] text-slate-500 mt-1">Structured internships</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duplicates Dropped</div>
          <div className="text-2xl font-black text-slate-300 mt-1">{agentStats.duplicatesRemoved}</div>
          <div className="text-[10px] text-slate-500 mt-1">Fingerprint filtered</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified High-Fit</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{agentStats.verified}</div>
          <div className="text-[10px] text-slate-500 mt-1">Score &ge; 75%</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Needs Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{agentStats.needsReview}</div>
          <div className="text-[10px] text-slate-500 mt-1">Score 50–74%</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Auto-Published</div>
          <div className="text-2xl font-black text-brand-400 mt-1">{agentStats.published}</div>
          <div className="text-[10px] text-slate-500 mt-1">Live on Student UI</div>
        </div>
      </div>

      {/* 3. Live Agent Execution Visualizer & Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-Time Execution Log Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-brand-400" />
                <h2 className="text-base font-bold text-white">Agent Execution Stream & Telemetry</h2>
              </div>

              {/* Log filter buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
                {['all', 'success', 'warn', 'error'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition ${
                      logFilter === f ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar (when active) */}
            {isAgentRunning && (
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-brand-500/30 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-300">Executing Stage: {agentProgress.stage}</span>
                  <span className="font-bold text-white">{agentProgress.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${agentProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Terminal Log Console */}
            <div className="h-96 overflow-y-auto font-mono text-xs p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5 selection:bg-brand-500">
              {filteredLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <Bot className="w-8 h-8 text-slate-600 animate-pulse" />
                  <p>Agent is standing by. Click "Run Agent Now" to initiate live discovery & verification.</p>
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const isSuccess = log.level === 'success';
                  const isWarn = log.level === 'warn';
                  const isError = log.level === 'error';

                  return (
                    <div
                      key={log.id}
                      className={`p-2.5 rounded-lg border leading-relaxed flex items-start gap-2.5 transition ${
                        isSuccess
                          ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                          : isWarn
                          ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                          : isError
                          ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 pt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${
                          isSuccess
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isWarn
                            ? 'bg-amber-500/20 text-amber-300'
                            : isError
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {log.stage}
                      </span>
                      <div className="flex-1 break-words">{log.message}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Configuration & Scheduler Control */}
        <div className="space-y-6">
          {/* Scheduler Panel */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Background Scheduler</h2>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  schedulerStatus.isScheduled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {schedulerStatus.isScheduled ? 'Scheduled (Active)' : 'Manual Only'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Scan Cadence:</span>
                <span className="font-bold text-white">Every {scanConfig.intervalHours} Hours</span>
              </div>
              {schedulerStatus.nextRunTime && (
                <div className="flex items-center justify-between text-slate-400">
                  <span>Next Automated Scan:</span>
                  <span className="font-bold text-emerald-400">
                    {new Date(schedulerStatus.nextRunTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleToggleScheduler}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                schedulerStatus.isScheduled
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
              }`}
            >
              {schedulerStatus.isScheduled ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Background Scheduler</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Enable Auto-Scan Schedule</span>
                </>
              )}
            </button>
          </div>

          {/* Threshold Tuning */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-brand-400" />
              <h2 className="text-base font-bold text-white">Verification & Auto-Publish Rules</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between font-bold text-slate-300 mb-1.5">
                  <span>Auto-Publish Score Threshold</span>
                  <span className="text-brand-400">{scanConfig.autoPublishThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  value={scanConfig.autoPublishThreshold}
                  onChange={(e) => setScanConfig({ ...scanConfig, autoPublishThreshold: Number(e.target.value) })}
                  className="w-full accent-brand-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Scores &ge; {scanConfig.autoPublishThreshold}% are automatically pushed live to the student catalog.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between font-bold text-slate-300 mb-1.5">
                  <span>Min Verification Score</span>
                  <span className="text-emerald-400">{scanConfig.minVerificationScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="85"
                  value={scanConfig.minVerificationScore}
                  onChange={(e) => setScanConfig({ ...scanConfig, minVerificationScore: Number(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Scores between 50% and {scanConfig.minVerificationScore}% are sent to the Human Review Queue.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Direct Auto-Publish</div>
                  <div className="text-[10px] text-slate-500">Publish high-fit items immediately</div>
                </div>
                <button
                  type="button"
                  onClick={() => setScanConfig({ ...scanConfig, autoPublish: !scanConfig.autoPublish })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    scanConfig.autoPublish ? 'bg-brand-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      scanConfig.autoPublish ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Registered Sources */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Registered Legitimate Sources ({VERIFIED_OPPORTUNITY_SOURCES.length})
              </h3>
            </div>
            <div className="space-y-2">
              {VERIFIED_OPPORTUNITY_SOURCES.map((src) => (
                <div
                  key={src.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div className="truncate min-w-0 pr-2">
                    <div className="font-bold text-slate-200 truncate">{src.name}</div>
                    <div className="text-[10px] text-slate-500">{src.type.toUpperCase()} • Trust: {src.trustScore}%</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
