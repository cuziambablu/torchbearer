import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, GraduationCap, Plus, X, ArrowRight, Check, Flame, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import BrandLogo from '../../components/common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRANCHES, YEARS } from '../../data/mockOpportunities';

const POPULAR_SKILLS = [
  'Python', 'React', 'TypeScript', 'Node.js', 'Machine Learning',
  'Data Structures', 'FastAPI', 'Java', 'C++', 'SQL', 'Docker', 'AWS'
];

const POPULAR_INTERESTS = [
  'Internships', 'Hackathons', 'Coding Competitions',
  'Scholarships', 'Open Source', 'Research Fellowships'
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    password: 'password123',
    college: 'National Institute of Technology',
    branch: 'CSE',
    year: '3rd Year',
    skills: ['Python', 'React', 'Data Structures'],
    interests: ['Internships', 'Hackathons']
  });

  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill]
      };
    });
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, customSkill.trim()] }));
      setCustomSkill('');
    }
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest]
      };
    });
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(formData);
      addToast('Profile setup complete! Welcome to Torchbearer AI.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Registration error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" showText={false} href="/" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Start your journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Create your profile and let Torchbearer AI help you discover what's next.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center justify-between max-w-xs mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white ring-4 ring-amber-100 shadow-md'
                    : step > s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded-full ${
                    step > s ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  College / Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@college.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setStep(2)}
                className="w-full justify-center mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold border-0 shadow-md shadow-amber-500/25"
              >
                <span>Continue to Academic Profile</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  College / University Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Engineering Branch
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    Current Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1 font-bold">
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold border-0 shadow-md shadow-amber-500/25"
                >
                  <span>Continue to Skills</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select Your Technical Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {POPULAR_SKILLS.map((skill) => {
                    const isSelected = formData.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {skill} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>

                {/* Custom skill adder */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add other skill (e.g. Kotlin)..."
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Button variant="outline" size="sm" onClick={addCustomSkill} className="font-bold">
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Opportunity Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_INTERESTS.map((interest) => {
                    const isSelected = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {interest} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button variant="outline" size="lg" onClick={() => setStep(2)} className="flex-1 font-bold">
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  loading={loading}
                  onClick={handleCompleteRegistration}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold border-0 shadow-md shadow-amber-500/25"
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-amber-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
