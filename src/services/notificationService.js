// In-App Notification Service for Students

import { supabase, isSupabaseConfigured } from './supabase';
import { getDeadlineStatus } from '../utils/dateUtils';

const LOCAL_NOTIFICATIONS_KEY = 'campuslaunch_notifications';

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: '⏰ Urgent Deadline: AI/ML Engineering Intern',
    message: 'Synthetix Labs application is closing in less than 6 days. Make sure to complete your submission!',
    type: 'deadline',
    link: '/opportunities/opp-1',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'notif-2',
    title: '✨ 95% Match Opportunity Available',
    message: 'Global HackIndia 2026 matches your CSE branch, 3rd year, and React/Python skills.',
    type: 'recommendation',
    link: '/opportunities/opp-2',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'notif-3',
    title: '🎉 Application Status Updated',
    message: 'Your application for Razorflow Payments was marked as "Interview". Check notes.',
    type: 'status_update',
    link: '/applications',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export async function fetchUserNotifications(userId) {
  if (isSupabaseConfigured && supabase && userId && !userId.startsWith('student-')) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          link: n.link,
          isRead: n.is_read,
          createdAt: n.created_at
        }));
      }
    } catch (e) {
      console.warn('Notifications cloud fetch error:', e);
    }
  }

  try {
    const saved = localStorage.getItem(LOCAL_NOTIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export async function createNotification({ userId, title, message, type = 'deadline', link = null }) {
  const notif = {
    id: 'notif-' + Date.now() + Math.random().toString(36).substring(2, 5),
    userId: userId || null,
    title,
    message,
    type,
    link,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_NOTIFICATIONS_KEY) || '[]');
    const updated = [notif, ...existing];
    localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    // Ignore
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').insert([
        {
          user_id: notif.userId,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          link: notif.link,
          is_read: false
        }
      ]);
    } catch (e) {
      console.warn('Could not insert notification into Supabase:', e);
    }
  }

  return notif;
}

export async function markNotificationAsRead(id) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_NOTIFICATIONS_KEY) || '[]');
    const updated = existing.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    // Ignore
  }

  if (isSupabaseConfigured && supabase && !id.startsWith('notif-')) {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch (e) {
      console.warn('Could not mark notification read in Supabase:', e);
    }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_NOTIFICATIONS_KEY) || '[]');
    const updated = existing.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    // Ignore
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
    } catch (e) {
      console.warn('Could not mark all notifications read in Supabase:', e);
    }
  }
}
