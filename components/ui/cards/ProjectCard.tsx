import Image from "next/image";
import { Card } from "./Card";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  tags?: string[];
  href?: string;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  image,
  imageAlt,
  tags,
  href,
  className = "",
}: ProjectCardProps) {
  const content = (
    <>
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-lavender/30">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="text-h4 text-text-primary mb-2 group-hover:text-primary transition-colors duration-200">{title}</h3>
      <p className="text-body text-primary-dark/80 line-clamp-2">{description}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-caption text-primary-dark bg-lavender/50 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
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

export default ProjectCard;
