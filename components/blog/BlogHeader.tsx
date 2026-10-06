interface BlogHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function BlogHeader({ title, description, eyebrow }: BlogHeaderProps) {
  return (
    <header className="blog-header">
      <div className="blog-header__inner">
        <p className="blog-header__eyebrow">{eyebrow ?? "Insights / Resources"}</p>
        <h1 className="blog-header__title">{title}</h1>
        {description && <p className="blog-header__description">{description}</p>}
      </div>
    </header>
  );
}
