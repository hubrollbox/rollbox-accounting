import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import DOMPurify from "dompurify";
import { UseMutateFunction } from "@tanstack/react-query";
import { sanitizeAndValidateNIF, sanitizeEmail, sanitizeText, limitInputLength } from "@/utils/inputSanitization";

interface ClientCreationFormProps {
  createClient: {
    mutate: UseMutateFunction<any, unknown, any, unknown>;
    isPending: boolean;
  };
}

export const ClientCreationForm = ({ createClient }: ClientCreationFormProps) => {
  const [form, setForm] = useState({
    name: "",
    tax_number: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [nifError, setNifError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    if (e.target.id === "tax_number") setNifError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Hardening: sanitize & validate all fields
    const sanitizedName = limitInputLength(sanitizeText(form.name), 80);
    const sanitizedPhone = limitInputLength(sanitizeText(form.phone), 24);
    const sanitizedEmail = sanitizeEmail(form.email);

    const { value: sanitizedNif, isValid: nifIsValid } = sanitizeAndValidateNIF(form.tax_number);
    if (!nifIsValid) {
      setNifError("NIF inválido. Deve conter 9 dígitos e passar o controlo de validade português.");
      setSubmitting(false);
      return;
    }

    if (!sanitizedEmail) {
      setSubmitting(false);
      alert("Por favor insira um email válido.");
      return;
    }

    createClient.mutate(
      {
        name: sanitizedName,
        tax_number: sanitizedNif,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        is_active: true,
      },
      {
        onSuccess: () => {
          setForm({ name: "", tax_number: "", email: "", phone: "" });
        },
        onSettled: () => setSubmitting(false),
      }
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Nome/Razão Social</Label>
        <Input
          id="name"
          value={form.name}
          onChange={handleChange}
          required
          maxLength={80}
          disabled={submitting || createClient.isPending}
        />
      </div>
      <div>
        <Label htmlFor="tax_number">NIF</Label>
        <Input
          id="tax_number"
          value={form.tax_number.replace(/\D/g, "")}
          onChange={handleChange}
          minLength={9}
          maxLength={9}
          required
          disabled={submitting || createClient.isPending}
          pattern="\d{9}"
        />
        {nifError && <span className="text-destructive text-xs">{nifError}</span>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          maxLength={80}
          disabled={submitting || createClient.isPending}
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={handleChange}
          maxLength={24}
          disabled={submitting || createClient.isPending}
        />
      </div>
      <DialogFooter>
        <Button className="w-full" type="submit" disabled={submitting || createClient.isPending}>
          {submitting || createClient.isPending ? "A criar..." : "Criar Cliente"}
        </Button>
      </DialogFooter>
    </form>
  );
};
