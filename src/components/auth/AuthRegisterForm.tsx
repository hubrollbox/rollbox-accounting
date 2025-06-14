
import { useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AuthRegisterFormProps {
  setLoading: (v: boolean) => void;
  loading: boolean;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  nif: string;
  setNif: (v: string) => void;
}

export const AuthRegisterForm = ({
  setLoading,
  loading,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  nif,
  setNif,
}: AuthRegisterFormProps) => {
  const { signUp } = useAuth();
  const { toast } = useToast();

  // Helper to sanitize all fields before sending to backend
  const sanitize = (value: string) => {
    return DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Sanitize all fields
    const cleanedEmail = sanitize(email);
    const cleanedPassword = sanitize(password);
    const cleanedName = sanitize(name);
    const cleanedNif = sanitize(nif);

    // NIF validation: must be exactly 9 digits and start with valid digits (Portugal)
    const validNif = /^[125689]\d{8}$/.test(cleanedNif);

    if (!validNif) {
      toast({
        title: "NIF inválido",
        description: "Por favor, insira um NIF português válido (9 dígitos, começando por 1, 2, 5, 6, 8, ou 9).",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await signUp(cleanedEmail, cleanedPassword, cleanedName, cleanedNif);

    if (error) {
      toast({
        title: "Erro no registo",
        description:
          error.message === "User already registered"
            ? "Este email já está registado. Tente fazer login."
            : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registo realizado com sucesso",
        description: "Verifique o seu email para confirmar a conta.",
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-name">Nome</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="O seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="text-sm py-2"
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-nif">NIF</Label>
        <Input
          id="register-nif"
          type="text"
          placeholder="Número de Identificação Fiscal"
          value={nif}
          onChange={(e) => setNif(e.target.value.replace(/\D/g, ""))}
          required
          minLength={9}
          maxLength={9}
          className="text-sm py-2"
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          inputMode="email"
          className="text-sm py-2"
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Palavra-passe</Label>
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="text-sm py-2"
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" className="w-full py-2 text-base" disabled={loading}>
        {loading ? "A registar..." : "Registar"}
      </Button>
    </form>
  );
};
