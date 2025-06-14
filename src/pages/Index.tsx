
declare global {
  interface Window {
    __lovableSidebarTrigger__?: () => void;
  }
}

import { useState } from "react";
// Remover SidebarProvider, AppSidebar, SidebarTrigger, SidebarTriggerMobile
import { Dashboard } from "@/components/Dashboard";
import { ClientsManagement } from "@/components/ClientsManagement";
import { ProductsManagement } from "@/components/ProductsManagement";
import { InvoicingModule } from "@/components/InvoicingModule";
import { ReportsModule } from "@/components/ReportsModule";
import { SuppliersManagement } from "@/components/SuppliersManagement";
import { StockManagement } from "@/components/StockManagement";
import { AccountingModule } from "@/components/accounting/AccountingModule";
import { IntegrationsModule } from "@/components/IntegrationsModule"; // <--- Novo import
import { Header } from "@/components/Header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Hash, Users, Truck, Euro, Package, FileText, Calculator } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    value: "dashboard",
    icon: Hash,
  },
  {
    title: "Clientes",
    value: "clients",
    icon: Users,
  },
  {
    title: "Fornecedores",
    value: "suppliers",
    icon: Truck,
  },
  {
    title: "Artigos",
    value: "products",
    icon: Euro,
  },
  {
    title: "Stock",
    value: "stock",
    icon: Package,
  },
  {
    title: "Faturação",
    value: "invoicing",
    icon: FileText,
  },
  {
    title: "Contabilidade",
    value: "accounting",
    icon: Calculator,
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Header fixo */}
      <Header />

      {/* Menu de navegação no topo */}
      <nav className="w-full bg-sidebar border-b border-border flex flex-wrap gap-1 px-2 sm:px-4 py-0.5 z-10">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.value}
            onClick={() => setActiveTab(item.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors
              ${
                activeTab === item.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-accent text-muted-foreground"
              }
            `}
            aria-current={activeTab === item.value ? "page" : undefined}
          >
            <item.icon className="w-4 h-4" />
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </nav>

      {/* Área de conteúdo principal */}
      <main className="flex-1 w-full px-2 py-2 sm:px-4 sm:py-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Plataforma de Faturação e Contabilidade
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground">
            Sistema completo de gestão empresarial conforme legislação portuguesa
          </p>
        </div>
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientsManagement />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <SuppliersManagement />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="stock" className="space-y-6">
            <StockManagement />
          </TabsContent>

          <TabsContent value="invoicing" className="space-y-6">
            <InvoicingModule />
          </TabsContent>

          <TabsContent value="accounting" className="space-y-6">
            <AccountingModule />
          </TabsContent>

          {/* Integrações REMOVIDO do dashboard - agora aparece nas Configurações do perfil */}
          {/* <TabsContent value="integrations" className="space-y-6">
            <IntegrationsModule />
          </TabsContent> */}
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
