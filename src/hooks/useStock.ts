
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface StockItem {
  id: string;
  product_id: string;
  quantity: number;
  min_quantity?: number;
  max_quantity?: number | null;
  location?: string | null;
  unit?: string;
}

export function useStock() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["stock"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("stock")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StockItem[];
    },
    enabled: !!user
  });

  // Exemplo de como criar movimentação de stock
  // const createStock = useMutation...

  return { ...query };
}
