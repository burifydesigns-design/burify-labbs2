"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { siteNavigation } from "@/components/layout/navigation";

const isActive = (pathname: string, href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

export function HomeNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <>
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between" aria-label="Main navigation">
          <Logo variant="default" size="md" />
          <div className="hidden items-center gap-4 xl:flex">
            {siteNavigation.map((item) => {
              const active = isActive(pathname, item.href) || item.children?.some((child) => isActive(pathname, child.href));
              return <div key={item.href} className="group relative">
                <div className="flex items-center gap-1">
                  <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={`py-3 text-nav font-medium transition-colors ${active ? "text-primary" : "text-text-primary hover:text-primary"}`}>{item.label}</Link>
                  {item.children && <svg aria-hidden="true" className={`h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180 ${active ? "text-primary" : "text-text-primary"}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.09 1.032l-4.25 4.5a.75.75 0 01-1.09 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>}
                </div>
                {item.children && <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-2 rounded-xl border border-border bg-background p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children.map((child) => <Link key={child.href} href={child.href} aria-current={pathname === child.href ? "page" : undefined} className={`block rounded-lg px-4 py-3 text-sm transition-colors hover:bg-background-secondary hover:text-primary ${isActive(pathname, child.href) ? "bg-background-secondary font-semibold text-primary" : "text-text-secondary"}`}>{child.label}</Link>)}
                </div>}
              </div>;
            })}
          </div>
          <div className="hidden xl:block"><Button variant="primary" size="sm" href="/contact">Book a Call</Button></div>
          <button onClick={() => setIsOpen(true)} className="rounded-lg p-2 text-text-primary transition-colors hover:bg-primary/5 xl:hidden" aria-label="Open menu" aria-expanded={isOpen} aria-controls="mobile-menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </nav>
      </div>
    </header>
    <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} links={siteNavigation} />
  </>;
}
export default HomeNavigation;
