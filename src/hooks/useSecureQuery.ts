
import { useQuery, QueryKey } from '@tanstack/react-query';
import { authService, AuthError } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface SecureQueryOptions<T> {
  queryKey: QueryKey;
  table: TableName;
  selectFields?: string;
  filters?: Record<string, any>;
  pagination?: PaginationOptions;
  requireCompanyAccess?: boolean;
  enabled?: boolean;
  staleTime?: number;
}

export function useSecureQuery<T = any>({
  queryKey,
  table,
  selectFields = '*',
  filters = {},
  pagination,
  requireCompanyAccess = true,
  enabled = true,
  staleTime = 5 * 60 * 1000,
}: SecureQueryOptions<T>) {
  return useQuery<T, Error, T, QueryKey>({
    queryKey,
    queryFn: async () => {
      const session = await authService.getSecureSession();
      if (!session) {
        throw new AuthError('UNAUTHORIZED', 'Usuário não autenticado');
      }

      let query = supabase.from(table).select(selectFields);

      if (requireCompanyAccess && session.company_id) {
        query = query.eq('company_id', session.company_id);
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      if (pagination) {
        const { page = 1, pageSize = 50 } = pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Erro na consulta da tabela ${table}:`, error);
        throw new Error(`Erro ao buscar dados: ${error.message}`);
      }

      return data as T;
    },
    staleTime,
    retry: (failureCount, error) => {
      if (error instanceof AuthError && error.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
    enabled,
  });
}

// Placeholder para mutation segura se necessário
export const useSecureMutation = () => {
  return null;
};
