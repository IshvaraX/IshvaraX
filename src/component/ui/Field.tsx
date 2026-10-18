import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/** M3 outlined text field: the label floats into the outline on focus or when filled. */
const Field = ({ label, id, className, placeholder, ...props }: FieldProps) => (
  <label htmlFor={id} className="m3-field">
    {/* A non-empty placeholder is required for the :placeholder-shown float logic. */}
    <input
      id={id}
      className={`g-input ${className ?? ""}`}
      placeholder={placeholder ?? " "}
      {...props}
    />
    <span className="m3-field-label">{label}</span>
  </label>
);

export default Field;
