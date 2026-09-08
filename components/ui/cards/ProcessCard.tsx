import type { ReactNode } from "react";
import { Card } from "./Card";

interface ProcessCardProps {
  step: number;
  title: string;
  description: string;
  icon?: ReactNode;
  isLast?: boolean;
  className?: string;
}

export function ProcessCard({
  step,
  title,
  description,
  icon,
  isLast = false,
  className = "",
}: ProcessCardProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-semibold text-h4 relative z-10">
          {icon || step}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-border mt-2 min-h-[4rem]" />
        )}
      </div>
      <Card variant="default" padding="md" className="flex-1">
        <h3 className="text-h4 text-text-primary mb-2">{title}</h3>
        <p className="text-body text-primary-dark/80">{description}</p>
      </Card>
    </div>
  );
}

export default ProcessCard;
