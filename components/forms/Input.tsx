import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = `
    w-full px-4 py-3
    bg-background text-text-primary
    border border-border rounded-xl
    text-body placeholder:text-primary-dark/50
    transition-all duration-200 ease-out
    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
    disabled:bg-background-secondary disabled:cursor-not-allowed
    peer
  `;

  const errorStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "";

  const iconWrapperStyles = leftIcon
    ? "pl-11"
    : rightIcon
    ? "pr-11"
    : "";

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-body-sm font-medium text-text-primary mb-2"
        >
          {label}
          {props.required && <span className="text-accent-pink ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/50 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            ${baseStyles}
            ${iconWrapperStyles}
            ${errorStyles}
            ${className}
          `.trim().replace(/\s+/g, " ")}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-dark/50">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-body-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-2 text-body-sm text-primary-dark/60">
          {hint}
        </p>
      )}
    </div>
  );
}

export default Input;
