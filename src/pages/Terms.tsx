
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

const Terms = () => (
  <main className="w-full min-h-screen flex items-center justify-center bg-muted/30 py-6">
    <section className="w-full max-w-xl rounded-2xl shadow-lg border border-border bg-card px-2 sm:px-8 py-6 sm:py-10 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2 text-center text-primary tracking-tight">
        Termos &amp; Condições
      </h1>
      <p className="mb-6 text-center text-muted-foreground text-sm">
        Abaixo pode consultar as nossas condições de utilização, políticas de privacidade e cookies.
      </p>

      <Tabs defaultValue="condicoes" className="w-full">
        <TabsList className="w-full flex justify-between mb-6 rounded-lg bg-muted/60 border overflow-hidden">
          <TabsTrigger
            value="condicoes"
            className="flex-1 text-xs sm:text-sm px-0 py-2 rounded-none aria-[selected=true]:bg-background aria-[selected=true]:font-semibold transition"
          >
            Utilização
          </TabsTrigger>
          <TabsTrigger
            value="privacidade"
            className="flex-1 text-xs sm:text-sm px-0 py-2 rounded-none aria-[selected=true]:bg-background aria-[selected=true]:font-semibold transition"
          >
            Privacidade
          </TabsTrigger>
          <TabsTrigger
            value="cookies"
            className="flex-1 text-xs sm:text-sm px-0 py-2 rounded-none aria-[selected=true]:bg-background aria-[selected=true]:font-semibold transition"
          >
            Cookies
          </TabsTrigger>
          <TabsTrigger
            value="alteracoes"
            className="flex-1 text-xs sm:text-sm px-0 py-2 rounded-none aria-[selected=true]:bg-background aria-[selected=true]:font-semibold transition"
          >
            Alterações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="condicoes">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-primary">Condições de Utilização</h2>
            <p className="text-sm text-foreground mb-3">
              Ao aceder e utilizar este site, o utilizador aceita cumprir estes Termos e Condições, bem como todas as leis e regulamentos aplicáveis.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mb-2">
              <li>O acesso é permitido apenas para fins legais e legítimos.</li>
              <li>É proibida a utilização para publicar ou transmitir conteúdos ilícitos, ofensivos, ou que violem direitos de terceiros.</li>
              <li>Reservamo-nos o direito de limitar ou suspender o acesso, sem aviso prévio, caso sejam detetadas violações a estas condições.</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Aconselhamos que consulte regularmente estes Termos para estar sempre atualizado.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="privacidade">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-primary">Política de Privacidade</h2>
            <p className="text-sm text-foreground mb-2">
              Valorizamos e respeitamos a sua privacidade. Os dados pessoais que recolhemos são tratados de acordo com a legislação vigente (RGPD).
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mb-2">
              <li>
                Dados recolhidos: nome, email, e outros necessários à prestação do serviço.
              </li>
              <li>
                Utilização dos dados: apenas para comunicações necessárias e melhoria dos serviços.
              </li>
              <li>
                Não partilhamos dados pessoais com terceiros, exceto obrigatoriedade legal.
              </li>
              <li>
                O utilizador pode solicitar a atualização ou eliminação dos seus dados, bastando contactar-nos.
              </li>
            </ul>
            <div className="mt-3 text-xs text-muted-foreground">
              Esclareça qualquer questão de privacidade ou exerça os seus direitos através do email: <span className="underline">suporte@exemplo.pt</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cookies">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-primary">Política de Cookies</h2>
            <p className="text-sm text-foreground mb-2">
              O nosso site utiliza cookies para garantir o correto funcionamento da plataforma e para melhorar a experiência de navegação.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mb-2">
              <li>
                Cookies essenciais: necessários para funcionalidades básicas.
              </li>
              <li>
                Cookies analíticos: ajudam a entender como utiliza o site, para melhorar funcionalidades e desempenho.
              </li>
              <li>
                Pode, a qualquer momento, configurar o seu navegador para aceitar ou recusar cookies.
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">
              A utilização continuada deste site será considerada como aceitação do uso de cookies, conforme definido nesta política.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="alteracoes">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-primary">Alterações &amp; Contacto</h2>
            <p className="text-sm text-foreground mb-2">
              Reservamo-nos o direito de atualizar, modificar ou substituir qualquer parte destes Termos e Políticas periodicamente. As alterações entram em vigor após publicação nesta página.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mb-2">
              <li>
                Recomenda-se a consulta regular da presente página para se manter sempre informado.
              </li>
              <li>
                O uso continuado do site após alterações será considerado aceitação dos novos termos.
              </li>
              <li>
                Em caso de dúvidas ou para exercer qualquer direito legal, contacte-nos por email.
              </li>
            </ul>
            <div className="mt-3 text-xs text-muted-foreground">
              Email de contacto: <span className="underline">suporte@exemplo.pt</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  </main>
);

export default Terms;
