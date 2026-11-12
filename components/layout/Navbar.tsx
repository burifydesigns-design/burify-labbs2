"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { MobileMenu } from "./MobileMenu";
import { siteNavigation } from "./navigation";

interface NavbarProps { variant?: "light" | "dark" | "transparent"; showCta?: boolean; }
const isActive = (pathname: string, href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

export function Navbar({ variant = "light", showCta = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const isDark = variant === "dark" || (variant === "transparent" && !isScrolled);
  const background = variant === "transparent" && !isScrolled ? "bg-transparent" : isDark ? "bg-background-dark/95 backdrop-blur-md border-b border-border-dark" : "bg-background/95 backdrop-blur-md border-b border-border";
  const textColor = isDark ? "text-white" : "text-text-primary";
  const activeColor = isDark ? "text-primary-light" : "text-primary";

  return <>
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${background}`}>
      <div className="container">
        <nav className="flex items-center justify-between h-20" aria-label="Main navigation">
          <Logo variant={isDark ? "light" : "default"} size="md" />
          <div className="hidden xl:flex items-center gap-4">
            {siteNavigation.map((item) => {
              const active = isActive(pathname, item.href) || item.children?.some((child) => isActive(pathname, child.href));
              return <div key={item.href} className="relative group">
                <div className="flex items-center gap-1">
                  <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={`text-nav font-medium py-3 transition-colors duration-200 ${active ? activeColor : textColor} hover:${isDark ? "text-primary-light" : "text-primary"}`}>{item.label}</Link>
                  {item.children && <svg aria-hidden="true" className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180 ${active ? activeColor : textColor}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.09 1.032l-4.25 4.5a.75.75 0 01-1.09 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>}
                </div>
                {item.children && <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-2 rounded-xl border border-border bg-background p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children.map((child) => <Link key={child.href} href={child.href} aria-current={pathname === child.href ? "page" : undefined} className={`block rounded-lg px-4 py-3 text-sm transition-colors hover:bg-background-secondary hover:text-primary ${isActive(pathname, child.href) ? "bg-background-secondary font-semibold text-primary" : "text-text-secondary"}`}>{child.label}</Link>)}
                </div>}
              </div>;
            })}
          </div>
          <div className="hidden xl:block">{showCta && <Button variant={isDark ? "outline" : "primary"} size="sm" href="/contact">Book a Call</Button>}</div>
          <button onClick={() => setIsOpen(true)} className={`xl:hidden p-2 rounded-lg transition-colors duration-200 ${isDark ? "text-white hover:bg-white/10" : "text-text-primary hover:bg-primary/5"}`} aria-label="Open menu" aria-expanded={isOpen} aria-controls="mobile-menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </nav>
      </div>
    </header>
    <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} links={siteNavigation} />
  </>;
}
export default Navbar;
