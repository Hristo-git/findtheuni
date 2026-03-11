import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { debouncedSave } from './lib/profileSync.js';
import { track, Events } from './lib/analytics.js';

const KEY = 'ftu_profile_v3';

const JOURNEY_STAGES = [
  { id: 'profile', label: 'Профил', emoji: '👤', route: 'home' },
  { id: 'career', label: 'Кариера', emoji: '🧬', route: 'test' },
  { id: 'countries', label: 'Държави', emoji: '🌍', route: 'guides' },
  { id: 'universities', label: 'Университети', emoji: '🎓', route: 'browse' },
  { id: 'programs', label: 'Програми', emoji: '📚', route: 'programs' },
  { id: 'planning', label: 'Планиране', emoji: '📋', route: 'tracker' },
  { id: 'applying', label: 'Кандидатстване', emoji: '📤', route: 'tracker' },
];

const defaults = {
  onboarded: false,
  name: '',
  email: '',
  level: '',          // bachelor | master | phd
  fields: [],         // ["IT","Медицина"]
  langPref: '',       // en | de | fr | local
  budget: 800,        // €/month
  gpa: '',            // string, flexible
  langCerts: {},      // { ielts: "6.5", toefl: "" }
  country: '',        // preferred country
  startDate: '',      // e.g. "2026-10" preferred start semester
  riasecDone: false,
  riasecScores: { R:0, I:0, A:0, S:0, E:0, C:0 },
  riasecCode: '',
  archetype: '',
  favorites: [],
  compared: [],
  savedPrograms: [],
  applications: [],
  docs: {},
  quizResults: null,
  targetCountries: [],
  createdAt: null,
  updatedAt: null,
  // Sprint 2 additions
  plan: 'free',
  reminderSettings: {
    remindersEnabled: false,
    reminderEmail: '',
    reminderOffsetsDays: [30, 14, 7, 1],
    weeklyDigestEnabled: false
  }
};

const UserCtx = createContext();

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      }
    } catch {}
    return { ...defaults };
  });

  // Track auth user ID for cloud sync
  const authUserIdRef = useRef(null);

  // Persist locally on every change
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch {}
    // Also sync to cloud if authenticated
    if (authUserIdRef.current) {
      debouncedSave(authUserIdRef.current, profile);
    }
  }, [profile]);

  // Auto-compute journey stages (NON-sequential — each stage unlocks independently)
  const completedStages = useMemo(() => {
    const checks = {
      profile: profile.onboarded,
      career: profile.riasecDone,
      // Countries: done quiz OR set a preferred country in onboarding OR has browsed enough
      countries: !!profile.quizResults || (profile.targetCountries?.length > 0)
        || !!profile.country || profile.favorites.length >= 1,
      // Universities: added at least 3 favorites
      universities: profile.favorites.length >= 3,
      // Programs: saved a program or has 3+ favorites (they've explored programs)
      programs: (profile.savedPrograms?.length || 0) > 0 || profile.favorites.length >= 5,
      planning: profile.applications.length > 0,
      applying: profile.applications.some(a => a.status === 'applied' || a.status === 'accepted'),
    };
    // Non-sequential: mark ALL completed stages, not just up to first incomplete
    return JOURNEY_STAGES.filter(stage => checks[stage.id]).map(s => s.id);
  }, [profile]);

  const currentStage = useMemo(() => {
    for (const stage of JOURNEY_STAGES) {
      if (!completedStages.includes(stage.id)) return stage.id;
    }
    return 'applying';
  }, [completedStages]);

  const journeyProgress = Math.round((completedStages.length / JOURNEY_STAGES.length) * 100);

  const update = (patch) => setProfile(p => ({ ...p, ...patch, updatedAt: new Date().toISOString() }));

  const toggleFav = (id) => setProfile(p => ({
    ...p,
    favorites: p.favorites.includes(id)
      ? p.favorites.filter(x => x !== id)
      : [...p.favorites, id],
    updatedAt: new Date().toISOString()
  }));

  const toggleCompare = (id) => setProfile(p => ({
    ...p,
    compared: p.compared.includes(id)
      ? p.compared.filter(x => x !== id)
      : p.compared.length < 4 ? [...p.compared, id] : p.compared,
    updatedAt: new Date().toISOString()
  }));

  // ── Saved programs ──
  const saveProgram = (prog) => {
    track(Events.PROGRAM_SAVED, { uniId: prog.uniId, program: prog.program });
    setProfile(p => {
      const key = `${prog.uniId}-${prog.program}`;
      if (p.savedPrograms.some(sp => `${sp.uniId}-${sp.program}` === key)) return p;
      return { ...p, savedPrograms: [...p.savedPrograms, { ...prog, savedAt: new Date().toISOString().split('T')[0] }], updatedAt: new Date().toISOString() };
    });
  };

  const removeSavedProgram = (uniId, program) => setProfile(p => ({
    ...p,
    savedPrograms: p.savedPrograms.filter(sp => !(sp.uniId === uniId && sp.program === program)),
    updatedAt: new Date().toISOString()
  }));

  const isProgramSaved = (uniId, program) =>
    profile.savedPrograms?.some(sp => sp.uniId === uniId && sp.program === program) || false;

  const addApplication = (app) => {
    track(Events.APPLICATION_STARTED, { uniId: app.uniId, program: app.program });
    setProfile(p => ({
      ...p,
      applications: [...p.applications, { ...app, id: Date.now(), addedAt: new Date().toISOString().split('T')[0], status: app.status || 'idea' }],
      updatedAt: new Date().toISOString()
    }));
  };

  const updateApplication = (id, patch) => {
    if (patch.status) track(Events.APPLICATION_STATUS_CHANGED, { applicationId: id, status: patch.status });
    setProfile(p => ({
      ...p,
      applications: p.applications.map(a => a.id === id ? { ...a, ...patch } : a),
      updatedAt: new Date().toISOString()
    }));
  };

  const removeApplication = (id) => setProfile(p => ({
    ...p,
    applications: p.applications.filter(a => a.id !== id),
    updatedAt: new Date().toISOString()
  }));

  const toggleDoc = (docId) => setProfile(p => ({
    ...p,
    docs: { ...p.docs, [docId]: !p.docs[docId] },
    updatedAt: new Date().toISOString()
  }));

  const saveRiasec = (scores, code, archetype) => setProfile(p => ({
    ...p,
    riasecDone: true,
    riasecScores: scores,
    riasecCode: code,
    archetype,
    updatedAt: new Date().toISOString()
  }));

  const resetProfile = () => {
    localStorage.removeItem(KEY);
    authUserIdRef.current = null;
    setProfile({ ...defaults });
  };

  // Sprint 2: hydrate from remote profile (after sign-in / migration)
  const hydrateFromRemote = useCallback((remoteProfile) => {
    setProfile(p => ({ ...defaults, ...remoteProfile }));
  }, []);

  // Sprint 2: set auth user ID for cloud sync
  const setAuthUserId = useCallback((userId) => {
    authUserIdRef.current = userId;
  }, []);

  // Sprint 2: update reminder settings
  const updateReminderSettings = useCallback((settings) => {
    setProfile(p => ({ ...p, reminderSettings: { ...p.reminderSettings, ...settings }, updatedAt: new Date().toISOString() }));
  }, []);

  return (
    <UserCtx.Provider value={{
      profile, update, toggleFav, toggleCompare,
      saveProgram, removeSavedProgram, isProgramSaved,
      addApplication, updateApplication, removeApplication,
      toggleDoc, saveRiasec, resetProfile,
      completedStages, currentStage, journeyProgress,
      JOURNEY_STAGES,
      // Sprint 2
      hydrateFromRemote, setAuthUserId, updateReminderSettings,
    }}>
      {children}
    </UserCtx.Provider>
  );
}

export const useUser = () => useContext(UserCtx);
