# Deploying the CSM Dashboard

The app deploys as a **Cloudflare Worker** on Jesse's own Cloudflare account
(`jesse@allconvos.ai`). The old Codex Sites pipeline (`.openai/hosting.json`,
`build/sites-vite-plugin.ts`, the `sites` git remote) is **retired** — those
files remain in the repo as legacy only and are not used by the deploy.

## Where it lives

| Thing | Value |
|---|---|
| Live URL | https://csm-dashboard.jesse-b4e.workers.dev |
| Worker name | `csm-dashboard` |
| Database | D1 `csm-dashboard-db` (id `680af23d-f64c-40d0-80f9-da8e258bec25`, region OC) |
| Binding | `env.DB` (declared in `vite.config.ts`, expected by `db/index.ts` and `worker/index.ts`) |
| Source of truth | GitHub `JessesOS/csm-dashboard`, branch `main` |

There is no `wrangler.toml` — the worker config lives inline in
`vite.config.ts` (the `@cloudflare/vite-plugin` `config` object).

## Deploy steps

```bash
cd ~/Master/AI/csm-dashboard
npm install            # first time only
npx wrangler whoami    # confirm you're logged in to the right account
npx vinext deploy      # builds with Vite, uploads assets + worker
```

The deploy prints the live URL and a version id on success.

## Database notes

- **No manual schema or seed step.** On the first request after a deploy the
  app runs `prepareTaskStorage()` (lib/taskStore.ts): it creates all tables,
  seeds demo clients/tasks, and runs any pending data migrations.
- **Data migrations** are triggered by bumping `currentStorageVersion` in
  `lib/taskStore.ts`. If your change should rewrite existing rows (not just
  new seeds), add a `migrate...()` function, call it from
  `prepareTaskStorage()`, and bump the version string.
- Inspect the remote DB: `npx wrangler d1 execute csm-dashboard-db --remote
  --command "SELECT COUNT(*) FROM tasks;"`

## Smoke tests after deploy

```bash
BASE=https://csm-dashboard.jesse-b4e.workers.dev
curl -s -o /dev/null -w "%{http_code}\n" $BASE                       # expect 200
curl -s "$BASE/api/tasks?environment=demo&product=respond&clientId=northlane-health" | head -c 300
# expect JSON with no "error" field; respond demo clients have 53 tasks,
# scale meta_google clients 87 (12 / 22 portal-visible respectively)
```

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `Compatibility flag specified multiple times: nodejs_compat` | vinext injects `nodejs_compat` itself — don't also list it in `vite.config.ts` |
| `D1_ERROR: Wrong number of parameter bindings` | An INSERT's column list and its values array are out of sync in `lib/taskStore.ts` (this exact bug bit `seedClients` once — count both sides) |
| API returns `"error"` + empty tasks | `prepareTaskStorage()` threw mid-seed; check `npx wrangler tail csm-dashboard` while hitting the API |
| Deploy goes to the wrong account | `npx wrangler logout && npx wrangler login`, then `npx wrangler whoami` |

## Local dev

```bash
npm run dev   # vinext dev on http://localhost:3000 (port is fixed)
```

Local D1 state lives in `.wrangler/state/`; delete that directory to test a
cold-start seed from scratch.
