import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import {
  INITIAL_OPPORTUNITIES,
  MOCK_APPLICATIONS,
  MOCK_SAVED_IDS,
  MOCK_SUBMISSIONS
} from '../data/mockOpportunities';

const OpportunityContext = createContext(null);

export function OpportunityProvider({ children }) {
  // 1. Opportunities State
  const [opportunities, setOpportunities] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_opportunities');
      return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  });

  // 2. Saved Opportunity IDs
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_saved_ids');
      return saved ? JSON.parse(saved) : MOCK_SAVED_IDS;
    } catch {
      return MOCK_SAVED_IDS;
    }
  });

  // 3. Applications State
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_applications');
      return saved ? JSON.parse(saved) : MOCK_APPLICATIONS;
    } catch {
      return MOCK_APPLICATIONS;
    }
  });

  // 4. Submissions State
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslaunch_submissions');
      return saved ? JSON.parse(saved) : MOCK_SUBMISSIONS;
    } catch {
      return MOCK_SUBMISSIONS;
    }
  });

  const [loading, setLoading] = useState(false);

  // Fetch live opportunities from Supabase on mount
  useEffect(() => {
    const fetchCloudData = async () => {
      if (!isSupabaseConfigured || !supabase) return;

      try {
        setLoading(true);
        // Fetch opportunities
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
            applyUrl: o.apply_url,
            sourceUrl: o.source_url,
            imageUrl: o.image_url,
            status: o.status,
            featured: o.featured,
            views: o.views,
            createdBy: o.created_by,
            createdAt: o.created_at,
            updatedAt: o.updated_at
          }));
          setOpportunities(formattedOpps);
          localStorage.setItem('campuslaunch_opportunities', JSON.stringify(formattedOpps));
        }

        // Fetch submissions
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

  // Saved Actions
  const toggleSave = (opportunityId) => {
    const isCurrentlySaved = savedIds.includes(opportunityId);
    let nextSaved;

    if (isCurrentlySaved) {
      nextSaved = savedIds.filter((id) => id !== opportunityId);
    } else {
      nextSaved = [...savedIds, opportunityId];
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
      stipend: submissionData.stipend || 'Unpaid / Certificate',
      eligibility: submissionData.eligibility || 'All Students',
      skills: submissionData.skills || '',
      deadline: submissionData.deadline,
      applyUrl: submissionData.applyUrl,
      sourceUrl: submissionData.sourceUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setSubmissions((prev) => [newSubmission, ...prev]);

    // Live sync to Supabase
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

  const approveSubmission = async (submissionId) => {
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
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      status: 'published',
      featured: false,
      createdBy: targetSub.submittedBy,
      createdAt: new Date().toISOString(),
      views: 1
    };

    setOpportunities((prev) => [newOpp, ...prev]);

    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'approved' } : s))
    );

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
            status: 'published',
            featured: false,
            views: 1
          }
        ]);

        // If UUID matches cloud submission
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

  const rejectSubmission = async (submissionId) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'rejected' } : s))
    );

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

  // Admin Opportunity CRUD with Supabase Sync
  const createOpportunity = async (oppData) => {
    const newOpp = {
      id: 'opp-' + Date.now(),
      ...oppData,
      status: oppData.status || 'published',
      createdAt: new Date().toISOString(),
      views: 0
    };
    setOpportunities((prev) => [newOpp, ...prev]);

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
            status: oppData.status || 'published',
            featured: oppData.featured || false
          }
        ]);
      } catch (err) {
        console.warn('Supabase create opportunity error:', err);
      }
    }

    return newOpp;
  };

  const updateOpportunity = async (id, updatedFields) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, ...updatedFields, updatedAt: new Date().toISOString() } : opp))
    );

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
            featured: updatedFields.featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update opportunity error:', err);
      }
    }
  };

  const deleteOpportunity = async (id) => {
    setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
    setSavedIds((prev) => prev.filter((sId) => sId !== id));

    if (isSupabaseConfigured && supabase && !id.startsWith('opp-')) {
      try {
        await supabase.from('opportunities').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
  };

  const togglePublishStatus = async (id) => {
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

  return (
    <OpportunityContext.Provider
      value={{
        opportunities,
        savedIds,
        applications,
        submissions,
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
        togglePublishStatus
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
