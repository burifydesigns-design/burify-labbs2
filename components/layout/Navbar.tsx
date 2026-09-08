"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { MobileMenu } from "./MobileMenu";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  variant?: "light" | "dark" | "transparent";
  showCta?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function Navbar({ variant = "light", showCta = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = variant === "transparent";
  const isDark = variant === "dark";

  const getBackgroundStyles = () => {
    if (isTransparent && !isScrolled) {
      return "bg-transparent";
    }
    if (isDark || isScrolled) {
      return "bg-background-dark/95 backdrop-blur-md border-b border-border-dark";
    }
    return "bg-background/95 backdrop-blur-md border-b border-border";
  };

  const getTextColor = () => {
    if (isDark || isScrolled) {
      return "text-white";
    }
    return "text-text-primary";
  };

  const getLinkHoverColor = () => {
    if (isDark || isScrolled) {
      return "hover:text-primary-light";
    }
    return "hover:text-primary";
  };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-300 ease-out
          ${getBackgroundStyles()}
        `}
      >
        <div className="container">
          <nav className="flex items-center justify-between h-20" aria-label="Main navigation">
            <Logo variant={isDark || isScrolled ? "light" : "default"} size="md" />

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-nav font-medium
                    transition-colors duration-200
                    ${getTextColor()} ${getLinkHoverColor()}
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:block">
              {showCta && (
                <Button variant={isDark || isScrolled ? "outline" : "primary"} size="sm" href="/contact">
                  Start a Project
                </Button>
              )}
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className={`
                lg:hidden p-2
                rounded-lg
                transition-colors duration-200
                ${isDark || isScrolled ? "text-white hover:bg-white/10" : "text-text-primary hover:bg-primary/5"}
              `}
              aria-label="Open menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        links={navLinks}
      />
    </>
  );
}

export default Navbar;
