
-- Criação da tabela 'transactions' para multi-tenant-ready
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid REFERENCES public.profiles(id),
  document_number text,
  transaction_date date NOT NULL DEFAULT now(),
  amount numeric(15,2) NOT NULL DEFAULT 0,
  description text,
  status text DEFAULT 'draft',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índice para consultas multi-tenant otimizadas por data
CREATE INDEX IF NOT EXISTS transactions_tenant_date_idx 
  ON public.transactions (tenant_id, transaction_date DESC);

-- Habilita RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
