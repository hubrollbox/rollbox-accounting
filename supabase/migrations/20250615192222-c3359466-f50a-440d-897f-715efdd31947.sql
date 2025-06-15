
-- Remover o trigger antes de redefinir a função
DROP TRIGGER IF EXISTS calculate_invoice_totals_trigger ON invoice_items;

DROP FUNCTION IF EXISTS public.calculate_invoice_totals();

CREATE FUNCTION public.calculate_invoice_totals()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO public
AS $function$
BEGIN
  -- Update line total for the item
  NEW.line_total = NEW.quantity * NEW.unit_price;
  
  -- Update invoice totals
  UPDATE public.invoices SET
    subtotal = (
      SELECT COALESCE(SUM(quantity * unit_price), 0)
      FROM public.invoice_items 
      WHERE invoice_id = NEW.invoice_id
    ),
    tax_amount = (
      SELECT COALESCE(SUM((quantity * unit_price) * (tax_rate / 100)), 0)
      FROM public.invoice_items 
      WHERE invoice_id = NEW.invoice_id
    ),
    total_amount = (
      SELECT COALESCE(SUM(quantity * unit_price * (1 + tax_rate / 100)), 0)
      FROM public.invoice_items 
      WHERE invoice_id = NEW.invoice_id
    )
  WHERE id = NEW.invoice_id;
  
  RETURN NEW;
END;
$function$;

-- Recriar o trigger na tabela invoice_items
CREATE TRIGGER calculate_invoice_totals_trigger
AFTER INSERT OR UPDATE ON invoice_items
FOR EACH ROW EXECUTE FUNCTION public.calculate_invoice_totals();
