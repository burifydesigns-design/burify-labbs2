import type { ReactNode } from "react";
import { Card } from "./Card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  stat?: string;
  label?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  stat,
  label,
  className = "",
}: FeatureCardProps) {
  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex flex-col">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary text-white flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-h4 text-text-primary mb-1">{title}</h3>
            {description && (
              <p className="text-body text-primary-dark/80">{description}</p>
            )}
          </div>
        </div>
        {stat && label && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-display text-primary font-bold">{stat}</p>
            <p className="text-body-sm text-primary-dark/60">{label}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default FeatureCard;
