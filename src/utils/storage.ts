
import { supabase } from "@/integrations/supabase/client";

export const getTenantBucket = (tenantId: string) => {
  return `tenant-${tenantId}-documents`;
};

export const uploadTenantDocument = async (tenantId: string, file: File) => {
  const bucketName = getTenantBucket(tenantId);
  
  // Verifica se o bucket existe
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some(b => b.name === bucketName)) {
    // Cria o bucket se não existir
    await supabase.storage.createBucket(bucketName, {
      public: false,
    });
  }

  // Faz upload do arquivo
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`doc_${Date.now()}_${file.name}`, file);
  
  return { data, error };
};
