
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";

/**
 * Componente invisível só para disparar SidebarTrigger (por evento custom)
 * Usado no mobile para acionar o Drawer via evento global.
 */
export function SidebarTriggerMobile() {
  const elRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // Protege para ambientes SSR/strict mode
    if (typeof window === "undefined" || !elRef.current) return;

    const triggerFn = () => {
      elRef.current?.click();
    };
    window.__lovableSidebarTrigger__ = triggerFn;

    // Listener para evento customizado
    const handler = () => {
      elRef.current?.click();
    };
    window.addEventListener("openSidebarMobile", handler);

    // Log para debug
    console.log("[SidebarTriggerMobile] registrado!");

    return () => {
      window.removeEventListener("openSidebarMobile", handler);
      delete window.__lovableSidebarTrigger__;
      console.log("[SidebarTriggerMobile] desmontado e listeners limpos");
    };
  }, [elRef]);

  return (
    <span
      className="hidden"
      id="trigger-sidebar-mobile"
      aria-hidden="true"
      ref={elRef}
      // Log em render apenas para garantir que monta corretamente
      data-debug="sidebar-trigger-mobile"
    >
      <SidebarTrigger style={{ display: "none" }} />
    </span>
  );
}
