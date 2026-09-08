import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
  error?: string;
}

export function Checkbox({
  label,
  description,
  error,
  className = "",
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5 mt-0.5">
          <input
            id={checkboxId}
            type="checkbox"
            className="
              w-5 h-5
              rounded-md border border-border
              bg-background
              text-primary
              cursor-pointer
              transition-all duration-200 ease-out
              focus:ring-2 focus:ring-primary/20 focus:border-primary
              checked:bg-primary checked:border-primary
              disabled:bg-background-secondary disabled:cursor-not-allowed
            "
            aria-invalid={!!error}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            {...props}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor={checkboxId}
            className="text-body text-text-primary cursor-pointer"
          >
            {label}
            {props.required && <span className="text-accent-pink ml-1">*</span>}
          </label>
          {description && (
            <p className="text-body-sm text-primary-dark/70 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p
          id={`${checkboxId}-error`}
          className="mt-2 text-body-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Checkbox;
