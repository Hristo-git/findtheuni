import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const KEY = 'ftu_profile';

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
  savedPrograms: [],  // first-class saved programs
  applications: [],
  docs: {},
  quizResults: null,  // destination quiz
  targetCountries: [], // from destination quiz ranked
  createdAt: null,
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

  // Persist on every change
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch {}
  }, [profile]);

  // Auto-compute journey stages (sequential — a stage only shows done if prior stages are also done)
  const completedStages = useMemo(() => {
    const checks = {
      profile: profile.onboarded,
      career: profile.riasecDone,
      countries: !!profile.quizResults || (profile.targetCountries?.length > 0),
      universities: profile.favorites.length >= 1,
      programs: (profile.savedPrograms?.length || 0) > 0,
      planning: profile.applications.length > 0,
      applying: profile.applications.some(a => a.status === 'applied' || a.status === 'accepted'),
    };
    const done = [];
    for (const stage of JOURNEY_STAGES) {
      if (checks[stage.id]) done.push(stage.id);
      else break; // Stop at first incomplete — keeps it sequential
    }
    return done;
  }, [profile]);

  const currentStage = useMemo(() => {
    for (const stage of JOURNEY_STAGES) {
      if (!completedStages.includes(stage.id)) return stage.id;
    }
    return 'applying';
  }, [completedStages]);

  const journeyProgress = Math.round((completedStages.length / JOURNEY_STAGES.length) * 100);

  const update = (patch) => setProfile(p => ({ ...p, ...patch }));

  const toggleFav = (id) => setProfile(p => ({
    ...p,
    favorites: p.favorites.includes(id)
      ? p.favorites.filter(x => x !== id)
      : [...p.favorites, id]
  }));

  const toggleCompare = (id) => setProfile(p => ({
    ...p,
    compared: p.compared.includes(id)
      ? p.compared.filter(x => x !== id)
      : p.compared.length < 4 ? [...p.compared, id] : p.compared
  }));

  // ── Saved programs ──
  const saveProgram = (prog) => setProfile(p => {
    const key = `${prog.uniId}-${prog.program}`;
    if (p.savedPrograms.some(sp => `${sp.uniId}-${sp.program}` === key)) return p;
    return { ...p, savedPrograms: [...p.savedPrograms, { ...prog, savedAt: new Date().toISOString().split('T')[0] }] };
  });

  const removeSavedProgram = (uniId, program) => setProfile(p => ({
    ...p,
    savedPrograms: p.savedPrograms.filter(sp => !(sp.uniId === uniId && sp.program === program))
  }));

  const isProgramSaved = (uniId, program) =>
    profile.savedPrograms?.some(sp => sp.uniId === uniId && sp.program === program) || false;

  const addApplication = (app) => setProfile(p => ({
    ...p,
    applications: [...p.applications, { ...app, id: Date.now(), addedAt: new Date().toISOString().split('T')[0], status: app.status || 'idea' }]
  }));

  const updateApplication = (id, patch) => setProfile(p => ({
    ...p,
    applications: p.applications.map(a => a.id === id ? { ...a, ...patch } : a)
  }));

  const removeApplication = (id) => setProfile(p => ({
    ...p,
    applications: p.applications.filter(a => a.id !== id)
  }));

  const toggleDoc = (docId) => setProfile(p => ({
    ...p,
    docs: { ...p.docs, [docId]: !p.docs[docId] }
  }));

  const saveRiasec = (scores, code, archetype) => setProfile(p => ({
    ...p,
    riasecDone: true,
    riasecScores: scores,
    riasecCode: code,
    archetype,
  }));

  const resetProfile = () => {
    localStorage.removeItem(KEY);
    setProfile({ ...defaults });
  };

  return (
    <UserCtx.Provider value={{
      profile, update, toggleFav, toggleCompare,
      saveProgram, removeSavedProgram, isProgramSaved,
      addApplication, updateApplication, removeApplication,
      toggleDoc, saveRiasec, resetProfile,
      completedStages, currentStage, journeyProgress,
      JOURNEY_STAGES,
    }}>
      {children}
    </UserCtx.Provider>
  );
}

export const useUser = () => useContext(UserCtx);
