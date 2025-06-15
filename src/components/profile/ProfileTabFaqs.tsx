
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FaqSection } from "@/components/FaqSection";

export const ProfileTabFaqs = () => (
  <div className="space-y-4 animate-fade-in">
    <Card>
      <CardHeader>
        <CardTitle>Perguntas Frequentes (FAQs)</CardTitle>
        <CardDescription>
          Dúvidas comuns sobre o sistema e integrações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FaqSection />
      </CardContent>
    </Card>
  </div>
);
