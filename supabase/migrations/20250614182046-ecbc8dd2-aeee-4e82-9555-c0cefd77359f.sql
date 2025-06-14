
-- Corrige o erro: substitui 'polname' por 'policyname' (coluna correta em pg_policies)

-- 1. TRANSACTIONS: garantir que todas as policies corretas existem

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Company users can view their transactions' AND tablename = 'transactions'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Company users can view their transactions"
      ON public.transactions
      FOR SELECT
      USING (
        tenant_id IN (
          SELECT id FROM public.company_settings WHERE user_id = auth.uid()
        )
      ) $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Company users can insert their transactions' AND tablename = 'transactions'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Company users can insert their transactions"
      ON public.transactions
      FOR INSERT
      WITH CHECK (
        tenant_id IN (
          SELECT id FROM public.company_settings WHERE user_id = auth.uid()
        )
      ) $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Company users can update their transactions' AND tablename = 'transactions'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Company users can update their transactions"
      ON public.transactions
      FOR UPDATE
      USING (
        tenant_id IN (
          SELECT id FROM public.company_settings WHERE user_id = auth.uid()
        )
      ) $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Company users can delete their transactions' AND tablename = 'transactions'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Company users can delete their transactions"
      ON public.transactions
      FOR DELETE
      USING (
        tenant_id IN (
          SELECT id FROM public.company_settings WHERE user_id = auth.uid()
        )
      ) $sql$;
  END IF;
END $$;

-- 2. PROFILES: garantir policies view/update do próprio perfil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Users can view their own profile"
      ON public.profiles FOR SELECT
      USING (id = auth.uid()); $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'profiles'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (id = auth.uid()); $sql$;
  END IF;
END $$;

-- 3. STOCK_MOVEMENTS: garantir policies de owner
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own stock movements' AND tablename = 'stock_movements'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Users can view their own stock movements"
      ON public.stock_movements FOR SELECT
      USING (user_id = auth.uid()); $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own stock movements' AND tablename = 'stock_movements'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Users can insert their own stock movements"
      ON public.stock_movements FOR INSERT
      WITH CHECK (user_id = auth.uid()); $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own stock movements' AND tablename = 'stock_movements'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Users can update their own stock movements"
      ON public.stock_movements FOR UPDATE
      USING (user_id = auth.uid()); $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own stock movements' AND tablename = 'stock_movements'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Users can delete their own stock movements"
      ON public.stock_movements FOR DELETE
      USING (user_id = auth.uid()); $sql$;
  END IF;
END $$;

-- 4. APPROVAL_REQUESTS: garantir policies requester/approver
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Requesters and approvers can view approval requests' AND tablename = 'approval_requests'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Requesters and approvers can view approval requests"
      ON public.approval_requests FOR SELECT
      USING (requester_id = auth.uid() OR approver_id = auth.uid()); $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Requesters can insert approval requests' AND tablename = 'approval_requests'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Requesters can insert approval requests"
      ON public.approval_requests FOR INSERT
      WITH CHECK (requester_id = auth.uid()); $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Approvers can update requests' AND tablename = 'approval_requests'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Approvers can update requests"
      ON public.approval_requests FOR UPDATE
      USING (approver_id = auth.uid()); $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Requesters can delete their approval requests' AND tablename = 'approval_requests'
  ) THEN
    EXECUTE $sql$ CREATE POLICY "Requesters can delete their approval requests"
      ON public.approval_requests FOR DELETE
      USING (requester_id = auth.uid()); $sql$;
  END IF;
END $$;

-- 5. ÍNDICE para performance se não existir ainda
CREATE INDEX IF NOT EXISTS transactions_tenant_id_idx ON public.transactions(tenant_id);
