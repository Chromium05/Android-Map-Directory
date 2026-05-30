import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

type AuthState = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      console.log('[auth] event:', event, '| user:', s?.user?.email ?? null);
      setSession(s);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error };
  };

  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    try {
      // In Expo Go → exp://192.168.x.x:8081/--/auth/callback
      // In standalone → mapdirectory://auth/callback
      const redirectTo = Linking.createURL('auth/callback');
      console.log('[auth] redirectTo:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data?.url) {
        console.log('[auth] signInWithOAuth error:', error);
        return { error: error ?? new Error('Gagal mendapatkan URL login.') };
      }

      // Warm up the Android Chrome Custom Tab before opening it.
      // This reduces startup latency and improves redirect reliability.
      await WebBrowser.warmUpAsync().catch(() => {});

      console.log('[auth] opening browser...');
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      console.log('[auth] browser result:', result.type);

      if (result.type === 'success') {
        console.log('[auth] exchanging code from:', result.url);
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(result.url);
        if (sessionError) console.log('[auth] exchangeCodeForSession error:', sessionError);
        return { error: sessionError };
      }

      // 'cancel' / 'dismiss' — user closed browser, not an error
      return { error: null };
    } catch (e) {
      console.log('[auth] signInWithGoogle exception:', e);
      return { error: e instanceof Error ? e : new Error('Terjadi kesalahan.') };
    } finally {
      WebBrowser.coolDownAsync().catch(() => {});
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
