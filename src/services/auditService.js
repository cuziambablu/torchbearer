// Admin Audit Logging Service

import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_LOGS_KEY = 'campuslaunch_admin_logs';

/**
 * Logs an administrative event to the audit log
 */
export async function logAdminAction({ adminId, adminEmail, action, entity, entityId, details = {} }) {
  const newLog = {
    id: 'log-' + Date.now() + Math.random().toString(36).substring(2, 5),
    adminId: adminId || 'admin-1',
    adminEmail: adminEmail || 'admin@campuslaunch.org',
    action, // e.g. 'OPPORTUNITY_VERIFIED', 'OPPORTUNITY_DELETED', 'CSV_IMPORTED'
    entity, // e.g. 'opportunity', 'submission', 'user'
    entityId: entityId || null,
    details,
    createdAt: new Date().toISOString()
  };

  // 1. Update local storage
  try {
    const existingLogs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY) || '[]');
    const updated = [newLog, ...existingLogs].slice(0, 100);
    localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    // Ignore storage issues
  }

  // 2. Persist to Supabase if connected
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('admin_logs').insert([
        {
          admin_email: newLog.adminEmail,
          action: newLog.action,
          entity: newLog.entity,
          entity_id: newLog.entityId,
          details: newLog.details
        }
      ]);
    } catch (e) {
      console.warn('Could not sync admin log to Supabase:', e);
    }
  }

  return newLog;
}

/**
 * Fetches admin audit logs
 */
export async function fetchAdminLogs(limit = 50) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          adminEmail: d.admin_email,
          action: d.action,
          entity: d.entity,
          entityId: d.entity_id,
          details: d.details,
          createdAt: d.created_at
        }));
      }
    } catch (e) {
      console.warn('Fetch admin logs cloud error:', e);
    }
  }

  try {
    return JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY) || '[]');
  } catch {
    return [];
  }
}
