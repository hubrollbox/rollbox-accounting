
-- Remover o trigger dependente antes de dropar a função
DROP TRIGGER IF EXISTS recalculate_totals_on_delete_trigger ON invoice_items;

DROP FUNCTION IF EXISTS public.recalculate_invoice_totals_on_delete();

CREATE FUNCTION public.recalculate_invoice_totals_on_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO public
AS $function$
BEGIN
  -- Update invoice totals after deletion
  UPDATE public.invoices SET
    subtotal = (
      SELECT COALESCE(SUM(quantity * unit_price), 0)
      FROM public.invoice_items 
      WHERE invoice_id = OLD.invoice_id
    ),
    tax_amount = (
      SELECT COALESCE(SUM((quantity * unit_price) * (tax_rate / 100)), 0)
      FROM public.invoice_items 
      WHERE invoice_id = OLD.invoice_id
    ),
    total_amount = (
      SELECT COALESCE(SUM(quantity * unit_price * (1 + tax_rate / 100)), 0)
      FROM public.invoice_items 
      WHERE invoice_id = OLD.invoice_id
    )
  WHERE id = OLD.invoice_id;
  
  RETURN OLD;
END;
$function$;

-- Recriar o trigger na tabela invoice_items
CREATE TRIGGER recalculate_totals_on_delete_trigger
AFTER DELETE ON invoice_items
FOR EACH ROW EXECUTE FUNCTION public.recalculate_invoice_totals_on_delete();
