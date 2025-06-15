
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
    <div className="w-full max-w-3xl mx-auto px-4 py-6 bg-background min-h-screen">
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
        <TabsList className="grid w-full grid-cols-6 mb-6 bg-muted rounded-lg">
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
    </div>
  );
};

export default Profile;
