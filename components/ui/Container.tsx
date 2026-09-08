import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg" | "xl" | "full";
  as?: "div" | "section" | "main" | "header" | "footer" | "article";
}

const sizeStyles = {
  sm: "max-w-screen-sm",
  default: "max-w-container",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  full: "max-w-full",
};

export function Container({
  size = "default",
  as: Component = "div",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`
        w-full mx-auto
        px-4 sm:px-6 lg:px-8
        ${sizeStyles[size]}
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;
