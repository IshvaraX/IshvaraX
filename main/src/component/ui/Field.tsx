import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Field = ({ label, id, className, placeholder, ...props }: FieldProps) => (
  <label htmlFor={id} className="m3-field">
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
