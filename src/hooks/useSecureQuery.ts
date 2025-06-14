
import { useQuery, QueryKey } from '@tanstack/react-query';
import { authService, AuthError } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

type TableName = string;

interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface SecureQueryOptions {
  queryKey: QueryKey;
  table: TableName;
  selectFields?: string;
  filters?: Record<string, any>;
  pagination?: PaginationOptions;
  requireCompanyAccess?: boolean;
  enabled?: boolean;
  staleTime?: number;
}

export function useSecureQuery(options: SecureQueryOptions): any {
  const {
    queryKey,
    table,
    selectFields = '*',
    filters = {},
    pagination,
    requireCompanyAccess = true,
    enabled = true,
    staleTime = 5 * 60 * 1000,
  } = options;

  return useQuery<any, any>({
    queryKey,
    queryFn: async () => {
      const session = await authService.getSecureSession();
      if (!session) {
        throw new AuthError('UNAUTHORIZED', 'Usuário não autenticado');
      }

      let finalFilters = { ...filters };
      if (requireCompanyAccess) {
        // Enforce company_id presence and match
        if (!session.company_id) {
          // Prevent data leak: Do NOT query if company_id is missing
          throw new AuthError(
            'NO_COMPANY_ACCESS',
            'Acesso à empresa não permitido: nenhum company_id associado ao utilizador autenticado.'
          );
        }
        finalFilters.company_id = session.company_id;
      }

      let query = (supabase.from(table as any) as any).select(selectFields);

      Object.entries(finalFilters).forEach(([key, value]) => {
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

      return (data as any[]) || [];
    },
    staleTime,
    retry: (failureCount: number, error: any) => {
      if (error instanceof AuthError && error.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
    enabled,
  });
}

export const useSecureMutation = () => {
  return null;
};
