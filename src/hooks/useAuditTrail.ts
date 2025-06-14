
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuditLog {
  id: string;
  user_id: string | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'TRANSACTION' | 'ACCOUNT' | 'USER' | 'CLIENT' | 'PRODUCT' | 'INVOICE';
  entity_id: string;
  old_value: any;
  new_value: any;
  timestamp: string;
  ip_address: string | null;
  device_info: string | null;
  created_at: string;
}

export const useAuditTrail = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Remover busca externa de IP
  const logAction = async (action: Omit<AuditLog, 'id' | 'timestamp' | 'created_at' | 'user_id' | 'ip_address' | 'device_info'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Usar apenas device_info localmente. IP será tratado por trigger no banco.
      const { error } = await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: action.action,
        entity: action.entity,
        entity_id: action.entity_id,
        old_value: action.old_value,
        new_value: action.new_value,
        ip_address: null,
        device_info: navigator.userAgent,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging audit action:', error);
    }
  };

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as AuditLog[];
    },
  });

  return {
    auditLogs,
    isLoading,
    logAction,
  };
};
