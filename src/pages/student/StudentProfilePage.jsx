import React, { useState, useMemo } from 'react';
import { User, Mail, Building, GraduationCap, Plus, X, Save, Sparkles, Github, Linkedin, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRANCHES, YEARS } from '../../data/mockOpportunities';
import { calculateProfileCompleteness } from '../../utils/recommendation';

const SUGGESTED_SKILLS = [
  'Python', 'React', 'TypeScript', 'Node.js', 'FastAPI', 'PyTorch',
  'Data Structures', 'Algorithms', 'SQL', 'PostgreSQL', 'Docker', 'AWS',
  'Next.js', 'C++', 'Java', 'Machine Learning', 'Tailwind CSS', 'Figma'
];

const SUGGESTED_INTERESTS = [
  'AI/ML', 'Full-Stack Development', 'Hackathons', 'Open Source',
  'Cloud & DevOps', 'Cybersecurity', 'Web3', 'Competitive Programming'
];

export default function StudentProfilePage() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: user?.college || '',
    branch: user?.branch || 'CSE',
    year: user?.year || '3rd Year',
    skills: user?.skills || ['Python', 'React', 'Data Structures'],
    interests: user?.interests || ['AI/ML', 'Hackathons'],
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [saving, setSaving] = useState(false);

  const completeness = useMemo(() => {
    return calculateProfileCompleteness(formData);
  }, [formData]);

  const handleAddSkill = (skillToAdd) => {
    const val = skillToAdd || newSkill.trim();
    if (val && !formData.skills.includes(val)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, val] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  const handleAddInterest = (interestToAdd) => {
    const val = interestToAdd || newInterest.trim();
    if (val && !formData.interests.includes(val)) {
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, val] }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interestToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(formData);
      addToast('Profile & AI Match preferences saved successfully!', 'success');
    } catch (err) {
      addToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-torch-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-torch-600">
              Match Profile Settings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Profile & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Keep your skills up to date to get high-accuracy AI opportunity recommendations.
          </p>
        </div>

        {/* Completeness Meter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-600">Profile Match Quality</span>
            <span className="text-torch-600 font-extrabold">{completeness}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-torch-gradient h-2 rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Academic Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-torch-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. IIT Bombay / VIT Vellore"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-torch-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Branch</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-torch-500"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-torch-500"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & AI Match */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-torch-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-torch-50 text-torch-800 font-semibold text-xs rounded-lg border border-torch-200 flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-torch-400 hover:text-torch-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="Add skill (e.g. Next.js, PyTorch)..."
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl flex-1 focus:outline-none focus:border-torch-500"
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
            >
              Add
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">Suggested Skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.filter((s) => !formData.skills.includes(s)).slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="text-[11px] px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-md border border-slate-200"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-torch-gradient rounded-xl shadow-torch-button hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile & Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
