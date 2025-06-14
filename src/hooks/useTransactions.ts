
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  tenant_id: string;
  user_id: string | null;
  document_number?: string | null;
  transaction_date: string;
  amount: number;
  description?: string | null;
  status?: string | null;
  created_at: string;
  updated_at: string;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get the current tenant_id for the logged-in user
  const fetchTenantId = async (): Promise<string | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("company_settings")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (error || !data) return null;
    return data.id;
  };

  // Query: fetch transactions only for the user's tenant
  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const tenantId = await fetchTenantId();
      if (!tenantId) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("transaction_date", { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  // Mutation: create a new transaction with tenant isolation
  const createTransaction = useMutation({
    mutationFn: async (newTx: Omit<Transaction, "id" | "created_at" | "updated_at" | "user_id" | "tenant_id">) => {
      const tenantId = await fetchTenantId();
      if (!tenantId) throw new Error("Tenant não encontrado para este usuário.");
      const { data, error } = await supabase.from("transactions").insert({
        ...newTx,
        tenant_id: tenantId,
        user_id: user?.id,
      }).select("*").single();
      if (error) throw error;
      return data as Transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Transação criada!",
        description: "A transação foi adicionada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar transação",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    ...transactionsQuery,
    createTransaction,
  };
};
