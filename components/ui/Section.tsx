import type { HTMLAttributes } from "react";

type SectionVariant = "default" | "dark" | "secondary" | "gradient";
type SectionPadding = "none" | "sm" | "md" | "lg" | "xl";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: SectionVariant;
  padding?: SectionPadding;
  as?: "section" | "div" | "header" | "footer" | "main";
}

const variantStyles: Record<SectionVariant, string> = {
  default: "bg-background",
  dark: "bg-background-dark",
  secondary: "bg-background-secondary",
  gradient: "bg-gradient-primary",
};

const paddingStyles: Record<SectionPadding, string> = {
  none: "",
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16 lg:py-20",
  lg: "py-16 md:py-20 lg:py-24",
  xl: "py-20 md:py-24 lg:py-32",
};

export function Section({
  variant = "default",
  padding = "lg",
  as: Component = "section",
  className = "",
  children,
  ...props
}: SectionProps) {
  const isDark = variant === "dark" || variant === "gradient";

  return (
    <Component
      className={`
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `.trim().replace(/\s+/g, " ")}
      data-theme={isDark ? "dark" : "light"}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Section;
