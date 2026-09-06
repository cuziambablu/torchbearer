import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import OpportunitiesPage from './pages/public/OpportunitiesPage';
import OpportunityDetailPage from './pages/public/OpportunityDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Student Pages
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import SavedOpportunitiesPage from './pages/student/SavedOpportunitiesPage';
import ApplicationTrackerPage from './pages/student/ApplicationTrackerPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import SubmitOpportunityPage from './pages/student/SubmitOpportunityPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageOpportunitiesPage from './pages/admin/ManageOpportunitiesPage';
import CreateOpportunityPage from './pages/admin/CreateOpportunityPage';
import EditOpportunityPage from './pages/admin/EditOpportunityPage';
import ReviewSubmissionsPage from './pages/admin/ReviewSubmissionsPage';
import CsvImportPage from './pages/admin/CsvImportPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="opportunities/:id" element={<OpportunityDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Student Routes */}
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="saved" element={<SavedOpportunitiesPage />} />
        <Route path="applications" element={<ApplicationTrackerPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="submit" element={<SubmitOpportunityPage />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="admin/opportunities" element={<ManageOpportunitiesPage />} />
        <Route path="admin/opportunities/new" element={<CreateOpportunityPage />} />
        <Route path="admin/opportunities/:id/edit" element={<EditOpportunityPage />} />
        <Route path="admin/submissions" element={<ReviewSubmissionsPage />} />
        <Route path="admin/import" element={<CsvImportPage />} />
        <Route path="admin/logs" element={<AdminAuditLogsPage />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
