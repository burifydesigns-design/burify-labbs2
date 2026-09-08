import type { HTMLAttributes } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "display" | "h1" | "h2" | "h3" | "h4";
  gradient?: boolean;
}

const sizeStyles = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
};

export function Heading({
  as: Component = "h2",
  size = "h2",
  gradient = false,
  className = "",
  children,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={`
        font-semibold text-text-primary
        tracking-tight
        ${sizeStyles[size]}
        ${gradient ? "gradient-text" : ""}
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </Component>
  );
}

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: "body-lg" | "body" | "body-sm";
  muted?: boolean;
}

export function Paragraph({
  size = "body",
  muted = false,
  className = "",
  children,
  ...props
}: ParagraphProps) {
  const sizeStyles = {
    "body-lg": "text-body-lg",
    body: "text-body",
    "body-sm": "text-body-sm",
  };

  return (
    <p
      className={`
        ${sizeStyles[size]}
        ${muted ? "text-primary-dark/70" : "text-primary-dark/90"}
        leading-relaxed
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </p>
  );
}

interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  required = false,
  className = "",
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={`text-body-sm font-medium text-text-primary ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-accent-pink ml-1">*</span>}
    </label>
  );
}

interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  muted?: boolean;
}

export function Caption({
  muted = false,
  className = "",
  children,
  ...props
}: CaptionProps) {
  return (
    <span
      className={`
        text-caption uppercase tracking-wider
        ${muted ? "text-primary-dark/60" : "text-primary-dark/80"}
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </span>
  );
}

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

export function Link({
  external = false,
  className = "",
  children,
  ...props
}: LinkProps) {
  return (
    <a
      className={`
        text-primary font-medium
        hover:text-primary-dark
        underline-offset-2
        hover:underline
        transition-colors duration-200
        ${className}
      `.trim().replace(/\s+/g, " ")}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

interface ListProps extends HTMLAttributes<HTMLUListElement> {
  ordered?: boolean;
}

export function List({
  ordered = false,
  className = "",
  children,
  ...props
}: ListProps) {
  const Component = ordered ? "ol" : "ul";

  return (
    <Component
      className={`
        space-y-2
        ${ordered ? "list-decimal list-inside" : "list-disc list-inside"}
        text-body text-primary-dark/80
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Blockquote({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={`
        border-l-4 border-primary pl-6
        italic text-body-lg text-primary-dark/80
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </blockquote>
  );
}

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  variant?: "default" | "gradient";
}

export function Divider({
  variant = "default",
  className = "",
  ...props
}: DividerProps) {
  return (
    <hr
      className={`
        border-0 h-px
        ${variant === "default" ? "bg-border" : "bg-gradient-primary"}
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    />
  );
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "outline";
}

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-lavender/50 text-primary-dark",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-accent-pink/10 text-accent-pink",
    outline: "bg-transparent border border-border text-primary-dark/80",
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        text-caption font-medium uppercase tracking-wider
        rounded-full
        ${variantStyles[variant]}
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </span>
  );
}
