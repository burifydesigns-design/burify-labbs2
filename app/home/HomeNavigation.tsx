"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function HomeNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-300 ease-out
          ${isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"}
        `}
      >
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20" aria-label="Main navigation">
            <Logo
              variant={isScrolled ? "default" : "default"}
              size="md"
            />

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    text-nav font-medium
                    transition-colors duration-200
                    text-text-primary hover:text-primary
                  "
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:block">
              <Button variant="primary" size="sm" href="/contact">
                Start a Project
              </Button>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-lg text-text-primary hover:bg-primary/5 transition-colors"
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

export default HomeNavigation;
