
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import DOMPurify from "dompurify";
import { UseMutateFunction } from "@tanstack/react-query";

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

  const sanitize = (value: string) =>
    DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const sanitized = {
      name: sanitize(form.name),
      tax_number: sanitize(form.tax_number.replace(/\D/g, "")),
      email: sanitize(form.email),
      phone: sanitize(form.phone),
    };
    createClient.mutate(
      {
        ...sanitized,
        is_active: true,
      },
      {
        onSuccess: () => {
          setForm({
            name: "",
            tax_number: "",
            email: "",
            phone: "",
          });
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
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={submitting || createClient.isPending}
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={handleChange}
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
