
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ApprovalRule {
  id: string;
  company_id: string;
  name: string;
  condition: 'AMOUNT' | 'ACCOUNT_TYPE' | 'MANUAL';
  min_amount?: number;
  account_types?: string[];
  approver_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApprovalRequest {
  id: string;
  transaction_id: string;
  rule_id: string;
  requester_id: string;
  approver_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export const useApprovalSystem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch approval rules
  const { data: approvalRules, isLoading: rulesLoading } = useQuery({
    queryKey: ['approval-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approval_rules')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApprovalRule[];
    },
  });

  // Fetch approval requests
  const { data: approvalRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['approval-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approval_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApprovalRequest[];
    },
  });

  // Create approval rule
  const createRuleMutation = useMutation({
    mutationFn: async (rule: Omit<ApprovalRule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('approval_rules')
        .insert(rule)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-rules'] });
      toast({
        title: "Regra criada",
        description: "Regra de aprovação criada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar regra de aprovação.",
        variant: "destructive",
      });
    },
  });

  // Request approval
  const requestApprovalMutation = useMutation({
    mutationFn: async ({ transactionId, amount }: { transactionId: string; amount: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Find applicable rules
      const applicableRules = approvalRules?.filter(rule => {
        if (rule.condition === 'AMOUNT' && rule.min_amount) {
          return amount >= rule.min_amount;
        }
        return rule.condition === 'MANUAL';
      }) || [];

      // Create approval requests
      const requests = applicableRules.map(rule => ({
        transaction_id: transactionId,
        rule_id: rule.id,
        requester_id: user.id,
        approver_id: rule.approver_id,
        status: 'PENDING' as const,
      }));

      if (requests.length > 0) {
        const { data, error } = await supabase
          .from('approval_requests')
          .insert(requests)
          .select();

        if (error) throw error;
        return data;
      }

      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-requests'] });
      toast({
        title: "Aprovação solicitada",
        description: "Solicitação de aprovação enviada com sucesso.",
      });
    },
  });

  // Approve/Reject request
  const processApprovalMutation = useMutation({
    mutationFn: async ({ 
      requestId, 
      status, 
      comments 
    }: { 
      requestId: string; 
      status: 'APPROVED' | 'REJECTED'; 
      comments?: string 
    }) => {
      const { data, error } = await supabase
        .from('approval_requests')
        .update({
          status,
          comments,
          approved_at: status === 'APPROVED' ? new Date().toISOString() : null,
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-requests'] });
      toast({
        title: "Aprovação processada",
        description: "Solicitação processada com sucesso.",
      });
    },
  });

  return {
    approvalRules,
    approvalRequests,
    rulesLoading,
    requestsLoading,
    createRule: createRuleMutation.mutate,
    requestApproval: requestApprovalMutation.mutate,
    processApproval: processApprovalMutation.mutate,
    isCreatingRule: createRuleMutation.isPending,
    isRequestingApproval: requestApprovalMutation.isPending,
    isProcessingApproval: processApprovalMutation.isPending,
  };
};
