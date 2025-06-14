
import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthLoginFormProps {
  setLoading: (v: boolean) => void;
  loading: boolean;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}

export const AuthLoginForm = ({
  setLoading,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}: AuthLoginFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Foca no campo email ao montar
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Helper to sanitize all fields before sending to backend
  const sanitize = (value: string) => {
    return DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanedEmail = sanitize(email);
    const cleanedPassword = sanitize(password);

    const { error } = await signIn(cleanedEmail, cleanedPassword);

    if (error) {
      toast({
        title: "Erro no login",
        description:
          error.message === "Invalid login credentials"
            ? "Credenciais inválidas. Verifique o email e palavra-passe."
            : error.message,
        variant: "destructive",
      });
      setTimeout(() => errorRef.current?.focus(), 120);
    } else {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Accounting!",
      });
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4" aria-live="polite">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          inputMode="email"
          className="text-sm py-2"
          autoComplete="username"
          disabled={loading}
          ref={emailRef}
          aria-required="true"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Palavra-passe</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-sm py-2"
          autoComplete="current-password"
          disabled={loading}
          aria-required="true"
        />
      </div>
      <Button type="submit" className="w-full py-2 text-base" disabled={loading}>
        {loading ? "A entrar..." : "Entrar"}
      </Button>
      <div
        ref={errorRef}
        tabIndex={-1}
        aria-live="assertive"
        className="sr-only"
      />
    </form>
  );
};
