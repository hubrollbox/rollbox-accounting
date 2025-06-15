
-- Remover triggers dependentes antes de alterar a função
DROP TRIGGER IF EXISTS audit_trigger_invoices ON invoices;
DROP TRIGGER IF EXISTS audit_trigger_clients ON clients;
DROP TRIGGER IF EXISTS audit_trigger_products ON products;

DROP FUNCTION IF EXISTS public.trigger_audit_log();

CREATE FUNCTION public.trigger_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
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
$$;

-- Recriar triggers nas tabelas relevantes
CREATE TRIGGER audit_trigger_invoices
AFTER INSERT OR UPDATE OR DELETE ON invoices
FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_log();

CREATE TRIGGER audit_trigger_clients
AFTER INSERT OR UPDATE OR DELETE ON clients
FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_log();

CREATE TRIGGER audit_trigger_products
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION public.trigger_audit_log();
