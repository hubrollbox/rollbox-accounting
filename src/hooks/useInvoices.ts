import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { signInvoice } from "@/hooks/useSignInvoice";

// Ajuste o tipo document_type para corresponder ao enum do Supabase
type DocumentType = "invoice" | "receipt" | "credit_note" | "debit_note";
// Corrigido o InvoiceStatus para os valores válidos do Supabase
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

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
    mutationFn: async (invoice: Omit<Invoice, "id" | "user_id">) => {
      const allowedStatus: InvoiceStatus[] = [
        "draft", "sent", "paid", "overdue", "cancelled"
      ];
      const status =
        invoice.status && allowedStatus.includes(invoice.status)
          ? invoice.status
          : undefined;

      // Obter previous_hash da última fatura (caso não seja draft)
      let previous_hash: string | undefined = undefined;
      if (user && invoice.status !== "draft") {
        const { data: lastInvoices, error } = await supabase
          .from("invoices")
          .select("digital_signature, previous_hash")
          .eq("user_id", user.id)
          .neq("status", "draft")
          .order("issue_date", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!error && lastInvoices) {
          previous_hash = lastInvoices.digital_signature;
        }
      }

      // ASSINATURA DIGITAL (!!) Só se não for draft
      let digitalSignature: string | undefined;
      let invoiceHash: string | undefined;
      if (user && invoice.status !== "draft") {
        try {
          const { hash, signature } = await signInvoice({
            user_id: user.id,
            invoice_number: invoice.invoice_number,
            total_amount: invoice.total_amount ?? 0,
            issue_date: invoice.issue_date,
            client_id: invoice.client_id,
            previous_hash: previous_hash,
          });
          digitalSignature = signature;
          invoiceHash = hash;
        } catch (err: any) {
          toast({
            title: "Erro ao assinar fatura digitalmente",
            description: err.message,
            variant: "destructive",
          });
        }
      }

      // Montar payload
      const payload: any = {
        ...invoice,
        status,
        user_id: user?.id,
        digital_signature: digitalSignature,
        previous_hash: previous_hash,
      };

      const { data, error } = await supabase
        .from("invoices")
        .insert(payload)
        .select("*")
        .single();
      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: () => {
      toast({ title: "Fatura criada/assinada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar fatura",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { ...query, createInvoice };
}
