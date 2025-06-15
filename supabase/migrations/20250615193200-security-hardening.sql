
-- Security Hardening: Strict RLS for all key tables

-- CLIENTS TABLE
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cada utilizador só vê os seus clientes" ON public.clients;
DROP POLICY IF EXISTS "Cada utilizador só pode inserir clientes seus" ON public.clients;
DROP POLICY IF EXISTS "Cada utilizador só pode editar os seus clientes" ON public.clients;
DROP POLICY IF EXISTS "Cada utilizador só pode remover os seus clientes" ON public.clients;

CREATE POLICY "User can select own clients"
    ON public.clients FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "User can insert own clients"
    ON public.clients FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can update own clients"
    ON public.clients FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "User can delete own clients"
    ON public.clients FOR DELETE
    USING (user_id = auth.uid());

-- PRODUCTS TABLE
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cada utilizador só vê os seus produtos" ON public.products;
DROP POLICY IF EXISTS "Cada utilizador só pode inserir produtos seus" ON public.products;
DROP POLICY IF EXISTS "Cada utilizador só pode editar os seus produtos" ON public.products;
DROP POLICY IF EXISTS "Cada utilizador só pode remover os seus produtos" ON public.products;

CREATE POLICY "User can select own products"
    ON public.products FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "User can insert own products"
    ON public.products FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can update own products"
    ON public.products FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "User can delete own products"
    ON public.products FOR DELETE
    USING (user_id = auth.uid());

-- SUPPLIERS TABLE
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cada utilizador só vê os seus fornecedores" ON public.suppliers;
DROP POLICY IF EXISTS "Cada utilizador só pode inserir fornecedores seus" ON public.suppliers;
DROP POLICY IF EXISTS "Cada utilizador só pode editar os seus fornecedores" ON public.suppliers;
DROP POLICY IF EXISTS "Cada utilizador só pode remover os seus fornecedores" ON public.suppliers;

CREATE POLICY "User can select own suppliers"
    ON public.suppliers FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "User can insert own suppliers"
    ON public.suppliers FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can update own suppliers"
    ON public.suppliers FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "User can delete own suppliers"
    ON public.suppliers FOR DELETE
    USING (user_id = auth.uid());

-- STOCK TABLE
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cada utilizador só vê o seu stock" ON public.stock;
DROP POLICY IF EXISTS "Cada utilizador só pode alterar o seu stock" ON public.stock;
DROP POLICY IF EXISTS "Cada utilizador só pode inserir stock seu" ON public.stock;
DROP POLICY IF EXISTS "Cada utilizador só pode remover o seu stock" ON public.stock;

CREATE POLICY "User can select own stock"
    ON public.stock FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "User can update own stock"
    ON public.stock FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "User can insert own stock"
    ON public.stock FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can delete own stock"
    ON public.stock FOR DELETE
    USING (user_id = auth.uid());

-- INVOICES TABLE
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cada utilizador só vê as suas faturas" ON public.invoices;
DROP POLICY IF EXISTS "Cada utilizador só pode inserir faturas suas" ON public.invoices;
DROP POLICY IF EXISTS "Cada utilizador só pode editar as suas faturas" ON public.invoices;
DROP POLICY IF EXISTS "Cada utilizador só pode remover as suas faturas" ON public.invoices;

CREATE POLICY "User can select own invoices"
    ON public.invoices FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "User can insert own invoices"
    ON public.invoices FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can update own invoices"
    ON public.invoices FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "User can delete own invoices"
    ON public.invoices FOR DELETE
    USING (user_id = auth.uid());
