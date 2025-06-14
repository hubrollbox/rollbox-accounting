
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { authService, AuthError } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

interface SecureQueryOptions<T> extends Omit<UseQueryOptions<T, Error, T, QueryKey>, 'queryFn'> {
  queryKey: QueryKey;
  table: TableName;
  selectFields?: string;
  filters?: Record<string, any>;
  pagination?: PaginationOptions;
  requireCompanyAccess?: boolean;
}

export const useSecureQuery = <T = any>({
  queryKey,
  table,
  selectFields = '*',
  filters = {},
  pagination,
  requireCompanyAccess = true,
  ...options
}: SecureQueryOptions<T>) => {
  return useQuery<T, Error>({
    queryKey: queryKey,
    queryFn: async (): Promise<T> => {
      // Verificar autenticação e autorização
      const session = await authService.getSecureSession();
      if (!session) {
        throw new AuthError('UNAUTHORIZED', 'Usuário não autenticado');
      }

      // Construir query base
      let query = supabase.from(table).select(selectFields);

      // Filtro automático por company_id
      if (requireCompanyAccess && session.company_id) {
        query = query.eq('company_id', session.company_id);
      }

      // Filtros adicionais
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Paginação
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
    // Cache e refetch
    staleTime: 5 * 60 * 1000, // 5 minutos
    // cacheTime removido pois não existe mais nessa versão
    retry: (failureCount, error) => {
      if (error instanceof AuthError && error.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};

// Placeholder para mutation segura se necessário
export const useSecureMutation = () => {
  return null;
};
