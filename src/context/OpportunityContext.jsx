import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { REAL_VERIFIED_OPPORTUNITIES } from '../data/realVerifiedOpportunities';
import { INITIAL_OPPORTUNITIES, MOCK_APPLICATIONS, MOCK_SAVED_IDS, MOCK_SUBMISSIONS, MOCK_REPORTS } from '../data/mockOpportunities';
import { logAdminAction } from '../services/auditService';
import { createNotification } from '../services/notificationService';

const OpportunityContext = createContext(null);

export function OpportunityProvider({ children }) {
  // Combine real verified opportunities as primary dataset
  const ALL_SEED_OPPORTUNITIES = [...REAL_VERIFIED_OPPORTUNITIES, ...INITIAL_OPPORTUNITIES];

  // 1. Opportunities State
  const [opportunities, setOpportunities] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_opportunities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return ALL_SEED_OPPORTUNITIES;
    } catch {
      return ALL_SEED_OPPORTUNITIES;
    }
  });

  // 2. Saved Opportunity IDs
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_saved_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return MOCK_SAVED_IDS;
    } catch {
      return MOCK_SAVED_IDS;
    }
  });

  // 3. Applications State
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return MOCK_APPLICATIONS;
    } catch {
      return MOCK_APPLICATIONS;
    }
  });

  // 4. Submissions State
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_submissions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return MOCK_SUBMISSIONS;
    } catch {
      return MOCK_SUBMISSIONS;
    }
  });

  // 5. Reports State (for broken links, scam reports, expired listings)
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_reports');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return MOCK_REPORTS;
    } catch {
      return MOCK_REPORTS;
    }
  });

  const [loading, setLoading] = useState(false);

  // Automated Expiration Checker: Run on mount to ensure expired opportunities are marked expired
  useEffect(() => {
    const now = new Date();
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.deadline && new Date(opp.deadline) < now && opp.status !== 'expired') {
          return { ...opp, status: 'expired', verificationStatus: 'expired' };
        }
        return opp;
      })
    );

    // Call Supabase automated expiration stored procedure if configured
    if (isSupabaseConfigured && supabase) {
      try {
        supabase.rpc('expire_past_deadlines').then(() => {}).catch?.(() => {});
      } catch (err) {
        // Ignore offline RPC errors
      }
    }
  }, []);

  // Fetch live opportunities from Supabase
  useEffect(() => {
    const fetchCloudData = async () => {
      if (!isSupabaseConfigured || !supabase) return;

      try {
        setLoading(true);
        const { data: cloudOpps, error: oppError } = await supabase
          .from('opportunities')
          .select('*')
          .order('created_at', { ascending: false });

        if (cloudOpps && cloudOpps.length > 0 && !oppError) {
          const formattedOpps = cloudOpps.map((o) => ({
            id: o.id,
            title: o.title,
            organization: o.organization,
            type: o.type,
            location: o.location,
            mode: o.mode,
            stipend: o.stipend,
            prize: o.prize,
            eligibility: o.eligibility,
            targetBranches: o.target_branches || [],
            targetYears: o.target_years || [],
            skills: o.skills || [],
            description: o.description,
            responsibilities: o.responsibilities || [],
            requirements: o.requirements || [],
            benefits: o.benefits || [],
            applicationProcess: o.application_process,
            deadline: o.deadline,
            start_date: o.start_date,
            applyUrl: o.apply_url,
            sourceUrl: o.source_url,
            sourceName: o.source_name || 'Official Source',
            imageUrl: o.image_url,
            status: o.status,
            verificationStatus: o.verification_status || 'verified',
            verifiedAt: o.verified_at,
            lastVerifiedAt: o.last_verified_at,
            featured: o.featured,
            isCollegeExclusive: o.is_college_exclusive,
            isOfficialCollege: o.is_official_college,
            collegeName: o.college_name,
            views: o.views,
            fingerprint: o.fingerprint,
            createdBy: o.created_by,
            createdAt: o.created_at,
            updatedAt: o.updated_at
          }));
          setOpportunities(formattedOpps);
          localStorage.setItem('campuslaunch_opportunities', JSON.stringify(formattedOpps));
        }

        const { data: cloudSubs } = await supabase
          .from('opportunity_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (cloudSubs && cloudSubs.length > 0) {
          const formattedSubs = cloudSubs.map((s) => ({
            id: s.id,
            submittedBy: s.submitted_by,
            studentName: s.student_name,
            studentEmail: s.student_email,
            title: s.title,
            organization: s.organization,
            type: s.type,
            description: s.description,
            location: s.location,
            mode: s.mode,
            stipend: s.stipend,
            eligibility: s.eligibility,
            skills: s.skills,
            deadline: s.deadline,
            applyUrl: s.apply_url,
            sourceUrl: s.source_url,
            status: s.status,
            createdAt: s.created_at
          }));
          setSubmissions(formattedSubs);
          localStorage.setItem('campuslaunch_submissions', JSON.stringify(formattedSubs));
        }

        const { data: cloudReports } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (cloudReports && cloudReports.length > 0) {
          const formattedReports = cloudReports.map((r) => ({
            id: r.id,
            opportunityId: r.opportunity_id,
            opportunityTitle: r.opportunity_title,
            reportedBy: r.reported_by,
            reporterEmail: r.reporter_email,
            reason: r.reason,
            details: r.details,
            status: r.status,
            adminNotes: r.admin_notes,
            resolvedAt: r.resolved_at,
            createdAt: r.created_at
          }));
          setReports(formattedReports);
          localStorage.setItem('campuslaunch_reports', JSON.stringify(formattedReports));
        }
      } catch (err) {
        console.warn('Live fetch error, falling back to cached state:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCloudData();
  }, []);

  // Persist local state
  useEffect(() => {
    localStorage.setItem('campuslaunch_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('campuslaunch_saved_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('campuslaunch_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('campuslaunch_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('campuslaunch_reports', JSON.stringify(reports));
  }, [reports]);

  // Saved Actions
  const toggleSave = (opportunityId) => {
    const isCurrentlySaved = savedIds.includes(opportunityId);
    let nextSaved;

    if (isCurrentlySaved) {
      nextSaved = savedIds.filter((id) => id !== opportunityId);
    } else {
      nextSaved = [...savedIds, opportunityId];
      // Create reminder notification if closing soon
      const opp = opportunities.find((o) => o.id === opportunityId);
      if (opp && opp.deadline) {
        createNotification({
          title: `Bookmarked: ${opp.title}`,
          message: `We'll notify you before the application deadline on ${new Date(opp.deadline).toLocaleDateString()}.`,
          type: 'deadline',
          link: `/opportunities/${opp.id}`
        });
      }
    }

    setSavedIds(nextSaved);
    localStorage.setItem('campuslaunch_saved_ids', JSON.stringify(nextSaved));
    return !isCurrentlySaved;
  };

  const isSaved = (opportunityId) => savedIds.includes(opportunityId);

  // Application Actions
  const addApplication = (opportunityId, status = 'Applied', notes = '') => {
    const existing = applications.find((a) => a.opportunityId === opportunityId);
    if (existing) {
      updateApplicationStatus(existing.id, status, notes);
      return existing;
    }

    const newApp = {
      id: 'app-' + Date.now(),
      opportunityId,
      userId: 'current-user',
      status,
      appliedAt: new Date().toISOString(),
      notes,
      updatedAt: new Date().toISOString()
    };

    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApplicationStatus = (applicationId, newStatus, notes) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: newStatus,
              notes: notes !== undefined ? notes : app.notes,
              updatedAt: new Date().toISOString()
            }
          : app
      )
    );
  };

  const removeApplication = (applicationId) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
  };

  // Student Submissions Actions
  const submitOpportunity = async (submissionData) => {
    const newSubmission = {
      id: 'sub-' + Date.now(),
      submittedBy: submissionData.submittedBy || 'student-1',
      studentName: submissionData.studentName || 'Student Contributor',
      studentEmail: submissionData.studentEmail || 'student@college.edu',
      title: submissionData.title,
      organization: submissionData.organization,
      type: submissionData.type || 'Internship',
      description: submissionData.description,
      location: submissionData.location || 'Remote',
      mode: submissionData.mode || 'Remote',
      stipend: submissionData.stipend || null,
      eligibility: submissionData.eligibility || 'All Students',
      skills: submissionData.skills || '',
      deadline: submissionData.deadline,
      applyUrl: submissionData.applyUrl,
      sourceUrl: submissionData.sourceUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setSubmissions((prev) => [newSubmission, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('opportunity_submissions').insert([
          {
            student_name: newSubmission.studentName,
            student_email: newSubmission.studentEmail,
            title: newSubmission.title,
            organization: newSubmission.organization,
            type: newSubmission.type,
            description: newSubmission.description,
            location: newSubmission.location,
            mode: newSubmission.mode,
            stipend: newSubmission.stipend,
            eligibility: newSubmission.eligibility,
            skills: newSubmission.skills,
            deadline: newSubmission.deadline ? `${newSubmission.deadline}T23:59:59Z` : null,
            apply_url: newSubmission.applyUrl,
            source_url: newSubmission.sourceUrl,
            status: 'pending'
          }
        ]);
      } catch (err) {
        console.warn('Could not insert submission to Supabase:', err);
      }
    }

    return newSubmission;
  };

  const approveSubmission = async (submissionId, adminEmail = 'admin@campuslaunch.org') => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub) return;

    const skillsArray = typeof targetSub.skills === 'string'
      ? targetSub.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : targetSub.skills || [];

    const newOpp = {
      id: 'opp-' + Date.now(),
      title: targetSub.title,
      organization: targetSub.organization,
      type: targetSub.type,
      location: targetSub.location || 'Remote',
      mode: targetSub.mode || 'Remote',
      stipend: targetSub.stipend,
      prize: null,
      deadline: targetSub.deadline ? `${targetSub.deadline}T23:59:59Z` : new Date(Date.now() + 86400000 * 14).toISOString(),
      eligibility: targetSub.eligibility || 'All undergraduate college students',
      targetBranches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
      targetYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      skills: skillsArray.length ? skillsArray : ['Communication', 'Teamwork'],
      description: targetSub.description,
      responsibilities: ['Review official opportunity documentation for detailed tasks.'],
      requirements: [targetSub.eligibility || 'Enrolled college student.'],
      benefits: ['Valuable student experience and networking.'],
      applicationProcess: 'Apply via official application URL provided by submitter.',
      applyUrl: targetSub.applyUrl,
      sourceUrl: targetSub.sourceUrl || targetSub.applyUrl,
      sourceName: 'Student Community Verified',
      status: 'published',
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      featured: false,
      isCollegeExclusive: false,
      isOfficialCollege: false,
      views: 1,
      createdAt: new Date().toISOString()
    };

    setOpportunities((prev) => [newOpp, ...prev]);

    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'approved' } : s))
    );

    // Record audit log
    await logAdminAction({
      adminEmail,
      action: 'SUBMISSION_APPROVED',
      entity: 'opportunity_submissions',
      entityId: submissionId,
      details: { title: newOpp.title, organization: newOpp.organization }
    });

    // Sync to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('opportunities').insert([
          {
            title: newOpp.title,
            organization: newOpp.organization,
            type: newOpp.type,
            location: newOpp.location,
            mode: newOpp.mode,
            stipend: newOpp.stipend,
            eligibility: newOpp.eligibility,
            target_branches: newOpp.targetBranches,
            target_years: newOpp.targetYears,
            skills: newOpp.skills,
            description: newOpp.description,
            responsibilities: newOpp.responsibilities,
            requirements: newOpp.requirements,
            benefits: newOpp.benefits,
            application_process: newOpp.applicationProcess,
            deadline: newOpp.deadline,
            apply_url: newOpp.applyUrl,
            source_url: newOpp.sourceUrl,
            source_name: newOpp.sourceName,
            status: 'published',
            verification_status: 'verified',
            verified_at: newOpp.verifiedAt,
            last_verified_at: newOpp.lastVerifiedAt,
            featured: false,
            views: 1
          }
        ]);

        if (!submissionId.startsWith('sub-')) {
          await supabase
            .from('opportunity_submissions')
            .update({ status: 'approved' })
            .eq('id', submissionId);
        }
      } catch (err) {
        console.warn('Supabase approval sync error:', err);
      }
    }
  };

  const rejectSubmission = async (submissionId, adminEmail = 'admin@campuslaunch.org') => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'rejected' } : s))
    );

    await logAdminAction({
      adminEmail,
      action: 'SUBMISSION_REJECTED',
      entity: 'opportunity_submissions',
      entityId: submissionId
    });

    if (isSupabaseConfigured && supabase && !submissionId.startsWith('sub-')) {
      try {
        await supabase
          .from('opportunity_submissions')
          .update({ status: 'rejected' })
          .eq('id', submissionId);
      } catch (err) {
        console.warn('Supabase reject sync error:', err);
      }
    }
  };

  // Admin Opportunity CRUD with Supabase & Audit Sync
  const createOpportunity = async (oppData, adminEmail = 'admin@campuslaunch.org') => {
    const newOpp = {
      id: 'opp-' + Date.now(),
      ...oppData,
      status: oppData.status || 'published',
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      views: 0
    };
    setOpportunities((prev) => [newOpp, ...prev]);

    await logAdminAction({
      adminEmail,
      action: 'OPPORTUNITY_CREATED',
      entity: 'opportunities',
      entityId: newOpp.id,
      details: { title: newOpp.title, organization: newOpp.organization }
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('opportunities').insert([
          {
            title: oppData.title,
            organization: oppData.organization,
            type: oppData.type,
            location: oppData.location,
            mode: oppData.mode,
            stipend: oppData.stipend,
            prize: oppData.prize,
            eligibility: oppData.eligibility,
            target_branches: oppData.targetBranches,
            target_years: oppData.targetYears,
            skills: oppData.skills,
            description: oppData.description,
            responsibilities: oppData.responsibilities,
            requirements: oppData.requirements,
            benefits: oppData.benefits,
            application_process: oppData.applicationProcess,
            deadline: oppData.deadline,
            apply_url: oppData.applyUrl,
            source_url: oppData.sourceUrl,
            source_name: oppData.sourceName || 'Official Source',
            status: oppData.status || 'published',
            verification_status: 'verified',
            verified_at: new Date().toISOString(),
            last_verified_at: new Date().toISOString(),
            featured: oppData.featured || false,
            is_college_exclusive: oppData.isCollegeExclusive || false,
            is_official_college: oppData.isOfficialCollege || false,
            college_name: oppData.collegeName || null
          }
        ]);
      } catch (err) {
        console.warn('Supabase create opportunity error:', err);
      }
    }

    return newOpp;
  };

  const updateOpportunity = async (id, updatedFields, adminEmail = 'admin@campuslaunch.org') => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, ...updatedFields, updatedAt: new Date().toISOString() } : opp))
    );

    await logAdminAction({
      adminEmail,
      action: 'OPPORTUNITY_UPDATED',
      entity: 'opportunities',
      entityId: id,
      details: { fields: Object.keys(updatedFields) }
    });

    if (isSupabaseConfigured && supabase && !id.startsWith('opp-')) {
      try {
        await supabase
          .from('opportunities')
          .update({
            title: updatedFields.title,
            organization: updatedFields.organization,
            type: updatedFields.type,
            location: updatedFields.location,
            mode: updatedFields.mode,
            stipend: updatedFields.stipend,
            prize: updatedFields.prize,
            eligibility: updatedFields.eligibility,
            target_branches: updatedFields.targetBranches,
            target_years: updatedFields.targetYears,
            skills: updatedFields.skills,
            description: updatedFields.description,
            responsibilities: updatedFields.responsibilities,
            requirements: updatedFields.requirements,
            benefits: updatedFields.benefits,
            application_process: updatedFields.applicationProcess,
            deadline: updatedFields.deadline,
            apply_url: updatedFields.applyUrl,
            source_url: updatedFields.sourceUrl,
            status: updatedFields.status,
            verification_status: updatedFields.verificationStatus,
            featured: updatedFields.featured,
            is_college_exclusive: updatedFields.isCollegeExclusive,
            is_official_college: updatedFields.isOfficialCollege,
            college_name: updatedFields.collegeName,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update opportunity error:', err);
      }
    }
  };

  const deleteOpportunity = async (id, adminEmail = 'admin@campuslaunch.org') => {
    setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
    setSavedIds((prev) => prev.filter((sId) => sId !== id));

    await logAdminAction({
      adminEmail,
      action: 'OPPORTUNITY_DELETED',
      entity: 'opportunities',
      entityId: id
    });

    if (isSupabaseConfigured && supabase && !id.startsWith('opp-')) {
      try {
        await supabase.from('opportunities').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
  };

  const togglePublishStatus = async (id, adminEmail = 'admin@campuslaunch.org') => {
    let nextStatus = 'published';
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          nextStatus = opp.status === 'published' ? 'draft' : 'published';
          return { ...opp, status: nextStatus };
        }
        return opp;
      })
    );

    await logAdminAction({
      adminEmail,
      action: nextStatus === 'published' ? 'OPPORTUNITY_PUBLISHED' : 'OPPORTUNITY_UNPUBLISHED',
      entity: 'opportunities',
      entityId: id
    });

    if (isSupabaseConfigured && supabase && !id.startsWith('opp-')) {
      try {
        await supabase
          .from('opportunities')
          .update({ status: nextStatus })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase publish toggle error:', err);
      }
    }
  };

  // Student Reporting Actions (Broken link, Scam, Expired, Incorrect Info)
  const reportOpportunity = async ({ opportunityId, opportunityTitle, reason, details, reportedBy, reporterEmail }) => {
    const newReport = {
      id: 'rep-' + Date.now(),
      opportunityId,
      opportunityTitle: opportunityTitle || 'Opportunity',
      reportedBy: reportedBy || 'student-user',
      reporterEmail: reporterEmail || 'student@college.edu',
      reason,
      details: details || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setReports((prev) => [newReport, ...prev]);

    // Send admin notification
    createNotification({
      title: 'Report Submitted',
      message: `Your report for "${opportunityTitle || 'Opportunity'}" has been submitted for moderation.`,
      type: 'report',
      link: `/opportunities/${opportunityId}`
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('reports').insert([
          {
            opportunity_id: opportunityId.startsWith('opp-') || opportunityId.startsWith('real-opp-') ? null : opportunityId,
            opportunity_title: opportunityTitle,
            reporter_email: reporterEmail,
            reason,
            details,
            status: 'pending'
          }
        ]);
      } catch (err) {
        console.warn('Supabase insert report error:', err);
      }
    }

    return newReport;
  };

  const resolveReport = async (reportId, actionTaken = 'resolved', adminNotes = '', adminEmail = 'admin@campuslaunch.org') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'resolved', adminNotes, resolvedAt: new Date().toISOString() }
          : r
      )
    );

    await logAdminAction({
      adminEmail,
      action: 'REPORT_RESOLVED',
      entity: 'reports',
      entityId: reportId,
      details: { actionTaken, adminNotes }
    });

    if (isSupabaseConfigured && supabase && !reportId.startsWith('rep-')) {
      try {
        await supabase
          .from('reports')
          .update({
            status: 'resolved',
            admin_notes: adminNotes,
            resolved_at: new Date().toISOString()
          })
          .eq('id', reportId);
      } catch (err) {
        console.warn('Supabase resolve report error:', err);
      }
    }
  };

  const dismissReport = async (reportId, adminNotes = 'Deemed accurate after review', adminEmail = 'admin@campuslaunch.org') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'dismissed', adminNotes, resolvedAt: new Date().toISOString() }
          : r
      )
    );

    await logAdminAction({
      adminEmail,
      action: 'REPORT_DISMISSED',
      entity: 'reports',
      entityId: reportId,
      details: { adminNotes }
    });

    if (isSupabaseConfigured && supabase && !reportId.startsWith('rep-')) {
      try {
        await supabase
          .from('reports')
          .update({
            status: 'dismissed',
            admin_notes: adminNotes,
            resolved_at: new Date().toISOString()
          })
          .eq('id', reportId);
      } catch (err) {
        console.warn('Supabase dismiss report error:', err);
      }
    }
  };

  return (
    <OpportunityContext.Provider
      value={{
        opportunities,
        setOpportunities,
        savedIds,
        applications,
        submissions,
        reports,
        loading,
        toggleSave,
        isSaved,
        addApplication,
        updateApplicationStatus,
        removeApplication,
        submitOpportunity,
        approveSubmission,
        rejectSubmission,
        createOpportunity,
        updateOpportunity,
        deleteOpportunity,
        togglePublishStatus,
        reportOpportunity,
        resolveReport,
        dismissReport
      }}
    >
      {children}
    </OpportunityContext.Provider>
  );
}

export function useOpportunities() {
  const context = useContext(OpportunityContext);
  if (!context) {
    throw new Error('useOpportunities must be used within an OpportunityProvider');
  }
  return context;
}
