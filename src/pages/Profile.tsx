
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
      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-6">
        {/* Top bar with back button and page title */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Button>
            <span className="hidden sm:inline text-lg sm:text-2xl font-bold text-foreground ml-4">
              Perfil e Configurações
            </span>
          </div>
          <div className="mt-2 sm:mt-0">
            <p className="text-muted-foreground">
              Gerir informações pessoais, configurações e relatórios
            </p>
          </div>
        </div>

        {/* Profile info + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* USER CARD */}
          <Card className="lg:col-span-1 flex flex-col justify-between">
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
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {profileStats.map((stat, index) => (
              <Card key={index}>
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

        {/* Divider */}
        <div className="border-t border-muted my-1" />

        {/* Tabs and modules */}
        <div>
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-lg mb-3">
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Segurança
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reports" className="space-y-6">
              <ReportsModule />
            </TabsContent>
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Empresa</CardTitle>
                  <CardDescription>
                    Configurações gerais do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-10 text-center py-6 text-muted-foreground">
                    <Settings className="w-12 h-12 mx-auto mb-4" />
                    <p>Módulo de Configurações</p>
                    <p className="text-sm">Em desenvolvimento</p>
                  </div>
                  <div>
                    <IntegrationsModule />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-6">
              <AuditTrail />
            </TabsContent>
          </Tabs>
        </div>

        {/* FAQ SECTION, espaçamento generoso */}
        <div className="mt-12">
          <FaqSection />
        </div>
      </div>
    </div>
  );
};

export default Profile;
