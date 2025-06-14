declare global {
  interface Window {
    __lovableSidebarTrigger__?: () => void;
  }
}

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { ClientsManagement } from "@/components/ClientsManagement";
import { ProductsManagement } from "@/components/ProductsManagement";
import { InvoicingModule } from "@/components/InvoicingModule";
import { ReportsModule } from "@/components/ReportsModule";
import { SuppliersManagement } from "@/components/SuppliersManagement";
import { StockManagement } from "@/components/StockManagement";
import { AccountingModule } from "@/components/accounting/AccountingModule";
import { Header } from "@/components/Header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar visible em todas as telas, Drawer no mobile */}
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Botão flutuante para abrir sidebar no mobile */}
        <button
          className="fixed top-3 left-3 z-40 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg sm:hidden"
          type="button"
          aria-label="Abrir menu"
          onClick={() => {
            // hack para acionar o SidebarTrigger (usa um evento personalizado)
            const ev = new CustomEvent("openSidebarMobile");
            window.dispatchEvent(ev);
          }}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
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
            </Tabs>
          </main>
        </div>
      </div>

      {/* Escuta para abrir o drawer responsivo via evento customizado */}
      <SidebarTriggerMobile />
    </SidebarProvider>
  );
};

// Componente invisível só para disparar SidebarTrigger (por evento custom)
function SidebarTriggerMobile() {
  // Esta função garante que o Sidebar no mobile pode ser "aberto" via evento global
  // O SidebarProvider já lida com openMobile/setOpenMobile via AppSidebar
  // Aqui simulamos clique no SidebarTrigger real
  // O SidebarTrigger controla o estado do Drawer via contexto
  // Fazendo um trigger virtual
  // Só existe no mobile
  if (typeof window !== "undefined") {
    window.__lovableSidebarTrigger__ = window.__lovableSidebarTrigger__ || (() => {});
  }

  return (
    <span
      className="hidden"
      id="trigger-sidebar-mobile"
      aria-hidden="true"
      ref={el => {
        if (el && typeof window !== "undefined") {
          window.__lovableSidebarTrigger__ = () => {
            el.click();
          };
          // Listener para evento customizado
          window.addEventListener("openSidebarMobile", () => {
            el.click();
          });
        }
      }}
    >
      <SidebarTrigger style={{ display: "none" }} />
    </span>
  );
}

export default Index;
