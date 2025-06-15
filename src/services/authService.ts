
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface SecureUserSession {
  user: User;
  session: Session;
  company_id?: string;
  permissions: string[];
}

export const authService = {
  /**
   * Obtém a sessão atual com verificações de segurança adicionais
   */
  async getSecureSession(): Promise<SecureUserSession | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao obter sessão:', error);
        throw new AuthError('SESSION_ERROR', 'Falha na autenticação');
      }

      if (!data.session || !data.session.user) {
        return null;
      }

      // Verificar se a sessão ainda é válida
      const { data: user, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user.user) {
        throw new AuthError('INVALID_SESSION', 'Sessão inválida');
      }

      // Verificar se a sessão não expirou
      const now = Math.floor(Date.now() / 1000);
      if (data.session.expires_at && data.session.expires_at < now) {
        throw new AuthError('SESSION_EXPIRED', 'Sessão expirada');
      }

      // Buscar informações adicionais do usuário de forma segura
      const { data: profile, error: profileError } = await supabase
        .from('company_settings')
        .select('id, company_name')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('Erro ao buscar perfil do usuário:', profileError);
      }

      return {
        user: user.user,
        session: data.session,
        company_id: profile?.id,
        permissions: ['read', 'write'] // TODO: Implementar sistema de permissões granular
      };
    } catch (error) {
      console.error('Erro na verificação de sessão:', error);
      throw error;
    }
  },

  /**
   * Valida se o usuário tem acesso a um recurso específico
   */
  async validateResourceAccess(resourceType: string, resourceId: string): Promise<boolean> {
    try {
      const session = await this.getSecureSession();
      
      if (!session) {
        return false;
      }

      // Para recursos da empresa, verificar se o usuário pertence à empresa
      if (resourceType === 'company_resource') {
        return session.company_id === resourceId;
      }

      // TODO: Implementar verificações mais granulares baseadas em roles
      return true;
    } catch (error) {
      console.error('Erro na validação de acesso:', error);
      return false;
    }
  },

  /**
   * Força refresh do token de autenticação
   */
  async refreshSession(): Promise<SecureUserSession | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw new AuthError('REFRESH_ERROR', 'Erro ao renovar sessão');
      }

      if (!data.session) {
        return null;
      }

      return this.getSecureSession();
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
      throw error;
    }
  },

  /**
   * Logout seguro com limpeza completa
   */
  async secureSignOut(): Promise<void> {
    try {
      // Log de segurança
      console.log('Iniciando logout seguro...');
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Erro no logout:', error);
      }

      // Limpar qualquer cache ou dados sensíveis
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Limpar cache do navegador relacionado à autenticação
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('auth') || name.includes('session')) {
              caches.delete(name);
            }
          });
        });
      }
      
    } catch (error) {
      console.error('Erro durante logout seguro:', error);
      // Mesmo com erro, limpar dados locais
      localStorage.clear();
      sessionStorage.clear();
      throw error;
    }
  },

  /**
   * Detecta atividade suspeita na sessão
   */
  async detectSuspiciousActivity(): Promise<boolean> {
    try {
      const session = await this.getSecureSession();
      if (!session) return false;

      // Verificar múltiplas sessões simultâneas (implementação básica)
      const lastActivity = localStorage.getItem('last_activity');
      const currentTime = Date.now();
      
      if (lastActivity) {
        const timeDiff = currentTime - parseInt(lastActivity);
        // Se a última atividade foi há mais de 8 horas, pode ser suspeito
        if (timeDiff > 8 * 60 * 60 * 1000) {
          return true;
        }
      }
      
      localStorage.setItem('last_activity', currentTime.toString());
      return false;
    } catch (error) {
      console.error('Erro ao detectar atividade suspeita:', error);
      return true; // Em caso de erro, assume atividade suspeita
    }
  }
};
