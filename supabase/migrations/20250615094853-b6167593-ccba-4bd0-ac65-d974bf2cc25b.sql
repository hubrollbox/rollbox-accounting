
-- RLS para tabela de clientes
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada utilizador só vê os seus clientes"
  ON public.clients
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode inserir clientes seus"
  ON public.clients
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode editar os seus clientes"
  ON public.clients
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode remover os seus clientes"
  ON public.clients
  FOR DELETE
  USING (user_id = auth.uid());

-- RLS para tabela de produtos
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada utilizador só vê os seus produtos"
  ON public.products
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode inserir produtos seus"
  ON public.products
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode editar os seus produtos"
  ON public.products
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode remover os seus produtos"
  ON public.products
  FOR DELETE
  USING (user_id = auth.uid());

-- RLS para tabela de fornecedores
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada utilizador só vê os seus fornecedores"
  ON public.suppliers
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode inserir fornecedores seus"
  ON public.suppliers
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode editar os seus fornecedores"
  ON public.suppliers
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode remover os seus fornecedores"
  ON public.suppliers
  FOR DELETE
  USING (user_id = auth.uid());

-- RLS para stock
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada utilizador só vê o seu stock"
  ON public.stock
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode alterar o seu stock"
  ON public.stock
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode inserir stock seu"
  ON public.stock
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode remover o seu stock"
  ON public.stock
  FOR DELETE
  USING (user_id = auth.uid());

-- RLS para stock_movements
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada utilizador só vê os seus movimentos de stock"
  ON public.stock_movements
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode inserir movimentos de stock seus"
  ON public.stock_movements
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode editar movimentos de stock seus"
  ON public.stock_movements
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode remover movimentos de stock seus"
  ON public.stock_movements
  FOR DELETE
  USING (user_id = auth.uid());

-- RLS para invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada utilizador só vê as suas faturas"
  ON public.invoices
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode inserir faturas suas"
  ON public.invoices
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode editar as suas faturas"
  ON public.invoices
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Cada utilizador só pode remover as suas faturas"
  ON public.invoices
  FOR DELETE
  USING (user_id = auth.uid());

-- RLS para invoice_items
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Itens de fatura só podem ser consultados se o utilizador for dono da fatura"
  ON public.invoice_items
  FOR SELECT
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Itens de fatura só podem ser inseridos se o utilizador for dono da fatura"
  ON public.invoice_items
  FOR INSERT
  WITH CHECK (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Itens de fatura só podem ser editados se o utilizador for dono da fatura"
  ON public.invoice_items
  FOR UPDATE
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Itens de fatura só podem ser apagados se o utilizador for dono da fatura"
  ON public.invoice_items
  FOR DELETE
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE user_id = auth.uid()
    )
  );
