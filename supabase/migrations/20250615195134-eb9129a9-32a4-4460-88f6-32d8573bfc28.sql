
-- Corrigir search_path da função generate_balance_sheet
DROP FUNCTION IF EXISTS public.generate_balance_sheet(uuid, date);

CREATE FUNCTION public.generate_balance_sheet(
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
SET search_path TO public
AS $function$
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
$function$;
