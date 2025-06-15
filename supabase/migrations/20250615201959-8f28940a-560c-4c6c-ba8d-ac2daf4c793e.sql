
-- Passo 1: Remover o trigger dependente
DROP TRIGGER IF EXISTS validate_journal_entry_trigger ON public.journal_entries;

-- Passo 2: Dropar a função antiga
DROP FUNCTION IF EXISTS public.validate_journal_entry();

-- Passo 3: Criar a função com search_path seguro
CREATE OR REPLACE FUNCTION public.validate_journal_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $function$
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
$function$;

-- Passo 4: Recriar o trigger
CREATE TRIGGER validate_journal_entry_trigger
  BEFORE INSERT OR UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_journal_entry();
