interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);
  }

  return (
    <nav className="blog-pagination" aria-label="Blog pagination">
      <button
        type="button"
        className="blog-pagination__button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Go to previous page"
      >
        <svg
          className="blog-pagination__icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <div className="blog-pagination__pages">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="blog-pagination__ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`blog-pagination__page ${page === currentPage ? "blog-pagination__page--active" : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="blog-pagination__button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Go to next page"
      >
        Next
        <svg
          className="blog-pagination__icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
