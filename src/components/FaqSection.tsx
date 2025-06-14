
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é o sistema de faturação certificado?",
    answer:
      "É um sistema aprovado pela Autoridade Tributária Portuguesa para garantir conformidade fiscal na emissão de faturas.",
  },
  {
    question: "Posso importar clientes de outro software?",
    answer:
      "Sim! Você pode importar clientes em formato CSV, acesse a área de Clientes e utilize a opção de importação.",
  },
  {
    question: "Como adicionar um novo utilizador à minha empresa?",
    answer:
      "Vá ao menu de configurações no perfil da empresa e escolha 'Gerir utilizadores'.",
  },
  {
    question: "As minhas informações estão seguras?",
    answer:
      "Sim, utilizamos Supabase e infraestruturas seguras; todos os dados são armazenados com criptografia e controlos de acesso rigorosos.",
  },
];

export function FaqSection() {
  return (
    <section className="max-w-2xl mx-auto my-12 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="w-full bg-card rounded-xl shadow p-2">
        {faqs.map((faq, idx) => (
          <AccordionItem value={`faq-${idx}`} key={idx}>
            <AccordionTrigger className="text-left text-lg font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default FaqSection;
