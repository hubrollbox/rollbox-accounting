
import { Euro, Shield } from "lucide-react";

export const AuthBrandHeader = () => (
  <div className="flex flex-col items-center justify-center space-y-3 mb-4 sm:flex-row sm:space-y-0 sm:space-x-2">
    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2 sm:mb-0">
      <Euro className="w-7 h-7 text-primary-foreground" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-foreground">Accounting</h1>
      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 justify-center">
        <Shield className="w-3 h-3" />
        Sistema Certificado AT
      </p>
    </div>
  </div>
);
