interface BlogHeaderProps {
  title: string;
  description?: string;
}

export function BlogHeader({ title, description }: BlogHeaderProps) {
  return (
    <header className="blog-header">
      <div className="blog-header__inner">
        <p className="blog-header__eyebrow">Insights / Resources</p>
        <h1 className="blog-header__title">{title}</h1>
        {description && <p className="blog-header__description">{description}</p>}
      </div>
    </header>
  );
}
