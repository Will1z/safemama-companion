import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg" | "icon" | "default";
  className?: string;
  loading?: boolean;
  /** When true (default in dev), warn if child is not a single React element */
  devEnforceSingleChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  asChild,
  variant = "primary",
  size = "md",
  className,
  children,
  loading,
  disabled,
  devEnforceSingleChild = process.env.NODE_ENV !== "production",
  ...props
}, ref) => {
  const Comp: any = asChild ? Slot : "button";

  if (asChild && devEnforceSingleChild) {
    const count = React.Children.count(children);
    if (count !== 1 || typeof children === "string") {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          "[Button asChild] requires exactly one *element* child (e.g. <Link>...</Link>). " +
          "Wrap icon+text in a single element or remove asChild. Received:",
          children
        );
      }
    }
  }

  const base = "inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold text-base tracking-wide transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]";
  
  const variants = {
    primary: "bg-[#1C3D3A] text-white hover:brightness-95 shadow-soft",
    secondary: "border border-[#1C3D3A] text-[#1C3D3A] bg-white hover:bg-[#EAF4F3]",
    danger: "bg-[#E74C3C] text-white hover:brightness-95 shadow-lg",
    outline: "border-2 border-[#1C3D3A] text-[#1C3D3A] bg-white hover:bg-[#EAF4F3]",
    ghost: "text-[#1B2735] hover:bg-[#EAF4F3] hover:text-[#1C3D3A]",
    accent: "bg-[#D4AF37] text-[#4A3A00] hover:brightness-95 shadow-lg"
  } as const;

  const sizes = {
    sm: "h-9 rounded-md px-3",
    md: "h-12 px-6 py-3",
    lg: "h-14 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
    default: "h-12 px-6 py-3"
  } as const;

  const cls = clsx(base, variants[variant], sizes[size], className, (disabled || loading) && "opacity-60 cursor-not-allowed");
  
  return (
    <Comp 
      ref={ref}
      className={cls}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
      ) : (
        children
      )}
    </Comp>
  );
});

Button.displayName = "Button";

export default Button;

// Export buttonVariants for backward compatibility
export const buttonVariants = (options: { variant?: string; size?: string } = {}) => {
  const base = "inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold text-base tracking-wide transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]";
  
  const variants = {
    primary: "bg-[#1C3D3A] text-white hover:brightness-95 shadow-soft",
    secondary: "border border-[#1C3D3A] text-[#1C3D3A] bg-white hover:bg-[#EAF4F3]",
    danger: "bg-[#E74C3C] text-white hover:brightness-95 shadow-lg",
    outline: "border-2 border-[#1C3D3A] text-[#1C3D3A] bg-white hover:bg-[#EAF4F3]",
    ghost: "text-[#1B2735] hover:bg-[#EAF4F3] hover:text-[#1C3D3A]",
    accent: "bg-[#D4AF37] text-[#4A3A00] hover:brightness-95 shadow-lg"
  };

  const sizes = {
    sm: "h-9 rounded-md px-3",
    md: "h-12 px-6 py-3",
    lg: "h-14 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
    default: "h-12 px-6 py-3"
  };

  const variant = options.variant || "primary";
  const size = options.size || "md";
  return `${base} ${variants[variant as keyof typeof variants] || variants.primary} ${sizes[size as keyof typeof sizes] || sizes.md}`;
};