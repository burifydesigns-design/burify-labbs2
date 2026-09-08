"use client";

import { useEffect, useRef, useState } from "react";
import { searchPosts } from "@/lib/blog";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BlogSearch({ value, onChange, placeholder = "Search articles..." }: BlogSearchProps) {
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!value.trim()) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    timeoutRef.current = setTimeout(() => {
      searchPosts(value);
      setIsSearching(false);
    }, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const clearSearch = () => {
    onChange("");
  };

  return (
    <div className="blog-search">
      <div className="blog-search__input-wrapper">
        <label htmlFor="blog-search-input" className="blog-search__label">
          Search articles
        </label>
        <input
          id="blog-search-input"
          type="search"
          className="blog-search__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-busy={isSearching}
        />
        <div className="blog-search__actions">
          {isSearching && (
            <span className="blog-search__spinner" aria-hidden="true">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          )}
          {value && (
            <button
              type="button"
              className="blog-search__clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
