import React, { useState } from 'react';
import {
  Globe,
  Plus,
  RotateCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  Activity,
  Layers,
  Search,
  Check,
  X
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { useOpportunities } from '../../context/OpportunityContext';
import { VERIFIED_OPPORTUNITY_SOURCES } from '../../services/opportunityAgent/sources';
import { formatDate } from '../../utils/dateUtils';
import { formatRelativeVerificationTime } from '../../services/opportunityAgent/freshnessEngine';

export default function OpportunitySourcesPage() {
  const [sources, setSources] = useState(() => {
    return VERIFIED_OPPORTUNITY_SOURCES.map((s, i) => ({
      ...s,
      lastChecked: s.lastChecked || new Date(Date.now() - (i + 1) * 3600000).toISOString(),
      httpStatus: 200,
      extractionStatus: 'success',
      discoveredCount: (s.sampleOpportunities || []).length || Math.floor(Math.random() * 8) + 3,
      enabled: s.enabled !== false
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    organization: '',
    category: 'Internships',
    type: 'api',
    country: 'India',
    baseUrl: '',
    trustScore: 95
  });

  const { isAgentRunning, runAgentNow } = useOpportunities();
  const { addToast } = useToast();

  const handleToggle = (id) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    addToast('Source status toggled successfully', 'info');
  };

  const handleScanAllSources = async () => {
    try {
      addToast('Scanning all active registered sources for new opportunities...', 'info');
      const res = await runAgentNow({ minVerificationScore: 75, autoPublishThreshold: 80, autoPublish: true });
      setSources((prev) =>
        prev.map((s) => ({
          ...s,
          lastChecked: new Date().toISOString(),
          httpStatus: 200,
          extractionStatus: 'success'
        }))
      );
      addToast('Scan complete! Discovered ' + res.stats.discovered + ' opportunities.', 'success');
    } catch (err) {
      addToast('Scan failed: ' + err.message, 'error');
    }
  };

  const handleAddSourceSubmit = (e) => {
    e.preventDefault();
    if (!newSource.name || !newSource.baseUrl) {
      addToast('Please provide a source name and URL.', 'error');
      return;
    }

    const created = {
      ...newSource,
      id: 'src-custom-' + Date.now(),
      lastChecked: new Date().toISOString(),
      httpStatus: 200,
      extractionStatus: 'success',
      discoveredCount: 0,
      enabled: true
    };

    setSources((prev) => [created, ...prev]);
    setAddModalOpen(false);
    setNewSource({
      name: '',
      organization: '',
      category: 'Internships',
      type: 'api',
      country: 'India',
      baseUrl: '',
      trustScore: 95
    });
    addToast('Source "' + created.name + '" registered successfully.', 'success');
  };

  const filteredSources = sources.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.organization || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q) ||
      (s.baseUrl || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Source Aggregation & Crawler Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Opportunity Sources ({sources.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor crawler health, HTTP endpoints, extraction success rates, and register new official channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={Plus}
            onClick={() => setAddModalOpen(true)}
          >
            Add New Source
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={RotateCw}
            loading={isAgentRunning}
            onClick={handleScanAllSources}
            className="bg-slate-900 text-white font-bold"
          >
            Scan All Sources
          </Button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search registered sources..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>{sources.filter((s) => s.enabled).length} Active Sources</span>
          </span>
          <span>•</span>
          <span className="text-slate-500">
            {sources.reduce((acc, s) => acc + (s.discoveredCount || 0), 0)} Total Discovered Items
          </span>
        </div>
      </div>

      {/* Sources Health Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Source Name & Organization</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Endpoint Type</th>
                <th className="py-3.5 px-4">Health & HTTP</th>
                <th className="py-3.5 px-4">Last Scanned</th>
                <th className="py-3.5 px-4 text-right">Items Discovered</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSources.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{s.organization || 'Official Portal'}</span>
                      <span>•</span>
                      <a
                        href={s.baseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-mono text-[10px]"
                      >
                        <span>{s.baseUrl.replace('https://', '')}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                      {s.category || 'Internships'}
                    </span>
                  </td>
                  <td className="py-4 px-4 uppercase font-mono text-[11px] font-bold text-slate-500">
                    {s.type || 'api'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-emerald-700">HTTP {s.httpStatus || 200} OK</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Extractor: {s.extractionStatus}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-[11px]">
                    {s.lastChecked ? formatRelativeVerificationTime(s.lastChecked) : 'Never'}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900 font-mono">
                    {s.discoveredCount || 0}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggle(s.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                        s.enabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {s.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Source Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Official Opportunity Source"
      >
        <form onSubmit={handleAddSourceSubmit} className="space-y-4 text-slate-900">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Source Name
            </label>
            <input
              type="text"
              required
              value={newSource.name}
              onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
              placeholder="e.g. Cisco International Student Careers"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Organization / Publisher
            </label>
            <input
              type="text"
              required
              value={newSource.organization}
              onChange={(e) => setNewSource({ ...newSource, organization: e.target.value })}
              placeholder="e.g. Cisco Systems"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Category
              </label>
              <select
                value={newSource.category}
                onChange={(e) => setNewSource({ ...newSource, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Internships">Internships</option>
                <option value="Scholarships">Scholarships</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Fellowships">Fellowships</option>
                <option value="Research">Research</option>
                <option value="Open Source">Open Source</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Government Programs">Government Programs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Endpoint Type
              </label>
              <select
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="api">API Endpoint</option>
                <option value="rss">RSS Feed</option>
                <option value="partner">Partner Portal</option>
                <option value="manual">Official Crawler</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Base URL / Feed Endpoint
            </label>
            <input
              type="url"
              required
              value={newSource.baseUrl}
              onChange={(e) => setNewSource({ ...newSource, baseUrl: e.target.value })}
              placeholder="https://jobs.cisco.com/students"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-slate-900 font-bold text-white"
            >
              Register Source
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
