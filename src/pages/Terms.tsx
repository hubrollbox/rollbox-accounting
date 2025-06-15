
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

const Terms = () => (
  <main className="w-full max-w-xl mx-auto py-8 px-2 sm:px-4">
    <h1 className="text-xl font-semibold mb-4 text-center">Termos &amp; Condições</h1>
    <Tabs defaultValue="condicoes" className="w-full animate-fade-in">
      <TabsList className="w-full flex justify-between mb-4">
        <TabsTrigger value="condicoes" className="flex-1 text-xs sm:text-sm">
          Condições de Utilização
        </TabsTrigger>
        <TabsTrigger value="privacidade" className="flex-1 text-xs sm:text-sm">
          Privacidade
        </TabsTrigger>
        <TabsTrigger value="cookies" className="flex-1 text-xs sm:text-sm">
          Cookies
        </TabsTrigger>
        <TabsTrigger value="alteracoes" className="flex-1 text-xs sm:text-sm">
          Alterações
        </TabsTrigger>
      </TabsList>
      <TabsContent value="condicoes">
        <section>
          <h2 className="text-lg font-medium mb-2">Condições de Utilização</h2>
          <p className="text-sm text-muted-foreground">
            Ao aceder e utilizar este site, o utilizador aceita cumprir e estar vinculado aos presentes Termos e Condições. 
            Se não concordar com os mesmos, por favor, não utilize este serviço.
          </p>
        </section>
      </TabsContent>
      <TabsContent value="privacidade">
        <section>
          <h2 className="text-lg font-medium mb-2">Política de Privacidade</h2>
          <p className="text-sm text-muted-foreground">
            Respeitamos a sua privacidade e protegemos os seus dados pessoais.
            As informações recolhidas são utilizadas para fornecer e melhorar os nossos serviços, 
            nunca sendo partilhadas com terceiros, exceto quando exigido por lei.
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            Para qualquer questão sobre dados pessoais, contacte suporte@exemplo.pt.
          </div>
        </section>
      </TabsContent>
      <TabsContent value="cookies">
        <section>
          <h2 className="text-lg font-medium mb-2">Política de Cookies</h2>
          <p className="text-sm text-muted-foreground">
            Utilizamos cookies para melhorar a experiência do utilizador.
            Pode gerir as preferências de cookies no seu navegador. 
            O uso continuado deste site implica a aceitação da nossa política de cookies.
          </p>
        </section>
      </TabsContent>
      <TabsContent value="alteracoes">
        <section>
          <h2 className="text-lg font-medium mb-2">Alterações &amp; Contacto</h2>
          <p className="text-sm text-muted-foreground">
            Reservamo-nos o direito de atualizar estes termos periodicamente. Recomendamos que os reveja regularmente. 
            O uso continuado do site após alterações será considerado aceitação dos novos termos.
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            Para esclarecimentos, contacte-nos: suporte@exemplo.pt
          </div>
        </section>
      </TabsContent>
    </Tabs>
  </main>
);

export default Terms;

