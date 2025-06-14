import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Euro, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nif, setNif] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

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

    // Verifica NIF (pode ajustar validação para formato se quiser)
    if (!nif || nif.length < 9) {
      toast({
        title: "NIF inválido",
        description: "Por favor, insira um NIF válido (9 dígitos).",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name, nif);

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
