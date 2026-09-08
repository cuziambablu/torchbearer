import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MoreVertical,
  UserCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';

const MOCK_STUDENTS = [
  {
    id: 'usr-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    college: 'National Institute of Technology, Karnataka',
    degree: 'B.Tech in Computer Science',
    branch: 'CSE',
    year: '3rd Year',
    completeness: 85,
    joinedAt: '2026-08-15T10:00:00Z',
    status: 'active'
  },
  {
    id: 'usr-2',
    name: 'Priya Patel',
    email: 'priya.patel@engg.edu',
    college: 'BMS College of Engineering',
    degree: 'B.Tech in Information Science',
    branch: 'ECE',
    year: '4th Year',
    completeness: 92,
    joinedAt: '2026-08-20T14:30:00Z',
    status: 'active'
  },
  {
    id: 'usr-3',
    name: 'Karan Singh',
    email: 'karan.singh@campus.edu',
    college: 'IIT Roorkee',
    degree: 'B.Tech in Data Science & AI',
    branch: 'CSE',
    year: '2nd Year',
    completeness: 70,
    joinedAt: '2026-09-01T09:15:00Z',
    status: 'active'
  },
  {
    id: 'usr-4',
    name: 'Ananya Verma',
    email: 'ananya.v@techuniv.ac.in',
    college: 'Delhi Technological University',
    degree: 'B.Tech in Electrical Engineering',
    branch: 'EEE',
    year: '3rd Year',
    completeness: 78,
    joinedAt: '2026-09-04T16:20:00Z',
    status: 'active'
  }
];

export default function StudentManagementPage() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const { addToast } = useToast();

  const filteredStudents = useMemo(() => {
    return students.filter((std) => {
      if (branchFilter !== 'all' && std.branch !== branchFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = std.name.toLowerCase().includes(q);
        const emailMatch = std.email.toLowerCase().includes(q);
        const collegeMatch = std.college.toLowerCase().includes(q);
        return nameMatch || emailMatch || collegeMatch;
      }
      return true;
    });
  }, [students, search, branchFilter]);

  const handleToggleStatus = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' }
          : s
      )
    );
    addToast('Student account status modified', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Student Directory & Moderation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Registered Students ({students.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review active student profiles, completion metrics, and account statuses.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, college, email..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
          >
            <option value="all">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800">
          {filteredStudents.map((std) => (
            <div
              key={std.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {std.name[0]}
                  </div>
                  <h3 className="text-sm font-bold text-white">{std.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {std.branch} ({std.year})
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    std.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {std.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  {std.degree} • <span className="text-slate-300 font-medium">{std.college}</span>
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span>Email: <span className="text-slate-400">{std.email}</span></span>
                  <span>•</span>
                  <span>Joined: {formatDate(std.joinedAt)}</span>
                </div>
              </div>

              {/* Completeness & Actions */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-300">{std.completeness}% Complete</div>
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${std.completeness}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(std.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    std.status === 'active'
                      ? 'border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                      : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                  }`}
                >
                  {std.status === 'active' ? 'Suspend' : 'Reactivate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
