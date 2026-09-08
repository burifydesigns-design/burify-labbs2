import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

interface ButtonLinkProps extends ButtonBaseProps {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonBaseProps & Partial<ButtonLinkProps>;

const isLink = (props: ButtonProps): props is ButtonLinkProps => "href" in props && typeof props.href === "string";

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-white
    hover:bg-primary-dark
    active:bg-primary-dark
    disabled:bg-primary/50
    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
  `,
  secondary: `
    bg-lavender text-primary-dark
    hover:bg-lavender/80
    active:bg-lavender/70
    disabled:bg-lavender/50
    focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2
  `,
  outline: `
    bg-transparent text-primary border border-primary
    hover:bg-primary hover:text-white
    active:bg-primary-dark active:border-primary-dark
    disabled:border-primary/50 disabled:text-primary/50
    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
  `,
  ghost: `
    bg-transparent text-primary
    hover:bg-primary/10
    active:bg-primary/20
    disabled:text-primary/50
    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
  `,
  dark: `
    bg-background-dark text-white
    hover:bg-background-dark-secondary
    active:bg-background-dark-secondary
    disabled:bg-background-dark/50
    focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-button rounded-lg min-h-[36px]",
  md: "px-6 py-3 text-button rounded-xl min-h-[44px]",
  lg: "px-8 py-4 text-body-sm rounded-xl min-h-[52px]",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = "",
    disabled,
    children,
    ...rest
  } = props;

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium tracking-wide
    transition-all duration-200 ease-out
    cursor-pointer select-none
    disabled:cursor-not-allowed
    focus:outline-none
  `;

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `.trim().replace(/\s+/g, " ");

  const content = (
    <>
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </>
  );

  if (isLink(props)) {
    const { href, external } = props as ButtonLinkProps;

    if (external) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={combinedClassName}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

export default Button;
