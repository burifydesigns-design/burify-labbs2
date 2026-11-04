"use client";

import { useEffect, useMemo, useState } from "react";

const destinations = [
  { label: "Overview", href: "/admin" },
  { label: "Lead pipeline", href: "/admin#leads" },
  { label: "Contact inbox", href: "/admin#contacts" },
  { label: "User management", href: "/admin#users" },
  { label: "Work / portfolio", href: "/admin/work" },
  { label: "Blog management", href: "/admin/blog" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Payments", href: "/admin/payments" },
];

export default function AdminControls() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("burify-admin-theme");
    const initial = stored === "light" || stored === "dark"
      ? stored
      : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.adminTheme = initial;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(value => !value);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => destinations.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.adminTheme = next;
    window.localStorage.setItem("burify-admin-theme", next);
  }

  function toggleMobileMenu() {
    document.querySelector(".admin-shell")?.classList.toggle("admin-menu-open");
  }

  return <>
    <div className="admin-toolbar-actions">
      <button className="admin-icon-button admin-mobile-menu" type="button" onClick={toggleMobileMenu} aria-label="Open navigation">☰</button>
      <button className="admin-command-trigger" type="button" onClick={() => setPaletteOpen(true)}><span>⌕</span><span>Search workspace</span><kbd>⌘ K</kbd></button>
      <button className="admin-icon-button" type="button" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={toggleTheme}>{theme === "dark" ? "☼" : "☾"}</button>
    </div>
    {paletteOpen && <div className="admin-command-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPaletteOpen(false); }}>
      <section className="admin-command-dialog" role="dialog" aria-modal="true" aria-label="Workspace navigation">
        <label className="admin-command-search"><span>⌕</span><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search pages and sections..." /></label>
        <div className="admin-command-results">{filtered.map(item => <a key={item.href} href={item.href} onClick={() => setPaletteOpen(false)}>{item.label}<span>↗</span></a>)}
          {filtered.length === 0 && <p>No matching destinations.</p>}
        </div>
        <footer><span>Navigate</span><span>ESC to close</span></footer>
      </section>
    </div>}
  </>;
}
