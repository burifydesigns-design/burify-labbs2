import Image from "next/image";
import Link from "next/link";

type LogoVariant = "default" | "light" | "dark" | "icon";
type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  href?: string;
  className?: string;
  showText?: boolean;
}

const sizeDimensions: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
};

const textSizes: Record<LogoSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

const logoSources = {
  default: "/images/logo/logo.jpeg",
  light: "/images/logo/logo.jpeg",
  dark: "/images/logo/logo.jpeg",
  icon: "/images/logo/logo.jpeg",
};

export function Logo({
  variant = "default",
  size = "md",
  href = "/",
  className = "",
  showText = true,
}: LogoProps) {
  const dimensions = sizeDimensions[size];
  const logoSrc = logoSources[variant];

  const logoContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0" style={{ width: dimensions.width, height: dimensions.height }}>
        <Image
          src={logoSrc}
          alt="Burify Labs"
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain w-full h-full"
          priority
        />
      </div>
      {showText && (
        <span className={`font-bold tracking-tight text-text-primary ${textSizes[size]}`}>
          <span className="text-primary">BURI</span>FY LABS
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex"
        aria-label="Burify Labs - Home"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

export function LogoIcon({
  size = "md",
  className = "",
}: {
  size?: LogoSize;
  className?: string;
}) {
  const dimensions = sizeDimensions[size];

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <Image
        src="/images/logo/logo.jpeg"
        alt="Burify Labs"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain w-full h-full"
        priority
      />
    </div>
  );
}

export function LogoMark({
  size = "md",
  className = "",
}: {
  size?: LogoSize;
  className?: string;
}) {
  const dimensions = sizeDimensions[size];

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <Image
        src="/images/logo/logo.jpeg"
        alt="Burify Labs"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain w-full h-full"
        priority
      />
    </div>
  );
}

export default Logo;
