import type { HTMLAttributes } from "react";

interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "subtle" | "radial" | "spotlight";
}

export function GradientBackground({
  variant = "subtle",
  className = "",
  ...props
}: GradientBackgroundProps) {
  const variants = {
    primary: "bg-gradient-primary",
    subtle: "bg-gradient-to-br from-primary/5 via-transparent to-accent-pink/5",
    radial: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent",
    spotlight: "relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] before:from-primary/20 before:via-transparent before:to-transparent before:opacity-50",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props} />
  );
}

interface GridPatternProps extends HTMLAttributes<HTMLDivElement> {
  opacity?: number;
  fade?: "none" | "edges" | "corners";
}

export function GridPattern({
  opacity = 0.03,
  fade = "edges",
  className = "",
  ...props
}: GridPatternProps) {
  const fadeStyles = {
    none: "",
    edges: "after:absolute after:inset-0 after:bg-gradient-to-r after:from-background after:via-transparent after:to-background",
    corners: "after:absolute after:inset-0 after:bg-gradient-to-tr after:from-background after:via-transparent after:to-background",
  };

  return (
    <div
      className={`absolute inset-0 bg-[length:40px_40px] [background-image:linear-gradient(to_right,_var(--color-border)_1px,_transparent_1px),_linear-gradient(to_bottom,_var(--color-border)_1px,_transparent_1px)] ${fadeStyles[fade]} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
      {...props}
    />
  );
}

interface GlowProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "pink" | "purple";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Glow({
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: GlowProps) {
  const colors = {
    primary: "bg-primary",
    pink: "bg-accent-pink",
    purple: "bg-primary-light",
  };

  const sizes = {
    sm: "w-32 h-32 blur-[50px]",
    md: "w-48 h-48 blur-[80px]",
    lg: "w-64 h-64 blur-[120px]",
    xl: "w-96 h-96 blur-[180px]",
  };

  return (
    <div
      className={`absolute rounded-full ${colors[variant]} ${sizes[size]} opacity-20 ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark";
}

export function GlassCard({
  variant = "light",
  className = "",
  ...props
}: GlassCardProps) {
  const variants = {
    light: "bg-white/10 backdrop-blur-md border border-white/20",
    dark: "bg-background-dark/80 backdrop-blur-md border border-border-dark",
  };

  return (
    <div className={`${variants[variant]} rounded-2xl ${className}`} {...props} />
  );
}

interface AnimatedBorderProps extends HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function AnimatedBorder({
  speed = 3,
  className = "",
  ...props
}: AnimatedBorderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0 bg-gradient-primary"
        style={{
          backgroundSize: "200% 200%",
          animation: `gradient-shift ${speed}s ease infinite`,
        }}
      />
      <div className="absolute inset-[1px] bg-background rounded-2xl" />
    </div>
  );
}

export function GradientBorder({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative p-[1px] rounded-2xl bg-gradient-primary ${className}`}
      {...props}
    >
      <div className="bg-background rounded-2xl h-full w-full">
        {children}
      </div>
    </div>
  );
}

interface NoiseOverlayProps extends HTMLAttributes<HTMLDivElement> {
  opacity?: number;
}

export function NoiseOverlay({
  opacity = 0.02,
  className = "",
  ...props
}: NoiseOverlayProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
