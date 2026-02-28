import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, ...props }: Props) {
  return (
    <label className="flex flex-col gap-2">
      {label && <span className="text-sm font-semibold">{label}</span>}
      <input
        {...props}
        className="border-border bg-card text-primary border px-3 py-2 text-sm outline-none"
      />
    </label>
  );
}
