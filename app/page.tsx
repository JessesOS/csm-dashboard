import RespondDashboard from "./components/RespondDashboard";
import {
  defaultEnvironment,
  defaultProduct,
  environmentProductClients,
  productCategories,
  productTasks,
  productTeamMembers,
} from "../lib/productWorkspaces";

export default function Home() {
  return (
    <RespondDashboard
      initialEnvironment={defaultEnvironment}
      initialProduct={defaultProduct}
      initialTasks={productTasks(defaultProduct)}
      initialCategories={productCategories(defaultProduct)}
      initialTeamMembers={productTeamMembers(defaultProduct)}
      initialClients={environmentProductClients(defaultEnvironment, defaultProduct)}
    />
  );
}
