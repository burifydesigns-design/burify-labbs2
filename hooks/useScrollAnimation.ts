"use client";

import { useEffect, useState, useRef, useCallback, type RefObject } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = "0px", once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref as RefObject<T>, isVisible];
}

interface UseStaggeredAnimationOptions {
  delay?: number;
  stagger?: number;
}

export function useStaggeredAnimation<T extends HTMLElement>(
  itemCount: number,
  options: UseStaggeredAnimationOptions = {}
): {
  refs: RefObject<T>[];
  isVisible: boolean[];
  getDelay: (index: number) => string;
} {
  const { delay = 0, stagger = 100 } = options;
  const [, isVisible] = useScrollAnimation<T>({ once: true });
  const refs = useRef<(RefObject<T> | null)[]>([]);

  const getDelay = useCallback(
    (index: number) => `${delay + index * stagger}ms`,
    [delay, stagger]
  );

  const isVisibleArray = Array.from({ length: itemCount }, () => isVisible);

  return {
    refs: refs.current.filter((r): r is RefObject<T> => r !== null),
    isVisible: isVisibleArray,
    getDelay,
  };
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function useParallax(speed: number = 0.5): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return offset;
}
