import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Building, MapPin, DollarSign, Calendar, Link2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useOpportunities } from '../../context/OpportunityContext';
import { useToast } from '../../context/ToastContext';
import { OPPORTUNITY_TYPES, MODES, BRANCHES, YEARS } from '../../data/mockOpportunities';

export default function CreateOpportunityPage() {
  const { createOpportunity } = useOpportunities();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    type: 'Internship',
    description: '',
    category: 'Software Development',
    location: 'Remote',
    mode: 'Remote',
    stipend: '',
    deadline: '',
    eligibility: 'Open to undergraduate and graduate engineering students',
    targetBranches: ['CSE', 'ECE'],
    targetYears: ['3rd Year', '4th Year'],
    skills: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    applicationProcess: 'Online Application -> Technical Evaluation -> Interview -> Offer',
    applyUrl: '',
    sourceUrl: '',
    status: 'published',
    featured: false
  });

  const toggleBranch = (b) => {
    setFormData((prev) => {
      const exists = prev.targetBranches.includes(b);
      return {
        ...prev,
        targetBranches: exists ? prev.targetBranches.filter((x) => x !== b) : [...prev.targetBranches, b]
      };
    });
  };

  const toggleYear = (y) => {
    setFormData((prev) => {
      const exists = prev.targetYears.includes(y);
      return {
        ...prev,
        targetYears: exists ? prev.targetYears.filter((x) => x !== y) : [...prev.targetYears, y]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.organization || !formData.applyUrl) {
      addToast('Please fill in required fields (Title, Organization, Apply URL)', 'warning');
      return;
    }

    const skillsArray = typeof formData.skills === 'string'
      ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : formData.skills;

    const respArray = typeof formData.responsibilities === 'string'
      ? formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
      : formData.responsibilities;

    const reqArray = typeof formData.requirements === 'string'
      ? formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
      : formData.requirements;

    const benefitArray = typeof formData.benefits === 'string'
      ? formData.benefits.split('\n').map((b) => b.trim()).filter(Boolean)
      : formData.benefits;

    createOpportunity({
      ...formData,
      skills: skillsArray,
      responsibilities: respArray,
      requirements: reqArray,
      benefits: benefitArray,
      deadline: formData.deadline.includes('T') ? formData.deadline : `${formData.deadline}T23:59:59Z`
    });

    addToast(`Successfully created "${formData.title}"!`, 'success');
    navigate('/admin/opportunities');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/admin/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Opportunities</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish a new student opportunity, competition, internship, or fellowship.
          </p>
        </div>
      </div>

      {/* Opportunity Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI Research Engineering Intern"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Organization / Company *
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Acme Labs"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Opportunity Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {OPPORTUNITY_TYPES.filter((t) => t.id !== 'all').map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Work Mode
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Remote / Bengaluru, India"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Stipend / Prize Pool
              </label>
              <input
                type="text"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                placeholder="e.g. ₹40,000 / month"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Application Deadline
              </label>
              <input
                type="date"
                value={formData.deadline.split('T')[0]}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Target Engineering Branches
              </label>
              <div className="flex flex-wrap gap-2">
                {BRANCHES.map((branch) => {
                  const isChecked = formData.targetBranches.includes(branch);
                  return (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => toggleBranch(branch)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition ${
                        isChecked
                          ? 'bg-brand-50 text-brand-700 border-brand-300 ring-1 ring-brand-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {branch} {isChecked && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Eligible Student Years
              </label>
              <div className="flex flex-wrap gap-2">
                {YEARS.map((yr) => {
                  const isChecked = formData.targetYears.includes(yr);
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => toggleYear(yr)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition ${
                        isChecked
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {yr} {isChecked && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Required Skills (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Python, React, TypeScript, Fast API"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Overview & Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed summary of the role..."
                className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Key Responsibilities (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Design and build features..."
                className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Requirements & Qualifications (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Official Application URL *
              </label>
              <input
                type="url"
                required
                value={formData.applyUrl}
                onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                placeholder="https://company.com/apply"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Feature on Homepage banner</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.status === 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Publish immediately to student discovery</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link to="/admin/opportunities">
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="lg" icon={Save} className="shadow-md shadow-brand-500/20">
            Publish Opportunity
          </Button>
        </div>
      </form>
    </div>
  );
}
