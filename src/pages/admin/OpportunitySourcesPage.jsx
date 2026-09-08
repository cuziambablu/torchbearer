import React, { useState } from 'react';
import {
  Globe,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useOpportunities } from '../../context/OpportunityContext';
import { formatDate } from '../../utils/dateUtils';

const DEFAULT_SOURCES = [
  {
    id: 'src-1',
    name: 'Google Summer of Code Official Feed',
    type: 'Organization / API',
    url: 'https://summerofcode.withgoogle.com',
    lastFetched: '2026-09-08T18:00:00Z',
    status: 'healthy',
    count: 3,
    enabled: true
  },
  {
    id: 'src-2',
    name: 'Microsoft Imagine Cup Global Portal',
    type: 'Official Company',
    url: 'https://imaginecup.microsoft.com',
    lastFetched: '2026-09-08T17:30:00Z',
    status: 'healthy',
    count: 2,
    enabled: true
  },
  {
    id: 'src-3',
    name: 'Smart India Hackathon (SIH)',
    type: 'Government / AICTE',
    url: 'https://sih.gov.in',
    lastFetched: '2026-09-07T12:00:00Z',
    status: 'healthy',
    count: 2,
    enabled: true
  },
  {
    id: 'src-4',
    name: 'GitHub Education & Campus Experts',
    type: 'Partner Feed',
    url: 'https://education.github.com',
    lastFetched: '2026-09-08T15:45:00Z',
    status: 'healthy',
    count: 4,
    enabled: true
  },
  {
    id: 'src-5',
    name: 'CERN Summer Student Programme',
    type: 'Research Lab / University',
    url: 'https://careers.cern',
    lastFetched: '2026-09-06T10:00:00Z',
    status: 'healthy',
    count: 2,
    enabled: true
  },
  {
    id: 'src-6',
    name: 'Student Community Verified Submissions',
    type: 'Community Moderated',
    url: 'https://campuslaunch.org/submit',
    lastFetched: '2026-09-08T19:20:00Z',
    status: 'healthy',
    count: 6,
    enabled: true
  }
];

export default function OpportunitySourcesPage() {
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [syncing, setSyncing] = useState(false);
  const { addToast } = useToast();

  const handleToggle = (id) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    addToast('Source status updated', 'info');
  };

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSources((prev) =>
        prev.map((s) => ({ ...s, lastFetched: new Date().toISOString() }))
      );
      addToast('All active opportunity sources successfully synchronized!', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Ingestion & Data Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Opportunity Sources & Feeds
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage authenticated APIs, RSS feeds, university portals, and community submission channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            loading={syncing}
            onClick={handleSyncAll}
            className="border-slate-700 bg-slate-900 text-slate-200 hover:text-white"
          >
            Trigger Pipeline Sync
          </Button>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Registered Pipeline Channels ({sources.length})
          </span>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All channels operational
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {sources.map((src) => (
            <div
              key={src.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{src.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {src.type}
                  </span>
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                >
                  <span className="truncate max-w-sm">{src.url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Last sync: {formatDate(src.lastFetched)}</span>
                  <span>•</span>
                  <span>Active opportunities: <span className="text-white font-bold">{src.count}</span></span>
                </div>
              </div>

              {/* Status toggle & action */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggle(src.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    src.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${src.enabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span>{src.enabled ? 'Active Pipeline' : 'Paused'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
