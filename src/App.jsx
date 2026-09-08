import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Protections
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import OpportunitiesPage from './pages/public/OpportunitiesPage';
import OpportunityDetailPage from './pages/public/OpportunityDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Student Auth Pages (Standalone)
import StudentLoginPage from './pages/student/StudentLoginPage';
import StudentSignupPage from './pages/student/StudentSignupPage';
import ForgotPasswordPage from './pages/student/ForgotPasswordPage';

// Student Protected Portal Pages
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import SavedOpportunitiesPage from './pages/student/SavedOpportunitiesPage';
import ApplicationTrackerPage from './pages/student/ApplicationTrackerPage';
import DeadlineCenterPage from './pages/student/DeadlineCenterPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentSettingsPage from './pages/student/StudentSettingsPage';
import SubmitOpportunityPage from './pages/student/SubmitOpportunityPage';

// Admin Auth Page (Standalone)
import AdminLoginPage from './pages/admin/AdminLoginPage';

// Admin Protected Portal Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageOpportunitiesPage from './pages/admin/ManageOpportunitiesPage';
import CreateOpportunityPage from './pages/admin/CreateOpportunityPage';
import EditOpportunityPage from './pages/admin/EditOpportunityPage';
import VerificationCenterPage from './pages/admin/VerificationCenterPage';
import OpportunitySourcesPage from './pages/admin/OpportunitySourcesPage';
import StudentManagementPage from './pages/admin/StudentManagementPage';
import ReviewSubmissionsPage from './pages/admin/ReviewSubmissionsPage';
import ReviewReportsPage from './pages/admin/ReviewReportsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import CsvImportPage from './pages/admin/CsvImportPage';

export default function App() {
  return (
    <Routes>
      {/* ========================================================= */}
      {/* 1. STANDALONE AUTHENTICATION ROUTES                       */}
      {/* ========================================================= */}
      <Route path="/student/login" element={<StudentLoginPage />} />
      <Route path="/student/signup" element={<StudentSignupPage />} />
      <Route path="/student/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Aliases for quick access */}
      <Route path="/login" element={<Navigate to="/student/login" replace />} />
      <Route path="/register" element={<Navigate to="/student/signup" replace />} />
      <Route path="/signup" element={<Navigate to="/student/signup" replace />} />

      {/* ========================================================= */}
      {/* 2. PUBLIC WEBSITE (PublicLayout)                          */}
      {/* ========================================================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ========================================================= */}
      {/* 3. STUDENT PORTAL (ProtectedRoute + StudentLayout)        */}
      {/* ========================================================= */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="opportunities/:id" element={<OpportunityDetailPage />} />
        <Route path="saved" element={<SavedOpportunitiesPage />} />
        <Route path="applications" element={<ApplicationTrackerPage />} />
        <Route path="deadlines" element={<DeadlineCenterPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="settings" element={<StudentSettingsPage />} />
        <Route path="submit" element={<SubmitOpportunityPage />} />
      </Route>

      {/* Student route aliases for backward compatibility */}
      <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/saved" element={<Navigate to="/student/saved" replace />} />
      <Route path="/applications" element={<Navigate to="/student/applications" replace />} />
      <Route path="/deadlines" element={<Navigate to="/student/deadlines" replace />} />
      <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
      <Route path="/settings" element={<Navigate to="/student/settings" replace />} />
      <Route path="/submit" element={<Navigate to="/student/submit" replace />} />

      {/* ========================================================= */}
      {/* 4. ADMIN PORTAL (AdminRoute + AdminLayout)                */}
      {/* ========================================================= */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="opportunities" element={<ManageOpportunitiesPage />} />
        <Route path="opportunities/new" element={<CreateOpportunityPage />} />
        <Route path="opportunities/:id/edit" element={<EditOpportunityPage />} />
        <Route path="verification" element={<VerificationCenterPage />} />
        <Route path="sources" element={<OpportunitySourcesPage />} />
        <Route path="submissions" element={<ReviewSubmissionsPage />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="reports" element={<ReviewReportsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="logs" element={<Navigate to="/admin/audit-logs" replace />} />
        <Route path="import" element={<CsvImportPage />} />
      </Route>

      {/* ========================================================= */}
      {/* 5. WILDCARD CATCH-ALL                                     */}
      {/* ========================================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
