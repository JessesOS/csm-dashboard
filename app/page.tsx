import RespondDashboard from "./components/RespondDashboard";
import { respondClients } from "../lib/respondClients";
import { categories, seedTasks, teamMembers } from "../lib/respondTasks";

export default function Home() {
  return <RespondDashboard initialTasks={seedTasks} categories={categories} teamMembers={teamMembers} clients={respondClients} />;
}
