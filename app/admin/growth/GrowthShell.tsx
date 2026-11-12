import Link from "next/link";
import "./growth.css";
import GrowthTabs from "./GrowthTabs";
import { signOut } from "../actions";

export default function GrowthShell({ title, eyebrow, email, pending, children }: {
  title: string; eyebrow: string; email?: string | null; pending: number; children: React.ReactNode;
}) {
  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/">BURIFY<span>LABS</span></Link>
      <p className="admin-side-label">WORKSPACE</p>
      <Link className="admin-nav" href="/admin">Overview</Link>
      <Link className="admin-nav" href="/admin/crm">Prospect CRM</Link>
      <Link className="admin-nav active" href="/admin/growth">Growth engine</Link>
      <Link className="admin-nav" href="/admin/work">Work / portfolio</Link>
      <Link className="admin-nav" href="/admin/blog">Blog management</Link>
      <Link className="admin-nav" href="/admin/analytics">Analytics</Link>
      <Link className="admin-nav" href="/admin/payments">Payments</Link>
      <div className="admin-sidebar-bottom"><span className="admin-avatar">{(email?.[0] ?? "A").toUpperCase()}</span><div><strong>Administrator</strong><small>{email}</small></div></div>
    </aside>
    <section className="admin-main gw-main">
      <header className="admin-topbar">
        <div><p className="admin-eyebrow">{eyebrow}</p><h1>{title}</h1></div>
        <form action={signOut}><button className="admin-logout" type="submit">Sign out</button></form>
      </header>
      <GrowthTabs pending={pending} />
      {children}
      <footer className="admin-footer">Burify Labs · Private administrator workspace</footer>
    </section>
  </main>;
}
