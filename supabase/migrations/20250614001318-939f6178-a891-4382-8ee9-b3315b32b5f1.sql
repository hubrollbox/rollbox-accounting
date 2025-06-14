
-- Sistema de Auditoria
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
  entity TEXT NOT NULL CHECK (entity IN ('TRANSACTION', 'ACCOUNT', 'USER', 'CLIENT', 'PRODUCT', 'INVOICE')),
  entity_id UUID NOT NULL,
  old_value JSONB,
  new_value JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  device_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);

-- Sistema de Aprovação
CREATE TYPE public.approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE public.approval_condition AS ENUM ('AMOUNT', 'ACCOUNT_TYPE', 'MANUAL');

CREATE TABLE public.approval_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.company_settings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  condition approval_condition NOT NULL,
  min_amount DECIMAL(15,2),
  account_types TEXT[],
  approver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.approval_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL, -- Pode referenciar faturas ou outros documentos
  rule_id UUID REFERENCES public.approval_rules(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status approval_status DEFAULT 'PENDING',
  comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Períodos Contábeis
CREATE TABLE public.accounting_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.company_settings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_open BOOLEAN DEFAULT true,
  closed_by UUID REFERENCES auth.users(id),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, start_date, end_date)
);

-- Contas Contábeis
CREATE TABLE public.chart_of_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.company_settings(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.chart_of_accounts(id),
  account_type TEXT NOT NULL CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, code)
);

-- Lançamentos Contábeis
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.company_settings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_number TEXT NOT NULL,
  description TEXT NOT NULL,
  reference_type TEXT, -- 'INVOICE', 'PAYMENT', 'ADJUSTMENT'
  reference_id UUID,
  accounting_date DATE NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'POSTED')),
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, entry_number)
);

CREATE TABLE public.journal_entry_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE CASCADE,
  description TEXT,
  debit_amount DECIMAL(15,2) DEFAULT 0,
  credit_amount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (debit_amount >= 0 AND credit_amount >= 0),
  CHECK (debit_amount = 0 OR credit_amount = 0)
);

-- Configurações de Empresa expandidas
ALTER TABLE public.company_settings 
ADD COLUMN max_entry_value DECIMAL(15,2) DEFAULT 100000.00,
ADD COLUMN require_approval_above DECIMAL(15,2) DEFAULT 10000.00,
ADD COLUMN fiscal_year_start_month INTEGER DEFAULT 1 CHECK (fiscal_year_start_month BETWEEN 1 AND 12);

-- RLS Policies
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entry_lines ENABLE ROW LEVEL SECURITY;

-- Políticas para Audit Logs
CREATE POLICY "Users can view audit logs of their company" 
  ON public.audit_logs FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert audit logs" 
  ON public.audit_logs FOR INSERT 
  WITH CHECK (true);

-- Políticas para Approval Rules
CREATE POLICY "Company users can view approval rules" 
  ON public.approval_rules FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_settings 
      WHERE id = approval_rules.company_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can manage approval rules" 
  ON public.approval_rules FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_settings 
      WHERE id = approval_rules.company_id 
      AND user_id = auth.uid()
    )
  );

-- Políticas para Approval Requests
CREATE POLICY "Users can view their approval requests" 
  ON public.approval_requests FOR SELECT 
  USING (requester_id = auth.uid() OR approver_id = auth.uid());

CREATE POLICY "Users can create approval requests" 
  ON public.approval_requests FOR INSERT 
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Approvers can update their requests" 
  ON public.approval_requests FOR UPDATE 
  USING (approver_id = auth.uid());

-- Políticas para outros módulos (aplicando padrão similar)
CREATE POLICY "Company users can view accounting periods" 
  ON public.accounting_periods FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_settings 
      WHERE id = accounting_periods.company_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can manage accounting periods" 
  ON public.accounting_periods FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_settings 
      WHERE id = accounting_periods.company_id 
      AND user_id = auth.uid()
    )
  );

-- Triggers para auditoria automática
CREATE OR REPLACE FUNCTION public.trigger_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity,
    entity_id,
    old_value,
    new_value
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME::text,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger nas tabelas principais
CREATE TRIGGER audit_trigger_invoices 
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices 
  FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_log();

CREATE TRIGGER audit_trigger_clients 
  AFTER INSERT OR UPDATE OR DELETE ON public.clients 
  FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_log();

CREATE TRIGGER audit_trigger_products 
  AFTER INSERT OR UPDATE OR DELETE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_log();

-- Função para validação de lançamentos contábeis
CREATE OR REPLACE FUNCTION public.validate_journal_entry()
RETURNS TRIGGER AS $$
DECLARE
  total_debits DECIMAL(15,2);
  total_credits DECIMAL(15,2);
  period_open BOOLEAN;
BEGIN
  -- Validar equilíbrio débito/crédito
  SELECT 
    COALESCE(SUM(debit_amount), 0),
    COALESCE(SUM(credit_amount), 0)
  INTO total_debits, total_credits
  FROM public.journal_entry_lines
  WHERE journal_entry_id = NEW.id;
  
  IF ABS(total_debits - total_credits) > 0.01 THEN
    RAISE EXCEPTION 'Lançamento não equilibrado: Débitos (%) ≠ Créditos (%)', total_debits, total_credits;
  END IF;
  
  -- Validar período contábil aberto
  SELECT is_open INTO period_open
  FROM public.accounting_periods ap
  JOIN public.company_settings cs ON cs.id = ap.company_id
  WHERE ap.company_id = NEW.company_id
    AND NEW.accounting_date BETWEEN ap.start_date AND ap.end_date
  LIMIT 1;
  
  IF period_open IS FALSE THEN
    RAISE EXCEPTION 'Período contábil fechado para a data %', NEW.accounting_date;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_journal_entry_trigger
  BEFORE UPDATE OF status ON public.journal_entries
  FOR EACH ROW 
  WHEN (NEW.status = 'POSTED')
  EXECUTE FUNCTION public.validate_journal_entry();

-- Função para relatório de balanço
CREATE OR REPLACE FUNCTION public.generate_balance_sheet(
  company_id_param UUID,
  report_date DATE
)
RETURNS TABLE (
  account_code TEXT,
  account_name TEXT,
  account_type TEXT,
  balance DECIMAL(15,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    coa.code,
    coa.name,
    coa.account_type,
    COALESCE(
      SUM(jel.debit_amount - jel.credit_amount),
      0
    ) AS balance
  FROM public.chart_of_accounts coa
  LEFT JOIN public.journal_entry_lines jel ON jel.account_id = coa.id
  LEFT JOIN public.journal_entries je ON je.id = jel.journal_entry_id
    AND je.status = 'POSTED'
    AND je.accounting_date <= report_date
  WHERE coa.company_id = company_id_param
    AND coa.is_active = true
  GROUP BY coa.id, coa.code, coa.name, coa.account_type
  ORDER BY coa.code;
END;
$$;

-- Trigger para atualizar timestamps
CREATE TRIGGER update_approval_rules_updated_at 
  BEFORE UPDATE ON public.approval_rules 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_approval_requests_updated_at 
  BEFORE UPDATE ON public.approval_requests 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounting_periods_updated_at 
  BEFORE UPDATE ON public.accounting_periods 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chart_of_accounts_updated_at 
  BEFORE UPDATE ON public.chart_of_accounts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at 
  BEFORE UPDATE ON public.journal_entries 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
