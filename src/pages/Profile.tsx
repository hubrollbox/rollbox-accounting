
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, FileText, Settings, Shield } from "lucide-react";
import { ProfileTabPerfil } from "@/components/profile/ProfileTabPerfil";
import { ProfileTabRelatorios } from "@/components/profile/ProfileTabRelatorios";
import { ProfileTabConfiguracoes } from "@/components/profile/ProfileTabConfiguracoes";
import { ProfileTabSeguranca } from "@/components/profile/ProfileTabSeguranca";
import { ProfileTabIntegracoes } from "@/components/profile/ProfileTabIntegracoes";
import { ProfileTabFaqs } from "@/components/profile/ProfileTabFaqs";

const Profile = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Top bar igual ao Dashboard */}
      <div className="w-full border-b bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-2 sm:px-4 py-3">
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
      </div>

      <main className="flex-1 w-full px-2 py-2 sm:px-4 sm:py-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Área do Utilizador
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground">
            Gere as suas definições, relatórios, integrações e mais
          </p>
        </div>
        {/* Tabs idêntico ao Dashboard */}
        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="flex flex-wrap gap-1 px-2 py-0.5 bg-muted rounded-lg mb-4">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Configurações
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
          <TabsContent value="perfil">
            <ProfileTabPerfil />
          </TabsContent>
          <TabsContent value="relatorios">
            <ProfileTabRelatorios />
          </TabsContent>
          <TabsContent value="configuracoes">
            <ProfileTabConfiguracoes />
          </TabsContent>
          <TabsContent value="seguranca">
            <ProfileTabSeguranca />
          </TabsContent>
          <TabsContent value="integracoes">
            <ProfileTabIntegracoes />
          </TabsContent>
          <TabsContent value="faqs">
            <ProfileTabFaqs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;

