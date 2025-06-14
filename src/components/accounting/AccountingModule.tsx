
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BookOpen, FileCheck, TrendingUp } from "lucide-react";
import { AuditLogsModule } from "./AuditLogsModule";
import { ApprovalSystemModule } from "./ApprovalSystemModule";
import { JournalEntriesModule } from "./JournalEntriesModule";
import { AdvancedReportsModule } from "./AdvancedReportsModule";

export const AccountingModule = () => {
  const [activeTab, setActiveTab] = useState("journal");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Contabilidade Avançada
          </h2>
          <p className="text-muted-foreground">
            Sistema completo de contabilidade profissional
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lançamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">Aprovação</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">Rastreado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">✓</div>
            <p className="text-xs text-muted-foreground">Validado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Lançamentos
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Aprovação
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Auditoria
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-6">
          <JournalEntriesModule />
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          <ApprovalSystemModule />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditLogsModule />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AdvancedReportsModule />
        </TabsContent>
      </Tabs>
    </div>
  );
};
