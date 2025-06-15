
-- Remover o trigger dependente antes de dropar a função
DROP TRIGGER IF EXISTS update_stock_trigger ON public.stock_movements;

DROP FUNCTION IF EXISTS public.update_stock_from_movement();

CREATE FUNCTION public.update_stock_from_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO public
AS $function$
BEGIN
  -- Update or insert stock record
  INSERT INTO public.stock (user_id, product_id, quantity, last_updated)
  VALUES (NEW.user_id, NEW.product_id, 
    CASE 
      WHEN NEW.movement_type = 'in' THEN NEW.quantity
      WHEN NEW.movement_type = 'out' THEN -NEW.quantity
      ELSE NEW.quantity -- adjustment can be positive or negative
    END,
    now()
  )
  ON CONFLICT (user_id, product_id) 
  DO UPDATE SET 
    quantity = stock.quantity + 
      CASE 
        WHEN NEW.movement_type = 'in' THEN NEW.quantity
        WHEN NEW.movement_type = 'out' THEN -NEW.quantity
        ELSE NEW.quantity -- adjustment can be positive or negative
      END,
    last_updated = now();
  
  RETURN NEW;
END;
$function$;

-- Recriar o trigger na tabela stock_movements
CREATE TRIGGER update_stock_trigger 
  AFTER INSERT ON public.stock_movements 
  FOR EACH ROW EXECUTE FUNCTION public.update_stock_from_movement();
