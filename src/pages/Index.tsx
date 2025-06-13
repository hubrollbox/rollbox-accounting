
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Euro, Users, FileText, Hash, Settings } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { ClientsManagement } from "@/components/ClientsManagement";
import { ProductsManagement } from "@/components/ProductsManagement";
import { InvoicingModule } from "@/components/InvoicingModule";
import { ReportsModule } from "@/components/ReportsModule";
import { IntegrationsModule } from "@/components/IntegrationsModule";
import { Header } from "@/components/Header";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Plataforma de Faturação e Contabilidade
          </h1>
          <p className="text-muted-foreground">
            Sistema completo de gestão empresarial conforme legislação portuguesa
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Euro className="w-4 h-4" />
              Artigos
            </TabsTrigger>
            <TabsTrigger value="invoicing" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Faturação
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Integrações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientsManagement />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="invoicing" className="space-y-6">
            <InvoicingModule />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsModule />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsModule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
