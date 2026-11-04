"use client";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BlogSearch({ value, onChange, placeholder = "Search articles..." }: BlogSearchProps) {
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
          onChange={(event) => onChange(event.target.value)}
        />
        <div className="blog-search__actions">
          {value && (
            <button
              type="button"
              className="blog-search__clear"
              onClick={() => onChange("")}
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
