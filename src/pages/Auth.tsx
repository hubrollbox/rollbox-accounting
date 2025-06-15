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
import { AuthIntegrateTab } from "@/components/auth/AuthIntegrateTab";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { FaqSection } from "@/components/FaqSection";

// Reduzido para 15 minutos para dados financeiros sensíveis
const SESSION_TIMEOUT = 15 * 60 * 1000;

const Auth = () => {
  // Estados separados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Estados separados para registro
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerNif, setRegisterNif] = useState("");
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const inactivityTimeoutRef = useRef<any>(null);

  useRedirectIfAuthenticated();

  // Input sanitization function
  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim(), { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    });
  };

  // Enhanced session timeout with security logging
  useEffect(() => {
    const resetInactivityTimeout = () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = setTimeout(() => {
        console.log('Sessão terminada por inatividade - logout automático');
        signOut();
        toast({
          title: "Sessão terminada por inatividade",
          description: "Por segurança, foi efetuado logout automático após 15 minutos sem atividade.",
          variant: "destructive",
        });
        navigate("/auth");
      }, SESSION_TIMEOUT);
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    activityEvents.forEach((event) => window.addEventListener(event, resetInactivityTimeout, { passive: true }));
    resetInactivityTimeout();

    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      activityEvents.forEach((event) => window.removeEventListener(event, resetInactivityTimeout));
    };
  }, [signOut, toast, navigate]);

  // Sanitize inputs on change
  const handleLoginEmailChange = (value: string) => {
    setLoginEmail(sanitizeInput(value));
  };

  const handleRegisterEmailChange = (value: string) => {
    setRegisterEmail(sanitizeInput(value));
  };

  const handleRegisterNameChange = (value: string) => {
    setRegisterName(sanitizeInput(value));
  };

  const handleRegisterNifChange = (value: string) => {
    setRegisterNif(sanitizeInput(value));
  };

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
              <div className="w-full overflow-x-auto scrollbar-none">
                <TabsList
                  className="
                    grid grid-cols-4 mb-2 
                    min-w-[440px] sm:min-w-0
                    whitespace-nowrap 
                    gap-0 rounded-md p-0
                    bg-muted
                    shadow-inner
                  "
                  style={{
                    WebkitOverflowScrolling: "touch"
                  }}
                >
                  <TabsTrigger
                    value="login"
                    className="
                      py-3 sm:py-2 px-0 sm:px-3 text-base
                      min-w-[100px] flex-1
                      focus:z-10
                    "
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="
                      py-3 sm:py-2 px-0 sm:px-3 text-base
                      min-w-[100px] flex-1
                      focus:z-10
                    "
                  >
                    Registar
                  </TabsTrigger>
                  <TabsTrigger
                    value="integrate"
                    className="
                      py-3 sm:py-2 px-0 sm:px-3 text-base
                      min-w-[110px] flex-1
                      focus:z-10
                    "
                  >
                    Integrar
                  </TabsTrigger>
                  <TabsTrigger
                    value="faqs"
                    className="
                      py-3 sm:py-2 px-0 sm:px-3 text-base
                      min-w-[90px] flex-1
                      focus:z-10
                    "
                  >
                    FAQs
                  </TabsTrigger>
                </TabsList>
              </div>
              <div
                className="relative w-full min-h-[330px] max-h-[420px] h-[350px] overflow-y-auto"
              >
                <TabsContent value="login">
                  <AuthLoginForm
                    setLoading={setLoading}
                    loading={loading}
                    email={loginEmail}
                    setEmail={handleLoginEmailChange}
                    password={loginPassword}
                    setPassword={setLoginPassword}
                  />
                </TabsContent>
                <TabsContent value="register">
                  <AuthRegisterForm
                    setLoading={setLoading}
                    loading={loading}
                    email={registerEmail}
                    setEmail={handleRegisterEmailChange}
                    password={registerPassword}
                    setPassword={setRegisterPassword}
                    name={registerName}
                    setName={handleRegisterNameChange}
                    nif={registerNif}
                    setNif={handleRegisterNifChange}
                  />
                </TabsContent>
                <TabsContent value="integrate">
                  <AuthIntegrateTab />
                </TabsContent>
                <TabsContent value="faqs">
                  <div className="py-2">
                    <FaqSection />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
