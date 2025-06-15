
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService, SecureUserSession } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  companyId: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, nif: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Session timeout: 15 minutes for financial data security
const SESSION_TIMEOUT = 15 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeoutId, setSessionTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const clearSessionTimeout = () => {
    if (sessionTimeoutId) {
      clearTimeout(sessionTimeoutId);
      setSessionTimeoutId(null);
    }
  };

  const setupSessionTimeout = () => {
    clearSessionTimeout();
    const timeoutId = setTimeout(() => {
      console.log('Session timeout - signing out user');
      signOut();
    }, SESSION_TIMEOUT);
    setSessionTimeoutId(timeoutId);
  };

  const updateAuthState = (session: Session | null) => {
    try {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        setupSessionTimeout();
        
        // Defer company ID fetch to avoid blocking auth state update
        setTimeout(() => {
          fetchCompanyId(session.user.id);
        }, 0);
      } else {
        setUser(null);
        setSession(null);
        setCompanyId(null);
        clearSessionTimeout();
      }
    } catch (error) {
      console.error('Erro ao atualizar estado de autenticação:', error);
      setUser(null);
      setSession(null);
      setCompanyId(null);
      clearSessionTimeout();
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyId = async (userId: string) => {
    try {
      const secureSession = await authService.getSecureSession();
      if (secureSession?.company_id) {
        setCompanyId(secureSession.company_id);
      }
    } catch (error) {
      console.error('Erro ao buscar company_id:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener - avoid async calls in callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        updateAuthState(session);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        updateAuthState(session);
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      clearSessionTimeout();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, nif: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
            nif: nif,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      clearSessionTimeout();
      await authService.secureSignOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      await authService.refreshSession();
      setupSessionTimeout(); // Reset timeout on refresh
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    companyId,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
