import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outlined" | "glass";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardBaseProps {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  className?: string;
  children?: ReactNode;
}

interface CardDivProps extends CardBaseProps {
  as?: "div" | "article" | "section";
}

interface CardLinkProps extends CardBaseProps {
  as: "a";
  href: string;
}

type CardProps = CardDivProps | CardLinkProps;

const variantStyles: Record<CardVariant, string> = {
  default: "bg-background border border-border",
  elevated: "bg-background shadow-lg",
  outlined: "bg-transparent border-2 border-border",
  glass: "glass-dark",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card(props: CardProps) {
  const {
    variant = "default",
    padding = "md",
    hover = false,
    className = "",
    children,
    ...rest
  } = props;

  const baseStyles = `
    rounded-xl
    transition-all duration-200 ease-out
  `;

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${hover ? "hover:border-primary-light hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" : ""}
    ${className}
  `.trim().replace(/\s+/g, " ");

  if (props.as === "a" && "href" in rest) {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={combinedClassName} {...anchorRest}>
        {children}
      </a>
    );
  }

  const Tag = (props as CardDivProps).as || "div";
  return (
    <Tag className={combinedClassName} {...(rest as HTMLAttributes<HTMLElement>)}>
      {children}
    </Tag>
  );
}

export default Card;
