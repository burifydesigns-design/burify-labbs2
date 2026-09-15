import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  inverse?: boolean;
};

export function Breadcrumbs({ items, inverse = false }: BreadcrumbsProps) {
  const color = inverse ? "text-white/70" : "text-text-muted";

  return (
    <nav aria-label="Breadcrumb" className={`mb-6 text-body-sm ${color}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {current || !item.href ? (
                <span aria-current={current ? "page" : undefined}>{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary-light">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
