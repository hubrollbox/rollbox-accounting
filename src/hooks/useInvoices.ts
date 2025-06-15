
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Ajuste o tipo document_type para corresponder ao enum do Supabase
type DocumentType = "invoice" | "receipt" | "credit_note" | "debit_note";
type InvoiceStatus = "draft" | "pending" | "paid" | "cancelled";

// Ajuste ao interface de Invoice para usar os tipos corretos
interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  document_type?: DocumentType;
  status?: InvoiceStatus;
  issue_date: string;
  due_date?: string;
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
  notes?: string;
}

export function useInvoices() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!user
  });

  const createInvoice = useMutation({
    // Remove "id" e "user_id" do payload para compatibilidade com Supabase typing
    mutationFn: async (invoice: Omit<Invoice, "id" | "user_id">) => {
      const { data, error } = await supabase
        .from("invoices")
        .insert({ ...invoice, user_id: user?.id })
        .select("*")
        .single();
      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: () => {
      toast({ title: "Fatura criada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao criar fatura", description: error.message, variant: "destructive" });
    }
  });

  return { ...query, createInvoice };
}
