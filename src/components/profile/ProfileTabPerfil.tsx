
import { ProfileUserCard } from "./ProfileUserCard";
import { ProfileStatsCards } from "./ProfileStatsCards";

export const ProfileTabPerfil = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <ProfileUserCard />
    <ProfileStatsCards />
  </div>
);
