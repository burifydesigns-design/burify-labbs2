import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export function Textarea({
  label,
  error,
  hint,
  fullWidth = true,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = `
    w-full px-4 py-3
    bg-background text-text-primary
    border border-border rounded-xl
    text-body placeholder:text-primary-dark/50
    transition-all duration-200 ease-out
    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
    disabled:bg-background-secondary disabled:cursor-not-allowed
    resize-y min-h-[120px]
  `;

  const errorStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "";

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-body-sm font-medium text-text-primary mb-2"
        >
          {label}
          {props.required && <span className="text-accent-pink ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          ${baseStyles}
          ${errorStyles}
          ${className}
        `.trim().replace(/\s+/g, " ")}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
        }
        {...props}
      />
      {error && (
        <p
          id={`${textareaId}-error`}
          className="mt-2 text-body-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${textareaId}-hint`} className="mt-2 text-body-sm text-primary-dark/60">
          {hint}
        </p>
      )}
    </div>
  );
}

export default Textarea;
