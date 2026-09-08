interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="toc" aria-labelledby="toc-heading">
      <h2 id="toc-heading" className="toc__heading">
        Table of Contents
      </h2>
      <ul className="toc__list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc__item toc__item--h${heading.level}`}
          >
            <a href={`#${heading.id}`} className="toc__link">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
