import Image from "next/image";
import { Card } from "./Card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  avatarAlt?: string;
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  avatar,
  avatarAlt,
  rating,
  className = "",
}: TestimonialCardProps) {
  return (
    <Card variant="default" padding="lg" className={className}>
      {rating && (
        <div className="flex gap-1 mb-4" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 ${index < rating ? "text-accent-pink" : "text-border"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      <blockquote className="text-body-lg text-primary-dark/90 mb-6 leading-relaxed">
        <svg className="w-6 h-6 text-primary/30 mb-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        {quote}
      </blockquote>
      <div className="flex items-center gap-3">
        {avatar ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-lavender">
            <Image
              src={avatar}
              alt={avatarAlt || author}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-text-primary">{author}</p>
          <p className="text-body-sm text-primary-dark/70">
            {role}
            {company && <span> at {company}</span>}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default TestimonialCard;
