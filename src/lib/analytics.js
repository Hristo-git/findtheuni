import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const EVENT_QUEUE = [];
let currentUserId = null;

export function setAnalyticsUser(userId) {
  currentUserId = userId;
}

export function track(eventName, properties = {}) {
  const event = {
    event: eventName,
    user_id: currentUserId,
    properties,
    timestamp: new Date().toISOString(),
    url: window.location.pathname
  };

  if (import.meta.env.DEV) {
    console.log('[analytics]', eventName, properties);
  }

  if (isSupabaseConfigured() && supabase) {
    supabase.from('analytics_events').insert(event).then(({ error }) => {
      if (error && import.meta.env.DEV) console.warn('[analytics] insert failed:', error.message);
    });
  } else {
    EVENT_QUEUE.push(event);
  }
}

// Flush queued events after sign-in
export function flushQueue() {
  if (!isSupabaseConfigured() || EVENT_QUEUE.length === 0) return;
  const events = EVENT_QUEUE.splice(0);
  events.forEach(e => { e.user_id = currentUserId; });
  supabase.from('analytics_events').insert(events).then(({ error }) => {
    if (error && import.meta.env.DEV) console.warn('[analytics] flush failed:', error.message);
  });
}

// Convenience helpers for Sprint 2 events
export const Events = {
  ACCOUNT_PROMPT_SHOWN: 'account_prompt_shown',
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_SIGNED_IN: 'account_signed_in',
  JOURNEY_MIGRATED: 'journey_migrated_to_cloud',
  REMINDER_ENABLED: 'reminder_enabled',
  REMINDER_DISABLED: 'reminder_disabled',
  PREMIUM_CTA_VIEWED: 'premium_cta_viewed',
  PREMIUM_CTA_CLICKED: 'premium_cta_clicked',
  UNIVERSITY_FAVORITED: 'university_favorited',
  PROGRAM_SAVED: 'program_saved',
  APPLICATION_STARTED: 'application_started',
  APPLICATION_STATUS_CHANGED: 'application_status_changed'
};
