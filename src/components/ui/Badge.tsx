import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", rounded = false, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center font-medium transition-colors duration-200";

    const variantClasses = {
      default: "bg-neutral-100 text-neutral-800 border border-neutral-200",
      primary: "bg-primary-100 text-primary-800 border border-primary-200",
      secondary: "bg-neutral-100 text-neutral-700 border border-neutral-300",
      success: "bg-green-100 text-green-800 border border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      error: "bg-red-100 text-red-800 border border-red-200",
      info: "bg-blue-100 text-blue-800 border border-blue-200",
    };

    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    };

    const roundedClasses = rounded ? "rounded-full" : "rounded-md";

    return (
      <span
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], roundedClasses, className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
