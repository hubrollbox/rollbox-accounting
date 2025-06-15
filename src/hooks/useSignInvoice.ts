
import { supabase } from "@/integrations/supabase/client";

/**
 * Envia os dados fiscalmente relevantes da fatura para o edge function
 * Gera e devolve o hash, assinatura digital e possívelmente a public key PEM.
 */
export async function signInvoice({
  user_id,
  invoice_number,
  total_amount,
  issue_date,
  client_id,
  previous_hash,
}: {
  user_id: string;
  invoice_number: string;
  total_amount: number;
  issue_date: string;
  client_id: string;
  previous_hash?: string;
}): Promise<{
  hash: string;
  signature: string;
  public_key_pem?: string;
  notice?: string;
  new_private_key_pem?: string;
}> {
  const { data, error } = await supabase.functions.invoke("sign-invoice", {
    body: {
      payload: {
        user_id,
        invoice_number,
        total_amount,
        issue_date,
        client_id,
        previous_hash: previous_hash ?? "",
      },
    },
  });
  if (error) throw error;
  return data as any;
}
