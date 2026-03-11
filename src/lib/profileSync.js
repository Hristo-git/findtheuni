import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { track, Events } from './analytics.js';

// --- Remote profile CRUD ---

export async function loadRemoteProfile(userId) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('user_journeys')
    .select('profile_json, updated_at')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.warn('[sync] load failed:', error.message);
    return null;
  }
  return data;
}

export async function saveRemoteProfile(userId, profile) {
  if (!isSupabaseConfigured()) return;
  const now = new Date().toISOString();
  const payload = {
    user_id: userId,
    profile_json: { ...profile, updatedAt: now },
    updated_at: now,
    source: 'cloud'
  };
  const { error } = await supabase
    .from('user_journeys')
    .upsert(payload, { onConflict: 'user_id' });
  if (error) console.warn('[sync] save failed:', error.message);
}

export async function ensureUserProfile(userId, email) {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      email,
      plan: 'free',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  if (error) console.warn('[sync] ensureUserProfile failed:', error.message);
}

export async function getUserPlan(userId) {
  if (!isSupabaseConfigured()) return 'free';
  const { data, error } = await supabase
    .from('user_profiles')
    .select('plan')
    .eq('user_id', userId)
    .single();
  if (error) return 'free';
  return data?.plan || 'free';
}

// --- Migration ---

function mergeArraysUnique(local, remote, keyFn) {
  const map = new Map();
  (remote || []).forEach(item => map.set(keyFn(item), item));
  (local || []).forEach(item => {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, item);
  });
  return [...map.values()];
}

export function mergeProfiles(local, remote) {
  const localTime = local?.updatedAt ? new Date(local.updatedAt).getTime() : 0;
  const remoteTime = remote?.updatedAt ? new Date(remote.updatedAt).getTime() : 0;

  // Use newer profile as base, then merge additive arrays from both
  const base = remoteTime >= localTime ? { ...remote } : { ...local };
  const other = remoteTime >= localTime ? local : remote;

  // Merge additive collections
  base.favorites = [...new Set([...(base.favorites || []), ...(other.favorites || [])])];
  base.compared = [...new Set([...(base.compared || []), ...(other.compared || [])])].slice(0, 4);
  base.savedPrograms = mergeArraysUnique(
    local?.savedPrograms, remote?.savedPrograms,
    p => `${p.uniId}:${p.program}`
  );
  base.applications = mergeArraysUnique(
    local?.applications, remote?.applications,
    a => `${a.id}`
  );

  return base;
}

export async function migrateLocalToCloud(userId, localProfile) {
  if (!isSupabaseConfigured()) return localProfile;

  const remote = await loadRemoteProfile(userId);

  if (!remote) {
    // First sign-in: upload local profile as-is
    const migrated = { ...localProfile, updatedAt: new Date().toISOString() };
    await saveRemoteProfile(userId, migrated);
    track(Events.JOURNEY_MIGRATED, { strategy: 'fresh_upload' });
    return migrated;
  }

  // Remote exists: merge
  const merged = mergeProfiles(localProfile, remote.profile_json);
  merged.updatedAt = new Date().toISOString();
  await saveRemoteProfile(userId, merged);
  track(Events.JOURNEY_MIGRATED, { strategy: 'merged' });
  return merged;
}

// --- Debounced sync ---

let syncTimer = null;
export function debouncedSave(userId, profile, delayMs = 2000) {
  if (!userId || !isSupabaseConfigured()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => saveRemoteProfile(userId, profile), delayMs);
}
