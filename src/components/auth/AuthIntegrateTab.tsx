
import { Link } from "react-router-dom";
import { Puzzle } from "lucide-react";

export const AuthIntegrateTab = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-3 text-center animate-fade-in">
      <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-2">
        <Puzzle className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-1">Integração com Outros Sistemas</h2>
      <p className="text-muted-foreground text-sm max-w-xs mx-auto">
        Em breve poderá integrar esta aplicação com outros repositórios ou sistemas externos.
        Se já possui um sistema externo e pretende realizar integração, entre em contacto com o suporte ou utilize a nossa API.
      </p>
      <Link to="/" className="text-primary underline text-sm mt-3">
        Voltar à página inicial
      </Link>
    </div>
  );
};
