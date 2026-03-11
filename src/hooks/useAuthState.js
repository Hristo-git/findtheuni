import { useState, useEffect, useCallback } from 'react';
import { getSession, onAuthStateChange, signOut as authSignOut } from '../lib/authClient.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { setAnalyticsUser, track, Events, flushQueue } from '../lib/analytics.js';

export function useAuthState() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewSignIn, setIsNewSignIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    getSession().then(s => {
      setSession(s);
      if (s?.user) setAnalyticsUser(s.user.id);
      setLoading(false);
    });

    const sub = onAuthStateChange(s => {
      const wasSignedOut = !session;
      setSession(s);
      if (s?.user) {
        setAnalyticsUser(s.user.id);
        flushQueue();
        if (wasSignedOut) {
          setIsNewSignIn(true);
          track(Events.ACCOUNT_SIGNED_IN);
        }
      }
    });

    return () => sub.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
    setSession(null);
    setAnalyticsUser(null);
  }, []);

  const clearNewSignIn = useCallback(() => setIsNewSignIn(false), []);

  return {
    session,
    user: session?.user || null,
    userId: session?.user?.id || null,
    email: session?.user?.email || null,
    isAuthenticated: !!session?.user,
    isGuest: !session?.user,
    loading,
    signOut,
    isNewSignIn,
    clearNewSignIn,
    authAvailable: isSupabaseConfigured()
  };
}
