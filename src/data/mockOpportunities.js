// Mock Opportunity Dataset for CampusLaunch (Phase 1 preview and testing)

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

export const BRANCHES = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const MODES = ['Remote', 'Hybrid', 'On-site'];

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'AI/ML Research Engineering Intern',
    organization: 'Synthetix Labs',
    type: 'Internship',
    location: 'Bengaluru, India',
    mode: 'Hybrid',
    stipend: '₹45,000 / month',
    deadline: '2026-09-12T23:59:59Z', // Closing soon (approx 6 days)
    eligibility: '3rd & 4th Year B.Tech (CSE, ECE, Data Science)',
    targetBranches: ['CSE', 'ECE'],
    targetYears: ['3rd Year', '4th Year'],
    skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'Vector DBs'],
    description: 'Work alongside world-class machine learning researchers building next-generation agentic workflows, LLM evaluation pipelines, and fine-tuning architectures.',
    responsibilities: [
      'Design, train, and benchmark domain-specific transformer models for coding assistants.',
      'Build scalable inference microservices using FastAPI and vLLM.',
      'Collaborate with product designers to integrate intelligence into real-time student tooling.'
    ],
    requirements: [
      'Solid foundations in deep learning, linear algebra, and data structures.',
      'Hands-on experience with PyTorch and Hugging Face.',
      'Prior participation in Kaggle, open-source projects, or research publications is a huge plus.'
    ],
    benefits: [
      'Mentorship from former Google and Stanford AI researchers.',
      'Full pre-placement offer (PPO) conversion opportunity.',
      'Monthly high-end compute credits and hardware setup stipend.'
    ],
    applicationProcess: '1. Resume Screening -> 2. Machine Learning Take-home Assignment -> 3. Technical & System Design Round -> 4. Final Offer.',
    applyUrl: 'https://example.com/careers/synthetix-ai-intern-2026',
    sourceUrl: 'https://linkedin.com/jobs/synthetix-labs',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: true,
    createdBy: 'admin-1',
    createdAt: '2026-09-01T10:00:00Z',
    views: 1420
  },
  {
    id: 'opp-2',
    title: 'Global HackIndia 2026: 36-Hour National Hackathon',
    organization: 'OpenDev Alliance & GitHub',
    type: 'Hackathon',
    location: 'New Delhi / Virtual',
    mode: 'Hybrid',
    stipend: '₹10,00,000 Prize Pool + Cloud Credits',
    deadline: '2026-09-10T18:00:00Z', // 4 days left
    eligibility: 'All college undergraduate & postgraduate students across India',
    targetBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
    targetYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    skills: ['React', 'Next.js', 'Solidity', 'Go', 'AI/ML', 'Cloud'],
    description: 'India’s premier student hackathon bringing together 1,500+ top student developers, designers, and innovators to solve pressing challenges in FinTech, EdTech, Healthcare, and Sustainable Cities.',
    responsibilities: [
      'Form a team of 2-4 students or participate as an individual.',
      'Submit a functional prototype with GitHub repository and demo video within 36 hours.',
      'Pitch to leading venture capitalists, startup founders, and engineering leaders.'
    ],
    requirements: [
      'Valid student ID card from an accredited university or college.',
      'Original code authored solely during the hackathon period.'
    ],
    benefits: [
      '₹5 Lakh for 1st Place, ₹3 Lakh for 2nd Place, ₹2 Lakh for 3rd Place.',
      'Direct fast-track interview passes with Tier-1 tech sponsors.',
      'Official hackathon swag kits, hoodies, and hardware kits for finalists.'
    ],
    applicationProcess: 'Online registration with GitHub handle & team proposal submission on the portal.',
    applyUrl: 'https://example.com/hackathons/global-hackindia-2026',
    sourceUrl: 'https://hackindia.dev',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: true,
    createdBy: 'admin-1',
    createdAt: '2026-08-25T12:00:00Z',
    views: 2890
  },
  {
    id: 'opp-3',
    title: 'Full-Stack Software Engineering Intern',
    organization: 'Razorflow Payments',
    type: 'Internship',
    location: 'Remote (Pan India)',
    mode: 'Remote',
    stipend: '₹35,000 / month',
    deadline: '2026-09-28T23:59:59Z',
    eligibility: '2nd, 3rd & 4th Year B.Tech / MCA (All branches with coding proficiency)',
    targetBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
    targetYears: ['2nd Year', '3rd Year', '4th Year'],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    description: 'Join the core payment infra engineering group. You will build user-facing merchant dashboards, developer webhooks, and scalable ledger interfaces.',
    responsibilities: [
      'Develop modern, ultra-responsive React dashboard components with TypeScript.',
      'Optimize backend API endpoints for sub-50ms latency.',
      'Write comprehensive unit and integration tests using Vitest and Cypress.'
    ],
    requirements: [
      'Strong command over JavaScript/TypeScript and async programming.',
      'Familiarity with relational databases (PostgreSQL) and RESTful API architecture.',
      'Clean Git workflow and problem-solving mindset.'
    ],
    benefits: [
      '100% remote flexibility with home-office equipment reimbursement.',
      'Direct code deployment to production serving thousands of transactions.',
      'Certificate of Completion and high-probability PPO.'
    ],
    applicationProcess: 'Submit resume & GitHub profile -> Online coding challenge -> 45-minute live pair programming session.',
    applyUrl: 'https://example.com/careers/razorflow-intern',
    sourceUrl: 'https://razorflow.io/jobs',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: true,
    createdBy: 'admin-1',
    createdAt: '2026-09-02T14:30:00Z',
    views: 980
  },
  {
    id: 'opp-4',
    title: 'Google Summer of Code / OpenSource Fellowship 2026',
    organization: 'Open Foundation & Tech Consortium',
    type: 'Fellowship',
    location: 'Global / Remote',
    mode: 'Remote',
    stipend: '₹1,80,000 Total Stipend (3 Months)',
    deadline: '2026-09-20T20:00:00Z',
    eligibility: 'All enrolled undergraduate students',
    targetBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
    targetYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    skills: ['Git', 'C++', 'Rust', 'Python', 'Linux', 'Open Source'],
    description: 'A prestigious 12-week remote fellowship pairing college students with seasoned open-source mentors to contribute to high-impact distributed systems and developer tools.',
    responsibilities: [
      'Author high-quality patches, documentation, and feature RFCs for core open-source repositories.',
      'Participate in weekly syncs and code review sessions with maintainers.',
      'Publish milestone summary blog posts detailing technical learnings.'
    ],
    requirements: [
      'Demonstrated enthusiasm for open-source software and version control.',
      'Ability to write readable, tested code in at least one systems language.'
    ],
    benefits: [
      'Internationally recognized fellowship credential.',
      'Competitive non-taxable research & development stipend.',
      'Lifelong network of top global software engineers.'
    ],
    applicationProcess: 'Draft proposal for one of the participating organizations -> Community bonding period -> Mentor selection.',
    applyUrl: 'https://example.com/fellowships/open-consortium-2026',
    sourceUrl: 'https://opensource.org',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: true,
    createdBy: 'admin-1',
    createdAt: '2026-08-30T09:00:00Z',
    views: 3120
  },
  {
    id: 'opp-5',
    title: 'National Women in Tech STEM Scholarship',
    organization: 'Grace Hopper Foundation & Tech Leaders Trust',
    type: 'Scholarship',
    location: 'Pan India',
    mode: 'Remote',
    stipend: '₹75,000 Tuition Grant + 1-on-1 Mentorship',
    deadline: '2026-10-15T23:59:59Z',
    eligibility: 'Female students currently enrolled in 1st, 2nd, or 3rd year engineering degrees',
    targetBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
    targetYears: ['1st Year', '2nd Year', '3rd Year'],
    skills: ['Problem Solving', 'Leadership', 'Academics', 'Communication'],
    description: 'Empowering future female tech leaders with direct educational grants, career mentorship from female VP/Director level engineers, and exclusive leadership retreats.',
    responsibilities: [
      'Maintain good academic standing (minimum 7.5 CGPA or equivalent).',
      'Participate in monthly 1:1 mentorship coaching calls.'
    ],
    requirements: [
      'Enrolled female student in an accredited engineering college in India.',
      'Statement of purpose (500 words) describing career aspirations in technology.'
    ],
    benefits: [
      'Direct one-time grant of ₹75,000 deposited for college fees/books/laptop.',
      'Invitation to the Annual National Tech Summit with travel sponsored.'
    ],
    applicationProcess: 'Online application with academic transcript and brief essay submission.',
    applyUrl: 'https://example.com/scholarships/women-in-tech-2026',
    sourceUrl: 'https://foundation.org/scholarships',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: false,
    createdBy: 'admin-1',
    createdAt: '2026-09-03T11:00:00Z',
    views: 1850
  },
  {
    id: 'opp-6',
    title: 'Mastering Cloud Native & Kubernetes Hands-on Workshop',
    organization: 'Cloud Native Computing Foundation (CNCF) Student Chapter',
    type: 'Workshop',
    location: 'Virtual / Online',
    mode: 'Remote',
    stipend: 'Free (Free Cloud Sandbox & Certificate Included)',
    deadline: '2026-09-09T17:00:00Z', // Closing soon (approx 3 days)
    eligibility: 'Open to all engineering students interested in DevOps and Cloud',
    targetBranches: ['CSE', 'ECE', 'EEE', 'Other'],
    targetYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS/GCP basics'],
    description: 'A comprehensive 2-day hands-on bootcamp taught by CNCF Ambassadors. Learn containerization, Helm charts, ingress controllers, and microservice orchestration from scratch with free cloud playground access.',
    responsibilities: [
      'Attend two live interactive sessions (3 hours each).',
      'Complete 4 guided hands-on lab exercises in the provided cloud terminal.'
    ],
    requirements: [
      'Laptop with internet browser (no local installation required).',
      'Basic knowledge of terminal commands.'
    ],
    benefits: [
      'Official CNCF Student Workshop Certificate of Completion.',
      '30-day free access to interactive cloud sandbox labs.',
      '50% discount voucher for CKA (Certified Kubernetes Administrator) exam.'
    ],
    applicationProcess: 'Instant registration on the community event portal.',
    applyUrl: 'https://example.com/workshops/cncf-k8s-bootcamp',
    sourceUrl: 'https://cncf.io/events',
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: false,
    createdBy: 'admin-1',
    createdAt: '2026-09-04T15:00:00Z',
    views: 740
  },
  {
    id: 'opp-7',
    title: 'Algorithmic Duel: Inter-Collegiate Coding Grand Prix',
    organization: 'CodeArena & Scaler Academy',
    type: 'Competition',
    location: 'Online Platform',
    mode: 'Remote',
    stipend: '₹2,50,000 Prize Pool + Direct Interview Shortlists',
    deadline: '2026-09-15T15:00:00Z',
    eligibility: 'Undergraduate students of all years and branches',
    targetBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
    targetYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    skills: ['Data Structures', 'Algorithms', 'C++', 'Java', 'Python', 'Competitive Programming'],
    description: 'Test your problem-solving speed and algorithmic precision against 5,000+ collegiate programmers in a 3-round speed coding championship.',
    responsibilities: [
      'Solve 6 algorithmic problems of varying difficulty in 150 minutes.',
      'Adhere to fair coding guidelines and anti-plagiarism automated monitoring.'
    ],
    requirements: [
      'Proficiency in C++, Java, or Python with standard library mastery.',
      'Active CodeArena or HackerRank profile.'
    ],
    benefits: [
      'Top 20 participants receive guaranteed interview screening calls with unicorn startups.',
      'Cash awards for top 10 college ranking positions.',
      'Personalized performance report and DSA benchmarking.'
    ],
    applicationProcess: 'Register with college email on the contest portal.',
    applyUrl: 'https://example.com/competitions/codearena-grand-prix',
    sourceUrl: 'https://codearena.dev',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: false,
    createdBy: 'admin-1',
    createdAt: '2026-09-02T18:00:00Z',
    views: 2150
  },
  {
    id: 'opp-8',
    title: 'Associate Product Manager — Campus Placement 2026-27',
    organization: 'Unicorn NextGen Tech',
    type: 'Placement',
    location: 'Gurugram / Bengaluru, India',
    mode: 'On-site',
    stipend: '₹18,00,000 - ₹24,00,000 CTC (Full-time)',
    deadline: '2026-10-05T23:59:59Z',
    eligibility: 'Final Year B.Tech / Dual Degree graduating batch of 2027',
    targetBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
    targetYears: ['4th Year'],
    skills: ['Product Strategy', 'Wireframing', 'Data Analytics', 'SQL', 'User Research', 'A/B Testing'],
    description: 'Rotational 2-year APM program giving graduating seniors direct ownership over user acquisition, conversion funnel experiments, and product roadmap development.',
    responsibilities: [
      'Write detailed PRDs (Product Requirement Documents) for consumer-facing features.',
      'Analyze telemetry data and run split tests to improve activation rates.',
      'Work in tight sprints with engineering, design, and marketing.'
    ],
    requirements: [
      'Graduating engineering senior with minimum 7.0 CGPA.',
      'Exceptional analytical aptitude, product intuition, and empathetic communication.'
    ],
    benefits: [
      'Industry-leading compensation with generous equity options.',
      'Semi-annual international learning summits.',
      'Comprehensive medical insurance and wellness stipends.'
    ],
    applicationProcess: 'Online Application -> Product Case Study submission -> Final Panel Presentation.',
    applyUrl: 'https://example.com/jobs/apm-campus-2027',
    sourceUrl: 'https://unicorntech.com/careers',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: true,
    createdBy: 'admin-1',
    createdAt: '2026-09-01T08:00:00Z',
    views: 4500
  },
  {
    id: 'opp-9',
    title: 'Certified Cloud Architect & DevOps Professional Track',
    organization: 'AWS Academy Student Program',
    type: 'Certification',
    location: 'Online Course & Exam',
    mode: 'Remote',
    stipend: '100% Exam Fee Waiver (Valued at $150)',
    deadline: '2026-10-25T23:59:59Z',
    eligibility: 'All college engineering students',
    targetBranches: ['CSE', 'ECE', 'EEE', 'Other'],
    targetYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    skills: ['AWS Cloud', 'IAM', 'VPC', 'EC2', 'Serverless', 'S3', 'Cloud Architecture'],
    description: 'Official AWS Academy student voucher initiative providing free curriculum access, hands-on cloud labs, and a fully subsidized AWS Certified Cloud Practitioner certification exam voucher.',
    responsibilities: [
      'Complete 20 hours of self-paced digital learning modules.',
      'Pass 3 practice benchmark tests with score >= 75% to unlock the exam voucher.'
    ],
    requirements: [
      'Current active college student email (.edu or .ac.in domain).',
      'Commitment to complete the certification within 60 days of voucher issuance.'
    ],
    benefits: [
      'Globally verified digital badge to showcase on LinkedIn and resume.',
      'Free 100% exam discount code.',
      'Access to exclusive AWS talent portal connecting certified students with recruiters.'
    ],
    applicationProcess: 'Student verification -> Instant portal access.',
    applyUrl: 'https://example.com/certifications/aws-student-voucher',
    sourceUrl: 'https://aws.amazon.com/training/awsacademy/',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: false,
    createdBy: 'admin-1',
    createdAt: '2026-08-28T14:00:00Z',
    views: 3200
  },
  {
    id: 'opp-10',
    title: 'EV Powertrain & Battery Management System Design Challenge',
    organization: 'AeroVolt Mobility & SAE Student Chapter',
    type: 'Competition',
    location: 'Pune, India',
    mode: 'On-site',
    stipend: '₹3,00,000 Top Prize + Prototype Funding',
    deadline: '2026-09-30T18:00:00Z',
    eligibility: 'Mechanical, EEE, Automobile, and ECE engineering students',
    targetBranches: ['Mechanical', 'EEE', 'ECE'],
    targetYears: ['2nd Year', '3rd Year', '4th Year'],
    skills: ['MATLAB', 'Simulink', 'CAD / SolidWorks', 'Battery Chemistries', 'Thermal Analysis'],
    description: 'Design and simulate an efficient thermal management and battery pack protection casing for high-performance electric two-wheelers.',
    responsibilities: [
      'Develop 3D CAD models and finite element thermal simulations.',
      'Submit comprehensive technical design report with bill of materials (BOM).'
    ],
    requirements: [
      'Team of 3-5 undergraduate students.',
      'Familiarity with SolidWorks/Ansys or MATLAB/Simulink modeling.'
    ],
    benefits: [
      'Direct interview rounds for R&D Core Engineering roles.',
      'Cash prize + ₹1.5 Lakh prototype fabrication grant for top 3 teams.'
    ],
    applicationProcess: 'Abstract submission -> Simulation review -> Final physical pitch at the Pune EV Tech Park.',
    applyUrl: 'https://example.com/competitions/aerovolt-ev-challenge',
    sourceUrl: 'https://aerovolt.in/challenge',
    imageUrl: 'https://images.unsplash.com/photo-1558441719-75a0bc07bbbf?auto=format&fit=crop&w=600&q=80',
    status: 'published',
    featured: false,
    createdBy: 'admin-1',
    createdAt: '2026-08-26T10:00:00Z',
    views: 1210
  }
];

export const MOCK_APPLICATIONS = [
  {
    id: 'app-1',
    opportunityId: 'opp-1',
    userId: 'student-1',
    status: 'Applied', // Saved, Applied, Interview, Selected, Rejected
    appliedAt: '2026-09-04T11:20:00Z',
    notes: 'Submitted resume and portfolio on Synthetix portal. Waiting for take-home assignment.',
    updatedAt: '2026-09-04T11:20:00Z'
  },
  {
    id: 'app-2',
    opportunityId: 'opp-2',
    userId: 'student-1',
    status: 'Interview',
    appliedAt: '2026-08-28T09:15:00Z',
    notes: 'Shortlisted for Round 2 pitching! Team presentation scheduled for Friday.',
    updatedAt: '2026-09-02T16:00:00Z'
  },
  {
    id: 'app-3',
    opportunityId: 'opp-3',
    userId: 'student-1',
    status: 'Applied',
    appliedAt: '2026-09-05T14:30:00Z',
    notes: 'Applied via official referral link. Coding round link expected in 48 hours.',
    updatedAt: '2026-09-05T14:30:00Z'
  }
];

export const MOCK_SAVED_IDS = ['opp-1', 'opp-2', 'opp-4', 'opp-8'];

export const MOCK_SUBMISSIONS = [
  {
    id: 'sub-1',
    submittedBy: 'student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@college.edu',
    title: 'Frontend Developer Intern (Vue / Tailwind)',
    organization: 'PixelCraft Studio',
    type: 'Internship',
    description: 'PixelCraft is looking for an enthusiastic frontend intern to build marketing pages and customer portals with Vue 3 and Tailwind.',
    location: 'Remote',
    mode: 'Remote',
    stipend: '₹20,000 / month',
    eligibility: '1st - 4th year B.Tech / BCA',
    skills: 'Vue.js, Tailwind CSS, JavaScript, HTML5',
    deadline: '2026-09-25',
    applyUrl: 'https://example.com/pixelcraft-intern-apply',
    sourceUrl: 'https://pixelcraft.design/careers',
    status: 'pending', // pending, approved, rejected
    createdAt: '2026-09-05T16:45:00Z'
  },
  {
    id: 'sub-2',
    submittedBy: 'student-2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@engg.edu',
    title: 'CyberSecurity Capture The Flag (CTF) Challenge 2026',
    organization: 'NullCon & OWASP Student Chapter',
    type: 'Competition',
    description: 'A 24-hour jeopardy-style cybersecurity tournament covering reverse engineering, cryptography, web exploitation, and digital forensics.',
    location: 'Virtual',
    mode: 'Remote',
    stipend: '₹1,50,000 Cash Prizes + CEH Vouchers',
    eligibility: 'Undergraduate and Polytechnic students',
    skills: 'Wireshark, Python, Linux, Cryptography, Reverse Engineering',
    deadline: '2026-09-18',
    applyUrl: 'https://example.com/nullcon-ctf-2026',
    sourceUrl: 'https://nullcon.net/student-ctf',
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
  id: 'admin-1',
  name: 'Devika Nair (Admin)',
  email: 'admin@campuslaunch.org',
  role: 'admin',
  college: 'CampusLaunch Platform Team',
  branch: 'Admin',
  year: 'Staff',
  skills: ['Opportunity Curation', 'Moderation', 'Platform Operations'],
  interests: ['Student Success', 'Community Building']
};

export const MOCK_REPORTS = [
  {
    id: 'rep-1',
    opportunityId: 'opp-1',
    opportunityTitle: 'AI/ML Research Engineering Intern',
    reportedBy: 'student-2',
    reporterEmail: 'priya.patel@engg.edu',
    reason: 'incorrect_info',
    details: 'The official portal lists stipend as ₹50,000 instead of ₹45,000 for 4th years.',
    status: 'pending',
    createdAt: '2026-09-06T14:20:00Z'
  },
  {
    id: 'rep-2',
    opportunityId: 'real-opp-10',
    opportunityTitle: 'GDSC Global Student Tech Summit & Hack',
    reportedBy: 'student-3',
    reporterEmail: 'karan.singh@campus.edu',
    reason: 'duplicate',
    details: 'This summit registration is also featured under the hackathons section.',
    status: 'investigating',
    createdAt: '2026-09-05T11:05:00Z'
  }
];

