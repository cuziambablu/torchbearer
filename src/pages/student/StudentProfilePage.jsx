import React, { useState, useMemo } from 'react';
import { User, Mail, Building, GraduationCap, Plus, X, Save, Sparkles, Github, Linkedin, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
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

  const completeness = useMemo(() => {
    return calculateProfileCompleteness(formData);
  }, [formData]);

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const handleAddSkill = (skillToAdd) => {
    const val = (skillToAdd || newSkill).trim();
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
    const val = (interestToAdd || newInterest).trim();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast('Profile & preferences successfully updated!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-brand-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Personalized Matching Profile
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Student Profile & Skills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            These preferences power your personalized opportunity recommendations and matching engine.
          </p>
        </div>
      </div>

      {/* Profile Completeness Banner */}
      <div className="bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Profile Completeness</h3>
          </div>
          <span className="text-lg font-black text-amber-300">{completeness.score}% Complete</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${completeness.score}%` }}
          />
        </div>

        {completeness.tips.length > 0 && (
          <div className="text-xs text-slate-300 flex items-start gap-2 pt-1">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{completeness.tips[0]}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Academic & Personal Info */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <span>Academic Background</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                College / University Name
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Branch / Major
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Year of Study
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
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

        {/* Card 2: Technical Skills */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Technical Skills ({formData.skills.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Used directly by the recommendation engine to score matching internships and hackathons.
            </p>
          </div>

          {/* Current Skills Chips */}
          <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-brand-600 text-white shadow-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-200 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom skill input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Type custom skill (e.g., Rust, GraphQL, Flutter)..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => handleAddSkill()}
            >
              Add Skill
            </Button>
          </div>

          {/* Quick suggestions */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Click to quickly add popular skills:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.filter((s) => !formData.skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition flex items-center gap-1"
                >
                  <span>+ {skill}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Interests & Links */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Opportunity Interests & Profiles
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Domains & Focus Areas
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-purple-600 text-white shadow-sm"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="hover:text-rose-200 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_INTERESTS.filter((i) => !formData.interests.includes(i)).map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleAddInterest(interest)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                >
                  + {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                GitHub Profile URL
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/yourhandle"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourhandle"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="submit" variant="primary" size="lg" icon={Save} className="shadow-md shadow-brand-500/20">
            Save Profile & Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
