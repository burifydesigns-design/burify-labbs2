import Image from "next/image";
import { Card } from "./Card";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category?: string;
  date: string;
  readTime?: string;
  author?: string;
  href?: string;
  className?: string;
}

export function BlogCard({
  title,
  excerpt,
  image,
  imageAlt,
  category,
  date,
  readTime,
  author,
  href,
  className = "",
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const content = (
    <>
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4 bg-lavender/30">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="space-y-3">
        {(category || date || readTime) && (
          <div className="flex flex-wrap items-center gap-2 text-caption text-primary-dark/60">
            {category && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {category}
              </span>
            )}
            <span>{formattedDate}</span>
            {readTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-primary-dark/30" />
                <span>{readTime}</span>
              </>
            )}
          </div>
        )}
        <h3 className="text-h4 text-text-primary group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
        <p className="text-body text-primary-dark/80 line-clamp-2">{excerpt}</p>
        {author && (
          <p className="text-body-sm text-primary-dark/60 pt-2 border-t border-border">
            By {author}
          </p>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Card
        hover
        className={`group ${className}`}
        as="a"
        href={href}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card hover className={className}>
      {content}
    </Card>
  );
}

export default BlogCard;
