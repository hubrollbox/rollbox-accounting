
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export const ProfileTabConfiguracoes = () => (
  <div className="space-y-4 animate-fade-in">
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
      </CardContent>
    </Card>
  </div>
);
