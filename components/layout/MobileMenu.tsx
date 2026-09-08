"use client";

import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const getFocusableElements = useCallback(() => {
    if (!menuRef.current) return [];
    return Array.from(
      menuRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onCloseRef.current();
    }
  }, []);

  const handleTab = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !menuRef.current) return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0] as HTMLElement;
      const lastElement = focusable[focusable.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isOpen, getFocusableElements]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTab);
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape, handleTab]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={menuRef}
        className={`
          absolute right-0 top-0 h-full w-full max-w-sm
          bg-background-dark border-l border-border-dark
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-white">
              <span className="text-primary">BURI</span>FY LABS
            </span>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block py-3 px-4 text-body-lg text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-border-dark">
            <Button variant="primary" size="lg" fullWidth href="/contact">
              Start a Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
