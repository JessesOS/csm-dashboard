import type { RespondClient } from "./types";

// BSS product seed clients. Demo holds one walkthrough client so the 41-task
// template renders for internal review; the real Fin Creighton client is created
// in the Live workspace via admin "New client" when Jesse is ready to send his
// portal link (not auto-seeded, matching how other live clients are created).
export const bssClients: RespondClient[] = [
  {
    id: "bss-fin-creighton-demo",
    environment: "demo",
    product: "bss",
    name: "Fin Creighton",
    companyName: "Bitcoin Success School",
    code: "BSS",
    industry: "Education / Coaching",
    owner: "Jesse Allan",
    phase: "Onboarding",
    health: "on_track",
    progress: 0,
    currentTask: "Voice interview — intake",
    goLiveDate: "",
    goLiveLabel: "~Week 6",
    lastUpdate: "",
    nextStep: "Complete the intake interview",
    blocker: "None",
    risk: "low",
    activeTasks: 41,
    completedTasks: 0,
    timeline: [
      {
        label: "Onboard, map & evaluate",
        phase: "Onboarding",
        startDay: 0,
        span: 14,
        status: "on_track",
        marker: "milestone",
      },
    ],
    attention: [],
  },
];
