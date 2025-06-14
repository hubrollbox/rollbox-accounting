
-- Suppliers table (Fornecedores)
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'Portugal',
  tax_number TEXT,
  contact_person TEXT,
  payment_terms INTEGER DEFAULT 30, -- dias para pagamento
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Stock/Inventory table
CREATE TABLE public.stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
  min_quantity DECIMAL(10,3) DEFAULT 0, -- stock mínimo
  max_quantity DECIMAL(10,3), -- stock máximo
  location TEXT, -- localização no armazém
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Stock movements table (para histórico de movimentos)
CREATE TABLE public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity DECIMAL(10,3) NOT NULL,
  reference_id UUID, -- pode referenciar uma fatura, compra, etc.
  reference_type TEXT, -- 'invoice', 'purchase', 'adjustment'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for suppliers
CREATE POLICY "Users can view their own suppliers" 
  ON public.suppliers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers" 
  ON public.suppliers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" 
  ON public.suppliers FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" 
  ON public.suppliers FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for stock
CREATE POLICY "Users can view their own stock" 
  ON public.stock FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock" 
  ON public.stock FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock" 
  ON public.stock FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock" 
  ON public.stock FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for stock_movements
CREATE POLICY "Users can view their own stock movements" 
  ON public.stock_movements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock movements" 
  ON public.stock_movements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_suppliers_updated_at 
  BEFORE UPDATE ON public.suppliers 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update stock automatically
CREATE OR REPLACE FUNCTION public.update_stock_from_movement()
RETURNS TRIGGER AS $$
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
$$ language 'plpgsql';

-- Trigger to update stock when movements are added
CREATE TRIGGER update_stock_trigger 
  AFTER INSERT ON public.stock_movements 
  FOR EACH ROW EXECUTE FUNCTION public.update_stock_from_movement();

-- Create indexes for better performance
CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_stock_user_id ON public.stock(user_id);
CREATE INDEX idx_stock_product_id ON public.stock(product_id);
CREATE INDEX idx_stock_movements_user_id ON public.stock_movements(user_id);
CREATE INDEX idx_stock_movements_product_id ON public.stock_movements(product_id);
