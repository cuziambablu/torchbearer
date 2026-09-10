import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Download,
  Sparkles,
  Layers,
  Building,
  Calendar
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { parseAndValidateCsv, ingestOpportunities } from '../../services/ingestionService';
import { logAdminAction } from '../../services/auditService';

const SAMPLE_CSV = `title,organization,type,description,location,mode,eligibility,skills,stipend,deadline,apply_url,source_name
NextGen AI/ML Research Intern,Anthropic Labs,Internship,Develop agentic evaluation frameworks and benchmarks for LLMs,San Francisco / Remote,Remote,3rd & 4th Year B.Tech,Python;PyTorch;Transformers,₹65000 / month,2026-10-30,https://anthropic.com/careers,Official Career Portal
Global Autonomous Drone Hackathon,OpenRobotics & IEEE,Hackathon,Design computer vision obstacle avoidance algorithms for quadcopters,Bengaluru India,Hybrid,All Undergraduate Students,ROS;C++;OpenCV;Python,₹500000 Prize Pool,2026-10-15,https://openrobotics.org/hackathon,IEEE Student Branch
National Cybersecurity Defense Challenge,OWASP Student Chapter,Competition,24-hour CTF covering binary exploitation and cryptography,Virtual,Remote,Engineering Students,Linux;Wireshark;Python;Reverse Engineering,₹200000 Cash Prizes,2026-09-28,https://owasp.org/student-challenge,OWASP Official`;

export default function CsvImportPage() {
  const { opportunities, setOpportunities } = useOpportunities();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [csvContent, setCsvContent] = useState('');
  const [parsingResult, setParsingResult] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const existingFingerprints = new Set(
    opportunities.map((o) => o.fingerprint || `${o.organization}__${o.title}`)
  );

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setCsvContent(text);
          const result = parseAndValidateCsv(text, existingFingerprints);
          setParsingResult(result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleParseText = () => {
    if (!csvContent.trim()) {
      addToast('Please paste CSV content first', 'warning');
      return;
    }
    const result = parseAndValidateCsv(csvContent, existingFingerprints);
    setParsingResult(result);
  };

  const handleLoadSample = () => {
    setCsvContent(SAMPLE_CSV);
    const result = parseAndValidateCsv(SAMPLE_CSV, existingFingerprints);
    setParsingResult(result);
  };

  const handleExecuteImport = async () => {
    if (!parsingResult || parsingResult.validRows.length === 0) {
      addToast('No valid rows available to import', 'warning');
      return;
    }

    try {
      setIsImporting(true);
      const inserted = await ingestOpportunities(parsingResult.validRows);

      // Update local opportunity context
      if (setOpportunities) {
        setOpportunities((prev) => [...inserted, ...prev]);
      }

      // Log admin audit
      await logAdminAction({
        adminId: user?.id,
        adminEmail: user?.email,
        action: 'CSV_IMPORTED',
        entity: 'opportunities',
        details: {
          importedCount: parsingResult.validRows.length,
          skippedCount: parsingResult.invalidRows.length
        }
      });

      addToast(
        `Successfully imported ${parsingResult.validRows.length} opportunities into Torchbearer AI!`,
        'success'
      );
      navigate('/admin/opportunities');
    } catch (e) {
      addToast('Error executing CSV import. Check console for details.', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Hub</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bulk Opportunity CSV Importer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Import batches of verified student opportunities with automated field validation, duplicate detection, and source normalization.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl border border-brand-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Example CSV</span>
        </button>
      </div>

      {/* Upload & Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-brand-600" />
            <span>Upload .CSV File</span>
          </h2>

          <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl p-8 text-center transition cursor-pointer relative bg-slate-50/50">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Click or drag CSV file here</p>
            <p className="text-xs text-slate-400 mt-1">Supports UTF-8 comma-separated format</p>
          </div>
        </div>

        {/* Raw Text Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Or Paste CSV Content
            </h2>
            <Button variant="outline" size="xs" onClick={handleParseText}>
              Validate & Preview
            </Button>
          </div>

          <textarea
            rows={6}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder="title,organization,type,description,location,mode,eligibility,skills,stipend,deadline,apply_url,source_name..."
            className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Validation & Preview Panel */}
      {parsingResult && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pre-Import Validation Report</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {parsingResult.validRows.length} valid opportunities ready for ingestion •{' '}
                {parsingResult.invalidRows.length} rejected/duplicates
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              loading={isImporting}
              disabled={parsingResult.validRows.length === 0}
              onClick={handleExecuteImport}
              icon={CheckCircle2}
              className="shadow-md shadow-brand-500/20"
            >
              Import {parsingResult.validRows.length} Opportunities
            </Button>
          </div>

          {/* Valid Rows Preview */}
          {parsingResult.validRows.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready to Ingest ({parsingResult.validRows.length})</span>
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-64 overflow-y-auto">
                {parsingResult.validRows.map((row, idx) => (
                  <div key={idx} className="p-3.5 text-xs flex items-center justify-between bg-white hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">{row.title}</div>
                      <div className="text-slate-500 flex items-center gap-2 text-[11px]">
                        <span>{row.organization}</span>
                        <span>•</span>
                        <span className="font-semibold text-brand-600">{row.type}</span>
                        <span>•</span>
                        <span>{row.location}</span>
                        {row.deadline && (
                          <>
                            <span>•</span>
                            <span className="text-amber-700">Deadline: {row.deadline.split('T')[0]}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                      Valid
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invalid / Duplicate Rows Preview */}
          {parsingResult.invalidRows.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Issues & Duplicates Detected ({parsingResult.invalidRows.length})</span>
              </h4>
              <div className="divide-y divide-rose-100 border border-rose-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto bg-rose-50/30">
                {parsingResult.invalidRows.map((row, idx) => (
                  <div key={idx} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">
                        Row #{row.rowNumber}: {row.data.title || 'Untitled'} ({row.data.organization || 'No Org'})
                      </div>
                      <div className="text-rose-600 text-[11px] mt-0.5">
                        {row.errors.join(' • ')}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">
                      Skipped
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
