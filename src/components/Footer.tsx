
import React from "react";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="w-full border-t border-border bg-background text-muted-foreground text-xs flex flex-col sm:flex-row items-center gap-2 justify-between px-4 py-2 fixed bottom-0 left-0 z-30">
    <div>
      <a
        href="/terms"
        className="underline hover:text-primary focus:text-primary transition-colors"
        target="_blank"
        rel="noopener"
      >
        Termos &amp; Condições
      </a>
    </div>
    <div className="flex items-center gap-1">
      Desenvolvido com
      <Heart size={16} className="mx-1 text-red-500 inline" fill="#ef4444" />
      para integrar.
    </div>
  </footer>
);

export default Footer;
