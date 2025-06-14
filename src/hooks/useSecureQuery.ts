
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { authService, AuthError } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

interface SecureQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryFn'> {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  pagination?: PaginationOptions;
  requireCompanyAccess?: boolean;
}

export const useSecureQuery = <T = any>({
  queryKey,
  table,
  select = '*',
  filters = {},
  pagination,
  requireCompanyAccess = true,
  ...options
}: SecureQueryOptions<T>) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async (): Promise<T> => {
      // Verificar autenticação e autorização
      const session = await authService.getSecureSession();
      
      if (!session) {
        throw new AuthError('UNAUTHORIZED', 'Usuário não autenticado');
      }

      // Construir query base
      let query = supabase.from(table).select(select);

      // Aplicar filtros de segurança automáticos
      if (requireCompanyAccess && session.company_id) {
        // Adicionar filtro de company_id automaticamente se a tabela tiver essa coluna
        query = query.eq('company_id', session.company_id);
      }

      // Aplicar filtros adicionais
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Aplicar paginação se especificada
      if (pagination) {
        const { page = 1, pageSize = 50 } = pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      // Executar query
      const { data, error } = await query;

      if (error) {
        console.error(`Erro na consulta da tabela ${table}:`, error);
        throw new Error(`Erro ao buscar dados: ${error.message}`);
      }

      return data as T;
    },
    // Configurações padrão para cache e refetch
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
    retry: (failureCount, error) => {
      // Não tentar novamente para erros de autorização
      if (error instanceof AuthError && error.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};

export const useSecureMutation = () => {
  // TODO: Implementar mutations seguras com validações
  return null;
};
