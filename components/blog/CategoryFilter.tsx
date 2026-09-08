"use client";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="category-filter" aria-label="Filter by category">
      <span className="category-filter__label" id="category-filter-label">
        Categories
      </span>
      <div className="category-filter__list" role="group" aria-labelledby="category-filter-label">
        <button
          type="button"
          className={`category-filter__button ${selectedCategory === null ? "category-filter__button--active" : ""}`}
          onClick={() => onSelectCategory(null)}
          aria-pressed={selectedCategory === null}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-filter__button ${selectedCategory === category ? "category-filter__button--active" : ""}`}
            onClick={() => onSelectCategory(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
