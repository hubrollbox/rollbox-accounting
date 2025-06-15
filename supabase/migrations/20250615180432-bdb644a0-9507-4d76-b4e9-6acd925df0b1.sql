
-- Adicionar campos para assinatura digital, hash anterior e key pública se necessário (na tabela invoices)
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS digital_signature TEXT,
  ADD COLUMN IF NOT EXISTS previous_hash TEXT;

-- Assegurar unicidade e sequência do número de fatura por série (assumindo que 'invoice_number' é string mas contém série)
-- Se série estiver em outro campo, ajustar.
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoice_number_user_id 
  ON public.invoices (user_id, invoice_number);

-- Impedir alteração dos seguintes campos fiscalmente relevantes sem logging (utilizar trigger de audit_log já existente, garantir gravação do valor antigo e novo dos campos: total_amount, client_id, issue_date, status, invoice_number, digital_signature, previous_hash).

-- Corrigir trigger audit_log caso precise incluir também os campos acima (apenas comentário, trigger de logging já existe).

-- [Opcional] Se utilizar também talões/receipts, duplicar add column para essa tabela.
