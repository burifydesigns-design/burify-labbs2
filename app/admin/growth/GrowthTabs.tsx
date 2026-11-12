"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/growth", label: "Overview" },
  { href: "/admin/growth/plan", label: "90-day plan" },
  { href: "/admin/growth/outreach", label: "Outreach" },
  { href: "/admin/growth/clients", label: "Clients" },
  { href: "/admin/growth/proposals", label: "Proposals" },
  { href: "/admin/growth/settings", label: "Settings" },
];

export default function GrowthTabs({ pending }: { pending: number }) {
  const path = usePathname();
  return <nav className="gw-tabs" aria-label="Growth engine sections">
    {TABS.map(tab => {
      const active = tab.href === "/admin/growth" ? path === tab.href : path.startsWith(tab.href);
      return <Link key={tab.href} href={tab.href} className={"gw-tab" + (active ? " is-active" : "")} aria-current={active ? "page" : undefined}>
        {tab.label}{tab.label === "Outreach" && pending > 0 ? <span className="gw-badge" aria-label={pending + " drafts waiting"}>{pending}</span> : null}
      </Link>;
    })}
  </nav>;
}
