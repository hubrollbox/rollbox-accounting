
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
      "Sim! Você pode importar clientes em formato CSV. Basta aceder à área de Clientes e utilizar a opção de importação.",
  },
  {
    question: "Como adicionar um novo utilizador à minha empresa?",
    answer:
      "Aceda ao menu de configurações no perfil da empresa e escolha 'Gerir utilizadores'. Lá pode convidar novos membros e definir permissões.",
  },
  {
    question: "As minhas informações estão seguras?",
    answer:
      "Sim, utilizamos Supabase e infraestruturas seguras; todos os dados são armazenados com criptografia e controlos de acesso rigorosos.",
  },
  {
    question: "Como obtenho suporte técnico em caso de problemas?",
    answer:
      "Deve contactar o nosso suporte pelo email ou chat disponível na área de ajuda. Respondemos normalmente em menos de 24 horas úteis.",
  },
  {
    question: "É possível integrar com outros sistemas ou plataformas?",
    answer:
      "Sim! Disponibilizamos integrações com plataformas de e-commerce, contabilidade e bancos. Consulte a área de Integrações no menu do utilizador.",
  },
  {
    question: "Como exporto as minhas faturas para SAFT-PT?",
    answer:
      "Aceda à área de Relatórios, selecione 'Exportar SAFT-PT' e siga as instruções para gerar o ficheiro conforme regras da AT.",
  },
  {
    question: "O que devo fazer se me esquecer da password?",
    answer:
      "Utilize a opção 'Esqueci-me da password' na página de login. Receberá um email para recuperar o seu acesso com toda a segurança.",
  },
  {
    question: "Como funciona a assinatura digital das faturas?",
    answer:
      "Cada fatura é assinada digitalmente antes do envio para a AT. O sistema utiliza um processo automático, garantindo o encadeamento e autenticidade conforme legislação.",
  },
  {
    question: "Que navegadores e dispositivos são suportados?",
    answer:
      "O sistema suporta os principais navegadores modernos (Chrome, Edge, Firefox, Safari) e adapta-se a qualquer dispositivo desktop, tablet ou mobile.",
  },
  {
    question: "O que acontece se a internet falhar enquanto estiver a emitir uma fatura?",
    answer:
      "Se perder a ligação, nenhuma fatura será emitida até que a ligação seja restabelecida. Deve guardar rascunhos e repetir o envio assim que possível.",
  },
  {
    question: "Posso cancelar ou emitir uma nota de crédito sobre uma fatura já emitida?",
    answer:
      "Sim. Aceda à lista de faturas, selecione a fatura pretendida e utilize a opção de cancelar ou emitir uma nota de crédito, cumprindo requisitos legais.",
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
