
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";

/**
 * Componente invisível só para disparar SidebarTrigger (por evento custom)
 * Usado no mobile para acionar o Drawer via evento global.
 */
export function SidebarTriggerMobile() {
  const elRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && elRef.current) {
      window.__lovableSidebarTrigger__ = () => {
        elRef.current?.click();
      };
      // Listener para evento customizado
      const handler = () => elRef.current?.click();
      window.addEventListener("openSidebarMobile", handler);
      return () => {
        window.removeEventListener("openSidebarMobile", handler);
        // Clean up para evitar problemas de memo vazando
        delete window.__lovableSidebarTrigger__;
      };
    }
  }, []);

  return (
    <span
      className="hidden"
      id="trigger-sidebar-mobile"
      aria-hidden="true"
      ref={elRef}
    >
      <SidebarTrigger style={{ display: "none" }} />
    </span>
  );
}
