// Mock Opportunity Dataset and Metadata for CampusLaunch
import { REAL_VERIFIED_OPPORTUNITIES } from './realVerifiedOpportunities';

export const OPPORTUNITY_TYPES = [
  { id: 'all', label: 'All Opportunities', icon: 'Sparkles', desc: 'Browse all student opportunities' },
  { id: 'Internship', label: 'Internships', icon: 'Briefcase', emoji: '💼', desc: 'Paid industry roles & summer research' },
  { id: 'Hackathon', label: 'Hackathons', icon: 'Trophy', emoji: '🏆', desc: 'National 24-48h team hackathons' },
  { id: 'Job', label: 'Full-Time Jobs', icon: 'Building2', emoji: '🏢', desc: 'Fresher & graduate hiring drives' },
  { id: 'Freelance', label: 'Freelance & Gigs', icon: 'Zap', emoji: '⚡', desc: 'Student-friendly paid contract projects' },
  { id: 'Scholarship', label: 'Scholarships', icon: 'GraduationCap', emoji: '🎓', desc: 'Merit & tuition funding for students' },
  { id: 'Fellowship', label: 'Fellowships', icon: 'Rocket', emoji: '🚀', desc: 'Global open-source & leadership stipends' },
  { id: 'Competition', label: 'Coding Contests', icon: 'Code', emoji: '💻', desc: 'DSA & competitive programming battles' },
  { id: 'Research', label: 'Research Grants', icon: 'FlaskConical', emoji: '🔬', desc: 'Academic lab papers & research grants' },
  { id: 'Workshop', label: 'Workshops', icon: 'BookOpen', emoji: '📚', desc: 'Hands-on bootcamps with certificates' },
  { id: 'Certification', label: 'Certifications', icon: 'Award', emoji: '📜', desc: 'Free exam fee vouchers & credentials' },
  { id: 'Open Source', label: 'Open Source', icon: 'GitBranch', emoji: '🌐', desc: 'Contributor cohorts & open-source tracks' },
  { id: 'Campus Exclusive', label: 'Placement Drives', icon: 'Building', emoji: '🏛️', desc: 'College placement cell exclusive drives' },
  { id: 'Career Event', label: 'Career Events', icon: 'Calendar', emoji: '🎙️', desc: 'AMA sessions, tech talks & virtual fairs' },
];

export const BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Machine Learning (AI & ML)',
  'Data Science & Artificial Intelligence',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Robotics & Automation Engineering',
  'Cyber Security & Digital Forensics',
  'Software Engineering',
  'Aerospace & Aeronautical Engineering',
  'Biotechnology & Biomedical Engineering',
  'Chemical Engineering',
  'Mechatronics & IoT Engineering',
  'Automobile & EV Engineering',
  'Industrial & Production Engineering',
  'Metallurgical & Materials Engineering',
  'Instrumentation & Control Engineering (ICE)',
  'Environmental & Energy Engineering',
  'Marine & Ocean Engineering',
  'Mining Engineering',
  'Petroleum & Petrochemical Engineering',
  'Agricultural & Food Engineering',
  'Other Engineering / General'
];
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const MODES = ['Remote', 'Hybrid', 'On-site'];

export const INITIAL_OPPORTUNITIES = REAL_VERIFIED_OPPORTUNITIES;

export const MOCK_APPLICATIONS = [
  {
    id: 'app-1',
    opportunityId: 'opp-real-1',
    userId: 'student-1',
    status: 'Applied',
    appliedAt: '2026-09-05T14:30:00Z',
    notes: 'Submitted proposal to Apache Software Foundation org under GSoC.',
    updatedAt: '2026-09-05T14:30:00Z'
  },
  {
    id: 'app-2',
    opportunityId: 'opp-real-2',
    userId: 'student-1',
    status: 'Assessment',
    appliedAt: '2026-09-02T10:15:00Z',
    notes: 'College internal screening cleared; SPOC uploaded team nomination for Smart India Hackathon.',
    updatedAt: '2026-09-02T16:00:00Z'
  },
  {
    id: 'app-3',
    opportunityId: 'opp-real-4',
    userId: 'student-1',
    status: 'Interview',
    appliedAt: '2026-08-28T09:00:00Z',
    notes: 'Submitted Azure AI prototype pitch video for Microsoft Imagine Cup.',
    updatedAt: '2026-09-04T11:20:00Z'
  }
];

export const MOCK_SAVED_IDS = ['opp-real-1', 'opp-real-2', 'opp-real-4', 'opp-real-7'];

export const MOCK_SUBMISSIONS = [
  {
    id: 'sub-1',
    submittedBy: 'student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@college.edu',
    title: 'ISRO RESPOND Research Fellowship Program',
    organization: 'Indian Space Research Organisation (ISRO)',
    type: 'Research',
    description: 'Sponsored research grants and junior research fellowships for academic institutions and universities in space sciences and engineering.',
    location: 'Bengaluru / Hybrid',
    mode: 'Hybrid',
    stipend: '₹37,000 / month + HRA',
    eligibility: 'B.E. / B.Tech / M.Tech in CSE, ECE, Mechanical, Aerospace',
    skills: ['Space Science', 'Embedded Systems', 'Remote Sensing', 'Signal Processing'],
    deadline: '2026-11-30',
    applyUrl: 'https://www.isro.gov.in/SponsoredResearch.html',
    sourceUrl: 'https://www.isro.gov.in',
    status: 'pending',
    createdAt: '2026-09-05T16:45:00Z'
  },
  {
    id: 'sub-2',
    submittedBy: 'student-2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@engg.edu',
    title: 'NullCon Security Hackathon & CTF',
    organization: 'NullCon & OWASP',
    type: 'Competition',
    description: 'A 24-hour jeopardy-style cybersecurity tournament covering reverse engineering, cryptography, web exploitation, and digital forensics.',
    location: 'Goa / Virtual',
    mode: 'Remote',
    stipend: '₹2,00,000 Cash Prizes + CEH Exam Vouchers',
    eligibility: 'Undergraduate and Polytechnic engineering students',
    skills: ['Wireshark', 'Python', 'Linux', 'Cryptography', 'Reverse Engineering'],
    deadline: '2026-10-15',
    applyUrl: 'https://nullcon.net/',
    sourceUrl: 'https://nullcon.net',
    status: 'pending',
    createdAt: '2026-09-06T09:10:00Z'
  }
];

export const MOCK_DEFAULT_STUDENT = {
  id: 'student-1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu',
  college: 'National Institute of Technology, Karnataka',
  degree: 'B.Tech in Computer Science & Engineering',
  branch: 'CSE',
  year: '3rd Year',
  cgpa: '8.8',
  role: 'student',
  skills: ['Python', 'React', 'TypeScript', 'Data Structures', 'Machine Learning', 'FastAPI', 'Docker', 'SQL'],
  interests: ['AI/ML', 'Full-Stack Development', 'Hackathons', 'Open Source', 'Cloud & DevOps'],
  preferredMode: 'Hybrid',
  preferredLocations: ['Bengaluru', 'Remote', 'Hyderabad', 'Pune'],
  preferredTypes: ['Internship', 'Hackathon', 'Fellowship', 'Job'],
  bio: 'Computer Science student passionate about generative AI applications and high-performance web systems. Active competitive programmer and hackathon builder.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  github: 'https://github.com/aaravsharma-dev',
  linkedin: 'https://linkedin.com/in/aaravsharma',
  portfolio: 'https://aaravsharma.dev'
};

export const MOCK_ADMIN_USER = {
  id: 'admin-irfan',
  name: 'Irfan (Platform Administrator)',
  email: 'irfan@gmail.com',
  role: 'admin',
  college: 'Torchbearer AI Core Administration',
  branch: 'Lead Administrator',
  year: 'Root Admin',
  skills: ['Platform Operations', 'AI System Governance', 'Security'],
  interests: ['Student Opportunities', 'AI Innovation']
};

export const MOCK_REPORTS = [
  {
    id: 'rep-1',
    opportunityId: 'opp-real-1',
    opportunityTitle: 'Google Summer of Code (GSoC) 2026',
    reportedBy: 'student-2',
    reporterEmail: 'priya.patel@engg.edu',
    reason: 'incorrect_info',
    details: 'The official portal lists organization application dates starting next month.',
    status: 'pending',
    createdAt: '2026-09-06T14:20:00Z'
  },
  {
    id: 'rep-2',
    opportunityId: 'opp-real-2',
    opportunityTitle: 'Smart India Hackathon (SIH) 2026',
    reportedBy: 'student-3',
    reporterEmail: 'karan.singh@campus.edu',
    reason: 'duplicate',
    details: 'This summit registration is also featured under the hackathons section.',
    status: 'investigating',
    createdAt: '2026-09-05T11:05:00Z'
  }
];
