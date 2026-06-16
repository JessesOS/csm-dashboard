"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  productConfig,
  productWorkspaces,
  type ProductWorkspace,
} from "../../lib/productWorkspaces";
import type { ProductKey, TrainingVideo, TrainingVideoCreatePayload } from "../../lib/types";

type TrainingTheme = "dark" | "light";
type TrainingMode = "admin" | "client";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function safeTrainingUrl(value: string | null | undefined) {
  const clean = value?.trim() ?? "";
  return /^https?:\/\//i.test(clean) ? clean : "";
}

function loomEmbedUrl(value: string | null | undefined) {
  const url = safeTrainingUrl(value);
  const match = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  return match ? `https://www.loom.com/embed/${match[1]}` : "";
}

function TrainingIcon({
  name,
}: {
  name: "search" | "plus" | "book" | "video" | "play" | "trash" | "settings" | "moon" | "sun" | "arrow";
}) {
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

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (name === "book") {
    return (
      <svg {...common}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
        <path d="M4 5.5A2.5 2.5 0 0 0 6.5 8H20" />
        <path d="M8 12h8" />
        <path d="M8 16h6" />
      </svg>
    );
  }

  if (name === "video") {
    return (
      <svg {...common}>
        <path d="M15 10.5 20 7v10l-5-3.5" />
        <rect x="3" y="6" width="12" height="12" rx="2" />
      </svg>
    );
  }

  if (name === "play") {
    return (
      <svg {...common}>
        <path d="M8 5v14l11-7Z" />
      </svg>
    );
  }

  if (name === "trash") {
    return (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg {...common}>
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
      </svg>
    );
  }

  if (name === "moon") {
    return (
      <svg {...common}>
        <path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5 8.5 8.5 0 1 0 20.5 14.4Z" />
      </svg>
    );
  }

  if (name === "sun") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function productName(product: ProductWorkspace) {
  return `${product.shortLabel} learning library`;
}

export function TrainingRoomPage({
  initialProduct,
  initialVideos,
  mode,
  initialTheme = "dark",
  initialAdminEditing = false,
  backHref = "/",
  backLabel = "Back to Mission Control",
  contextLabel,
  contextDetail,
}: {
  initialProduct: ProductKey;
  initialVideos: TrainingVideo[];
  mode: TrainingMode;
  initialTheme?: TrainingTheme;
  initialAdminEditing?: boolean;
  backHref?: string;
  backLabel?: string;
  contextLabel?: string;
  contextDetail?: string;
}) {
  const [activeProduct, setActiveProduct] = useState<ProductKey>(initialProduct);
  const [videos, setVideos] = useState<TrainingVideo[]>(initialVideos);
  const [theme, setTheme] = useState<TrainingTheme>(initialTheme);
  const [adminEditing, setAdminEditing] = useState(mode === "admin" && initialAdminEditing);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Start here",
    description: "",
    loomUrl: "",
    tags: "",
  });

  const product = productConfig(activeProduct);
  const categories = useMemo(() => Array.from(new Set(videos.map((video) => video.category))).sort(), [videos]);
  const filteredVideos = useMemo(() => {
    const cleanQuery = normalizeText(query);

    return videos.filter((video) => {
      const matchesCategory = categoryFilter === "all" || video.category === categoryFilter;
      const matchesQuery =
        !cleanQuery ||
        normalizeText(video.title).includes(cleanQuery) ||
        normalizeText(video.description).includes(cleanQuery) ||
        video.tags.some((tag) => normalizeText(tag).includes(cleanQuery));

      return matchesCategory && matchesQuery;
    });
  }, [categoryFilter, query, videos]);
  const groupedVideos = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          videos: filteredVideos.filter((video) => video.category === category),
        }))
        .filter((group) => group.videos.length > 0),
    [categories, filteredVideos]
  );

  async function loadProduct(productKey: ProductKey) {
    setActiveProduct(productKey);
    setCategoryFilter("all");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/training?product=${encodeURIComponent(productKey)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not load training room.");
      }

      setVideos(data.videos as TrainingVideo[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load training room.");
    } finally {
      setIsLoading(false);
    }
  }

  async function createTrainingResource(payload: TrainingVideoCreatePayload) {
    const response = await fetch("/api/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, product: activeProduct }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Could not add training lesson.");
    }

    return data.video as TrainingVideo;
  }

  async function submitTrainingVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const video = await createTrainingResource({
        title: form.title,
        category: form.category,
        description: form.description,
        loomUrl: form.loomUrl,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setVideos((current) => [...current.filter((item) => item.id !== video.id), video].sort((a, b) => a.sortOrder - b.sortOrder));
      setForm((current) => ({ ...current, title: "", description: "", loomUrl: "", tags: "" }));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not add training lesson.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteTrainingVideo(video: TrainingVideo) {
    if (!window.confirm(`Delete "${video.title}" from the training room?`)) {
      return;
    }

    setError("");
    try {
      const response = await fetch(`/api/training/${encodeURIComponent(video.id)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete training lesson.");
      }

      setVideos((current) => current.filter((item) => item.id !== video.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete training lesson.");
    }
  }

  return (
    <main className={`training-page-shell training-page-shell-${theme}`}>
      <header className="training-page-topbar">
        <a className="training-page-back" href={backHref}>
          <TrainingIcon name="arrow" />
          {backLabel}
        </a>
        <div className="training-page-actions">
          {mode === "admin" ? (
            <div className="training-product-switcher" aria-label="Training product">
              {productWorkspaces.map((workspace) => (
                <button
                  type="button"
                  key={workspace.key}
                  className={activeProduct === workspace.key ? "active" : ""}
                  onClick={() => loadProduct(workspace.key)}
                >
                  {workspace.shortLabel}
                </button>
              ))}
            </div>
          ) : null}
          <div className="training-theme-toggle" aria-label="Theme mode">
            <button type="button" className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}>
              <TrainingIcon name="moon" />
              Dark
            </button>
            <button type="button" className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}>
              <TrainingIcon name="sun" />
              Light
            </button>
          </div>
          {mode === "admin" ? (
            <button
              type="button"
              className={adminEditing ? "training-admin-toggle active" : "training-admin-toggle"}
              aria-pressed={adminEditing}
              onClick={() => setAdminEditing((current) => !current)}
            >
              <TrainingIcon name="settings" />
              Admin editing {adminEditing ? "on" : "off"}
            </button>
          ) : null}
        </div>
      </header>

      <section className={`training-room training-room-${theme} training-room-page`} aria-label={productName(product)}>
        <header className="training-room-head">
          <div>
            <span className="training-kicker">
              <TrainingIcon name="book" />
              Training room
            </span>
            <h1>{productName(product)}</h1>
            <p>
              {contextLabel
                ? `${contextLabel}${contextDetail ? ` - ${contextDetail}` : ""}`
                : `${videos.length} lessons across ${categories.length || 1} categories.`}
            </p>
          </div>
        </header>

        <div className="training-room-toolbar">
          <div className="search-box training-search">
            <TrainingIcon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search training" />
          </div>
          <select aria-label="Training category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {error ? <div className="storage-notice training-page-notice">{error}</div> : null}

        <div className="training-room-grid">
          <aside className="training-room-side">
            <div className="training-room-stat">
              <span>Lessons</span>
              <strong>{videos.length}</strong>
              <small>{filteredVideos.length} visible</small>
            </div>
            <div className="training-room-stat">
              <span>Categories</span>
              <strong>{categories.length}</strong>
              <small>{product.clientLabel}</small>
            </div>
            {contextLabel ? (
              <div className="training-room-stat training-context-card">
                <span>Portal</span>
                <strong>{contextLabel}</strong>
                {contextDetail ? <small>{contextDetail}</small> : null}
              </div>
            ) : null}

            {mode === "admin" && adminEditing ? (
              <form className="training-add-form" onSubmit={submitTrainingVideo}>
                <div className="inspector-section-title">
                  <TrainingIcon name="plus" />
                  Add Loom
                </div>
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Lesson title"
                  required
                />
                <input
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  placeholder="Category"
                  list="training-page-categories"
                  required
                />
                <datalist id="training-page-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
                <input
                  value={form.loomUrl}
                  onChange={(event) => setForm((current) => ({ ...current, loomUrl: event.target.value }))}
                  placeholder="https://www.loom.com/share/..."
                />
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Short lesson note"
                  rows={4}
                />
                <input
                  value={form.tags}
                  onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                  placeholder="Tags, separated by commas"
                />
                <button type="submit" disabled={isSaving || !form.title.trim()}>
                  <TrainingIcon name="plus" />
                  {isSaving ? "Adding" : "Add lesson"}
                </button>
              </form>
            ) : mode === "admin" ? (
              <div className="training-admin-hint">
                <TrainingIcon name="settings" />
                <span>Admin editing is off</span>
              </div>
            ) : null}
          </aside>

          <section className="training-library" aria-label="Training lessons">
            {isLoading ? <div className="training-empty">Loading training room...</div> : null}
            {!isLoading && filteredVideos.length === 0 ? <div className="training-empty">No lessons found.</div> : null}
            {groupedVideos.map((group, index) => (
              <details
                className="training-category"
                key={group.category}
                open={categoryFilter === "all" || query.trim() ? true : groupedVideos.length === 1 || index === 0}
              >
                <summary>
                  <span>{group.category}</span>
                  <strong>{group.videos.length}</strong>
                </summary>
                <div className="training-card-grid">
                  {group.videos.map((video) => {
                    const embedUrl = loomEmbedUrl(video.loomUrl);

                    return (
                      <article className="training-card" key={video.id}>
                        <div className="training-video-frame">
                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              title={video.title}
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="training-video-placeholder">
                              <TrainingIcon name="video" />
                              <span>Loom pending</span>
                            </div>
                          )}
                        </div>
                        <div className="training-card-body">
                          <div>
                            <span className="training-card-category">{video.category}</span>
                            <h3>{video.title}</h3>
                            {video.description ? <p>{video.description}</p> : null}
                          </div>
                          {video.tags.length > 0 ? (
                            <div className="training-tags">
                              {video.tags.map((tag) => (
                                <span key={tag}>{tag}</span>
                              ))}
                            </div>
                          ) : null}
                          <div className="training-card-actions">
                            {video.loomUrl ? (
                              <a href={video.loomUrl} target="_blank" rel="noreferrer">
                                <TrainingIcon name="play" />
                                Open Loom
                              </a>
                            ) : null}
                            {mode === "admin" && adminEditing ? (
                              <button type="button" onClick={() => deleteTrainingVideo(video)}>
                                <TrainingIcon name="trash" />
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </details>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
