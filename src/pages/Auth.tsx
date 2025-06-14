
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Euro, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nif, setNif] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const inactivityTimeoutRef = useRef<any>(null);

  // Session timeout and automatic signout
  useEffect(() => {
    const resetInactivityTimeout = () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = setTimeout(() => {
        signOut();
        toast({
          title: "Sessão terminada por inatividade",
          description: "Por segurança, foi efetuado logout automático após 30 minutos sem atividade.",
          variant: "destructive",
        });
        navigate("/auth");
      }, SESSION_TIMEOUT);
    };

    const activityEvents = ["mousemove", "keydown", "click"];
    activityEvents.forEach((event) => window.addEventListener(event, resetInactivityTimeout));
    resetInactivityTimeout();

    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      activityEvents.forEach((event) => window.removeEventListener(event, resetInactivityTimeout));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signOut, toast, navigate]);

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
    } else {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Accounting!",
      });
      navigate("/");
    }

    setLoading(false);
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
    <div className="min-h-screen bg-background flex items-center justify-center px-2 py-6 md:p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex flex-col items-center justify-center space-y-3 mb-4 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2 sm:mb-0">
              <Euro className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Accounting</h1>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 justify-center">
                <Shield className="w-3 h-3" />
                Sistema Certificado AT
              </p>
            </div>
          </div>
        </div>

        <Card className="w-full shadow-sm border bg-card/90 md:bg-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-center">Acesso à Plataforma</CardTitle>
            <CardDescription className="text-center">
              Entre na sua conta ou registe-se para aceder ao sistema de faturação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="login" className="py-2">Login</TabsTrigger>
                <TabsTrigger value="register" className="py-2">Registar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
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
                    <Label htmlFor="password">Palavra-passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-sm py-2"
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" className="w-full py-2 text-base" disabled={loading}>
                    {loading ? "A entrar..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
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
                    <Label htmlFor="nif">NIF</Label>
                    <Input
                      id="nif"
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
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
                    <Label htmlFor="password">Palavra-passe</Label>
                    <Input
                      id="password"
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
