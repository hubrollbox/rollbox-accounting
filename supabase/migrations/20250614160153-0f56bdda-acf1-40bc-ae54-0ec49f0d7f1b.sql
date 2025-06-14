
-- Criação da policy de isolamento multi-tenant na tabela transactions
CREATE POLICY "Tenant isolation (ALL)" ON public.transactions
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
