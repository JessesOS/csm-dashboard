import RespondDashboard from "./components/RespondDashboard";
import {
  defaultProduct,
  environmentProductClients,
  productCategories,
  productTeamMembers,
} from "../lib/productWorkspaces";
import type { EnvironmentKey } from "../lib/types";

// The dashboard opens on Live (2026-10-15); Demo is under Settings → Mode.
// No seeded preview tasks for Live: the board loads the real client's tasks
// from the database (a template shown under a real client would be wrong).
const startEnvironment: EnvironmentKey = "live";

export default function Home() {
  return (
    <RespondDashboard
      initialEnvironment={startEnvironment}
      initialProduct={defaultProduct}
      initialTasks={[]}
      initialCategories={productCategories(defaultProduct)}
      initialTeamMembers={productTeamMembers(defaultProduct)}
      initialClients={environmentProductClients(startEnvironment, defaultProduct)}
    />
  );
}
