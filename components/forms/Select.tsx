import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  fullWidth = true,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = `
    w-full px-4 py-3
    bg-background text-text-primary
    border border-border rounded-xl
    text-body
    transition-all duration-200 ease-out
    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
    disabled:bg-background-secondary disabled:cursor-not-allowed
    appearance-none cursor-pointer
    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236B5FA9%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')]
    bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat
    pr-10
  `;

  const errorStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "";

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-body-sm font-medium text-text-primary mb-2"
        >
          {label}
          {props.required && <span className="text-accent-pink ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`
          ${baseStyles}
          ${errorStyles}
          ${className}
        `.trim().replace(/\s+/g, " ")}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-2 text-body-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${selectId}-hint`} className="mt-2 text-body-sm text-primary-dark/60">
          {hint}
        </p>
      )}
    </div>
  );
}

export default Select;
