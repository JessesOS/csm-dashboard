"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Category, Task, TaskStatus, TaskUpdatePayload } from "../../lib/types";
import { statusLabels, taskStatuses } from "../../lib/types";

interface DashboardProps {
  initialTasks: Task[];
  categories: Category[];
  teamMembers: string[];
}

const phaseOrder = ["Onboarding", "Build", "Testing", "Go-Live", "Post-Launch", "Support"];

function Icon({ name }: { name: "search" | "filter" | "plus" | "check" | "link" | "user" | "calendar" | "move" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  if (name === "filter") {
    return (
      <svg {...common}>
        <path d="M4 5h16" />
        <path d="M7 12h10" />
        <path d="M10 19h4" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "link") {
    return (
      <svg {...common}>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.2-1.2" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg {...common}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3v18" />
      <path d="m8 7 4-4 4 4" />
      <path d="m8 17 4 4 4-4" />
      <path d="M3 12h18" />
      <path d="m7 8-4 4 4 4" />
      <path d="m17 8 4 4-4 4" />
    </svg>
  );
}

function initials(name: string) {
  if (name === "Unassigned") {
    return "--";
  }

  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getDependencyState(task: Task, taskMap: Map<string, Task>) {
  const dependencies = task.dependencies.map((id) => taskMap.get(id)).filter((item): item is Task => Boolean(item));
  const open = dependencies.filter((item) => item.status !== "complete");

  return {
    dependencies,
    open,
    isBlockedByDependencies: open.length > 0,
  };
}

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function useFilteredTasks(tasks: Task[], query: string, category: string, owner: string, status: string) {
  return useMemo(() => {
    const text = normalizeText(query);

    return tasks.filter((task) => {
      const matchesText =
        !text ||
        normalizeText(task.title).includes(text) ||
        normalizeText(task.category).includes(text) ||
        normalizeText(task.assignee).includes(text);
      const matchesCategory = category === "all" || task.category === category;
      const matchesOwner = owner === "all" || task.assignee === owner;
      const matchesStatus = status === "all" || task.status === status;

      return matchesText && matchesCategory && matchesOwner && matchesStatus;
    });
  }, [tasks, query, category, owner, status]);
}

function TaskCard({
  task,
  taskMap,
  active,
  onSelect,
  onQuickMove,
  onDragStart,
}: {
  task: Task;
  taskMap: Map<string, Task>;
  active: boolean;
  onSelect: (task: Task) => void;
  onQuickMove: (task: Task, status: TaskStatus) => void;
  onDragStart: (task: Task) => void;
}) {
  const dependencyState = getDependencyState(task, taskMap);
  const isDone = task.status === "complete";

  return (
    <article
      className={`task-card ${active ? "task-card-active" : ""}`}
      draggable
      onDragStart={() => onDragStart(task)}
      onClick={() => onSelect(task)}
    >
      <div className="task-card-topline">
        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
        <span className="drag-handle" title="Drag to move status">
          <Icon name="move" />
        </span>
      </div>
      <h3>{task.title}</h3>
      <div className="task-meta-line">
        <span>{task.category}</span>
      </div>
      <div className="task-card-footer">
        <span className="avatar" title={task.assignee}>
          {initials(task.assignee)}
        </span>
        <span className="mini-meta" title="Due window">
          <Icon name="calendar" />
          {task.dueWindow || "No date"}
        </span>
        <span className={`dependency-chip ${dependencyState.isBlockedByDependencies ? "dependency-open" : ""}`}>
          <Icon name="link" />
          {dependencyState.dependencies.length}
        </span>
      </div>
      <div className="task-actions" onClick={(event) => event.stopPropagation()}>
        {isDone ? (
          <button type="button" onClick={() => onQuickMove(task, "review")} title="Move back to review">
            Review
          </button>
        ) : (
          <button type="button" onClick={() => onQuickMove(task, "complete")} title="Mark complete">
            <Icon name="check" />
            Done
          </button>
        )}
        {dependencyState.isBlockedByDependencies && task.status !== "blocked" ? (
          <button type="button" onClick={() => onQuickMove(task, "blocked")} title="Mark blocked">
            Block
          </button>
        ) : null}
      </div>
    </article>
  );
}

function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

export default function RespondDashboard({ initialTasks, categories, teamMembers }: DashboardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedId, setSelectedId] = useState(initialTasks[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"board" | "categories">("board");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState(categories[0]?.name ?? "");
  const [storageNotice, setStorageNotice] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    fetch("/api/tasks", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load task storage.");
        }
        return data.tasks as Task[];
      })
      .then((remoteTasks) => {
        if (!active || remoteTasks.length === 0) {
          return;
        }
        setTasks(remoteTasks);
        setSelectedId((current) => current || remoteTasks[0]?.id || "");
        setStorageNotice("");
      })
      .catch((error: Error) => {
        if (active) {
          setStorageNotice(error.message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const taskMap = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const selectedTask = tasks.find((task) => task.id === selectedId) ?? tasks[0];
  const filteredTasks = useFilteredTasks(tasks, query, categoryFilter, ownerFilter, statusFilter);

  const metrics = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "complete").length;
    const blocked = tasks.filter((task) => task.status === "blocked" || getDependencyState(task, taskMap).isBlockedByDependencies).length;
    const active = tasks.filter((task) => task.status === "in_progress" || task.status === "review").length;
    const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    return {
      completed,
      blocked,
      active,
      percent,
    };
  }, [tasks, taskMap]);

  const categoryStats = useMemo(
    () =>
      categories.map((category) => {
        const categoryTasks = tasks.filter((task) => task.category === category.name);
        const complete = categoryTasks.filter((task) => task.status === "complete").length;
        return {
          ...category,
          total: categoryTasks.length,
          complete,
          percent: categoryTasks.length > 0 ? Math.round((complete / categoryTasks.length) * 100) : 0,
        };
      }),
    [categories, tasks]
  );

  async function persistTask(id: string, payload: TaskUpdatePayload) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Task update failed.");
    }

    return data.task as Task;
  }

  function updateTask(id: string, payload: TaskUpdatePayload) {
    const previous = tasks;
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const nextCategory = payload.category ? categories.find((category) => category.name === payload.category) : null;
        return {
          ...task,
          ...payload,
          phase: nextCategory?.phase ?? payload.phase ?? task.phase,
        };
      })
    );

    startTransition(() => {
      persistTask(id, payload)
        .then((remoteTask) => {
          setTasks((current) => current.map((task) => (task.id === id ? remoteTask : task)));
          setStorageNotice("");
        })
        .catch((error: Error) => {
          setTasks(previous);
          setStorageNotice(error.message);
        });
    });
  }

  function moveTask(task: Task, status: TaskStatus) {
    updateTask(task.id, { status });
  }

  async function addTask() {
    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    const tempTask: Task = {
      id: `draft-${Date.now()}`,
      title,
      category: newTaskCategory,
      phase: categories.find((category) => category.name === newTaskCategory)?.phase ?? "Onboarding",
      status: "queued",
      assignee: "Unassigned",
      dueWindow: "",
      priority: "normal",
      dependencies: [],
      notes: "",
      sortOrder: tasks.length + 1,
    };

    setTasks((current) => [...current, tempTask]);
    setSelectedId(tempTask.id);
    setNewTaskTitle("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category: newTaskCategory }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not create task.");
      }
      setTasks((current) => current.map((task) => (task.id === tempTask.id ? data.task : task)));
      setSelectedId(data.task.id);
      setStorageNotice("");
    } catch (error) {
      setTasks((current) => current.filter((task) => task.id !== tempTask.id));
      setStorageNotice(error instanceof Error ? error.message : "Could not create task.");
    }
  }

  const statusTasks = useMemo(
    () =>
      taskStatuses.map((status) => ({
        status,
        tasks: filteredTasks.filter((task) => task.status === status),
      })),
    [filteredTasks]
  );

  return (
    <main className="dashboard-shell">
      <aside className="side-rail">
        <div className="brand">
          <span className="brand-mark">R</span>
          <div>
            <strong>Respond CSM</strong>
            <span>Onboarding & delivery</span>
          </div>
        </div>
        <nav className="phase-nav" aria-label="Task categories">
          {phaseOrder.map((phase) => {
            const phaseCategories = categoryStats.filter((category) => category.phase === phase);
            return (
              <div key={phase} className="phase-group">
                <span className="phase-label">{phase}</span>
                {phaseCategories.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    className={categoryFilter === category.name ? "category-link active" : "category-link"}
                    onClick={() => setCategoryFilter(categoryFilter === category.name ? "all" : category.name)}
                  >
                    <span className="category-dot" style={{ background: category.accent }} />
                    <span>{category.name}</span>
                    <strong>{category.complete}/{category.total}</strong>
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>Respond workflow board</h1>
            <p>{tasks.length} operational tasks from the master CSM checklist</p>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Icon name="search" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, owners, categories" />
            </div>
            <button className="icon-button" type="button" title="Clear filters" onClick={() => {
              setCategoryFilter("all");
              setOwnerFilter("all");
              setStatusFilter("all");
              setQuery("");
            }}>
              <Icon name="filter" />
            </button>
          </div>
        </header>

        <section className="command-strip">
          <Metric label="Progress" value={`${metrics.percent}%`} detail={`${metrics.completed} of ${tasks.length} complete`} />
          <Metric label="Active" value={metrics.active} detail="In progress or review" />
          <Metric label="Waiting" value={metrics.blocked} detail="Open dependencies or holds" />
          <Metric label="Categories" value={categories.length} detail="Onboarding to support" />
          <div className="new-task">
            <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="Add a custom task" />
            <select value={newTaskCategory} onChange={(event) => setNewTaskCategory(event.target.value)}>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={addTask} disabled={!newTaskTitle.trim()}>
              <Icon name="plus" />
              Add
            </button>
          </div>
        </section>

        <section className="filters-row" aria-label="Dashboard filters">
          <div className="segmented">
            <button type="button" className={view === "board" ? "active" : ""} onClick={() => setView("board")}>Board</button>
            <button type="button" className={view === "categories" ? "active" : ""} onClick={() => setView("categories")}>Categories</button>
          </div>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <select aria-label="Filter by owner" value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
            <option value="all">All owners</option>
            {teamMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </section>

        {storageNotice ? <div className="storage-notice">{storageNotice}</div> : null}

        {view === "board" ? (
          <section className="board" aria-label="Task workflow board">
            {statusTasks.map(({ status, tasks: columnTasks }) => (
              <div
                key={status}
                className="board-column"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggedTask) {
                    moveTask(draggedTask, status);
                    setDraggedTask(null);
                  }
                }}
              >
                <div className="column-header">
                  <strong>{statusLabels[status]}</strong>
                  <span>{columnTasks.length}</span>
                </div>
                <div className="column-scroll">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      taskMap={taskMap}
                      active={selectedTask?.id === task.id}
                      onSelect={(item) => setSelectedId(item.id)}
                      onQuickMove={moveTask}
                      onDragStart={setDraggedTask}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="category-view" aria-label="Task categories">
            {categoryStats.map((category) => {
              const rows = filteredTasks.filter((task) => task.category === category.name);
              return (
                <article key={category.id} className="category-panel">
                  <div className="category-panel-head">
                    <span className="category-dot" style={{ background: category.accent }} />
                    <div>
                      <strong>{category.name}</strong>
                      <span>{category.phase}</span>
                    </div>
                    <progress value={category.percent} max="100" aria-label={`${category.name} progress`} />
                    <b>{category.percent}%</b>
                  </div>
                  <div className="category-task-list">
                    {rows.slice(0, 10).map((task) => (
                      <button type="button" key={task.id} onClick={() => setSelectedId(task.id)}>
                        <span>{task.title}</span>
                        <em>{statusLabels[task.status]}</em>
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>

      <aside className="inspector">
        {selectedTask ? (
          <>
            <div className="inspector-head">
              <span className={`priority priority-${selectedTask.priority}`}>{selectedTask.priority}</span>
              <h2>{selectedTask.title}</h2>
              <p>{selectedTask.category}</p>
            </div>

            <label>
              Status
              <div className="status-grid">
                {taskStatuses.map((status) => (
                  <button
                    type="button"
                    key={status}
                    className={selectedTask.status === status ? "active" : ""}
                    onClick={() => updateTask(selectedTask.id, { status })}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </label>

            <label>
              Assignee
              <select aria-label="Assignee" value={selectedTask.assignee} onChange={(event) => updateTask(selectedTask.id, { assignee: event.target.value })}>
                {teamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Category
              <select aria-label="Category" value={selectedTask.category} onChange={(event) => updateTask(selectedTask.id, { category: event.target.value })}>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Due window
              <input aria-label="Due window" value={selectedTask.dueWindow} onChange={(event) => updateTask(selectedTask.id, { dueWindow: event.target.value })} />
            </label>

            <label>
              Notes
              <textarea aria-label="Notes" value={selectedTask.notes} onChange={(event) => updateTask(selectedTask.id, { notes: event.target.value })} placeholder="Add context for the team" />
            </label>

            <div className="dependency-list">
              <div className="inspector-section-title">
                <Icon name="link" />
                Dependencies
              </div>
              {selectedTask.dependencies.length === 0 ? (
                <p>No dependencies attached.</p>
              ) : (
                selectedTask.dependencies.map((id) => {
                  const dependency = taskMap.get(id);
                  return (
                    <button type="button" key={id} onClick={() => dependency && setSelectedId(dependency.id)}>
                      <span>{dependency?.title ?? id}</span>
                      <em>{dependency ? statusLabels[dependency.status] : "Missing"}</em>
                    </button>
                  );
                })
              )}
            </div>

            <div className="inspector-footer">
              <span className={isPending ? "saving active" : "saving"}>{isPending ? "Saving" : "Saved"}</span>
              <button type="button" onClick={() => updateTask(selectedTask.id, { status: "complete" })}>
                <Icon name="check" />
                Complete
              </button>
            </div>
          </>
        ) : null}
      </aside>
    </main>
  );
}
