
import { useQuery } from '@tanstack/react-query';
import { authService, AuthError } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface SecureQueryOptions<T> {
  queryKey: any;
  table: TableName;
  selectFields?: string;
  filters?: Record<string, any>;
  pagination?: PaginationOptions;
  requireCompanyAccess?: boolean;
  staleTime?: number;
  retry?: (failureCount: number, error: any) => boolean;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (err: Error) => void;
}

export function useSecureQuery<T = any>({
  queryKey,
  table,
  selectFields = '*',
  filters = {},
  pagination,
  requireCompanyAccess = true,
  staleTime = 5 * 60 * 1000,
  retry,
  enabled = true,
  onSuccess,
  onError,
}: SecureQueryOptions<T>) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async (): Promise<T> => {
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
    retry: retry
      ? retry
      : (failureCount, error) => {
          if (error instanceof AuthError && error.code === 'UNAUTHORIZED') {
            return false;
          }
          return failureCount < 3;
        },
    enabled,
    onSuccess,
    onError,
  });
}

// Placeholder para mutation segura se necessário
export const useSecureMutation = () => {
  return null;
};
