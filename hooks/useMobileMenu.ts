"use client";

import { useCallback, useState } from "react";

export function useMobileMenu(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
