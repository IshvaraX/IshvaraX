import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/** Labeled text input used across the auth forms. */
const Field = ({ label, id, ...props }: FieldProps) => (
  <label htmlFor={id} className="flex flex-col gap-1.5">
    <span className="gdm-eyebrow">{label}</span>
    <input
      id={id}
      className="w-full rounded-xl border border-[rgb(var(--border-rgb))] bg-[rgb(var(--surface-rgb))] px-4 py-2.5 text-[0.95rem] text-[rgb(var(--foreground-rgb))] outline-none transition-colors focus:border-[rgb(var(--muted-rgb))]"
      {...props}
    />
  </label>
);

export default Field;
