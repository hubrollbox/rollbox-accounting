
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profileStats = [
  { label: "Faturas Emitidas", value: "89", color: "text-blue-600" },
  { label: "Clientes Ativos", value: "23", color: "text-green-600" },
  { label: "Produtos", value: "45", color: "text-purple-600" },
  { label: "Valor Total", value: "€12,450", color: "text-orange-600" },
];

export const ProfileStatsCards = () => (
  <div className="col-span-2 grid grid-cols-2 md:grid-cols-2 gap-4 content-between">
    {profileStats.map((stat, index) => (
      <Card key={index} className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wide">{stat.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
