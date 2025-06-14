
import React, { useState } from "react";
import { uploadTenantDocument } from "@/utils/storage";

interface DocumentUploaderProps {
  tenantId: string;
}

export default function DocumentUploader({ tenantId }: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg(null);

    const { error } = await uploadTenantDocument(tenantId, file);

    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "Erro desconhecido no upload");
    } else {
      setStatus("success");
      setFile(null); // Limpa
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-6 p-4 border rounded-xl flex flex-col gap-2 bg-card shadow">
      <label className="block text-sm font-medium mb-1">Enviar documento:</label>
      <input
        type="file"
        className="border rounded px-2 py-1"
        accept="application/pdf,image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={status === "uploading"}
      />
      <button
        onClick={handleUpload}
        disabled={!file || status === "uploading"}
        className="bg-primary text-white rounded py-2 font-medium disabled:opacity-60"
      >
        {status === "uploading" ? "Enviando..." : "Enviar Documento"}
      </button>
      {status === "success" && (
        <div className="text-green-700 text-sm flex items-center gap-1 mt-1">
          ✅ Documento salvo!
        </div>
      )}
      {status === "error" && (
        <div className="text-destructive text-sm mt-1">
          ❌ Erro no upload: {errorMsg}
        </div>
      )}
    </div>
  );
}
