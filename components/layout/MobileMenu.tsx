"use client";

import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import type { SiteNavLink } from "./navigation";

interface MobileMenuProps { isOpen: boolean; onClose: () => void; links: SiteNavLink[]; }
const isActive = (pathname: string, href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef("");
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const getFocusableElements = useCallback(() => {
    if (!menuRef.current) return [];
    return Array.from(menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  }, []);
  const handleEscape = useCallback((event: KeyboardEvent) => { if (event.key === "Escape") onCloseRef.current(); }, []);
  const handleTab = useCallback((event: KeyboardEvent) => {
    if (!isOpen || !menuRef.current) return;
    const focusable = getFocusableElements();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, [isOpen, getFocusableElements]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      previousOverflowRef.current = document.body.style.overflow;
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTab);
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = previousOverflowRef.current;
      if (isOpen) previousFocusRef.current?.focus();
    };
  }, [isOpen, handleEscape, handleTab]);

  if (!isOpen) return null;
  return <div id="mobile-menu" className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
    <button className="absolute inset-0 h-full w-full cursor-default bg-background-dark/80 backdrop-blur-sm" onClick={onClose} aria-label="Close navigation overlay" tabIndex={-1} />
    <div ref={menuRef} className="absolute right-0 top-0 flex h-full min-h-0 w-full max-w-sm flex-col border-l border-border-dark bg-background-dark pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between border-b border-border-dark px-6 py-5">
        <span className="text-xl font-bold text-white"><span className="text-primary">BURI</span>FY LABS</span>
        <button ref={closeButtonRef} onClick={onClose} className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close menu">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5" aria-label="Mobile navigation">
        {links.map((link) => <div key={link.href} className="py-1">
          <Link href={link.href} onClick={onClose} aria-current={pathname === link.href ? "page" : undefined} className={`flex items-center justify-between rounded-lg px-3 py-3 text-base font-semibold transition-colors hover:bg-white/5 hover:text-white ${isActive(pathname, link.href) ? "bg-white/10 text-primary-light" : "text-white/85"}`}>
            {link.label}<span aria-hidden="true" className="text-white/35">→</span>
          </Link>
          {link.children && <div className="ml-3 mt-1 space-y-1 border-l border-white/15 pl-3">
            {link.children.map((child) => <Link key={child.href} href={child.href} onClick={onClose} aria-current={pathname === child.href ? "page" : undefined} className={`block rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-white ${isActive(pathname, child.href) ? "font-semibold text-primary-light" : "text-white/65"}`}>{child.label}</Link>)}
          </div>}
        </div>)}
      </nav>
      <div className="border-t border-border-dark p-6">
        <p className="mb-3 text-sm text-white/60">Have a project in mind?</p>
        <Button variant="primary" size="lg" fullWidth href="/contact">Book a Strategy Call</Button>
      </div>
    </div>
  </div>;
}
export default MobileMenu;
