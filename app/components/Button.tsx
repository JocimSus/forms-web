import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground",
  ghost: "text-secondary hover:text-primary",
  outline: "border border-border text-primary",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`px-4 py-2 text-sm font-semibold ${variantStyles[variant]} ${className}`.trim()}
    />
  );
}
