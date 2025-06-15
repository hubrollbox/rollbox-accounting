
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Shield, LogOut, FileText, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsModule } from "@/components/ReportsModule";
import { AuditTrail } from "@/components/AuditTrail";
import { IntegrationsModule } from "@/components/IntegrationsModule";
import { FaqSection } from "@/components/FaqSection";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sessão terminada",
      description: "Até à próxima!",
    });
    navigate("/auth");
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const profileStats = [
    { label: "Faturas Emitidas", value: "89", color: "text-blue-600" },
    { label: "Clientes Ativos", value: "23", color: "text-green-600" },
    { label: "Produtos", value: "45", color: "text-purple-600" },
    { label: "Valor Total", value: "€12,450", color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-2 max-w-5xl flex flex-col gap-3">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackToDashboard} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Button>
            <span className="hidden sm:inline text-xl sm:text-2xl font-bold text-foreground ml-4">
              Área do Utilizador
            </span>
          </div>
          <div className="mt-2 sm:mt-0">
            <p className="text-muted-foreground text-sm">
              Gestão de perfil, sistema e integrações
            </p>
          </div>
        </div>

        {/* TAB MENU */}
        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 rounded-lg">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="integracoes" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              FAQs
            </TabsTrigger>
          </TabsList>

          {/* PERFIL */}
          <TabsContent value="perfil" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* USER CARD */}
              <Card className="col-span-1 flex flex-col justify-between animate-fade-in">
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <CardTitle className="break-words">{user?.email}</CardTitle>
                  <CardDescription>Administrador do Sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge variant="default">
                      <Shield className="w-3 h-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plano:</span>
                    <Badge variant="secondary">Professional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Último Acesso:</span>
                    <span className="text-sm text-muted-foreground">Agora</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="w-full mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Terminar Sessão
                  </Button>
                </CardContent>
              </Card>
              
              {/* STATS */}
              <div className="col-span-2 grid grid-cols-2 md:grid-cols-2 gap-4 content-between">
                {profileStats.map((stat, index) => (
                  <Card key={index} className="animate-fade-in">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium uppercase tracking-wide">{stat.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* RELATÓRIOS */}
          <TabsContent value="relatorios" className="space-y-6 animate-fade-in">
            <ReportsModule />
          </TabsContent>

          {/* CONFIGURAÇÕES */}
          <TabsContent value="configuracoes" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Empresa</CardTitle>
                <CardDescription>
                  Configurações gerais do sistema (em desenvolvimento)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-10 text-center py-8 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4" />
                  <p>Módulo de Configurações</p>
                  <p className="text-sm">Em desenvolvimento</p>
                </div>
                {/* Aqui pode ir um formulário/configurações totais no futuro */}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEGURANÇA */}
          <TabsContent value="seguranca" className="space-y-4 animate-fade-in">
            <AuditTrail />
          </TabsContent>

          {/* INTEGRAÇÕES */}
          <TabsContent value="integracoes" className="space-y-4 animate-fade-in">
            <IntegrationsModule />
          </TabsContent>

          {/* FAQS */}
          <TabsContent value="faqs" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes (FAQs)</CardTitle>
                <CardDescription>
                  Dúvidas comuns sobre o sistema e integrações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FaqSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
