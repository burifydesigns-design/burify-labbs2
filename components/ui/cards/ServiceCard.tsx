import type { ReactNode } from "react";
import { Card } from "./Card";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features?: string[];
  href?: string;
  variant?: "default" | "elevated" | "outlined" | "glass";
  className?: string;
}

export function ServiceCard({
  icon,
  title,
  description,
  features,
  href,
  variant = "default",
  className = "",
}: ServiceCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-h4 text-text-primary mb-2">{title}</h3>
      <p className="text-body text-primary-dark/80 mb-4">{description}</p>
      {features && features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-body-sm text-primary-dark/70">
              <svg
                className="w-4 h-4 mt-0.5 text-primary flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (href) {
    return (
      <Card
        variant={variant}
        hover
        className={`group ${className}`}
        as="a"
        href={href}
      >
        <div className="group-hover:text-primary transition-colors duration-200">
          {content}
        </div>
      </Card>
    );
  }

  return (
    <Card variant={variant} hover className={className}>
      {content}
    </Card>
  );
}

export default ServiceCard;
