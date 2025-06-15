
import { ProfileUserCard } from "./ProfileUserCard";
import { ProfileStatsCards } from "./ProfileStatsCards";

export const ProfileTabPerfil = () => (
  <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4 w-full">
    {/* No mobile, o ProfileUserCard aparece primeiro, depois estatísticas verticalmente */}
    <ProfileUserCard />
    <ProfileStatsCards />
  </div>
);
