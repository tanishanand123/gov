"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "btn-primary text-white focus-visible:ring-primary",
        secondary: "btn-secondary text-white focus-visible:ring-secondary",
        outline:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus-visible:ring-primary",
        danger:
          "bg-danger text-white hover:opacity-90 shadow-sm focus-visible:ring-danger",
        success:
          "bg-success text-white hover:opacity-90 shadow-sm focus-visible:ring-success",
        amber:
          "bg-accent text-white hover:opacity-90 shadow-sm focus-visible:ring-accent",
        ghost:
          "text-text hover:bg-elevated focus-visible:ring-primary",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
      },
      size: {
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-10 px-5 text-sm gap-2",
        lg: "h-12 px-7 text-base gap-2",
      },
      pill: {
        true: "rounded-full",
        false: "rounded-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      pill: false,
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  pill,
  fullWidth,
  leftIcon,
  rightIcon,
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(buttonVariants({ variant, size, pill, fullWidth }), className))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
