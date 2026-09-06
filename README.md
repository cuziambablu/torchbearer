# CampusLaunch — Discover. Apply. Grow.

> Centralized college-focused opportunity discovery and career pipeline tracking platform.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🚀 Features

### 🎓 For Students
- **Smart Opportunity Discovery**: Search and filter across **Internships, Hackathons, Coding Competitions, Workshops, Scholarships, Fellowships, Placements, and Certifications**.
- **Personalized Recommendation Engine**: Multi-factor matching scoring algorithm based on student's branch (CSE, ECE, Mech, etc.), graduation year, and technical skills.
- **Deadline Intelligence**: Urgency badges (`⏰ Closes in 4h`, `🔥 3 days left`, `📅 14 days left`, `Expired`).
- **Application Tracker**: Full pipeline management (`Saved`, `Applied`, `Interview`, `Selected`, `Rejected`) with interview notes.
- **Community Submissions**: Submit open opportunities directly to the student review board.
- **Verified Official Links**: Direct redirection to official application portals.

### 🛡️ For Administrators
- **Admin Hub & Metrics**: Real-time KPI statistics on active opportunities, student traffic, and category breakdowns.
- **Listings Management**: Searchable data table with instant **Publish / Unpublish** toggle, Edit forms, and deletion safety.
- **Submission Moderation Queue**: 1-click **Approve & Publish** or **Reject** workflows for student-submitted opportunities.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security, Supabase Auth)
- **Design System**: Plus Jakarta Sans, Inter, custom modern palettes, responsive for Mobile, Tablet, and Desktop.

---

## 🏁 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/campuslaunch.git
cd campuslaunch
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## 🗄️ Database Schema

The database schema is located in `supabase/schema.sql` and includes:
- `profiles` (Student & Admin profiles)
- `opportunities` (Opportunity listings)
- `saved_opportunities` (Bookmarked items)
- `applications` (Application tracker pipeline)
- `opportunity_submissions` (Moderation queue)

---

## 📄 License

MIT License © 2026 CampusLaunch.
