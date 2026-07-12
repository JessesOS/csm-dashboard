import vinext from "vinext";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

// Deploys to Jesse's own Cloudflare account (JessesOS). The old Codex Sites
// control plane (.openai/hosting.json + build/sites-vite-plugin) is retired;
// those files remain in the repo as legacy only and are no longer used.
const workerConfig = {
  name: "csm-dashboard",
  main: "./worker/index.ts",
  compatibility_date: "2026-06-01",
  // nodejs_compat is injected by vinext automatically — declaring it here too
  // makes the Cloudflare API reject the upload as a duplicate flag.
  d1_databases: [
    {
      binding: "DB",
      database_name: "csm-dashboard-db",
      database_id: "680af23d-f64c-40d0-80f9-da8e258bec25",
    },
  ],
};

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      config: workerConfig,
    }),
  ],
});
