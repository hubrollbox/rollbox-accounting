
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  code?: string;
  name: string;
  category?: string;
  price: number;
  tax_rate: number;
  stock?: number | null;
  unit?: string;
  description?: string;
  is_active?: boolean;
}

export function useProducts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!user
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const { data, error } = await supabase
        .from("products")
        .insert({ ...product, user_id: user?.id })
        .select("*")
        .single();
      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      toast({ title: "Artigo criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao criar artigo", description: error.message, variant: "destructive" });
    }
  });

  return { ...query, createProduct };
}
