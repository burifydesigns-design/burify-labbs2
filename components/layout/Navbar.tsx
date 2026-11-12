"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { MobileMenu } from "./MobileMenu";

interface NavLink { label: string; href: string; }
interface NavbarProps { variant?: "light" | "dark" | "transparent"; showCta?: boolean; }

const navLinks: NavLink[] = [
  { label: "Patient Growth", href: "/patient-growth" },
  { label: "Industries", href: "/industries" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

export function Navbar({ variant = "light", showCta = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const isDark = variant === "dark" || (variant === "transparent" && !isScrolled);
  const background = variant === "transparent" && !isScrolled ? "bg-transparent" : isDark ? "bg-background-dark/95 backdrop-blur-md border-b border-border-dark" : "bg-background/95 backdrop-blur-md border-b border-border";
  const textColor = isDark ? "text-white" : "text-text-primary";
  const hoverColor = isDark ? "hover:text-primary-light" : "hover:text-primary";

  return <>
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${background}`}>
      <div className="container">
        <nav className="flex items-center justify-between h-20" aria-label="Main navigation">
          <Logo variant={isDark ? "light" : "default"} size="md" />
          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => <Link key={link.href} href={link.href} className={`text-nav font-medium transition-colors duration-200 ${textColor} ${hoverColor}`}>{link.label}</Link>)}
          </div>
          <div className="hidden xl:block">{showCta && <Button variant={isDark ? "outline" : "primary"} size="sm" href="/contact">Book a Call</Button>}</div>
          <button onClick={() => setIsOpen(true)} className={`xl:hidden p-2 rounded-lg transition-colors duration-200 ${isDark ? "text-white hover:bg-white/10" : "text-text-primary hover:bg-primary/5"}`} aria-label="Open menu" aria-expanded={isOpen} aria-controls="mobile-menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </nav>
      </div>
    </header>
    <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} links={navLinks} />
  </>;
}
export default Navbar;
