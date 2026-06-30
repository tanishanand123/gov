import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import React from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-semibold text-xs rounded-full px-2.5 py-0.5",
  {
    variants: {
      variant: {
        eligible: "bg-emerald-100 text-emerald-700",
        almost: "bg-amber-100 text-amber-700",
        missing: "bg-red-100 text-red-700",
        processing: "bg-indigo-100 text-indigo-700",
        verified: "bg-green-100 text-green-700",
        expired: "bg-amber-100 text-amber-700",
        default: "bg-slate-100 text-slate-700",
        secondary: "bg-cyan-100 text-cyan-700",
        education: "bg-blue-100 text-blue-700",
        health: "bg-rose-100 text-rose-700",
        housing: "bg-purple-100 text-purple-700",
        agriculture: "bg-lime-100 text-lime-700",
        finance: "bg-indigo-100 text-indigo-700",
        employment: "bg-orange-100 text-orange-700",
        applied: "bg-slate-100 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ variant, dot, children, className, ...props }: BadgeProps) {
  return (
    <span
      className={twMerge(clsx(badgeVariants({ variant }), className))}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
