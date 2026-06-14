import RespondDashboard from "./components/RespondDashboard";
import { defaultProduct, productCategories, productClients, productTasks, productTeamMembers } from "../lib/productWorkspaces";

export default function Home() {
  return (
    <RespondDashboard
      initialProduct={defaultProduct}
      initialTasks={productTasks(defaultProduct)}
      initialCategories={productCategories(defaultProduct)}
      initialTeamMembers={productTeamMembers(defaultProduct)}
      initialClients={productClients(defaultProduct)}
    />
  );
}
