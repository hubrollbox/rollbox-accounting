
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const ProfileUserCard = () => {
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

  return (
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
  );
};
