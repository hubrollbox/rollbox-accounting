import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  Hash,
  Users,
  Truck,
  Euro,
  Package,
  FileText,
  Calculator,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    value: "dashboard",
    icon: Hash,
  },
  {
    title: "Clientes",
    value: "clients",
    icon: Users,
  },
  {
    title: "Fornecedores",
    value: "suppliers",
    icon: Truck,
  },
  {
    title: "Artigos",
    value: "products",
    icon: Euro,
  },
  {
    title: "Stock",
    value: "stock",
    icon: Package,
  },
  {
    title: "Faturação",
    value: "invoicing",
    icon: FileText,
  },
  {
    title: "Contabilidade",
    value: "accounting",
    icon: Calculator,
  },
  {
    title: "Integrações",
    value: "integrations",
    icon: Settings,
  }
];

export function AppSidebar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeTab === item.value}
                    onClick={() => onTabChange(item.value)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="truncate">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
