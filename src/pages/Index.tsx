
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar visible em todas as telas, Drawer no mobile */}
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 w-full px-2 py-2 sm:px-4 sm:py-6">
            {/* Botão para ativar sidebar no mobile */}
            <div className="flex sm:hidden mb-3">
              <SidebarTrigger />
            </div>
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
    </SidebarProvider>
  );
};

export default Index;
