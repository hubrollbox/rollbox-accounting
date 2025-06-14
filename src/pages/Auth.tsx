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
import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { AuthLoginForm } from "@/components/auth/AuthLoginForm";
import { AuthRegisterForm } from "@/components/auth/AuthRegisterForm";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nif, setNif] = useState("");
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-2 py-6 md:p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <AuthBrandHeader />
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
                <AuthLoginForm
                  setLoading={setLoading}
                  loading={loading}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                />
              </TabsContent>
              <TabsContent value="register">
                <AuthRegisterForm
                  setLoading={setLoading}
                  loading={loading}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  name={name}
                  setName={setName}
                  nif={nif}
                  setNif={setNif}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
